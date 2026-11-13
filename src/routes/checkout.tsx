import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  Landmark,
  MessageCircle,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import * as React from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { VerifyNote } from "@/components/course-card";
import { CheckoutSteps, OrderSummary } from "@/components/order-summary";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import type { Lang } from "@/lib/text";
import { getCourse, rupiah, sessionLabel, whatsappLink } from "@/lib/catalog";
import { BANK_ACCOUNTS, PAYMENT_WINDOW_HOURS } from "@/lib/fixtures";
import {
  computeTotals,
  isLineAvailable,
  variantSummary,
  type CartLine,
  type CartTotals,
} from "@/lib/pricing";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — NBRI Academy" }] }),
  component: CheckoutPage,
});

function makeSchema(lang: Lang) {
  const t = (en: string, id: string) => (lang === "id" ? id : en);
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t("Enter your full name.", "Masukkan nama lengkap.")),
    email: z.email(t("Enter a valid email.", "Masukkan email yang valid.")),
    phone: z
      .string()
      .trim()
      .regex(
        /^(\+?62|0)8\d{7,12}$/,
        t(
          "Use an Indonesian WhatsApp number, e.g. 0812xxxxxxx.",
          "Gunakan nomor WhatsApp Indonesia, mis. 0812xxxxxxx.",
        ),
      ),
    company: z.string().trim().optional(),
    participants: z.array(
      z
        .string()
        .trim()
        .min(2, t("Enter the participant's name.", "Isi nama peserta.")),
    ),
  });
}
type Values = z.infer<ReturnType<typeof makeSchema>>;

interface PlacedOrder {
  ref: string;
  createdAt: string;
  expiresAt: string;
  buyer: Omit<Values, "participants">;
  lines: { line: CartLine; participants: string[] }[];
  totals: CartTotals;
}

function orderRef() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `NBRI-${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function CheckoutPage() {
  const cart = useCart();
  const [order, setOrder] = React.useState<PlacedOrder | null>(null);
  const { t } = useLang();

  if (order) return <OrderPlaced order={order} />;

  const lines = cart.lines.filter((l) => l.selected && isLineAvailable(l));
  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <CheckoutSteps step={2} />
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
      {!cart.ready ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      ) : lines.length === 0 ? (
        <div className="grid place-items-center gap-4 rounded-2xl border border-dashed py-16 text-center">
          <p className="text-lg font-semibold">
            {t(
              "No programs selected for checkout yet.",
              "Belum ada program yang dipilih untuk checkout.",
            )}
          </p>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/cart">{t("Back to cart", "Kembali ke keranjang")}</Link>
          </Button>
        </div>
      ) : (
        <CheckoutForm
          lines={lines}
          onPlaced={(o) => {
            setOrder(o);
            cart.clearSelected();
            window.scrollTo({ top: 0 });
          }}
        />
      )}
    </div>
  );
}

function CheckoutForm({
  lines,
  onPlaced,
}: {
  lines: CartLine[];
  onPlaced: (o: PlacedOrder) => void;
}) {
  const { lang, t, tr } = useLang();
  const schema = React.useMemo(() => makeSchema(lang), [lang]);
  const totals = computeTotals(lines);
  // one participant name per offline ticket
  const seats = lines.flatMap((l, li) =>
    l.sessionId ? Array.from({ length: l.qty }, (_, k) => ({ li, k })) : [],
  );
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      participants: seats.map(() => ""),
    },
  });

  const submit = form.handleSubmit(async (v) => {
    // Milestone 3 replaces this with a server function that re-prices the cart,
    // reserves seats, and stores the order in Netlify Database.
    const now = new Date();
    const expires = new Date(now.getTime() + PAYMENT_WINDOW_HOURS * 3600_000);
    onPlaced({
      ref: orderRef(),
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      buyer: {
        name: v.name,
        email: v.email,
        phone: v.phone,
        company: v.company,
      },
      lines: lines.map((line, li) => ({
        line,
        participants: seats
          .map((s, i) => (s.li === li ? v.participants[i] : null))
          .filter((x): x is string => !!x),
      })),
      totals,
    });
  });

  return (
    <Form {...form}>
      <form
        onSubmit={submit}
        noValidate
        className="grid items-start gap-6 lg:grid-cols-[1fr_360px]"
      >
        <div className="space-y-6">
          <section className="space-y-4 rounded-xl border bg-card p-6">
            <h2 className="text-lg font-bold">
              {t("Your details", "Data pemesan")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                form={form}
                name="name"
                label={t("Full name", "Nama lengkap")}
                autoComplete="name"
              />
              <TextField
                form={form}
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
              />
              <TextField
                form={form}
                name="phone"
                label={t("WhatsApp number", "Nomor WhatsApp")}
                type="tel"
                autoComplete="tel"
                placeholder="0812xxxxxxx"
              />
              <TextField
                form={form}
                name="company"
                label={t(
                  "Company / institution (optional)",
                  "Perusahaan / institusi (opsional)",
                )}
                autoComplete="organization"
              />
            </div>
          </section>

          {seats.length > 0 && (
            <section className="space-y-4 rounded-xl border bg-card p-6">
              <div>
                <h2 className="text-lg font-bold">
                  {t("Participant details", "Data peserta")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t(
                    "These names are printed on the e-ticket and certificate.",
                    "Nama ini dicetak pada e-tiket dan sertifikat.",
                  )}
                </p>
              </div>
              {lines.map((l, li) => {
                const course = getCourse(l.slug)!;
                const session = course.sessions.find(
                  (s) => s.id === l.sessionId,
                );
                const idx = seats
                  .map((s, i) => ({ ...s, i }))
                  .filter((s) => s.li === li);
                if (!idx.length) return null;
                return (
                  <div
                    key={l.key}
                    className="space-y-3 rounded-lg bg-muted/60 p-4"
                  >
                    <div className="text-sm font-bold">{tr(course.title)}</div>
                    {session && (
                      <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />{" "}
                        {sessionLabel(session, lang)}
                      </div>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {idx.map((s) => (
                        <FormField
                          key={s.i}
                          control={form.control}
                          name={`participants.${s.i}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("Participant", "Peserta")} {s.k + 1}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          <section className="space-y-4 rounded-xl border bg-card p-6">
            <h2 className="text-lg font-bold">
              {t("Payment method", "Metode pembayaran")}
            </h2>
            <div className="flex items-start gap-3 rounded-lg border-2 border-primary bg-accent p-4">
              <Landmark className="mt-0.5 size-5 text-primary" />
              <div>
                <div className="font-bold">
                  {t("Manual bank transfer", "Transfer bank manual")}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t(
                    `Transfer to the official NBRI account within ${PAYMENT_WINDOW_HOURS} hours, then confirm via WhatsApp with your transfer receipt. The admin verifies the payment before tickets are activated.`,
                    `Transfer ke rekening resmi NBRI dalam ${PAYMENT_WINDOW_HOURS} jam, lalu konfirmasi via WhatsApp dengan bukti transfer. Admin memverifikasi dana masuk sebelum tiket diaktifkan.`,
                  )}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-3 lg:sticky lg:top-24">
          <OrderSummary totals={totals} />
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="bg-brand-gradient h-12 w-full rounded-full text-base font-bold text-navy hover:opacity-90"
          >
            {t("Place order", "Buat pesanan")} · {rupiah(totals.total)}
          </Button>
          <p className="flex gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-primary" />
            {t(
              "Seats are held until the payment deadline.",
              "Kursi ditahan selama batas waktu pembayaran.",
            )}
          </p>
        </div>
      </form>
    </Form>
  );
}

function TextField({
  form,
  name,
  label,
  ...input
}: {
  form: UseFormReturn<Values>;
  name: "name" | "email" | "phone" | "company";
  label: string;
} & Omit<React.ComponentProps<"input">, "name" | "form">) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...input} {...field} value={field.value ?? ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function formatDeadline(iso: string, lang: Lang) {
  return new Date(iso).toLocaleString(lang === "id" ? "id-ID" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderPlaced({ order }: { order: PlacedOrder }) {
  const { lang, t, tr } = useLang();
  const items = order.lines.map(({ line }) => {
    const c = getCourse(line.slug)!;
    const s = c.sessions.find((x) => x.id === line.sessionId);
    return `• ${tr(c.title)}${s ? ` (${sessionLabel(s, lang)})` : ""} × ${line.qty}`;
  });
  const waText = [
    t(
      "Hello NBRI Academy, I would like to confirm my payment.",
      "Halo NBRI Academy, saya ingin konfirmasi pembayaran.",
    ),
    `${t("Order no.", "No. pesanan")}: ${order.ref}`,
    `${t("Name", "Nama")}: ${order.buyer.name}`,
    `Total: ${rupiah(order.totals.total)}`,
    ...items,
    t("My transfer receipt is attached.", "Bukti transfer saya lampirkan."),
  ].join("\n");
  const bank = BANK_ACCOUNTS[0];
  const copy = (text: string, what: string) => {
    navigator.clipboard?.writeText(text).then(
      () => toast.success(t(`${what} copied`, `${what} disalin`)),
      () => toast.error(t("Couldn't copy", "Gagal menyalin")),
    );
  };

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <CheckoutSteps step={3} />
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-secondary p-6 text-foreground sm:p-8">
            <CheckCircle2 className="size-10 text-primary" />
            <h1 className="mt-3 text-3xl font-bold">
              {t("Order placed", "Pesanan dibuat")}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {t(
                "Complete the transfer before the deadline so your seats stay reserved.",
                "Selesaikan transfer sebelum batas waktu agar kursi Anda tetap ditahan.",
              )}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-background p-4">
                <div className="text-xs text-muted-foreground">
                  {t("Order number", "Nomor pesanan")}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copy(order.ref, t("Order number", "Nomor pesanan"))
                  }
                  className="mt-1 inline-flex items-center gap-2 font-display text-xl font-bold"
                >
                  {order.ref} <Copy className="size-4 text-muted-foreground" />
                </button>
              </div>
              <div className="rounded-xl bg-background p-4">
                <div className="text-xs text-muted-foreground">
                  {t("Transfer amount", "Jumlah transfer")}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copy(String(order.totals.total), t("Amount", "Jumlah"))
                  }
                  className="text-primary mt-1 inline-flex items-center gap-2 font-display text-xl font-bold"
                >
                  {rupiah(order.totals.total)}{" "}
                  <Copy className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800">
              <Clock className="size-4" /> {t("Pay before", "Bayar sebelum")}{" "}
              {formatDeadline(order.expiresAt, lang)}
            </div>
          </section>

          <section className="space-y-4 rounded-xl border bg-card p-6">
            <h2 className="text-lg font-bold">
              {t(
                "1 · Transfer to the official NBRI account",
                "1 · Transfer ke rekening resmi NBRI",
              )}
            </h2>
            <div className="flex items-start gap-4 rounded-lg bg-muted/60 p-4">
              <Building2 className="mt-1 size-6 text-primary" />
              <div className="space-y-1">
                <div className="font-bold">{tr(bank.bank)}</div>
                <div className="font-display text-lg font-bold">
                  {bank.accountNumber ??
                    t(
                      "The account number appears once the admin sets it",
                      "Nomor rekening akan ditampilkan setelah diatur admin",
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("Account holder:", "a.n.")} {bank.holder}
                </div>
                {!bank.verified && <VerifyNote />}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Write", "Tulis")}{" "}
              <b className="text-foreground">{order.ref}</b>{" "}
              {t("in the transfer note.", "di berita transfer.")}
            </p>
          </section>

          <section className="space-y-4 rounded-xl border bg-card p-6">
            <h2 className="text-lg font-bold">
              {t("2 · Confirm via WhatsApp", "2 · Konfirmasi via WhatsApp")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(
                "Send your transfer receipt. A message with your order number and details is ready to go.",
                "Kirim bukti transfer. Pesan berisi nomor pesanan dan rincian sudah disiapkan.",
              )}
            </p>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-[#25D366] px-6 text-base font-bold text-white hover:bg-[#1fb857]"
            >
              <a
                href={whatsappLink(waText)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle />{" "}
                {t("Confirm payment", "Konfirmasi pembayaran")}
              </a>
            </Button>
          </section>

          <section className="space-y-4 rounded-xl border bg-card p-6">
            <h2 className="text-lg font-bold">
              {t("3 · E-tickets & course access", "3 · E-tiket & akses kursus")}
            </h2>
            <ol className="grid gap-2 text-sm sm:grid-cols-3">
              {[
                t("Awaiting payment", "Menunggu pembayaran"),
                t("Admin verification", "Verifikasi admin"),
                t("Tickets & access active", "Tiket & akses aktif"),
              ].map((s, i) => (
                <li
                  key={s}
                  className={
                    i === 0
                      ? "rounded-lg bg-amber-100 p-3 font-semibold text-amber-900 dark:bg-amber-950/50 dark:text-amber-300"
                      : "rounded-lg bg-muted p-3 text-muted-foreground"
                  }
                >
                  {i + 1}. {s}
                </li>
              ))}
            </ol>
            <div className="grid gap-3">
              {order.lines.flatMap(({ line, participants }) => {
                const c = getCourse(line.slug)!;
                const s = c.sessions.find((x) => x.id === line.sessionId);
                return participants.map((p, i) => (
                  <div
                    key={`${line.key}-${i}`}
                    className="flex items-center gap-4 rounded-lg border border-dashed p-4"
                  >
                    <Ticket className="size-6 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-bold">{tr(c.title)}</div>
                      <div className="text-xs text-muted-foreground">
                        {s && sessionLabel(s, lang)} ·{" "}
                        {variantSummary(c, line.variant, lang)} ·{" "}
                        {t("Participant", "Peserta")}: <b>{p}</b>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                      {t(
                        "QR issued after verification",
                        "QR terbit setelah verifikasi",
                      )}
                    </span>
                  </div>
                ));
              })}
            </div>
          </section>
        </div>
        <div className="space-y-3 lg:sticky lg:top-24">
          <OrderSummary totals={order.totals} />
          <Button asChild variant="outline" className="w-full rounded-full">
            <Link to="/courses">
              {t("Continue browsing", "Lanjut belanja")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
