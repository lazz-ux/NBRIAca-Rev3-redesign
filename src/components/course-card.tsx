import { Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  cdnImage,
  courseImage,
  getCategory,
  purchaseState,
  rupiah,
  sessionLabel,
} from "@/lib/catalog";
import type { Course, Session } from "@/lib/fixtures";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function CoursePrice({
  course,
  size = "md",
}: {
  course: Course;
  size?: "md" | "lg";
}) {
  const { t } = useLang();
  const big = size === "lg" ? "text-3xl" : "text-lg";
  if (course.price === null)
    return (
      <div className={cn("font-display font-bold", big)}>
        {t("Price on request", "Hubungi kami")}
      </div>
    );
  if (course.price === 0)
    return (
      <div className={cn("font-display font-bold text-primary", big)}>
        {t("Free", "Gratis")}
      </div>
    );
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={cn("font-display font-bold text-foreground", big)}>
        {rupiah(course.price)}
      </span>
      {course.priceIsExample && (
        <span className="text-xs text-muted-foreground">
          {t("(example price)", "(harga contoh)")}
        </span>
      )}
    </div>
  );
}

export function StatusBadge({ course }: { course: Course }) {
  const { t } = useLang();
  const st = purchaseState(course);
  const map = {
    buy: {
      label: t("Tickets available", "Tiket tersedia"),
      cls: "bg-primary text-primary-foreground",
    },
    online: {
      label: t("Instant access", "Akses langsung"),
      cls: "bg-primary text-primary-foreground",
    },
    quote: {
      label: t("Flexible schedule", "Jadwal fleksibel"),
      cls: "bg-navy text-white",
    },
    "coming-soon": {
      label: t("Coming soon", "Segera hadir"),
      cls: "bg-amber-400 text-navy",
    },
    tba: {
      label: t("Dates to be announced", "Jadwal segera diumumkan"),
      cls: "bg-white text-navy",
    },
  };
  const m = map[st.kind];
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm",
        m.cls,
      )}
    >
      {m.label}
    </span>
  );
}

export function CourseCard({ course }: { course: Course }) {
  const { lang, t, tr } = useLang();
  const st = purchaseState(course);
  const next = st.kind === "buy" ? st.sessions[0] : null;
  return (
    <Link
      to="/courses/$slug"
      params={{ slug: course.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-navy">
        <img
          src={cdnImage(courseImage(course), 480)}
          alt=""
          loading="lazy"
          className="size-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent" />
        <div className="absolute top-3 left-3">
          <StatusBadge course={course} />
        </div>
        <span className="absolute bottom-3 left-3 text-[11px] font-bold tracking-wider text-white/90 uppercase">
          {getCategory(course.category).name}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-[15px] leading-snug font-bold group-hover:text-primary">
          {tr(course.title)}
        </h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {tr(course.duration)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {course.mode === "online" ? "Online" : "Offline"}
          </span>
        </div>
        {next && (
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-accent-foreground">
            <CalendarDays className="size-3.5" />
            {sessionLabel(next, lang)} · {next.seatsLeft} {t("seats", "kursi")}
          </div>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <CoursePrice course={course} />
          <Badge variant="secondary" className="shrink-0">
            {course.level}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

/** Shopee-inspired purchasable ticket card for a single workshop session. */
export function SessionCard({
  course,
  session,
  done = false,
}: {
  course: Course;
  session: Session;
  done?: boolean;
}) {
  const { lang, t, tr } = useLang();
  const sold = session.seatsTotal - session.seatsLeft;
  const low = session.seatsLeft <= 5;
  const label = sessionLabel(session, lang);
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg motion-reduce:transition-none",
        done && "opacity-60 hover:shadow-none",
      )}
    >
      <div className="relative aspect-[16/9] bg-navy">
        <img
          src={cdnImage(courseImage(course), 480)}
          alt=""
          loading="lazy"
          className="size-full object-cover opacity-85"
        />
        <div className="absolute top-3 left-3 rounded-lg bg-white px-2.5 py-1.5 text-center leading-tight text-navy shadow">
          <div className="font-display text-lg font-bold">
            {label.split(" ")[0]}
          </div>
          <div className="text-[11px] font-semibold uppercase">
            {label.split(" ").slice(1).join(" ")}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[11px] font-bold tracking-wider text-primary uppercase">
          {getCategory(course.category).name} · {course.level}
        </span>
        <h3 className="line-clamp-2 leading-snug font-bold">
          {tr(course.title)}
        </h3>
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          {tr(course.location)}
        </div>
        {!done && (
          <div className="space-y-1">
            <Progress
              value={(sold / session.seatsTotal) * 100}
              className="h-1.5"
            />
            <div
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold",
                low ? "text-sale" : "text-muted-foreground",
              )}
            >
              <Users className="size-3.5" />
              {t(
                `${session.seatsLeft} of ${session.seatsTotal} seats left`,
                `${session.seatsLeft} dari ${session.seatsTotal} kursi tersisa`,
              )}
            </div>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <CoursePrice course={course} />
          {done ? (
            <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
              {t("Completed", "Selesai")}
            </span>
          ) : (
            <Link
              to="/courses/$slug"
              params={{ slug: course.slug }}
              search={{ session: session.id }}
              className="bg-brand-gradient rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap text-navy shadow-sm transition-transform hover:scale-105 motion-reduce:transition-none"
            >
              {t("Get ticket", "Beli tiket")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function VerifyNote({ className }: { className?: string }) {
  const { t } = useLang();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-dashed border-amber-500/60 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
        className,
      )}
    >
      {t(
        "Sample data · awaiting admin verification",
        "Data contoh · menunggu verifikasi admin",
      )}
    </span>
  );
}
