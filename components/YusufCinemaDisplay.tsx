'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { Play } from 'lucide-react';
import AtmosphericParticles from './AtmosphericParticles';
import {
  FULL_SURAH_AYAHS,
  MOSSAD_AYAH_SEGMENTS,
  MOSSAD_TOTAL_DURATION_SEC,
  STORY_SCENES,
  type ReciterMode,
  getSceneForAyah,
  getSceneForMossadTime,
  splitAyahWords,
  toArabicNumerals,
} from '@/data/yusuf-timeline';

const MOSSAD_AUDIO_SRC = '/audio/yusuf-mossad.mp3';

function getAyahAudioUrl(ayahNumber: number): string {
  return `/audio/yusuf/${String(ayahNumber).padStart(3, '0')}.mp3`;
}

export default function YusufCinemaDisplay() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const freqBufferRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const sourceConnectedRef = useRef(false);
  const energyRef = useRef(0);
  const horizonGlowRef = useRef<HTMLDivElement | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const [reciterMode, setReciterMode] = useState<ReciterMode>('full-dosari');
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Full-Surah (Ayah 1 -> 111) tracking
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [ayahProgress, setAyahProgress] = useState(0);

  // Mossad ending (Ayahs 102 -> 111) tracking
  const [mossadTime, setMossadTime] = useState(0);

  const [isEndingGrace, setIsEndingGrace] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const activeAyah = useMemo(() => {
    if (reciterMode === 'full-dosari') {
      return FULL_SURAH_AYAHS[currentAyahIndex] ?? FULL_SURAH_AYAHS[0];
    }
    const found = MOSSAD_AYAH_SEGMENTS.find(
      (seg) => mossadTime >= seg.startTime && mossadTime < seg.endTime
    );
    return found ?? MOSSAD_AYAH_SEGMENTS[MOSSAD_AYAH_SEGMENTS.length - 1];
  }, [reciterMode, currentAyahIndex, mossadTime]);

  const activeScene = useMemo(() => {
    if (!hasStarted) return STORY_SCENES.stars;
    if (reciterMode === 'full-dosari') {
      return getSceneForAyah(activeAyah.ayahNumber);
    }
    return getSceneForMossadTime(mossadTime);
  }, [hasStarted, reciterMode, activeAyah.ayahNumber, mossadTime]);

  const ayahWords = useMemo(
    () => splitAyahWords(activeAyah.text),
    [activeAyah.text]
  );

  const revealedWordCount = useMemo(() => {
    if (!hasStarted) return 0;

    if (reciterMode === 'full-dosari') {
      const clamped = Math.max(0, Math.min(1, ayahProgress + 0.035));
      return Math.min(
        ayahWords.length,
        Math.max(1, Math.ceil(clamped * ayahWords.length))
      );
    }

    const mossadSeg = activeAyah as (typeof MOSSAD_AYAH_SEGMENTS)[number];
    const span = Math.max(0.5, mossadSeg.endTime - mossadSeg.startTime);
    const rawProgress = (mossadTime - mossadSeg.startTime) / span;
    const clamped = Math.max(0, Math.min(1, rawProgress + 0.025));
    return Math.min(
      ayahWords.length,
      Math.max(1, Math.ceil(clamped * ayahWords.length))
    );
  }, [hasStarted, reciterMode, ayahProgress, mossadTime, activeAyah, ayahWords.length]);

  const overallProgress = useMemo(() => {
    if (reciterMode === 'full-dosari') {
      return Math.min(
        1,
        (currentAyahIndex + ayahProgress) / FULL_SURAH_AYAHS.length
      );
    }
    return Math.min(1, Math.max(0, mossadTime / MOSSAD_TOTAL_DURATION_SEC));
  }, [reciterMode, currentAyahIndex, ayahProgress, mossadTime]);

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

  // Preload next ayah MP3 in full-surah mode for zero-gap transitions
  useEffect(() => {
    if (!hasStarted || reciterMode !== 'full-dosari') return;
    const nextIdx = (currentAyahIndex + 1) % FULL_SURAH_AYAHS.length;
    const nextUrl = getAyahAudioUrl(FULL_SURAH_AYAHS[nextIdx].ayahNumber);
    if (!preloadAudioRef.current) {
      preloadAudioRef.current = new Audio();
      preloadAudioRef.current.preload = 'auto';
    }
    preloadAudioRef.current.src = nextUrl;
    preloadAudioRef.current.load();
  }, [hasStarted, reciterMode, currentAyahIndex]);

  const handleStart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setAudioError(null);
    setupAudioGraph();

    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    if (reciterMode === 'full-dosari') {
      setCurrentAyahIndex(0);
      setAyahProgress(0);
      audio.src = getAyahAudioUrl(1);
    } else {
      setMossadTime(0);
      audio.src = MOSSAD_AUDIO_SRC;
    }

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
        setAudioError('تعذر بدء التلاوة تلقائياً، يرجى المحاولة مرة أخرى.');
      });
  }, [reciterMode, requestWakeLock, setupAudioGraph]);

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

  // 60fps audio progress + vocal-reactive atmospheric lighting
  useEffect(() => {
    if (!hasStarted) return;

    let rafId = 0;

    const tick = () => {
      const audio = audioRef.current;
      if (audio) {
        if (reciterMode === 'full-dosari') {
          const dur = audio.duration;
          if (Number.isFinite(dur) && dur > 0) {
            setAyahProgress(Math.min(1, audio.currentTime / dur));
          }
        } else {
          setMossadTime(audio.currentTime);
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
  }, [hasStarted, isPlaying, reciterMode]);

  // Handle seamless ayah-to-ayah progression and ambient loop
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let restartTimer: ReturnType<typeof setTimeout> | null = null;

    const onEnded = () => {
      if (reciterMode === 'full-dosari') {
        if (currentAyahIndex < FULL_SURAH_AYAHS.length - 1) {
          const nextIndex = currentAyahIndex + 1;
          setCurrentAyahIndex(nextIndex);
          setAyahProgress(0);
          audio.src = getAyahAudioUrl(FULL_SURAH_AYAHS[nextIndex].ayahNumber);
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else {
          setIsEndingGrace(true);
          restartTimer = setTimeout(() => {
            setIsEndingGrace(false);
            setCurrentAyahIndex(0);
            setAyahProgress(0);
            audio.src = getAyahAudioUrl(1);
            audio
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          }, 4200);
        }
      } else {
        setIsEndingGrace(true);
        restartTimer = setTimeout(() => {
          setIsEndingGrace(false);
          audio.currentTime = 0;
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }, 4200);
      }
    };

    const onError = () => {
      setAudioError('تعذر تحميل ملف التلاوة المحلي.');
      setIsPlaying(false);
    };

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      if (restartTimer) clearTimeout(restartTimer);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [reciterMode, currentAyahIndex]);

  // Keep screen awake on mobile when returning to foreground
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
      <audio ref={audioRef} preload="auto" playsInline />

      {/* Overlapping Living Camera Scene Cross-Dissolves ("تداخل كاميرا في التانيه") */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${activeScene.fallbackGradient} transition-colors duration-1000`}
      >
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={activeScene.id}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{
              opacity: { duration: 3.8, ease: [0.22, 1, 0.36, 1] },
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

      {/* Cinematic contrast scrim for effortless Arabic legibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-t from-black/88 via-black/22 to-black/32"
      />

      {/* Pre-Play Entrance Screen */}
      <AnimatePresence initial={false}>
        {!hasStarted && (
          <motion.section
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6 text-center bg-black/50 backdrop-blur-[2px] cursor-default"
          >
            <p className="text-xs sm:text-sm text-amber-200/80 tracking-wide mb-3">
              عرض سينمائي حيّ · وضع محلي بالكامل
            </p>

            <h1 className="font-quran text-5xl sm:text-7xl md:text-8xl font-bold text-amber-50 leading-tight mb-3 [text-wrap:balance] drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)]">
              سُورَةُ يُوسُفَ
            </h1>

            <p className="text-sm sm:text-base text-amber-100/80 mb-7 max-w-md [text-wrap:balance]">
              عِش القصة من أول آية مع تداخل المشاهد وكتابة الآيات تلقائياً
            </p>

            {/* Clean segmented reciter/range selector on start screen only (vanishes completely on Play) */}
            <div
              role="radiogroup"
              aria-label="اختيار التلاوة"
              className="mb-8 inline-flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl bg-black/55 border border-white/10 backdrop-blur-md"
            >
              <button
                type="button"
                onClick={() => setReciterMode('full-dosari')}
                className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  reciterMode === 'full-dosari'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-amber-100/80 hover:text-amber-50'
                }`}
              >
                السورة كاملة من أولها (١ – ١١١) · ياسر الدوسري
              </button>
              <button
                type="button"
                onClick={() => setReciterMode('ending-mossad')}
                className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  reciterMode === 'ending-mossad'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-amber-100/80 hover:text-amber-50'
                }`}
              >
                الخاتمة (١٠٢ – ١١١) · عبدالرحمن مسعد
              </button>
            </div>

            <button
              type="button"
              onClick={handleStart}
              aria-label="تشغيل العرض والتلاوة"
              className="group relative flex items-center justify-center gap-3 min-h-[64px] min-w-[64px] px-9 py-4 rounded-full bg-amber-400/95 hover:bg-amber-300 text-stone-950 font-bold text-lg shadow-[0_0_45px_rgba(251,191,36,0.4)] active:scale-[0.97] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-4 focus-visible:ring-offset-black cursor-pointer"
            >
              <Play className="w-6 h-6 fill-stone-950 transition-transform duration-200 group-hover:scale-110" />
              <span>تشغيل</span>
            </button>

            {audioError && (
              <p className="mt-5 text-sm text-rose-300" role="alert">
                {audioError}
              </p>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Active Playback: ZERO buttons on screen. Pure living story + auto-written Quranic verses */}
      {hasStarted && (
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
            ) : (
              <motion.div
                key={`ayah-${activeAyah.ayahNumber}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-4xl text-center"
              >
                {/* Unboxed quiet story chapter & ayah metadata */}
                <div className="mb-3 sm:mb-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-amber-200/85">
                  <span>{activeScene.titleAr}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    الآية ﴿{toArabicNumerals(activeAyah.ayahNumber)}﴾
                  </span>
                </div>

                {/* Calligraphic Quranic verse auto-written word-by-word */}
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

                {/* Ultra-thin ambient timeline hairline */}
                <div
                  aria-hidden="true"
                  className="mx-auto mt-5 sm:mt-7 h-[2px] w-36 sm:w-52 overflow-hidden rounded-full bg-white/15"
                >
                  <div
                    className="h-full bg-amber-300/80 transition-transform duration-300 origin-right"
                    style={{
                      transform: `scaleX(${overallProgress})`,
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Subtle centered indicator ONLY when user explicitly taps screen to pause */}
      <AnimatePresence>
        {hasStarted && !isPlaying && !isEndingGrace && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-black/25"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/55 backdrop-blur-md text-amber-100">
              <Play className="w-7 h-7 fill-amber-100" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
