import {
  createFileRoute,
  Link,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  GraduationCap,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { CoursePrice, CourseCard, StatusBadge } from "@/components/course-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import {
  cdnImage,
  courseImage,
  getCategory,
  getCourse,
  pastSessions,
  purchaseState,
  rupiah,
  sessionLabel,
  whatsappLink,
} from "@/lib/catalog";
import { COURSES, MAX_TICKETS_PER_LINE, type Course } from "@/lib/fixtures";
import { useLang } from "@/lib/i18n";
import { unitPrice } from "@/lib/pricing";
import { pick } from "@/lib/text";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/courses/$slug")({
  validateSearch: (s: Record<string, unknown>): { session?: string } => ({
    session: typeof s.session === "string" ? s.session : undefined,
  }),
  loader: ({ params }) => {
    const course = getCourse(params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData, match }) => {
    const lang = match.context.lang;
    return {
      meta: loaderData
        ? [
            { title: `${pick(loaderData.course.title, lang)} — NBRI Academy` },
            { name: "description", content: loaderData.course.summary[lang] },
          ]
        : [],
    };
  },
  component: CoursePage,
});

function CoursePage() {
  const { course } = Route.useLoaderData();
  const { t, tr } = useLang();
  const related = COURSES.filter((c) => c.slug !== course.slug)
    .sort(
      (a, b) =>
        Number(b.category === course.category) -
        Number(a.category === course.category),
    )
    .slice(0, 4);

  return (
    <>
      <section className="border-b bg-secondary text-foreground">
        <div className="mx-auto grid max-w-content gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
            >
              <Link to="/courses" className="hover:text-primary">
                {t("Programs", "Program")}
              </Link>
              <ChevronRight className="size-3.5" />
              <Link
                to="/courses"
                search={{ cat: course.category }}
                className="hover:text-primary"
              >
                {getCategory(course.category).name}
              </Link>
            </nav>
            <div className="flex flex-wrap gap-2">
              <StatusBadge course={course} />
              <span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-bold">
                {course.mode === "online" ? "Online" : "Offline"}
              </span>
              <span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-bold">
                {course.level}
              </span>
            </div>
            <h1 className="text-3xl leading-tight font-bold sm:text-4xl">
              {tr(course.title)}
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              {tr(course.summary)}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" />
                {tr(course.duration)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" />
                {tr(course.location)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="size-4" />
                {t("Certificate of completion", "Sertifikat penyelesaian")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-content gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div className="order-2 space-y-10 lg:order-1">
          <section className="rounded-xl border p-6">
            <h2 className="mb-4 text-xl font-bold">
              {t("What you will learn", "Yang akan Anda pelajari")}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o.en} className="flex gap-2.5 text-[15px]">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {tr(o)}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">
              {course.mode === "online"
                ? t("Curriculum", "Kurikulum")
                : t("Program agenda", "Agenda program")}
            </h2>
            <Accordion
              type="multiple"
              defaultValue={["a-0"]}
              className="rounded-xl border"
            >
              {course.agenda.map((a, i) => (
                <AccordionItem key={a.en} value={`a-${i}`} className="px-5">
                  <AccordionTrigger className="font-semibold">
                    <span className="flex items-center gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {i + 1}
                      </span>
                      {tr(a)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-10 text-muted-foreground">
                    {t(
                      "Detailed session content is managed by the instructor through the curriculum dashboard.",
                      "Rincian materi sesi ini dikelola instruktur melalui dashboard kurikulum.",
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">
              {t("Instructor", "Instruktur")}
            </h2>
            <div className="flex items-center gap-4 rounded-xl border p-5">
              <div className="grid size-14 place-items-center rounded-full bg-muted">
                <UserRound className="size-6 text-muted-foreground" />
              </div>
              <div>
                <div className="font-bold">
                  {course.instructor?.name ??
                    t(
                      "NBRI researchers & practitioners",
                      "Tim peneliti & praktisi NBRI",
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {course.instructor
                    ? tr(course.instructor.role)
                    : t(
                        "Instructor profiles are announced together with the dates.",
                        "Profil instruktur akan diumumkan bersama jadwal.",
                      )}
                </div>
              </div>
            </div>
          </section>

          <PastRuns course={course} />
        </div>

        <aside className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24 lg:-mt-64">
            <PurchaseBox key={course.slug} course={course} />
          </div>
        </aside>
      </div>

      <section className="bg-muted/50 py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <h2 className="mb-6 text-2xl font-bold">
            {t(
              "Other programs you may like",
              "Program lain yang mungkin Anda suka",
            )}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PastRuns({ course }: { course: Course }) {
  const { lang, t } = useLang();
  const past = pastSessions(course);
  if (!past.length) return null;
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">
        {t("Previous dates", "Jadwal sebelumnya")}
      </h2>
      <div className="flex flex-wrap gap-2">
        {past.map((s) => (
          <span
            key={s.id}
            className="rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground line-through decoration-muted-foreground/40"
          >
            {sessionLabel(s, lang)}
          </span>
        ))}
      </div>
    </section>
  );
}

function PurchaseBox({ course }: { course: Course }) {
  const st = purchaseState(course);
  const { add } = useCart();
  const { lang, t, tr } = useLang();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const sessions = st.kind === "buy" ? st.sessions : [];
  const [sessionId, setSessionId] = React.useState(
    sessions.find((s) => s.id === search.session)?.id ??
      sessions[0]?.id ??
      null,
  );
  const [variant, setVariant] = React.useState<number[]>(
    course.variants.map(() => 0),
  );
  const [qty, setQty] = React.useState(1);
  const session = sessions.find((s) => s.id === sessionId);
  const maxQty = Math.min(
    MAX_TICKETS_PER_LINE,
    session?.seatsLeft ?? MAX_TICKETS_PER_LINE,
  );
  const price = unitPrice(course, variant);
  const canBuy =
    st.kind === "buy" || (st.kind === "online" && course.price !== null);

  const addToCart = (goToCart: boolean) => {
    add({ slug: course.slug, sessionId: session?.id ?? null, variant, qty });
    if (goToCart) {
      navigate({ to: "/cart" });
      return;
    }
    toast.success(t("Added to cart", "Ditambahkan ke keranjang"), {
      description: tr(course.title),
      action: {
        label: t("View cart", "Lihat keranjang"),
        onClick: () => navigate({ to: "/cart" }),
      },
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
      <img
        src={cdnImage(courseImage(course), 760)}
        alt=""
        className="aspect-[16/9] w-full object-cover"
      />
      <div className="space-y-5 p-5">
        <div className="space-y-1">
          {canBuy ? (
            <div className="font-display text-3xl font-bold">
              {rupiah(price)}
            </div>
          ) : (
            <CoursePrice course={course} size="lg" />
          )}
        </div>

        {st.kind === "buy" && (
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-bold">
              {t("Choose a date", "Pilih jadwal")}
            </legend>
            {sessions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSessionId(s.id);
                  setQty((q) => Math.min(q, s.seatsLeft));
                }}
                aria-pressed={s.id === sessionId}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border-2 px-3 py-2.5 text-left transition-colors motion-reduce:transition-none",
                  s.id === sessionId
                    ? "border-primary bg-accent"
                    : "hover:border-primary/40",
                )}
              >
                <span className="inline-flex items-center gap-2 font-semibold">
                  <CalendarDays className="size-4 text-primary" />
                  {sessionLabel(s, lang)}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    s.seatsLeft <= 5 ? "text-sale" : "text-muted-foreground",
                  )}
                >
                  {t(
                    `${s.seatsLeft} seats left`,
                    `${s.seatsLeft} kursi tersisa`,
                  )}
                </span>
              </button>
            ))}
          </fieldset>
        )}

        {canBuy &&
          course.variants.map((g, gi) => (
            <fieldset key={g.label.en}>
              <legend className="mb-2 text-sm font-bold">{tr(g.label)}</legend>
              <div className="grid gap-2">
                {g.options.map((o, oi) => (
                  <button
                    key={o.label.en}
                    type="button"
                    aria-pressed={variant[gi] === oi}
                    onClick={() =>
                      setVariant((v) => v.map((x, k) => (k === gi ? oi : x)))
                    }
                    className={cn(
                      "flex items-center justify-between rounded-lg border-2 px-3 py-2 text-left text-sm transition-colors motion-reduce:transition-none",
                      variant[gi] === oi
                        ? "border-primary bg-accent font-semibold"
                        : "hover:border-primary/40",
                    )}
                  >
                    {tr(o.label)}
                    {o.surcharge > 0 && (
                      <span className="text-muted-foreground">
                        +{rupiah(o.surcharge)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}

        {st.kind === "buy" && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">
              {t("Number of tickets", "Jumlah tiket")}
            </span>
            <div className="flex items-center gap-1 rounded-full border p-1">
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                aria-label={t("Decrease", "Kurangi")}
                disabled={qty <= 1}
                onClick={() => setQty(qty - 1)}
              >
                <Minus />
              </Button>
              <span className="w-8 text-center font-bold" aria-live="polite">
                {qty}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                aria-label={t("Increase", "Tambah")}
                disabled={qty >= maxQty}
                onClick={() => setQty(qty + 1)}
              >
                <Plus />
              </Button>
            </div>
          </div>
        )}

        {canBuy && (
          <>
            {qty > 1 && (
              <div className="flex justify-between border-t pt-4">
                <span>Subtotal</span>
                <b className="font-display text-xl">{rupiah(price * qty)}</b>
              </div>
            )}
            <div className="grid gap-2">
              <Button
                size="lg"
                className="bg-brand-gradient h-12 rounded-full text-base font-bold text-navy hover:opacity-90"
                onClick={() => addToCart(true)}
              >
                {st.kind === "buy"
                  ? t("Get tickets now", "Beli tiket sekarang")
                  : t("Buy now", "Beli sekarang")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-primary text-base font-bold text-primary hover:text-primary"
                onClick={() => addToCart(false)}
              >
                {t("Add to cart", "Tambah ke keranjang")}
              </Button>
            </div>
          </>
        )}

        {st.kind === "quote" && (
          <>
            <p className="text-sm text-muted-foreground">
              {t(
                "The program is tailored to your team's needs, schedule, and location.",
                "Program disesuaikan dengan kebutuhan, jadwal, dan lokasi tim Anda.",
              )}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-gradient h-12 w-full rounded-full text-base font-bold text-navy hover:opacity-90"
            >
              <a
                href={whatsappLink(
                  t(
                    `Hello NBRI Academy, I would like to discuss: ${tr(course.title)}`,
                    `Halo NBRI Academy, saya ingin konsultasi: ${tr(course.title)}`,
                  ),
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Enquire via WhatsApp", "Konsultasi via WhatsApp")}
              </a>
            </Button>
          </>
        )}

        {(st.kind === "tba" || st.kind === "coming-soon") && (
          <>
            <p className="text-sm text-muted-foreground">
              {st.kind === "tba"
                ? t(
                    "The next date is being prepared. We'll let you know as soon as tickets open.",
                    "Jadwal berikutnya sedang disiapkan. Kami kabari Anda begitu tiket dibuka.",
                  )
                : t(
                    "This online course is in production. Sign up to hear when it launches.",
                    "Kursus online ini sedang diproduksi. Daftar untuk mendapat kabar peluncuran.",
                  )}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-gradient h-12 w-full rounded-full text-base font-bold text-navy hover:opacity-90"
            >
              <a
                href={whatsappLink(
                  t(
                    `Hello NBRI Academy, please let me know when ${tr(course.title)} opens.`,
                    `Halo NBRI Academy, mohon kabari saya saat ${tr(course.title)} dibuka.`,
                  ),
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Notify me via WhatsApp", "Beritahu saya via WhatsApp")}
              </a>
            </Button>
          </>
        )}

        <p className="flex gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          {course.mode === "offline"
            ? t(
                "Tickets activate once the admin verifies payment. Certificate included.",
                "Tiket aktif setelah pembayaran diverifikasi admin. Sertifikat disertakan.",
              )
            : t(
                "Access activates once payment is approved. Certificate included.",
                "Akses aktif setelah pembayaran disetujui. Sertifikat disertakan.",
              )}
        </p>
      </div>
    </div>
  );
}
