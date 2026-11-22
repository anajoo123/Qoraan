import type { StaticImageData } from 'next/image';
import fullAyahsJson from './surah-yusuf-ayahs.json';
import dosariTimingsJson from './yusuf-dosari-timings.json';

import starsImg from '@/src/assets/images/yusuf_scene_stars_1795238977800.jpg';
import wellImg from '@/src/assets/images/yusuf_scene_well_1795238977875.jpg';
import palaceImg from '@/src/assets/images/yusuf_scene_palace_1795238977803.jpg';
import prisonImg from '@/src/assets/images/yusuf_scene_prison_1795239489207.jpg';
import harvestImg from '@/src/assets/images/yusuf_scene_harvest_1795238977724.jpg';
import caravanImg from '@/src/assets/images/yusuf_scene_caravan_1795238978325.jpg';
import throneImg from '@/src/assets/images/yusuf_scene_throne_1795239488934.jpg';
import dawnImg from '@/src/assets/images/yusuf_scene_dawn_1795238978393.jpg';
import oasisImg from '@/src/assets/images/scene_paradise_oasis_1795317313727.jpg';
import oceanImg from '@/src/assets/images/scene_ocean_aurora_1795317313459.jpg';
import mountainImg from '@/src/assets/images/scene_mountain_mist_1795317313919.jpg';
import lanternImg from '@/src/assets/images/scene_mosque_lantern_1795317312787.jpg';

export interface StoryScene {
  id: string;
  titleAr: string;
  subtitleAr: string;
  image: StaticImageData;
  motionClass: string;
  glowColor: string;
  particleTint: string;
  rayColor: string;
  fallbackGradient: string;
}

export interface TimedAyahEntry {
  ayahNumber: number;
  text: string;
  startTime: number;
  endTime: number;
}

interface RawAyah {
  ayahNumber: number;
  text: string;
}

interface RawTiming {
  ayahNumber: number;
  startTime: number;
  endTime: number;
}

export const MOSSAD_TOTAL_DURATION_SEC = 251.6;
export const DOSARI_FULL_DURATION_SEC = 2130.552;

const rawAyahs = fullAyahsJson as RawAyah[];
const rawDosariTimings = dosariTimingsJson as RawTiming[];

/**
 * All 111 ayahs of Surah Yusuf mapped to exact millisecond timestamps
 * inside the single gapless stitched MP3 (/audio/yusuf-dosari-full.mp3).
 */
export const FULL_SURAH_TIMED_AYAHS: TimedAyahEntry[] = rawAyahs.map(
  (ayah, idx) => ({
    ayahNumber: ayah.ayahNumber,
    text: ayah.text,
    startTime: rawDosariTimings[idx]?.startTime ?? 0,
    endTime: rawDosariTimings[idx]?.endTime ?? DOSARI_FULL_DURATION_SEC,
  })
);

/**
 * Exact Uthmani script for Surah Yusuf (12:102-111)
 * Aligned to Abdulrahman Mossad's studio recording (/audio/yusuf-mossad.mp3).
 */
export const MOSSAD_AYAH_SEGMENTS: TimedAyahEntry[] = [
  { ayahNumber: 102, text: rawAyahs[101].text, startTime: 0.0, endTime: 19.3 },
  { ayahNumber: 103, text: rawAyahs[102].text, startTime: 19.3, endTime: 29.3 },
  { ayahNumber: 104, text: rawAyahs[103].text, startTime: 29.3, endTime: 52.5 },
  { ayahNumber: 105, text: rawAyahs[104].text, startTime: 52.5, endTime: 74.5 },
  { ayahNumber: 106, text: rawAyahs[105].text, startTime: 74.5, endTime: 95.0 },
  { ayahNumber: 107, text: rawAyahs[106].text, startTime: 95.0, endTime: 121.0 },
  { ayahNumber: 108, text: rawAyahs[107].text, startTime: 121.0, endTime: 155.5 },
  { ayahNumber: 109, text: rawAyahs[108].text, startTime: 155.5, endTime: 196.5 },
  { ayahNumber: 110, text: rawAyahs[109].text, startTime: 196.5, endTime: 228.8 },
  { ayahNumber: 111, text: rawAyahs[110].text, startTime: 228.8, endTime: 251.6 },
];

export const STORY_SCENES: Record<string, StoryScene> = {
  stars: {
    id: 'stars',
    titleAr: 'رؤيا الكواكب الأحد عشر',
    subtitleAr: 'ليالي كنعان الساجية وبداية الرؤيا',
    image: starsImg,
    motionClass: 'camera-motion-0',
    glowColor: 'rgba(245, 185, 86, 0.28)',
    particleTint: 'rgba(255, 224, 150, 0.90)',
    rayColor: 'rgba(253, 224, 140, 0.14)',
    fallbackGradient: 'from-slate-950 via-indigo-950 to-amber-950',
  },
  well: {
    id: 'well',
    titleAr: 'غيابت الجب وأشعة الأمل',
    subtitleAr: 'نور السماء ينفذ إلى أعماق البئر',
    image: wellImg,
    motionClass: 'camera-motion-1',
    glowColor: 'rgba(251, 191, 36, 0.34)',
    particleTint: 'rgba(253, 224, 130, 0.95)',
    rayColor: 'rgba(254, 215, 110, 0.24)',
    fallbackGradient: 'from-stone-950 via-amber-950 to-sky-950',
  },
  palace: {
    id: 'palace',
    titleAr: 'رحاب مصر وقصر العزيز',
    subtitleAr: 'ثبات اليقين على ضفاف النيل',
    image: palaceImg,
    motionClass: 'camera-motion-2',
    glowColor: 'rgba(245, 158, 11, 0.30)',
    particleTint: 'rgba(252, 211, 120, 0.90)',
    rayColor: 'rgba(251, 191, 36, 0.18)',
    fallbackGradient: 'from-amber-950 via-stone-900 to-slate-950',
  },
  prison: {
    id: 'prison',
    titleAr: 'محراب السجن وتأويل الرؤيا',
    subtitleAr: 'أشعة الفرج تنساب عبر كوّة الحجر',
    image: prisonImg,
    motionClass: 'camera-motion-4',
    glowColor: 'rgba(245, 158, 11, 0.32)',
    particleTint: 'rgba(255, 220, 145, 0.95)',
    rayColor: 'rgba(253, 200, 100, 0.26)',
    fallbackGradient: 'from-stone-950 via-amber-950 to-black',
  },
  harvest: {
    id: 'harvest',
    titleAr: 'سنابل النيل وخزائن الأرض',
    subtitleAr: 'رؤيا الملك وسنوات الرخاء',
    image: harvestImg,
    motionClass: 'camera-motion-3',
    glowColor: 'rgba(234, 179, 8, 0.28)',
    particleTint: 'rgba(254, 240, 138, 0.90)',
    rayColor: 'rgba(254, 230, 138, 0.18)',
    fallbackGradient: 'from-emerald-950 via-amber-950 to-stone-950',
  },
  caravan: {
    id: 'caravan',
    titleAr: 'قافلة الإخوة عند المغيب',
    subtitleAr: 'رحلة الميرة والشوق على طريق مصر',
    image: caravanImg,
    motionClass: 'camera-motion-0',
    glowColor: 'rgba(249, 115, 22, 0.32)',
    particleTint: 'rgba(253, 186, 116, 0.92)',
    rayColor: 'rgba(251, 146, 60, 0.20)',
    fallbackGradient: 'from-orange-950 via-stone-950 to-black',
  },
  throne: {
    id: 'throne',
    titleAr: 'اللقاء والتمكين ورفع العرش',
    subtitleAr: 'عودة القميص واجتماع الشمل بالرحمة',
    image: throneImg,
    motionClass: 'camera-motion-2',
    glowColor: 'rgba(251, 191, 36, 0.32)',
    particleTint: 'rgba(255, 228, 160, 0.92)',
    rayColor: 'rgba(253, 210, 120, 0.22)',
    fallbackGradient: 'from-amber-950 via-orange-950 to-stone-950',
  },
  dawn: {
    id: 'dawn',
    titleAr: 'فجر العبرة لأولي الألباب',
    subtitleAr: 'هدىً ورحمةً لقوم يؤمنون',
    image: dawnImg,
    motionClass: 'camera-motion-5',
    glowColor: 'rgba(251, 207, 152, 0.28)',
    particleTint: 'rgba(255, 237, 213, 0.88)',
    rayColor: 'rgba(254, 215, 170, 0.18)',
    fallbackGradient: 'from-sky-950 via-rose-950 to-stone-950',
  },
  oasis: {
    id: 'oasis',
    titleAr: 'واحة السكينة والأنهار الجارية',
    subtitleAr: 'في ظلال النخيل ونور الصباح',
    image: oasisImg,
    motionClass: 'camera-motion-3',
    glowColor: 'rgba(52, 211, 153, 0.22)',
    particleTint: 'rgba(254, 240, 168, 0.90)',
    rayColor: 'rgba(253, 224, 130, 0.22)',
    fallbackGradient: 'from-emerald-950 via-teal-950 to-stone-950',
  },
  ocean: {
    id: 'ocean',
    titleAr: 'آيات الليل والبحر المسجور',
    subtitleAr: 'جلال الكون وتسابيح السحر',
    image: oceanImg,
    motionClass: 'camera-motion-1',
    glowColor: 'rgba(147, 197, 253, 0.22)',
    particleTint: 'rgba(224, 242, 254, 0.85)',
    rayColor: 'rgba(186, 230, 253, 0.16)',
    fallbackGradient: 'from-slate-950 via-sky-950 to-black',
  },
  mountain: {
    id: 'mountain',
    titleAr: 'قمم الرواسي وبحر الغمام',
    subtitleAr: 'سكون الجبال تحت ضياء الفجر',
    image: mountainImg,
    motionClass: 'camera-motion-4',
    glowColor: 'rgba(251, 191, 36, 0.28)',
    particleTint: 'rgba(254, 243, 199, 0.90)',
    rayColor: 'rgba(253, 210, 120, 0.22)',
    fallbackGradient: 'from-amber-950 via-stone-900 to-slate-950',
  },
  lantern: {
    id: 'lantern',
    titleAr: 'رواق الخشوع ومصابيح السحر',
    subtitleAr: 'طُمأنينة القلب في رحاب الذكر',
    image: lanternImg,
    motionClass: 'camera-motion-5',
    glowColor: 'rgba(245, 158, 11, 0.30)',
    particleTint: 'rgba(253, 224, 145, 0.92)',
    rayColor: 'rgba(251, 191, 36, 0.20)',
    fallbackGradient: 'from-slate-950 via-amber-950 to-black',
  },
};

export type SceneKey = keyof typeof STORY_SCENES;

export const YUSUF_STORY_SEQUENCE: SceneKey[] = [
  'stars',
  'well',
  'palace',
  'prison',
  'harvest',
  'caravan',
  'throne',
  'dawn',
];

export const CONTEMPLATION_SEQUENCE: SceneKey[] = [
  'oasis',
  'mountain',
  'lantern',
  'ocean',
  'dawn',
  'stars',
  'caravan',
  'throne',
];

/**
 * Maps every ayah (1..111) to its chronological chapter scene in Prophet Yusuf's story,
 * while cycling cleanly through scenes if a chapter spans several minutes.
 */
export function getSceneForAyah(ayahNumber: number, currentTime: number): StoryScene {
  let primary: SceneKey = 'stars';
  let secondary: SceneKey = 'caravan';
  if (ayahNumber <= 8) {
    primary = 'stars';
    secondary = 'dawn';
  } else if (ayahNumber <= 20) {
    primary = 'well';
    secondary = 'caravan';
  } else if (ayahNumber <= 34) {
    primary = 'palace';
    secondary = 'lantern';
  } else if (ayahNumber <= 42) {
    primary = 'prison';
    secondary = 'well';
  } else if (ayahNumber <= 57) {
    primary = 'harvest';
    secondary = 'oasis';
  } else if (ayahNumber <= 82) {
    primary = 'caravan';
    secondary = 'mountain';
  } else if (ayahNumber <= 101) {
    primary = 'throne';
    secondary = 'palace';
  } else {
    primary = 'dawn';
    secondary = 'stars';
  }

  // Alternate smoothly every 16 seconds between primary & complementary angle for non-stop cinema motion
  const beat = Math.floor(currentTime / 16) % 2;
  return STORY_SCENES[beat === 0 ? primary : secondary];
}

export function getSceneFromSequence(
  sequence: SceneKey[],
  currentTime: number,
  intervalSeconds = 14
): StoryScene {
  const idx = Math.floor(currentTime / intervalSeconds) % sequence.length;
  return STORY_SCENES[sequence[idx]];
}

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicNumerals(num: number): string {
  return String(num)
    .split('')
    .map((ch) => ARABIC_DIGITS[Number(ch)] ?? ch)
    .join('');
}

const WAQF_MARKS = new Set(['ۖ', 'ۗ', 'ۘ', 'ۙ', 'ۚ', 'ۛ', 'ۜ']);

export function splitAyahWords(text: string): string[] {
  const raw = text.trim().split(/\s+/);
  const words: string[] = [];
  for (const token of raw) {
    if (WAQF_MARKS.has(token) && words.length > 0) {
      words[words.length - 1] = `${words[words.length - 1]} ${token}`;
    } else {
      words.push(token);
    }
  }
  return words;
}
