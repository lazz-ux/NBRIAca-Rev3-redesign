import { rupiah } from "@/lib/catalog";
import { useLang } from "@/lib/i18n";
import type { CartTotals } from "@/lib/pricing";

export function CheckoutSteps({ step }: { step: 1 | 2 | 3 }) {
  const { t } = useLang();
  const steps = [
    t("Cart", "Keranjang"),
    t("Payment", "Pembayaran"),
    t("WhatsApp confirmation", "Konfirmasi WhatsApp"),
  ];
  return (
    <ol className="mb-6 flex flex-wrap gap-2 text-sm">
      {steps.map((s, i) => (
        <li
          key={s}
          aria-current={i + 1 === step ? "step" : undefined}
          className={
            i + 1 <= step
              ? "rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground"
              : "rounded-full bg-muted px-3 py-1 text-muted-foreground"
          }
        >
          {i + 1} · {s}
        </li>
      ))}
    </ol>
  );
}

export function OrderSummary({ totals }: { totals: CartTotals }) {
  const { t } = useLang();
  return (
    <div className="space-y-2.5 rounded-xl border bg-card p-5">
      <h2 className="mb-1 text-lg font-bold">
        {t("Order summary", "Ringkasan pesanan")}
      </h2>
      <div className="flex justify-between gap-3 text-sm">
        <span>
          {t(
            `${totals.items} program${totals.items === 1 ? "" : "s"} · ${totals.tickets} ticket${totals.tickets === 1 ? "" : "s"}`,
            `${totals.items} program · ${totals.tickets} tiket`,
          )}
        </span>
        <span>{rupiah(totals.total)}</span>
      </div>
      <div className="flex items-baseline justify-between border-t pt-3">
        <b>Total</b>
        <b className="font-display text-2xl">{rupiah(totals.total)}</b>
      </div>
    </div>
  );
}
