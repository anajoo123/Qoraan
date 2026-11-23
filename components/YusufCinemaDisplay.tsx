'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Play } from 'lucide-react';
import AdSenseBanner from './AdSenseBanner';
import AtmosphericParticles from './AtmosphericParticles';
import PWAInstallButton from './PWAInstallButton';
import { useOnlineStatus } from '@/hooks/usePWAInstall';
import {
  DOSARI_FULL_DURATION_SEC,
  FULL_SURAH_TIMED_AYAHS,
  MOSSAD_AYAH_SEGMENTS,
  MOSSAD_TOTAL_DURATION_SEC,
  STORY_SCENES,
  getSceneForAyah,
  getSceneFromSequence,
  splitAyahWords,
  toArabicNumerals,
} from '@/data/yusuf-timeline';
import { RECITERS_CATALOG } from '@/data/reciters-catalog';

export default function YusufCinemaDisplay() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const freqBufferRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const sourceConnectedRef = useRef(false);
  const energyRef = useRef(0);
  const horizonGlowRef = useRef<HTMLDivElement | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const [selectedReciterId, setSelectedReciterId] = useState(
    RECITERS_CATALOG[0].id
  );
  const [selectedTrackId, setSelectedTrackId] = useState(
    RECITERS_CATALOG[0].tracks[0].id
  );

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEndingGrace, setIsEndingGrace] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const isOnline = useOnlineStatus();

  const selectedReciter = useMemo(
    () =>
      RECITERS_CATALOG.find((r) => r.id === selectedReciterId) ??
      RECITERS_CATALOG[0],
    [selectedReciterId]
  );

  const selectedTrack = useMemo(
    () =>
      selectedReciter.tracks.find((t) => t.id === selectedTrackId) ??
      selectedReciter.tracks[0],
    [selectedReciter, selectedTrackId]
  );

  const handleSelectReciter = useCallback((reciterId: string) => {
    setSelectedReciterId(reciterId);
    const reciter = RECITERS_CATALOG.find((r) => r.id === reciterId);
    if (reciter && reciter.tracks.length > 0) {
      setSelectedTrackId(reciter.tracks[0].id);
    }
    setAudioError(null);
  }, []);

  // Compute active ayah for synced Surah Yusuf modes
  const activeAyah = useMemo(() => {
    if (selectedTrack.syncMode === 'dosari-full-ayahs') {
      const found = FULL_SURAH_TIMED_AYAHS.find(
        (seg) => currentTime >= seg.startTime && currentTime < seg.endTime
      );
      return found ?? FULL_SURAH_TIMED_AYAHS[FULL_SURAH_TIMED_AYAHS.length - 1];
    }
    if (selectedTrack.syncMode === 'mossad-ayahs') {
      const found = MOSSAD_AYAH_SEGMENTS.find(
        (seg) => currentTime >= seg.startTime && currentTime < seg.endTime
      );
      return found ?? MOSSAD_AYAH_SEGMENTS[MOSSAD_AYAH_SEGMENTS.length - 1];
    }
    return null;
  }, [selectedTrack.syncMode, currentTime]);

  const activeScene = useMemo(() => {
    if (!hasStarted) return STORY_SCENES.stars;
    if (selectedTrack.syncMode === 'dosari-full-ayahs' && activeAyah) {
      return getSceneForAyah(activeAyah.ayahNumber, currentTime);
    }
    return getSceneFromSequence(selectedTrack.sceneSequence, currentTime, 13);
  }, [hasStarted, selectedTrack, activeAyah, currentTime]);

  const ayahWords = useMemo(
    () => (activeAyah ? splitAyahWords(activeAyah.text) : []),
    [activeAyah]
  );

  const revealedWordCount = useMemo(() => {
    if (!hasStarted || !activeAyah || ayahWords.length === 0) return 0;
    const span = Math.max(0.5, activeAyah.endTime - activeAyah.startTime);
    const rawProgress = (currentTime - activeAyah.startTime) / span;
    const clamped = Math.max(0, Math.min(1, rawProgress + 0.03));
    return Math.min(
      ayahWords.length,
      Math.max(1, Math.ceil(clamped * ayahWords.length))
    );
  }, [hasStarted, activeAyah, ayahWords.length, currentTime]);

  const overallProgress = useMemo(() => {
    if (selectedTrack.syncMode === 'dosari-full-ayahs') {
      return Math.min(1, Math.max(0, currentTime / DOSARI_FULL_DURATION_SEC));
    }
    if (selectedTrack.syncMode === 'mossad-ayahs') {
      return Math.min(1, Math.max(0, currentTime / MOSSAD_TOTAL_DURATION_SEC));
    }
    if (duration > 0) {
      return Math.min(1, Math.max(0, currentTime / duration));
    }
    return 0;
  }, [selectedTrack.syncMode, currentTime, duration]);

  const setupAudioGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || sourceConnectedRef.current) return;

    try {
      const AudioContextCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextCtor) return;

      const ctx = new AudioContextCtor();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.85;

      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      freqBufferRef.current = new Uint8Array(
        new ArrayBuffer(analyser.frequencyBinCount)
      );
      sourceConnectedRef.current = true;
    } catch {
      // Fallback gracefully if Web Audio graph is unavailable
    }
  }, []);

  const requestWakeLock = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      navigator.wakeLock
        .request('screen')
        .then((sentinel) => {
          wakeLockRef.current = sentinel;
        })
        .catch(() => {});
    }
  }, []);

  const handleStart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setAudioError(null);
    setIsBuffering(!selectedTrack.isLocal);
    setupAudioGraph();

    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    setCurrentTime(0);
    setDuration(0);
    audio.crossOrigin = 'anonymous';
    audio.src = selectedTrack.audioUrl;
    audio.load();

    audio
      .play()
      .then(() => {
        setHasStarted(true);
        setIsPlaying(true);
        setIsEndingGrace(false);
        requestWakeLock();

        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      })
      .catch(() => {
        setIsBuffering(false);
        setAudioError(
          'تعذر تشغيل هذه السورة الآن، يمكنك اختيار تلاوة أخرى أو المحاولة مجدداً.'
        );
      });
  }, [requestWakeLock, selectedTrack, setupAudioGraph]);

  const handleReturnToMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setHasStarted(false);
    setIsEndingGrace(false);
    setIsBuffering(false);
    setCurrentTime(0);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleViewportTap = useCallback(() => {
    if (!hasStarted) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          requestWakeLock();
        })
        .catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [hasStarted, requestWakeLock]);

  // 60fps continuous time tracking + vocal-reactive ambient bloom
  useEffect(() => {
    if (!hasStarted) return;

    let rafId = 0;

    const tick = () => {
      const audio = audioRef.current;
      if (audio) {
        setCurrentTime(audio.currentTime);
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
        }
      }

      const analyser = analyserRef.current;
      const buffer = freqBufferRef.current;
      let targetEnergy = 0.14;

      if (analyser && buffer && isPlaying) {
        analyser.getByteFrequencyData(buffer);
        let sum = 0;
        const limit = Math.min(20, buffer.length);
        for (let i = 1; i < limit; i++) {
          sum += buffer[i];
        }
        targetEnergy = sum / ((limit - 1) * 255);
      } else if (isPlaying) {
        targetEnergy = 0.25 + 0.12 * Math.sin(performance.now() * 0.0025);
      }

      energyRef.current = energyRef.current * 0.84 + targetEnergy * 0.16;

      if (horizonGlowRef.current) {
        const e = energyRef.current;
        horizonGlowRef.current.style.opacity = `${(0.38 + e * 0.62).toFixed(3)}`;
        horizonGlowRef.current.style.transform = `scale(${(1 + e * 0.24).toFixed(3)})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [hasStarted, isPlaying]);

  // Audio playback lifecycle listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let restartTimer: ReturnType<typeof setTimeout> | null = null;

    const onPlaying = () => setIsBuffering(false);
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);

    const onEnded = () => {
      setIsEndingGrace(true);
      restartTimer = setTimeout(() => {
        setIsEndingGrace(false);
        audio.currentTime = 0;
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }, 4200);
    };

    const onError = () => {
      setIsBuffering(false);
      setAudioError('تعذر تحميل الصوت، يرجى التحقق من الاتصال أو اختيار التلاوة المحلية.');
      setIsPlaying(false);
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      if (restartTimer) clearTimeout(restartTimer);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Re-acquire wake lock when returning to foreground on mobile
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isPlaying) {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      wakeLockRef.current?.release().catch(() => {});
    };
  }, [isPlaying, requestWakeLock]);

  return (
    <main
      onClick={handleViewportTap}
      className="relative h-[100dvh] w-screen overflow-hidden bg-[#050608] select-none cursor-pointer"
    >
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="auto"
        playsInline
      />

      {/* Overlapping Living Camera Scene Cross-Dissolves + Optical Light-Leak Transition */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${activeScene.fallbackGradient} transition-colors duration-1000`}
      >
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={activeScene.id}
            initial={{ opacity: 0, scale: 1.13 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{
              opacity: { duration: 4.0, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 5.5, ease: [0.22, 1, 0.36, 1] },
            }}
            className="absolute inset-0 will-change-transform"
          >
            <div
              className={`relative h-full w-full ${activeScene.motionClass}`}
              style={{
                animationPlayState:
                  !hasStarted || isPlaying ? 'running' : 'paused',
              }}
            >
              <Image
                src={activeScene.image}
                alt={activeScene.titleAr}
                fill
                priority
                sizes="100vw"
                referrerPolicy="no-referrer"
                className="object-cover object-center"
              />
            </div>

            {/* Subtle warm cinema light-leak sweep on scene entry */}
            {hasStarted && (
              <motion.div
                initial={{ opacity: 0.45, x: '-20%' }}
                animate={{ opacity: 0, x: '25%' }}
                transition={{ duration: 2.4, ease: 'easeOut' }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 mix-blend-screen"
                style={{
                  background:
                    'radial-gradient(ellipse 55% 85% at 50% 45%, rgba(253, 210, 120, 0.35), transparent 70%)',
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Vocal-reactive ambient horizon bloom ("مع نوازع الصوت") */}
      <div
        ref={horizonGlowRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[55vh] z-[6] transition-colors duration-1000 will-change-transform"
        style={{
          background: `radial-gradient(ellipse 78% 62% at 50% 90%, ${activeScene.glowColor}, transparent 72%)`,
          opacity: 0.42,
        }}
      />

      {/* Multi-depth Volumetric Sunbeams, Soft Dust & Foreground Lens Bokeh Overlay */}
      <AtmosphericParticles
        energyRef={energyRef}
        tint={activeScene.particleTint}
        rayColor={activeScene.rayColor}
        active={!hasStarted || isPlaying}
      />

      {/* Cinematic contrast scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-t from-black/88 via-black/22 to-black/32"
      />

      {/* Pre-Play Entrance Screen (clean reciter & Surah selection, then 0 buttons on Play) */}
      <AnimatePresence initial={false}>
        {!hasStarted && (
          <motion.section
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-40 overflow-y-auto bg-black/58 backdrop-blur-[3px] cursor-default"
          >
            <div className="min-h-full w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col items-center justify-center text-center">
              <p className="text-xs sm:text-sm text-amber-200/80 tracking-wide mb-2">
                تطبيق تلاوات ومشاهد قرآنية · {isOnline ? 'خفيف ع الهاتف' : 'وضع عدم الاتصال · التلاوات المحلية جاهزة'}
              </p>

              <h1 className="font-quran text-5xl sm:text-7xl md:text-8xl font-bold text-amber-50 leading-tight mb-2 [text-wrap:balance] drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)]">
                بِسْمِ اللَّهِ
              </h1>

              <p className="text-sm sm:text-base text-amber-100/75 mb-7 max-w-xl [text-wrap:balance]">
                اختر القارئ والسورة ثم اضغط تشغيل للدخول إلى المشهد بدون أي أزرار
              </p>

              {/* Reciters Selector */}
              <div className="w-full mb-5">
                <p className="text-xs text-amber-200/70 mb-2.5">
                  اختر القارئ
                </p>
                <div
                  role="radiogroup"
                  aria-label="اختيار القارئ"
                  className="flex flex-wrap items-center justify-center gap-2"
                >
                  {RECITERS_CATALOG.map((reciter) => {
                    const active = reciter.id === selectedReciter.id;
                    return (
                      <button
                        key={reciter.id}
                        type="button"
                        onClick={() => handleSelectReciter(reciter.id)}
                        className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm rounded-xl border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-[0_0_24px_rgba(251,191,36,0.28)]'
                            : 'bg-black/45 text-amber-100/85 border-white/10 hover:border-amber-300/40 hover:text-amber-50'
                        }`}
                      >
                        {reciter.nameAr}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2.5 text-xs text-amber-200/75">
                  {selectedReciter.descriptorAr}
                </p>
              </div>

              {/* Surahs Selector for chosen reciter */}
              <div className="w-full mb-8">
                <p className="text-xs text-amber-200/70 mb-2.5">
                  اختر السورة أو المقطع
                </p>
                <div
                  role="radiogroup"
                  aria-label="اختيار السورة"
                  className="flex flex-wrap items-center justify-center gap-2"
                >
                  {selectedReciter.tracks.map((track) => {
                    const active = track.id === selectedTrack.id;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => {
                          setSelectedTrackId(track.id);
                          setAudioError(null);
                        }}
                        className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm rounded-xl border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-white/15 text-amber-100 border-amber-300/70 font-semibold'
                            : 'bg-black/35 text-amber-100/70 border-white/10 hover:border-white/25 hover:text-amber-50'
                        }`}
                      >
                        {track.titleAr}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-amber-100/65">
                  {selectedTrack.subtitleAr}
                </p>
              </div>

              {/* Single Primary Play Trigger */}
              <button
                type="button"
                onClick={handleStart}
                aria-label="تشغيل العرض والتلاوة"
                className="group relative flex items-center justify-center gap-3 min-h-[64px] min-w-[64px] px-10 py-4 rounded-full bg-amber-400/95 hover:bg-amber-300 text-stone-950 font-bold text-lg shadow-[0_0_45px_rgba(251,191,36,0.4)] active:scale-[0.97] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-4 focus-visible:ring-offset-black cursor-pointer"
              >
                <Play className="w-6 h-6 fill-stone-950 transition-transform duration-200 group-hover:scale-110" />
                <span>تشغيل</span>
              </button>

              <PWAInstallButton />

              <AdSenseBanner className="mt-6" />

              {audioError && (
                <p className="mt-5 text-sm text-rose-300" role="alert">
                  {audioError}
                </p>
              )}

              {/* Cinematic Studio Signature & AdSense Compliance Links */}
              <footer className="mt-8 pt-5 border-t border-amber-200/10 flex flex-col items-center gap-2 text-center">
                <span
                  dir="ltr"
                  className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] text-amber-300/85 drop-shadow-[0_1px_10px_rgba(251,191,36,0.25)]"
                >
                  MRJOO World
                </span>
                <p className="text-[11px] sm:text-xs text-amber-100/60">
                  اترك أثر طيب · لنا لقاء آخر
                </p>
                <nav
                  aria-label="روابط التطبيق"
                  className="mt-1 flex flex-wrap items-center justify-center gap-3 text-[11px] text-amber-100/50"
                >
                  <Link
                    href="/about"
                    className="hover:text-amber-200 transition-colors"
                  >
                    عن التطبيق وقصة سورة يوسف
                  </Link>
                  <span aria-hidden="true">·</span>
                  <Link
                    href="/privacy"
                    className="hover:text-amber-200 transition-colors"
                  >
                    سياسة الخصوصية
                  </Link>
                  <span aria-hidden="true">·</span>
                  <Link
                    href="/contact"
                    className="hover:text-amber-200 transition-colors"
                  >
                    تواصل معنا
                  </Link>
                </nav>
              </footer>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Active Playback: ZERO buttons on screen. Pure living cinema + auto-written verses or quiet montage caption */}
      {hasStarted && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed top-4 sm:top-6 inset-x-0 z-30 flex flex-col items-center justify-center gap-0.5 text-center opacity-55"
          >
            <span
              dir="ltr"
              className="text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] text-amber-200/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]"
            >
              MRJOO World
            </span>
            <span className="text-[10px] text-amber-100/75 drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]">
              اترك أثر طيب · لنا لقاء آخر
            </span>
          </div>

          <section
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-col items-center justify-end px-5 sm:px-10 pb-8 sm:pb-12 pt-16"
          >
          <AnimatePresence mode="wait">
            {isEndingGrace ? (
              <motion.div
                key="closing-reflection"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-center max-w-2xl"
              >
                <p className="font-quran text-3xl sm:text-5xl text-amber-100 drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
                  صَدَقَ اللَّهُ الْعَظِيمُ
                </p>
              </motion.div>
            ) : activeAyah ? (
              <motion.div
                key={`ayah-${activeAyah.ayahNumber}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-4xl text-center"
              >
                <div className="mb-3 sm:mb-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-amber-200/85">
                  <span>{activeScene.titleAr}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedReciter.nameAr}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    الآية ﴿{toArabicNumerals(activeAyah.ayahNumber)}﴾
                  </span>
                </div>

                <p
                  dir="rtl"
                  className="font-quran text-[1.45rem] sm:text-3xl md:text-[2.15rem] leading-[2.05] sm:leading-[2.15] text-amber-50 drop-shadow-[0_2px_14px_rgba(0,0,0,0.92)] [text-wrap:balance]"
                >
                  {ayahWords.map((word, idx) => {
                    const isRevealed = idx < revealedWordCount;
                    const isCurrent = idx === revealedWordCount - 1;
                    return (
                      <span
                        key={`${activeAyah.ayahNumber}-${idx}`}
                        className={`inline-block mx-[0.16em] transition-all duration-300 ${
                          isCurrent
                            ? 'opacity-100 text-amber-200 drop-shadow-[0_0_18px_rgba(251,191,36,0.55)]'
                            : isRevealed
                              ? 'opacity-95 text-amber-50'
                              : 'opacity-20 text-amber-50/70'
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}{' '}
                  <span className="inline-block text-amber-300/90 text-[0.85em] mx-1">
                    ﴿{toArabicNumerals(activeAyah.ayahNumber)}﴾
                  </span>
                </p>

                <div
                  aria-hidden="true"
                  className="mx-auto mt-5 sm:mt-7 h-[2px] w-36 sm:w-52 overflow-hidden rounded-full bg-white/15"
                >
                  <div
                    className="h-full bg-amber-300/80 transition-transform duration-300 origin-right"
                    style={{ transform: `scaleX(${overallProgress})` }}
                  />
                </div>
              </motion.div>
            ) : (
              /* Cinema Montage Mode for all additional reciters & Surahs */
              <motion.div
                key={`montage-${activeScene.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-3xl text-center"
              >
                <p className="font-quran text-2xl sm:text-4xl text-amber-50 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)] mb-2">
                  {selectedTrack.titleAr}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-amber-200/85">
                  <span>بصوت القارئ {selectedReciter.nameAr}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeScene.titleAr}</span>
                </div>

                {isBuffering && (
                  <p className="mt-3 text-xs text-amber-200/70">
                    جارٍ تهيئة التلاوة...
                  </p>
                )}

                <div
                  aria-hidden="true"
                  className="mx-auto mt-5 h-[2px] w-36 sm:w-52 overflow-hidden rounded-full bg-white/15"
                >
                  <div
                    className="h-full bg-amber-300/80 transition-transform duration-300 origin-right"
                    style={{ transform: `scaleX(${overallProgress})` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        </>
      )}

      {/* Subtle paused state ONLY when user explicitly taps screen to pause */}
      <AnimatePresence>
        {hasStarted && !isPlaying && !isEndingGrace && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-black/35 backdrop-blur-[1px]"
          >
            <div className="pointer-events-none flex h-16 w-16 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-amber-100">
              <Play className="w-7 h-7 fill-amber-100" />
            </div>

            {audioError && (
              <p className="text-sm text-rose-300 px-6 text-center" role="alert">
                {audioError}
              </p>
            )}

            <button
              type="button"
              onClick={handleReturnToMenu}
              className="min-h-[44px] px-5 py-2 text-sm text-amber-100/90 hover:text-amber-50 underline underline-offset-4 cursor-pointer"
            >
              تغيير القارئ أو السورة
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
