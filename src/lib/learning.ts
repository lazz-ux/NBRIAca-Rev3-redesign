/**
 * Learning levels + homepage image slots.
 *
 * LEVELS: Beginner / Advanced / Expert. `levelOf()` derives a level from the
 * existing `Course.level` so no course data changes. When a placement
 * assessment exists, add an optional `levelId` to Course (or a DB column) and
 * return it here first; Participant level (AuthUser.level) uses the same ids.
 *
 * MEDIA: every homepage photo is referenced from here. Swap `src` for real NBRI
 * photography (drop files into public/img/) without touching components.
 * Current files are the generated placeholders already in the repo.
 */
import type { Course } from "./fixtures";
import { l, type L } from "./text";

export type LevelId = "beginner" | "advanced" | "expert";

export interface LevelInfo {
  id: LevelId;
  name: L;
  who: L;
  /** Tailwind classes (kept as full strings so Tailwind can see them). */
  bar: string;
  soft: string;
}

export const LEVELS: LevelInfo[] = [
  {
    id: "beginner",
    name: l("Beginner", "Pemula"),
    who: l(
      "New to batteries. Start with the foundations.",
      "Baru mengenal baterai. Mulai dari dasar.",
    ),
    bar: "bg-[#0e9f8e]",
    soft: "bg-[#e4f6f3] text-[#0b6f63]",
  },
  {
    id: "advanced",
    name: l("Advanced", "Menengah-Lanjut"),
    who: l(
      "Know the basics. Build technical and practical skills.",
      "Sudah paham dasar. Perdalam kompetensi teknis dan praktik.",
    ),
    bar: "bg-primary",
    soft: "bg-accent text-accent-foreground",
  },
  {
    id: "expert",
    name: l("Expert", "Ahli"),
    who: l(
      "Experienced professionals. Specialise and lead.",
      "Profesional berpengalaman. Spesialisasi dan memimpin.",
    ),
    bar: "bg-[#f59e0b]",
    soft: "bg-[#fef3d6] text-[#8a5300]",
  },
];

export function levelOf(c: Course): LevelId {
  if (c.level === "Basic") return "beginner";
  if (c.level === "Intermediate") return "advanced";
  return "expert";
}

export interface Media {
  src: string;
  alt: L;
}

export const MEDIA = {
  hero: {
    src: "/img/cat-industrial.png",
    alt: l(
      "Engineers training together on a battery assembly line",
      "Engineer berlatih bersama di lini perakitan baterai",
    ),
  },
  heroLab: {
    src: "/img/hero.png",
    alt: l(
      "Researchers testing a battery module in the laboratory",
      "Peneliti menguji modul baterai di laboratorium",
    ),
  },
  heroClass: {
    src: "/img/cat-tot.png",
    alt: l(
      "An instructor presenting to a group of professionals",
      "Instruktur memaparkan materi kepada para profesional",
    ),
  },
  online: {
    src: "/img/cat-edutech.png",
    alt: l("A learner following an online course", "Peserta mengikuti kursus online"),
  },
  batterySchool: {
    src: "/img/cat-battery-school.png",
    alt: l("Battery cells and lab notes on a workbench", "Sel baterai dan catatan lab di meja kerja"),
  },
} satisfies Record<string, Media>;
