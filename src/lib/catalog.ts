import {
  CATEGORIES,
  CONTACT,
  COURSES,
  type CategoryId,
  type Course,
  type Session,
} from "./fixtures";
import type { Lang } from "./text";

const MONTHS: Record<Lang, string[]> = {
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  id: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ],
};

export function monthNames(lang: Lang) {
  return MONTHS[lang];
}

export function rupiah(n: number) {
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

function parseDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function sessionLabel(
  s: Pick<Session, "start" | "end">,
  lang: Lang = "en",
) {
  const M = MONTHS[lang];
  const a = parseDay(s.start);
  const b = parseDay(s.end);
  const sameMonth = a.getMonth() === b.getMonth();
  const startPart = sameMonth
    ? `${a.getDate()}`
    : `${a.getDate()} ${M[a.getMonth()]}`;
  return `${startPart}–${b.getDate()} ${M[b.getMonth()]} ${b.getFullYear()}`;
}

export function dayLabel(iso: string, lang: Lang = "en") {
  const d = parseDay(iso);
  return `${d.getDate()} ${MONTHS[lang][d.getMonth()]} ${d.getFullYear()}`;
}

export function sessionMonth(s: Session) {
  return parseDay(s.start).getMonth();
}

/** A session is finished once its last day is over (evaluated at runtime). */
export function isSessionDone(s: Session, now = new Date()) {
  const end = parseDay(s.end);
  end.setHours(23, 59, 59, 999);
  return end < now;
}

export function upcomingSessions(c: Course, now = new Date()) {
  return c.sessions
    .filter((s) => !isSessionDone(s, now) && s.seatsLeft > 0)
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function pastSessions(c: Course, now = new Date()) {
  return c.sessions
    .filter((s) => isSessionDone(s, now))
    .sort((a, b) => b.start.localeCompare(a.start));
}

export function getCourse(slug: string) {
  return COURSES.find((c) => c.slug === slug);
}

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)!;
}

/** Price a buyer pays for the base product (before variants). */
export function effectivePrice(c: Course) {
  return c.price ?? 0;
}

export type PurchaseState =
  | { kind: "buy"; sessions: Session[] }
  | { kind: "online" }
  | { kind: "quote" }
  | { kind: "coming-soon" }
  | { kind: "tba" };

/** Decides which call-to-action a course shows right now. */
export function purchaseState(c: Course, now = new Date()): PurchaseState {
  if (c.availability === "quote") return { kind: "quote" };
  if (c.availability === "coming-soon") return { kind: "coming-soon" };
  if (c.mode === "online") return { kind: "online" };
  const sessions = upcomingSessions(c, now);
  return sessions.length ? { kind: "buy", sessions } : { kind: "tba" };
}

export function whatsappLink(text: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** Images are served directly from /public (no image CDN). */
export function cdnImage(path: string, width?: number) {
  void width;
  return path;
}

export function courseImage(c: Course) {
  return getCategory(c.category).image;
}
