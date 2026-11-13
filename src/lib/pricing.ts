import type { Course } from "./fixtures";
import { getCourse, purchaseState } from "./catalog";
import { pick, type Lang } from "./text";

export interface CartLine {
  key: string;
  slug: string;
  sessionId: string | null;
  /** Selected option index per variant group. */
  variant: number[];
  qty: number;
  selected: boolean;
}

export function lineKey(
  slug: string,
  sessionId: string | null,
  variant: number[],
) {
  return [slug, sessionId ?? "-", variant.join(".")].join("|");
}

/** Base price plus the surcharge of each selected variant option. */
export function unitPrice(course: Course, variant: number[]) {
  const surcharge = course.variants.reduce(
    (sum, g, i) => sum + (g.options[variant[i] ?? 0]?.surcharge ?? 0),
    0,
  );
  return (course.price ?? 0) + surcharge;
}

export function variantSummary(
  course: Course,
  variant: number[],
  lang: Lang = "en",
) {
  return course.variants
    .map((g, i) => {
      const o = g.options[variant[i] ?? 0];
      return o ? pick(o.label, lang) : "";
    })
    .filter(Boolean)
    .join(" · ");
}

/** A cart line stays purchasable only while its course/session is still on sale. */
export function isLineAvailable(l: CartLine, now = new Date()) {
  const course = getCourse(l.slug);
  if (!course) return false;
  const st = purchaseState(course, now);
  if (st.kind === "online") return course.price !== null;
  if (st.kind !== "buy") return false;
  return st.sessions.some((s) => s.id === l.sessionId && s.seatsLeft >= l.qty);
}

export interface CartTotals {
  items: number;
  tickets: number;
  total: number;
}

/**
 * Order total at list price. No promotions are offered yet.
 * Milestone 3 moves this to the server so the order total is authoritative.
 */
export function computeTotals(lines: CartLine[]): CartTotals {
  const selected = lines.filter((l) => l.selected && isLineAvailable(l));
  let total = 0;
  let tickets = 0;
  for (const l of selected) {
    const course = getCourse(l.slug);
    if (!course) continue;
    total += unitPrice(course, l.variant) * l.qty;
    tickets += l.qty;
  }
  return { items: selected.length, tickets, total };
}
