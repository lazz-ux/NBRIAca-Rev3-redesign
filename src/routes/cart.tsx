import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarDays,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { CourseCard } from "@/components/course-card";
import { CheckoutSteps, OrderSummary } from "@/components/order-summary";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import {
  cdnImage,
  courseImage,
  getCategory,
  getCourse,
  purchaseState,
  rupiah,
  sessionLabel,
} from "@/lib/catalog";
import { COURSES, MAX_TICKETS_PER_LINE } from "@/lib/fixtures";
import {
  computeTotals,
  isLineAvailable,
  unitPrice,
  variantSummary,
  type CartLine,
} from "@/lib/pricing";

export const Route = createFileRoute("/cart")({
  head: ({ match }) => ({
    meta: [
      {
        title: `${match.context.lang === "id" ? "Keranjang" : "Cart"} — NBRI Academy`,
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const { t } = useLang();
  const totals = computeTotals(cart.lines);
  const availableLines = cart.lines.filter((l) => isLineAvailable(l));
  const allSelected =
    availableLines.length > 0 && availableLines.every((l) => l.selected);

  return (
    <div className="mx-auto max-w-content px-4 py-10 pb-32 sm:px-6 md:pb-10">
      <CheckoutSteps step={1} />
      <h1 className="mb-6 text-3xl font-bold">
        {t("Your cart", "Keranjang belanja")}
      </h1>

      {!cart.ready ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          <Skeleton className="h-72 rounded-xl" />
        </div>
      ) : cart.lines.length === 0 ? (
        <div className="grid place-items-center gap-4 rounded-2xl border border-dashed py-16 text-center">
          <ShoppingBag className="size-10 text-muted-foreground" />
          <div>
            <p className="text-lg font-semibold">
              {t("Your cart is empty", "Keranjang masih kosong")}
            </p>
            <p className="text-muted-foreground">
              {t(
                "Choose a workshop or course to get started.",
                "Pilih workshop atau kursus untuk memulai.",
              )}
            </p>
          </div>
          <Button
            asChild
            className="bg-brand-gradient rounded-full px-6 font-bold text-navy"
          >
            <Link to="/schedule">
              {t("View training calendar", "Lihat jadwal workshop")}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            <label className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 font-semibold">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(v) => cart.toggleAll(v === true)}
              />
              {t("Select all", "Pilih semua")} ({availableLines.length})
            </label>
            {cart.lines.map((l) => (
              <CartRow key={l.key} line={l} />
            ))}
            <Link
              to="/courses"
              className="inline-block pt-2 text-sm font-semibold text-primary hover:underline"
            >
              {t("+ Find more programs", "+ Cari program lainnya")}
            </Link>
          </div>
          <div className="space-y-3 lg:sticky lg:top-24">
            <OrderSummary totals={totals} />
            <Button
              size="lg"
              className="bg-brand-gradient hidden h-12 w-full rounded-full text-base font-bold text-navy hover:opacity-90 md:inline-flex"
              disabled={totals.items === 0}
              onClick={() => navigate({ to: "/checkout" })}
            >
              Checkout ({totals.items})
            </Button>
          </div>
        </div>
      )}

      {cart.ready && <Recommendations />}

      {cart.ready && cart.lines.length > 0 && (
        <div className="fixed inset-x-0 bottom-[60px] z-30 flex items-center justify-between gap-3 border-t bg-background px-4 py-3 shadow-[0_-8px_24px_rgba(15,21,38,0.08)] md:hidden">
          <div>
            <div className="text-xs text-muted-foreground">
              Total ({totals.items} {t("selected", "dipilih")})
            </div>
            <div className="font-display text-xl font-bold">
              {rupiah(totals.total)}
            </div>
          </div>
          <Button
            className="bg-brand-gradient rounded-full px-6 font-bold text-navy"
            disabled={totals.items === 0}
            onClick={() => navigate({ to: "/checkout" })}
          >
            Checkout ({totals.items})
          </Button>
        </div>
      )}
    </div>
  );
}

function CartRow({ line }: { line: CartLine }) {
  const cart = useCart();
  const { lang, t, tr } = useLang();
  const course = getCourse(line.slug);
  if (!course) return null;
  const st = purchaseState(course);
  const session = course.sessions.find((s) => s.id === line.sessionId);
  const available = isLineAvailable(line);
  const price = unitPrice(course, line.variant);
  const maxQty = Math.min(
    MAX_TICKETS_PER_LINE,
    session?.seatsLeft ?? MAX_TICKETS_PER_LINE,
  );
  const variants = variantSummary(course, line.variant, lang);

  return (
    <div className="flex gap-3 rounded-xl border bg-card p-4">
      <Checkbox
        className="mt-1"
        aria-label={t(
          `Select ${tr(course.title)}`,
          `Pilih ${tr(course.title)}`,
        )}
        checked={line.selected && available}
        disabled={!available}
        onCheckedChange={(v) => cart.toggle(line.key, v === true)}
      />
      <Link
        to="/courses/$slug"
        params={{ slug: course.slug }}
        className="shrink-0"
      >
        <img
          src={cdnImage(courseImage(course), 200)}
          alt=""
          className="size-20 rounded-lg object-cover sm:h-20 sm:w-28"
        />
      </Link>
      <div className="min-w-0 flex-1 space-y-1">
        <span className="text-[11px] font-bold tracking-wider text-primary uppercase">
          {getCategory(course.category).name}
        </span>
        <Link
          to="/courses/$slug"
          params={{ slug: course.slug }}
          className="line-clamp-2 leading-snug font-bold hover:text-primary"
        >
          {tr(course.title)}
        </Link>
        <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
          {session && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {sessionLabel(session, lang)}
            </span>
          )}
          {variants && <span>{variants}</span>}
        </div>
        {!available && (
          <p className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
            <AlertTriangle className="size-3.5" />
            {st.kind === "buy"
              ? t(
                  "Not enough seats for this quantity",
                  "Kursi tidak mencukupi untuk jumlah ini",
                )
              : t(
                  "This date is no longer available",
                  "Jadwal ini sudah tidak tersedia",
                )}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {course.mode === "offline" ? (
            <div className="flex items-center gap-1 rounded-full border p-0.5">
              <Button
                variant="ghost"
                size="icon-xs"
                className="rounded-full"
                aria-label={t("Remove one ticket", "Kurangi tiket")}
                disabled={line.qty <= 1}
                onClick={() => cart.setQty(line.key, line.qty - 1)}
              >
                <Minus />
              </Button>
              <span className="w-6 text-center text-sm font-bold">
                {line.qty}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                className="rounded-full"
                aria-label={t("Add one ticket", "Tambah tiket")}
                disabled={line.qty >= maxQty}
                onClick={() => cart.setQty(line.key, line.qty + 1)}
              >
                <Plus />
              </Button>
              <span className="pr-2 text-xs text-muted-foreground">
                {t("tickets", "tiket")}
              </span>
            </div>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => cart.remove(line.key)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5" /> {t("Remove", "Hapus")}
          </button>
        </div>
      </div>
      <div className="text-right">
        <div className="font-display font-bold">{rupiah(price * line.qty)}</div>
      </div>
    </div>
  );
}

function Recommendations() {
  const cart = useCart();
  const { t } = useLang();
  const inCart = new Set(cart.lines.map((l) => l.slug));
  const items = COURSES.filter((c) => !inCart.has(c.slug))
    .sort((a, b) => {
      const ok = (k: string) => (k === "buy" || k === "online" ? 1 : 0);
      return ok(purchaseState(b).kind) - ok(purchaseState(a).kind);
    })
    .slice(0, 4);
  if (!items.length) return null;
  return (
    <section className="mt-14">
      <h2 className="mb-6 text-2xl font-bold">
        {t("Other participants also joined", "Peserta lain juga mengikuti")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((c) => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </section>
  );
}
