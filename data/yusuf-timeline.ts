import type { StaticImageData } from 'next/image';
import fullAyahsJson from './surah-yusuf-ayahs.json';

import starsImg from '@/src/assets/images/yusuf_scene_stars_1795238977800.jpg';
import wellImg from '@/src/assets/images/yusuf_scene_well_1795238977875.jpg';
import palaceImg from '@/src/assets/images/yusuf_scene_palace_1795238977803.jpg';
import prisonImg from '@/src/assets/images/yusuf_scene_prison_1795239489207.jpg';
import harvestImg from '@/src/assets/images/yusuf_scene_harvest_1795238977724.jpg';
import caravanImg from '@/src/assets/images/yusuf_scene_caravan_1795238978325.jpg';
import throneImg from '@/src/assets/images/yusuf_scene_throne_1795239488934.jpg';
import dawnImg from '@/src/assets/images/yusuf_scene_dawn_1795238978393.jpg';

export type ReciterMode = 'full-dosari' | 'ending-mossad';

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

export interface FullAyahEntry {
  ayahNumber: number;
  text: string;
}

export interface MossadAyahSegment {
  ayahNumber: number;
  text: string;
  startTime: number;
  endTime: number;
}

export const MOSSAD_TOTAL_DURATION_SEC = 251.6;

export const FULL_SURAH_AYAHS: FullAyahEntry[] =
  fullAyahsJson as FullAyahEntry[];

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
};

const SCENE_LIST: StoryScene[] = [
  STORY_SCENES.stars,
  STORY_SCENES.well,
  STORY_SCENES.palace,
  STORY_SCENES.prison,
  STORY_SCENES.harvest,
  STORY_SCENES.caravan,
  STORY_SCENES.throne,
  STORY_SCENES.dawn,
];

/**
 * Maps every ayah (1..111) to its chronological chapter scene in Prophet Yusuf's story.
 */
export function getSceneForAyah(ayahNumber: number): StoryScene {
  if (ayahNumber <= 8) return STORY_SCENES.stars;
  if (ayahNumber <= 20) return STORY_SCENES.well;
  if (ayahNumber <= 34) return STORY_SCENES.palace;
  if (ayahNumber <= 42) return STORY_SCENES.prison;
  if (ayahNumber <= 57) return STORY_SCENES.harvest;
  if (ayahNumber <= 82) return STORY_SCENES.caravan;
  if (ayahNumber <= 101) return STORY_SCENES.throne;
  return STORY_SCENES.dawn;
}

export function getSceneForMossadTime(currentTime: number): StoryScene {
  const step = MOSSAD_TOTAL_DURATION_SEC / SCENE_LIST.length;
  const idx = Math.min(
    SCENE_LIST.length - 1,
    Math.max(0, Math.floor(currentTime / step))
  );
  return SCENE_LIST[idx];
}

/**
 * Exact Uthmani script for Surah Yusuf (12:102-111)
 * Aligned to the acoustic breath pauses of Abdulrahman Mossad's studio recording.
 */
export const MOSSAD_AYAH_SEGMENTS: MossadAyahSegment[] = [
  {
    ayahNumber: 102,
    text: FULL_SURAH_AYAHS[101].text,
    startTime: 0.0,
    endTime: 19.3,
  },
  {
    ayahNumber: 103,
    text: FULL_SURAH_AYAHS[102].text,
    startTime: 19.3,
    endTime: 29.3,
  },
  {
    ayahNumber: 104,
    text: FULL_SURAH_AYAHS[103].text,
    startTime: 29.3,
    endTime: 52.5,
  },
  {
    ayahNumber: 105,
    text: FULL_SURAH_AYAHS[104].text,
    startTime: 52.5,
    endTime: 74.5,
  },
  {
    ayahNumber: 106,
    text: FULL_SURAH_AYAHS[105].text,
    startTime: 74.5,
    endTime: 95.0,
  },
  {
    ayahNumber: 107,
    text: FULL_SURAH_AYAHS[106].text,
    startTime: 95.0,
    endTime: 121.0,
  },
  {
    ayahNumber: 108,
    text: FULL_SURAH_AYAHS[107].text,
    startTime: 121.0,
    endTime: 155.5,
  },
  {
    ayahNumber: 109,
    text: FULL_SURAH_AYAHS[108].text,
    startTime: 155.5,
    endTime: 196.5,
  },
  {
    ayahNumber: 110,
    text: FULL_SURAH_AYAHS[109].text,
    startTime: 196.5,
    endTime: 228.8,
  },
  {
    ayahNumber: 111,
    text: FULL_SURAH_AYAHS[110].text,
    startTime: 228.8,
    endTime: 251.6,
  },
];

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicNumerals(num: number): string {
  return String(num)
    .split('')
    .map((ch) => ARABIC_DIGITS[Number(ch)] ?? ch)
    .join('');
}

const WAQF_MARKS = new Set(['ۖ', 'ۗ', 'ۘ', 'ۙ', 'ۚ', 'ۛ', 'ۜ']);

/**
 * Splits Quranic text into words while keeping waqf pause symbols attached
 * to their preceding word so they never orphan on screen.
 */
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
