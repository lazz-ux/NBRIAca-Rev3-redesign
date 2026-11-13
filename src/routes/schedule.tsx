import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, Building2, CalendarClock } from "lucide-react";
import * as React from "react";

import { Chip } from "@/components/chip";
import { SessionCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import {
  cdnImage,
  courseImage,
  getCategory,
  isSessionDone,
  monthNames,
  pastSessions,
  purchaseState,
  sessionMonth,
  upcomingSessions,
  whatsappLink,
} from "@/lib/catalog";
import { CATEGORIES, COURSES, type CategoryId } from "@/lib/fixtures";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/schedule")({
  head: ({ match }) => ({
    meta: [
      {
        title: `${match.context.lang === "id" ? "Jadwal Pelatihan" : "Training Calendar"} — NBRI Academy`,
      },
    ],
  }),
  component: SchedulePage,
});

const OFFLINE_CATS = CATEGORIES.filter((c) => c.id !== "edutech");

function SchedulePage() {
  const [cat, setCat] = React.useState<CategoryId | null>(null);
  const [month, setMonth] = React.useState<number | null>(null);
  const { lang, t, tr } = useLang();

  const offline = COURSES.filter(
    (c) => c.mode === "offline" && (!cat || c.category === cat),
  );
  const upcoming = offline
    .flatMap((c) => upcomingSessions(c).map((s) => ({ c, s })))
    .filter(({ s }) => month === null || sessionMonth(s) === month)
    .sort((a, b) => a.s.start.localeCompare(b.s.start));
  const monthsWithSessions = new Set(
    COURSES.flatMap((c) =>
      c.sessions.filter((s) => !isSessionDone(s)).map(sessionMonth),
    ),
  );
  const tba = offline.filter((c) => {
    const k = purchaseState(c).kind;
    return k === "tba" || k === "quote";
  });
  const done = offline
    .flatMap((c) => pastSessions(c).map((s) => ({ c, s })))
    .sort((a, b) => b.s.start.localeCompare(a.s.start));

  return (
    <>
      <section className="border-b bg-secondary text-foreground">
        <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">
            {t("Training calendar", "Jadwal pelatihan")}{" "}
            <span className="text-primary">{new Date().getFullYear()}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {t(
              "Choose a program and date, check the seats left, and reserve your ticket. All in-person training takes place at the NBRI Workshop, Puspiptek BRIN.",
              "Pilih program dan tanggal, lihat sisa kursi, lalu beli tiket. Semua pelatihan offline berlangsung di NBRI Workshop, Puspiptek BRIN.",
            )}
          </p>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-content space-y-2 px-4 py-3 sm:px-6">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            <Chip on={!cat} onClick={() => setCat(null)}>
              {t("All programs", "Semua program")}
            </Chip>
            {OFFLINE_CATS.map((c) => (
              <Chip key={c.id} on={cat === c.id} onClick={() => setCat(c.id)}>
                {c.name}
              </Chip>
            ))}
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            <Chip on={month === null} onClick={() => setMonth(null)}>
              {t("All months", "Semua bulan")}
            </Chip>
            {monthNames(lang).map((m, i) => (
              <Chip key={m} on={month === i} onClick={() => setMonth(i)}>
                {m}
                {monthsWithSessions.has(i) && (
                  <span
                    className="ml-1.5 inline-block size-1.5 rounded-full bg-sale align-middle"
                    aria-label={t("has sessions", "ada jadwal")}
                  />
                )}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content space-y-14 px-4 py-10 sm:px-6">
        <section>
          <h2 className="mb-1 text-2xl font-bold">
            {t("Upcoming training", "Tiket tersedia")}
          </h2>
          <p className="mb-6 text-muted-foreground">
            {t(
              "Seats are counted per participant. Up to 6 tickets per order.",
              "Kursi dihitung per peserta. Maksimal 6 tiket per pesanan.",
            )}
          </p>
          {upcoming.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map(({ c, s }) => (
                <SessionCard key={s.id} course={c} session={s} />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center gap-3 rounded-xl border border-dashed py-14 text-center">
              <CalendarClock className="size-8 text-muted-foreground" />
              <p className="font-semibold">
                {t(
                  "No sessions match this filter yet.",
                  "Belum ada jadwal pada filter ini.",
                )}
              </p>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setCat(null);
                  setMonth(null);
                }}
              >
                {t("Show all sessions", "Tampilkan semua jadwal")}
              </Button>
            </div>
          )}
        </section>

        {tba.length > 0 && (
          <section>
            <h2 className="mb-1 text-2xl font-bold">
              {t(
                "Opening soon & flexible scheduling",
                "Segera dibuka & jadwal fleksibel",
              )}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {t(
                "Ask to be notified, or arrange a custom schedule for your team.",
                "Minta pemberitahuan, atau atur jadwal khusus untuk tim Anda.",
              )}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tba.map((c) => {
                const quote = purchaseState(c).kind === "quote";
                return (
                  <div
                    key={c.slug}
                    className="flex flex-col overflow-hidden rounded-xl border bg-card"
                  >
                    <Link
                      to="/courses/$slug"
                      params={{ slug: c.slug }}
                      className="relative aspect-[16/9] bg-navy"
                    >
                      <img
                        src={cdnImage(courseImage(c), 400)}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover opacity-70"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-navy">
                        {quote
                          ? t("Flexible schedule", "Jadwal fleksibel")
                          : t("To be announced", "Segera diumumkan")}
                      </span>
                    </Link>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <span className="text-[11px] font-bold tracking-wider text-primary uppercase">
                        {getCategory(c.category).name}
                      </span>
                      <Link
                        to="/courses/$slug"
                        params={{ slug: c.slug }}
                        className="line-clamp-2 leading-snug font-bold hover:text-primary"
                      >
                        {tr(c.title)}
                      </Link>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="mt-auto rounded-full"
                      >
                        <a
                          href={whatsappLink(
                            quote
                              ? t(
                                  `Hello NBRI Academy, we would like to discuss: ${tr(c.title)}`,
                                  `Halo NBRI Academy, kami ingin konsultasi: ${tr(c.title)}`,
                                )
                              : t(
                                  `Hello NBRI Academy, please let me know the next date for: ${tr(c.title)}`,
                                  `Halo NBRI Academy, mohon kabari jadwal berikutnya: ${tr(c.title)}`,
                                ),
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {quote ? <Building2 /> : <BellRing />}
                          {quote
                            ? t("Enquire", "Konsultasi")
                            : t("Notify me", "Beritahu saya")}
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {done.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-bold">
              {t("Completed", "Telah selesai")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {done.map(({ c, s }) => (
                <SessionCard key={s.id} course={c} session={s} done />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
