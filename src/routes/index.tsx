import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Handshake,
  MonitorPlay,
  Presentation,
  Quote,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import * as React from "react";

import { CourseCard, SessionCard, VerifyNote } from "@/components/course-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  cdnImage,
  dayLabel,
  upcomingSessions,
  whatsappLink,
} from "@/lib/catalog";
import {
  COURSES,
  EXPERTS,
  FAQ,
  PARTNERS,
  PAST_PROGRAMS,
  STATS,
  TESTIMONIALS,
  type CategoryId,
} from "@/lib/fixtures";
import { useLang } from "@/lib/i18n";
import { LEVELS, MEDIA, levelOf, type LevelId, type Media } from "@/lib/learning";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <WhyBatterySchool />
      <LearningPaths />
      <LearningLevels />
      <CareerJourney />
      <AlumniStories />
      <PartnerLogos />
      <Speakers />
      <ProgramsGate />
      <FaqSection />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Avatar({
  photo,
  name,
  className,
  size = 160,
}: {
  photo?: string;
  name: string;
  className?: string;
  size?: number;
}) {
  const initials = initialsOf(name);
  return photo ? (
    <img
      src={cdnImage(photo, size)}
      alt={name}
      loading="lazy"
      className={cn("rounded-full bg-muted object-cover", className)}
    />
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        "grid place-items-center rounded-full bg-gradient-to-br from-[#d4f4ef] to-[#8be5d5] font-display font-bold text-accent-foreground select-none",
        className,
      )}
    >
      {initials}
    </span>
  );
}

/** "Ir. Sirmayanti, S.T., M.Eng." -> "S"; "Kevin Vicario Aritonang" -> "KV". */
function initialsOf(name: string) {
  return name
    .split(",")[0]
    .replace(/\b(Prof|Dr|Ir|rer|nat)\.\s*/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function SectionHeading({
  eyebrow,
  title,
  sub,
  action,
  center,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: string;
  action?: React.ReactNode;
  center?: boolean;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-3",
        center && "flex-col items-center text-center",
      )}
    >
      <div className={cn(center ? "max-w-2xl" : "max-w-3xl")}>
        {eyebrow && (
          <div className="mb-2 text-sm font-bold tracking-wide text-primary uppercase">
            {eyebrow}
          </div>
        )}
        <h2 id={id} className="text-2xl font-bold sm:text-3xl md:text-4xl">
          {title}
        </h2>
        {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Photo({
  m,
  className,
  priority,
  width = 800,
}: {
  m: Media;
  className?: string;
  priority?: boolean;
  width?: number;
}) {
  const { tr } = useLang();
  return (
    <img
      src={cdnImage(m.src, width)}
      alt={tr(m.alt)}
      loading={priority ? undefined : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={cn("size-full rounded-3xl object-cover shadow-md", className)}
    />
  );
}

function Hero() {
  const { t, tr } = useLang();
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-secondary via-secondary/70 to-background">
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 -z-10 size-[34rem] rounded-full bg-primary/15 blur-3xl"
      />
      <div className="mx-auto grid max-w-content items-center gap-10 px-4 pt-10 pb-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:pt-16">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-bold tracking-wider text-accent-foreground uppercase shadow-sm">
            <span className="size-1.5 rounded-full bg-primary" />
            {t(
              "Online learning · Industrial training",
              "Pembelajaran online · Pelatihan industri",
            )}
          </span>
          <h1 className="text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
            {t("Learn from the people", "Belajar dari orang-orang")}{" "}
            <span className="text-primary">
              {t(
                "building the battery industry.",
                "yang membangun industri baterai.",
              )}
            </span>
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            {t(
              "Practical courses and hands-on training from NBRI researchers and industry practitioners.",
              "Kursus praktis dan pelatihan langsung dari peneliti NBRI dan praktisi industri.",
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-6 text-base font-bold">
              <a href="#learning-paths">
                {t("Explore Learning", "Jelajahi Pembelajaran")} <ArrowRight />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full bg-background px-6 text-base font-semibold"
            >
              <Link to="/courses/$slug" params={{ slug: "industrial-training" }}>
                <Building2 />
                {t("Industrial Training", "Pelatihan Industri")}
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative grid h-[22rem] grid-cols-6 grid-rows-6 gap-3 sm:h-[30rem]">
          <Photo m={MEDIA.hero} priority width={1000} className="col-span-4 row-span-6" />
          <Photo m={MEDIA.heroLab} className="col-span-2 row-span-3" />
          <Photo m={MEDIA.heroClass} className="col-span-2 row-span-3" />
          <div className="absolute bottom-4 left-4 rounded-2xl bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
            <div className="font-display text-2xl font-bold text-primary">
              {STATS.items[0].value}
            </div>
            <div className="text-xs font-semibold text-muted-foreground">
              {tr(STATS.items[0].label)}
            </div>
          </div>
        </div>
      </div>
      <dl className="mx-auto mt-6 grid max-w-content grid-cols-2 gap-3 px-4 pb-10 sm:px-6 md:grid-cols-4">
        {STATS.items.map((s) => (
          <div key={s.label.en} className="rounded-2xl bg-card/80 px-4 py-3 shadow-sm">
            <dd className="font-display text-2xl font-bold text-accent-foreground">
              {s.value}
            </dd>
            <dt className="text-xs text-muted-foreground">{tr(s.label)}</dt>
          </div>
        ))}
      </dl>
      {!STATS.verified && <VerifyNote className="mx-auto max-w-content px-4 pb-4 sm:px-6" />}
    </section>
  );
}

function WhyBatterySchool() {
  const { t } = useLang();
  const reasons = [
    {
      icon: TrendingUp,
      title: t("Industry needs talent", "Industri butuh talenta"),
      body: t(
        "Cell plants, smelters, EVs and storage keep growing.",
        "Pabrik sel, smelter, EV, dan penyimpanan energi terus tumbuh.",
      ),
    },
    {
      icon: FlaskConical,
      title: t("Practice over theory", "Praktik, bukan teori saja"),
      body: t(
        "Real cells, real packs, in the Puspiptek BRIN lab.",
        "Sel dan pack sungguhan, di lab Puspiptek BRIN.",
      ),
    },
    {
      icon: Presentation,
      title: t("Taught by practitioners", "Diajar praktisi"),
      body: t(
        "NBRI and BRIN researchers with industry experts.",
        "Peneliti NBRI dan BRIN bersama pakar industri.",
      ),
    },
    {
      icon: Handshake,
      title: t("Certificate and network", "Sertifikat dan jejaring"),
      body: t(
        "Connect with 100+ industries and institutions.",
        "Terhubung dengan 100+ industri dan institusi.",
      ),
    },
  ];
  return (
    <section
      aria-labelledby="why-heading"
      className="mx-auto grid max-w-content items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr]"
    >
      <div className="relative">
        <Photo m={MEDIA.heroLab} className="aspect-[4/3]" />
        <div className="absolute -right-2 -bottom-4 rounded-2xl bg-navy px-4 py-3 text-white shadow-lg sm:-right-4">
          <div className="font-display text-2xl font-bold">
            {t("2 days", "2 hari")}
          </div>
          <div className="text-xs text-white/75">
            {t("Battery School class", "Kelas Battery School")}
          </div>
        </div>
      </div>
      <div>
        <div className="text-sm font-bold tracking-wide text-primary uppercase">
          {t("Why Battery School", "Kenapa Battery School")}
        </div>
        <h2 id="why-heading" className="mt-2 text-3xl font-bold md:text-4xl">
          {t("Skills the industry is hiring for.", "Keterampilan yang dicari industri.")}
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {reasons.map((r) => (
            <li key={r.title} className="rounded-2xl border bg-card p-4 shadow-sm">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <r.icon className="size-5" />
              </span>
              <h3 className="mt-3 font-bold">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LearningPaths() {
  const { t } = useLang();
  const onlineSoon = COURSES.filter((c) => c.category === "edutech").every(
    (c) => c.availability === "coming-soon",
  );
  const consult = whatsappLink(
    t(
      "Hello NBRI Academy, we would like to discuss Industrial Training.",
      "Halo NBRI Academy, kami ingin konsultasi Industrial Training.",
    ),
  );
  const paths: {
    title: string;
    tag: string;
    body: string;
    media: Media;
    cta: React.ReactNode;
  }[] = [
    {
      title: t("Online Learning", "Pembelajaran Online"),
      tag: onlineSoon ? t("Opening soon", "Segera dibuka") : t("Online", "Online"),
      body: t("Self-paced courses and live sessions.", "Kursus mandiri dan sesi langsung."),
      media: MEDIA.online,
      cta: (
        <Link to="/courses" search={{ cat: "edutech" }}>
          {t("Explore courses", "Lihat kursus")} <ArrowRight />
        </Link>
      ),
    },
    {
      title: "Battery School",
      tag: t("In person · Puspiptek", "Tatap muka · Puspiptek"),
      body: t("Two days of lab practice with experts.", "Dua hari praktik lab bersama pakar."),
      media: MEDIA.batterySchool,
      cta: (
        <Link to="/courses" search={{ cat: "battery-school" }}>
          {t("View classes", "Lihat kelas")} <ArrowRight />
        </Link>
      ),
    },
    {
      title: t("Industrial Training", "Pelatihan Industri"),
      tag: t("Talk to our team", "Konsultasi dengan tim"),
      body: t(
        "Custom programs for your team, on site or at NBRI.",
        "Program khusus untuk tim Anda, di lokasi atau di NBRI.",
      ),
      media: MEDIA.hero,
      cta: (
        <a href={consult} target="_blank" rel="noopener noreferrer">
          {t("Talk to our team", "Hubungi tim kami")} <ArrowRight />
        </a>
      ),
    },
    {
      title: "Training of Trainers",
      tag: t("For instructors", "Untuk instruktur"),
      body: t("Teach battery and EV technology with confidence.", "Ajarkan teknologi baterai dan EV dengan percaya diri."),
      media: MEDIA.heroClass,
      cta: (
        <Link to="/courses/$slug" params={{ slug: "training-of-trainers" }}>
          {t("Learn more", "Selengkapnya")} <ArrowRight />
        </Link>
      ),
    },
  ];
  return (
    <section
      id="learning-paths"
      aria-labelledby="paths-heading"
      className="scroll-mt-20 bg-secondary/70 py-14"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <SectionHeading
          id="paths-heading"
          center
          title={t("Find your learning path", "Temukan jalur belajar Anda")}
          sub={t(
            "Learn online, in the lab, or with your whole team.",
            "Belajar online, di lab, atau bersama seluruh tim.",
          )}
        />
        <PathSlider
          label={t("Learning paths", "Jalur belajar")}
          prevLabel={t("Previous learning paths", "Jalur belajar sebelumnya")}
          nextLabel={t("Next learning paths", "Jalur belajar berikutnya")}
          pageLabel={(n) => t(`Go to slide ${n}`, `Ke slide ${n}`)}
        >
          {paths.map((p) => (
            <article
              key={p.title}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl bg-navy text-white shadow-md"
            >
              <img
                src={cdnImage(p.media.src, 700)}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-transparent"
              />
              <div className="relative space-y-2 p-5">
                <span className="inline-block rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-navy">
                  {p.tag}
                </span>
                <h3 className="text-2xl font-bold">{p.title}</h3>
                <p className="text-sm text-white/85">{p.body}</p>
                <Button asChild className="mt-1 h-10 rounded-full bg-white px-5 font-bold text-navy hover:bg-white/90">
                  {p.cta}
                </Button>
              </div>
            </article>
          ))}
        </PathSlider>
      </div>
    </section>
  );
}

function LearningLevels() {
  const { t, tr } = useLang();
  const [id, setId] = React.useState<LevelId>("beginner");
  const level = LEVELS.find((x) => x.id === id)!;
  const programs = COURSES.filter((c) => levelOf(c) === id);
  return (
    <section
      aria-labelledby="levels-heading"
      className="mx-auto max-w-content px-4 py-14 sm:px-6"
    >
      <SectionHeading
        id="levels-heading"
        center
        title={t("Choose your level", "Pilih level Anda")}
        sub={t(
          "Every program is matched to what you already know.",
          "Setiap program disesuaikan dengan kemampuan Anda saat ini.",
        )}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div role="tablist" aria-label={t("Learning levels", "Level belajar")} className="grid gap-3">
          {LEVELS.map((x, i) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              id={`level-tab-${x.id}`}
              aria-selected={x.id === id}
              aria-controls="level-panel"
              onClick={() => setId(x.id)}
              className={cn(
                "flex items-center gap-4 rounded-2xl border-2 bg-card p-4 text-left transition-all motion-reduce:transition-none",
                x.id === id ? "border-primary shadow-md" : "border-transparent shadow-sm hover:border-primary/40",
              )}
            >
              <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl font-display text-lg font-bold text-white", x.bar)}>
                {i + 1}
              </span>
              <span>
                <span className="block text-lg font-bold">{tr(x.name)}</span>
                <span className="text-sm text-muted-foreground">{tr(x.who)}</span>
              </span>
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id="level-panel"
          aria-labelledby={`level-tab-${id}`}
          className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold">
              {t("Recommended for", "Rekomendasi untuk")} {tr(level.name)}
            </h3>
            <span className={cn("rounded-full px-3 py-1 text-xs font-bold", level.soft)}>
              {tr(level.name)}
            </span>
          </div>
          {programs.length ? (
            <ul className="grid gap-3">
              {programs.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/courses/$slug"
                    params={{ slug: c.slug }}
                    className="flex items-center justify-between gap-3 rounded-xl bg-secondary/70 p-4 transition-colors hover:bg-accent motion-reduce:transition-none"
                  >
                    <span>
                      <span className="block leading-snug font-bold">{tr(c.title)}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.mode === "online" ? t("Online", "Online") : t("In person", "Tatap muka")}
                        {c.availability === "quote" && ` · ${t("On request", "Sesuai permintaan")}`}
                        {c.availability === "coming-soon" && ` · ${t("Coming soon", "Segera hadir")}`}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              {t("Programs for this level are being planned.", "Program untuk level ini sedang disiapkan.")}
            </p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            {t(
              "Not sure of your level? Ask our team. A placement assessment is planned.",
              "Belum yakin dengan level Anda? Tanyakan ke tim kami. Asesmen penempatan sedang direncanakan.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

function CareerJourney() {
  const { t } = useLang();
  const steps: { icon: typeof BookOpen; label: string; line: string; media?: Media }[] = [
    { icon: BookOpen, label: t("Learn", "Belajar"), line: t("Build the foundations.", "Bangun dasar yang kuat."), media: MEDIA.heroClass },
    { icon: FlaskConical, label: t("Practice", "Praktik"), line: t("Work hands-on in the lab.", "Praktik langsung di lab."), media: MEDIA.heroLab },
    { icon: Award, label: t("Certify", "Bersertifikat"), line: t("Earn a verifiable certificate.", "Raih sertifikat yang dapat diverifikasi.") },
    { icon: Briefcase, label: t("Grow", "Berkembang"), line: t("Join an industry network.", "Masuk jejaring industri."), media: MEDIA.hero },
  ];
  return (
    <section aria-labelledby="journey-heading" className="bg-secondary/70 py-14">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <SectionHeading
          id="journey-heading"
          center
          title={t("Your career journey", "Perjalanan karier Anda")}
          sub={t("From first class to industry role.", "Dari kelas pertama sampai peran di industri.")}
        />
        <ol className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {steps.map((s, i) => (
            <li
              key={s.label}
              className="relative aspect-[4/5] w-64 shrink-0 snap-start overflow-hidden rounded-3xl bg-navy text-white shadow-md lg:w-auto"
            >
              {s.media ? (
                <img src={cdnImage(s.media.src, 600)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
              ) : (
                <div aria-hidden="true" className="bg-brand-gradient absolute inset-0 grid place-items-center">
                  <Award className="size-24 text-white/90" />
                </div>
              )}
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="mb-2 grid size-9 place-items-center rounded-full bg-white font-display font-bold text-navy">
                  {i + 1}
                </span>
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <s.icon className="size-5" aria-hidden="true" /> {s.label}
                </h3>
                <p className="text-sm text-white/85">{s.line}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AlumniStories() {
  const { t, tr } = useLang();
  const { ref, scroll } = useCarousel();
  return (
    <section
      id="alumni"
      aria-labelledby="alumni-heading"
      className="mx-auto max-w-content scroll-mt-20 px-4 py-14 sm:px-6"
    >
      <SectionHeading
        id="alumni-heading"
        title={t("Alumni Stories", "Cerita Alumni")}
        sub={t("In their own words.", "Dalam kata-kata mereka sendiri.")}
        action={
          <CarouselButtons
            onScroll={scroll}
            prevLabel={t("Previous stories", "Cerita sebelumnya")}
            nextLabel={t("Next stories", "Cerita berikutnya")}
          />
        }
      />
      {!TESTIMONIALS.verified && <VerifyNote className="mb-4" />}
      <div
        ref={ref}
        role="region"
        tabIndex={0}
        aria-label={t("Alumni stories", "Cerita alumni")}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {TESTIMONIALS.items.map((x) => (
          <figure
            key={x.name}
            className="flex w-[85%] shrink-0 snap-start flex-col rounded-3xl border bg-card p-6 shadow-sm sm:w-96"
          >
            <Quote className="size-8 text-primary" aria-hidden="true" />
            <blockquote className="mt-3 flex-1 text-lg leading-relaxed font-medium">
              “{tr(x.quote)}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
              <Avatar photo={x.photo} name={x.name} size={160} className="size-14 shrink-0 text-base ring-2 ring-primary/30" />
              <div className="min-w-0 text-sm">
                <div className="line-clamp-2 font-bold">{x.name}</div>
                <div className="line-clamp-2 text-muted-foreground">{tr(x.org)}</div>
              </div>
            </figcaption>
          </figure>
        ))}
        <a
          href={whatsappLink(
            t(
              "Hello NBRI Academy, I am an alumnus and would like to share my career story after the training.",
              "Halo NBRI Academy, saya alumni dan ingin berbagi cerita karier saya setelah pelatihan.",
            ),
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-gradient grid w-[85%] shrink-0 snap-start place-content-center gap-2 rounded-3xl p-6 text-center font-bold text-navy sm:w-72"
        >
          <Sparkles className="mx-auto size-7" aria-hidden="true" />
          {t("Alumni? Share your story", "Alumni? Bagikan cerita Anda")}
        </a>
      </div>
    </section>
  );
}

function Speakers() {
  const { t, tr } = useLang();
  const { ref, scroll } = useCarousel();
  return (
    <section
      aria-labelledby="speakers-heading"
      className="relative isolate overflow-hidden bg-navy py-16 text-white"
    >
      <div aria-hidden="true" className="absolute -top-40 -left-24 -z-10 size-[30rem] rounded-full bg-primary/30 blur-3xl" />
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="text-sm font-bold tracking-wide text-[#8fc2ff] uppercase">
              {t("Battery Speakers", "Pembicara Battery School")}
            </div>
            <h2 id="speakers-heading" className="mt-2 text-3xl font-bold sm:text-5xl">
              {t("Learn from the people shaping the industry.", "Belajar dari para pembentuk industri.")}
            </h2>
          </div>
          <div className="flex gap-2">
            {([-1, 1] as const).map((d) => (
              <Button
                key={d}
                variant="outline"
                size="icon"
                className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                aria-label={d < 0 ? t("Previous speakers", "Pembicara sebelumnya") : t("Next speakers", "Pembicara berikutnya")}
                onClick={() => scroll(d)}
              >
                {d < 0 ? <ChevronLeft /> : <ChevronRight />}
              </Button>
            ))}
          </div>
        </div>
        <div
          ref={ref}
          role="region"
          tabIndex={0}
          aria-label={t("Battery School speakers", "Pembicara Battery School")}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
        >
          {EXPERTS.map((e) => (
            <article key={e.name} className="w-60 shrink-0 snap-start overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/15 sm:w-64">
              <div className="relative aspect-square bg-gradient-to-br from-[#dbeafe] via-[#93c5fd] to-[#3b82f6]">
                {e.photo ? (
                  <img src={cdnImage(e.photo, 400)} alt={e.name} loading="lazy" className="size-full object-cover object-top" />
                ) : (
                  <span aria-hidden="true" className="grid size-full place-items-center font-display text-5xl font-bold text-white">
                    {initialsOf(e.name)}
                  </span>
                )}
              </div>
              <div className="space-y-1 p-4">
                <h3 className="leading-snug font-bold">{e.name}</h3>
                <p className="text-sm text-white/75">{tr(e.role)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerLogos() {
  const { t } = useLang();
  const logos = PARTNERS.logos;
  return (
    <section
      className="border-y bg-background py-10"
      aria-labelledby="partners-heading"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <h2
          id="partners-heading"
          className="text-center text-base font-bold text-muted-foreground"
        >
          {t(
            "Trusted by experts from industry, state-owned enterprises, government & universities",
            "Dipercaya para ahli dari berbagai sektor — industri, BUMN, pemerintah & kampus",
          )}
        </h2>
        {!PARTNERS.verified && <VerifyNote className="mt-2" />}
      </div>
      <div className="group relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-[marquee_45s_linear_infinite] gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex gap-4"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {logos.map((p) => (
                <li
                  key={p.name}
                  className={cn(
                    "grid h-24 w-44 shrink-0 place-items-center rounded-xl border px-5 py-4",
                    p.dark ? "border-navy bg-navy" : "bg-card",
                  )}
                >
                  {p.logo && p.label ? (
                    <span className="flex items-center gap-2.5">
                      <img
                        src={cdnImage(p.logo, 200)}
                        alt=""
                        loading="lazy"
                        className="h-11 w-auto shrink-0 object-contain"
                      />
                      <span className="font-display text-sm leading-tight font-bold text-navy">
                        {copy === 0 && (
                          <span className="sr-only">{p.name}: </span>
                        )}
                        <span aria-hidden="true">{p.label}</span>
                      </span>
                    </span>
                  ) : p.logo ? (
                    <img
                      src={cdnImage(p.logo, 400)}
                      alt={copy === 0 ? p.name : ""}
                      loading="lazy"
                      className={cn(
                        "max-h-14 max-w-full object-contain",
                        p.dark && "max-h-9",
                      )}
                    />
                  ) : (
                    <span className="text-center font-display text-lg leading-tight font-bold text-navy">
                      {p.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}


function PathSlider({
  children,
  label,
  prevLabel,
  nextLabel,
  pageLabel,
}: {
  children: React.ReactNode[];
  label: string;
  prevLabel: string;
  nextLabel: string;
  pageLabel: (n: number) => string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [page, setPage] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const count = children.length;

  const measure = React.useCallback(() => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const step =
      first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    const visible = Math.max(1, Math.round((el.clientWidth + 1) / step));
    const total = Math.max(1, count - visible + 1);
    setPages(total);
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setPage(
      atEnd ? total - 1 : Math.min(total - 1, Math.round(el.scrollLeft / step)),
    );
  }, [count]);

  React.useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const goTo = (i: number) => {
    const el = ref.current;
    const slides = el?.children;
    if (!el || !slides?.length) return;
    const first = slides[0] as HTMLElement;
    const target = slides[Math.max(0, Math.min(count - 1, i))] as HTMLElement;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollTo({
      left: target.offsetLeft - first.offsetLeft,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="relative">
        <div
          ref={ref}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 py-2 sm:mx-0 sm:scroll-px-0 sm:px-0"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") goTo(page + 1);
            if (e.key === "ArrowLeft") goTo(page - 1);
          }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              className="w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              {child}
            </div>
          ))}
        </div>
        <SliderArrow
          side="left"
          label={prevLabel}
          disabled={page === 0}
          onClick={() => goTo(page - 1)}
        />
        <SliderArrow
          side="right"
          label={nextLabel}
          disabled={page >= pages - 1}
          onClick={() => goTo(page + 1)}
        />
      </div>
      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label={prevLabel}
            disabled={page === 0}
            onClick={() => goTo(page - 1)}
            className="mr-2 size-9 rounded-full sm:hidden"
          >
            <ChevronLeft />
          </Button>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={pageLabel(i + 1)}
              aria-current={i === page ? "true" : undefined}
              onClick={() => goTo(i)}
              className={cn(
                "h-2.5 rounded-full transition-all motion-reduce:transition-none",
                i === page
                  ? "w-7 bg-primary"
                  : "w-2.5 bg-primary/25 hover:bg-primary/50",
              )}
            />
          ))}
          <Button
            variant="outline"
            size="icon"
            aria-label={nextLabel}
            disabled={page >= pages - 1}
            onClick={() => goTo(page + 1)}
            className="ml-2 size-9 rounded-full sm:hidden"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}

function SliderArrow({
  side,
  label,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "absolute top-[calc(50%-1.5rem)] z-10 hidden size-11 rounded-full bg-background shadow-md disabled:opacity-0 sm:inline-flex",
        side === "left" ? "-left-3 lg:-left-5" : "-right-3 lg:-right-5",
      )}
    >
      <Icon />
    </Button>
  );
}


/* ------------------------------------------------------------------ */

function useCarousel() {
  const ref = React.useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  return { ref, scroll };
}

function CarouselButtons({
  onScroll,
  prevLabel,
  nextLabel,
}: {
  onScroll: (d: 1 | -1) => void;
  prevLabel: string;
  nextLabel: string;
}) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background"
        aria-label={prevLabel}
        onClick={() => onScroll(-1)}
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background"
        aria-label={nextLabel}
        onClick={() => onScroll(1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}


/* ------------------------------------------------------------------ */

/**
 * The detailed programs area (program finder, upcoming classes, corporate CTA,
 * past programs) stays collapsed until the visitor clicks "Next", so the
 * homepage opens light instead of with a wall of programs and prices.
 */
function ProgramsGate() {
  const { t } = useLang();
  const [open, setOpen] = React.useState(false);
  const revealRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) revealRef.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <>
      <section className="mx-auto max-w-content px-4 pb-14 sm:px-6">
        <div className="bg-brand-gradient relative overflow-hidden rounded-3xl p-8 text-center text-navy sm:p-12">
          <Sparkles className="mx-auto size-8" aria-hidden="true" />
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            {t("Ready to find your program?", "Siap menemukan program Anda?")}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-navy/80">
            {t(
              "Answer one quick question and we'll show you the programs and upcoming training that fit your goals.",
              "Jawab satu pertanyaan singkat, lalu kami tunjukkan program dan jadwal pelatihan yang sesuai tujuan Anda.",
            )}
          </p>
          {!open && (
            <Button
              size="lg"
              onClick={() => {
                setOpen(true);
                requestAnimationFrame(() =>
                  revealRef.current?.scrollIntoView({ behavior: "smooth" }),
                );
              }}
              aria-expanded={open}
              aria-controls="find-program"
              className="mt-6 h-12 rounded-full bg-navy px-8 text-base font-bold text-white hover:bg-navy/90"
            >
              {t("Next", "Lanjut")} <ArrowRight />
            </Button>
          )}
        </div>
      </section>
      <div
        id="find-program"
        ref={revealRef}
        tabIndex={-1}
        className="scroll-mt-20 outline-none"
        hidden={!open}
      >
        {open && (
          <div className="animate-in fade-in duration-500 motion-reduce:animate-none">
            <ProgramFinder />
            <UpcomingTickets />
            <CorporateCta />
            <PastPrograms />
          </div>
        )}
      </div>
    </>
  );
}

function ProgramFinder() {
  const { t } = useLang();
  const goals: {
    id: CategoryId;
    icon: typeof Users;
    label: string;
    hint: string;
  }[] = [
    {
      id: "battery-school",
      icon: Briefcase,
      label: t(
        "I want to work or grow in the battery industry",
        "Saya ingin kerja / naik level di industri baterai",
      ),
      hint: t(
        "Battery School · 2-day class + lab practice",
        "Battery School · kelas 2 hari + praktik lab",
      ),
    },
    {
      id: "industrial",
      icon: Building2,
      label: t(
        "I want to train my company's team",
        "Saya ingin melatih tim perusahaan",
      ),
      hint: t(
        "Industrial Training · custom 3–5 day program",
        "Industrial Training · program khusus 3–5 hari",
      ),
    },
    {
      id: "tot",
      icon: Presentation,
      label: t(
        "I want to teach battery & EV technology",
        "Saya ingin jadi pengajar baterai & EV",
      ),
      hint: "Training of Trainers",
    },
    {
      id: "edutech",
      icon: MonitorPlay,
      label: t(
        "I want to learn online first",
        "Saya ingin coba belajar online dulu",
      ),
      hint: t(
        "Online Learning · self-paced & live sessions",
        "Pembelajaran Online · mandiri & sesi langsung",
      ),
    },
  ];
  const [goal, setGoal] = React.useState<CategoryId | null>(null);
  const [step, setStep] = React.useState<1 | 2>(1);
  const resultsRef = React.useRef<HTMLHeadingElement>(null);
  const picked = goals.find((g) => g.id === goal);
  const programs = COURSES.filter((c) => c.category === goal);

  React.useEffect(() => {
    if (step === 2) resultsRef.current?.focus();
  }, [step]);

  return (
    <section className="bg-secondary/60 py-14">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <SectionHeading
          center
          eyebrow={t("Start here", "Mulai dari sini")}
          title={t(
            "Which program suits you?",
            "Program mana yang cocok untuk Anda?",
          )}
          sub={t(
            "Pick your goal and we'll show the programs that fit best.",
            "Pilih tujuan Anda, kami tunjukkan program yang paling pas.",
          )}
        />
        {step === 1 ? (
          <div className="mx-auto max-w-3xl">
            <div
              className="grid gap-3 sm:grid-cols-2"
              role="radiogroup"
              aria-label={t("Learning goal", "Tujuan belajar")}
            >
              {goals.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  role="radio"
                  aria-checked={goal === g.id}
                  onClick={() => setGoal(g.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border-2 bg-card p-5 text-left transition-colors motion-reduce:transition-none",
                    goal === g.id
                      ? "border-primary bg-accent/50"
                      : "border-transparent hover:border-primary/40",
                  )}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <g.icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-bold">{g.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {g.hint}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                className="h-12 rounded-full px-8 text-base font-bold"
                disabled={!goal}
                onClick={() => setStep(2)}
              >
                {t("Show programs", "Tampilkan program")} <ArrowRight />
              </Button>
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/courses">
                  {t("See all programs", "Lihat semua program")}
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h3
                ref={resultsRef}
                tabIndex={-1}
                className="text-xl font-bold outline-none"
              >
                {t("Recommended for:", "Rekomendasi untuk:")}{" "}
                <span className="text-primary">{picked?.label}</span>
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setStep(1)}
                >
                  <ChevronLeft /> {t("Change goal", "Ganti tujuan")}
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/courses" search={goal ? { cat: goal } : {}}>
                    {t("Open catalog", "Buka katalog")} <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {programs.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function UpcomingTickets() {
  const { t } = useLang();
  const items = COURSES.flatMap((c) =>
    upcomingSessions(c).map((s) => ({ c, s })),
  ).sort((a, b) => a.s.start.localeCompare(b.s.start));
  return (
    <section className="mx-auto max-w-content px-4 py-14 sm:px-6">
      <SectionHeading
        title={t("Upcoming training", "Kelas terdekat")}
        sub={t(
          "Seats are limited for each session.",
          "Kursi terbatas di setiap sesi.",
        )}
        action={
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/schedule">
              {t("View Training Calendar", "Lihat Jadwal Pelatihan")}{" "}
              <ArrowRight />
            </Link>
          </Button>
        }
      />
      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map(({ c, s }) => (
            <SessionCard key={s.id} course={c} session={s} />
          ))}
          <NotifyCard />
        </div>
      ) : (
        <NotifyCard />
      )}
    </section>
  );
}

function NotifyCard() {
  const { t } = useLang();
  return (
    <div className="flex flex-col justify-center gap-3 rounded-xl border border-dashed bg-muted/50 p-6">
      <Sparkles className="size-6 text-primary" />
      <h3 className="text-lg font-bold">
        {t("More dates coming soon", "Jadwal berikutnya segera diumumkan")}
      </h3>
      <p className="text-sm text-muted-foreground">
        {t(
          "Safety, Battery Standard and BESS will open again. Be the first to know via WhatsApp.",
          "Safety, Battery Standard, dan BESS akan dibuka kembali. Dapatkan kabar pertama lewat WhatsApp.",
        )}
      </p>
      <Button asChild variant="outline" className="w-fit rounded-full">
        <a
          href={whatsappLink(
            t(
              "Hello NBRI Academy, please let me know when the next Battery School dates open.",
              "Halo NBRI Academy, mohon kabari saya saat jadwal Battery School berikutnya dibuka.",
            ),
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("Notify me", "Beritahu saya")}
        </a>
      </Button>
    </div>
  );
}

function CorporateCta() {
  const { t } = useLang();
  return (
    <section className="mx-auto max-w-content px-4 pb-14 sm:px-6">
      <div className="relative isolate grid overflow-hidden rounded-3xl border bg-gradient-to-br from-secondary to-accent md:grid-cols-2">
        <div className="space-y-4 p-8 md:p-12">
          <Building2 className="size-8 text-primary" />
          <h2 className="text-3xl font-bold">
            {t("Need training", "Butuh pelatihan")}{" "}
            <span className="text-primary">
              {t("for your company?", "khusus perusahaan?")}
            </span>
          </h2>
          <p className="text-muted-foreground">
            {t(
              "Industrial Training: team needs diagnostics, flexible scheduling, a confidential curriculum and a program impact report — at your site or at Puspiptek.",
              "Industrial Training: diagnostik kebutuhan tim, jadwal fleksibel, kurikulum rahasia, dan laporan dampak program — di lokasi Anda atau di Puspiptek.",
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full px-6 font-bold">
              <a
                href={whatsappLink(
                  t(
                    "Hello NBRI Academy, we would like to discuss Industrial Training.",
                    "Halo NBRI Academy, kami ingin konsultasi Industrial Training.",
                  ),
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Discuss your needs", "Diskusikan kebutuhan Anda")}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full bg-background"
            >
              <Link
                to="/courses/$slug"
                params={{ slug: "industrial-training" }}
              >
                {t("Program details", "Detail program")}
              </Link>
            </Button>
          </div>
        </div>
        <img
          src={cdnImage("/img/cat-industrial.png", 1000)}
          alt=""
          loading="lazy"
          className="hidden h-full w-full object-cover md:block"
        />
      </div>
    </section>
  );
}

function PastPrograms() {
  const { lang, t, tr } = useLang();
  return (
    <section className="bg-secondary/60 py-14">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <SectionHeading
          title={t("Previous programs", "Program sebelumnya")}
          sub={t(
            "Activities NBRI Academy has delivered.",
            "Kegiatan yang telah diselenggarakan NBRI Academy.",
          )}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {PAST_PROGRAMS.map((p) => (
            <div
              key={tr(p.title)}
              className="space-y-3 rounded-xl border bg-card p-5"
            >
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                {dayLabel(p.date, lang)}
              </span>
              <h3 className="leading-snug font-bold">{tr(p.title)}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const { t, tr } = useLang();
  return (
    <section className="mx-auto max-w-reading px-4 py-14 sm:px-6">
      <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
        {t("Frequently asked questions", "Pertanyaan umum")}
      </h2>
      <Accordion
        type="single"
        collapsible
        className="rounded-xl border bg-card px-5"
      >
        {FAQ.map((f, i) => (
          <AccordionItem key={f.q.en} value={`faq-${i}`}>
            <AccordionTrigger className="text-left font-semibold">
              {tr(f.q)}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {tr(f.a)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

