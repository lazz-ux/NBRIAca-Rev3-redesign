import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Chip } from "@/components/chip";
import { CourseCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { effectivePrice, purchaseState, upcomingSessions } from "@/lib/catalog";
import {
  CATEGORIES,
  COURSES,
  type CategoryId,
  type Course,
} from "@/lib/fixtures";
import { useLang } from "@/lib/i18n";
import { pick } from "@/lib/text";

const SORTS = {
  recommended: ["Recommended", "Rekomendasi"],
  soonest: ["Soonest date", "Jadwal terdekat"],
  "price-asc": ["Price: low to high", "Harga terendah"],
  "price-desc": ["Price: high to low", "Harga tertinggi"],
} as const;
type Sort = keyof typeof SORTS;

const PRICES = {
  all: ["All prices", "Semua harga"],
  free: ["Free", "Gratis"],
  "5000000": ["≤ Rp5.000.000", "≤ Rp5.000.000"],
  "7000000": ["≤ Rp7.000.000", "≤ Rp7.000.000"],
} as const;
type PriceFilter = keyof typeof PRICES;

const LEVELS = ["Basic", "Intermediate", "Advanced"] as const;

interface CourseSearch {
  q?: string;
  cat?: CategoryId;
  level?: (typeof LEVELS)[number];
  price?: PriceFilter;
  sort?: Sort;
  mode?: "offline" | "online";
}

export const Route = createFileRoute("/courses/")({
  validateSearch: (s: Record<string, unknown>): CourseSearch => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
    cat: CATEGORIES.some((c) => c.id === s.cat)
      ? (s.cat as CategoryId)
      : undefined,
    level: LEVELS.includes(s.level as never)
      ? (s.level as CourseSearch["level"])
      : undefined,
    price:
      typeof s.price === "string" && s.price in PRICES
        ? (s.price as PriceFilter)
        : undefined,
    sort:
      typeof s.sort === "string" && s.sort in SORTS
        ? (s.sort as Sort)
        : undefined,
    mode: s.mode === "offline" || s.mode === "online" ? s.mode : undefined,
  }),
  head: ({ match }) => ({
    meta: [
      {
        title: `${match.context.lang === "id" ? "Katalog Program" : "Programs"} — NBRI Academy`,
      },
    ],
  }),
  component: CoursesPage,
});

const rank = (c: Course) =>
  ({ buy: 0, online: 0, quote: 1, "coming-soon": 2, tba: 3 })[
    purchaseState(c).kind
  ];

function filterCourses(s: CourseSearch) {
  const q = (s.q ?? "").toLowerCase();
  const list = COURSES.filter((c) => {
    if (s.cat && c.category !== s.cat) return false;
    if (s.level && c.level !== s.level) return false;
    if (s.mode && c.mode !== s.mode) return false;
    if (s.price && s.price !== "all") {
      if (c.price === null) return false;
      if (
        s.price === "free" ? c.price !== 0 : effectivePrice(c) > Number(s.price)
      )
        return false;
    }
    if (
      q &&
      !(["en", "id"] as const)
        .map(
          (lang) =>
            `${pick(c.title, lang)} ${c.summary[lang]} ${c.outcomes.map((o) => o[lang]).join(" ")}`,
        )
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
      return false;
    return true;
  });
  const priceOf = (c: Course) =>
    c.price === null ? Infinity : effectivePrice(c);
  const nextStart = (c: Course) => upcomingSessions(c)[0]?.start ?? "9999";
  switch (s.sort) {
    case "price-asc":
      return list.sort((a, b) => priceOf(a) - priceOf(b));
    case "price-desc":
      return list.sort(
        (a, b) =>
          (b.price === null ? -1 : effectivePrice(b)) -
          (a.price === null ? -1 : effectivePrice(a)),
      );
    case "soonest":
      return list.sort((a, b) => nextStart(a).localeCompare(nextStart(b)));
    default:
      return list.sort((a, b) => rank(a) - rank(b));
  }
}

function CoursesPage() {
  const search = Route.useSearch();
  const { t } = useLang();
  const opts = (o: Record<string, readonly [string, string]>) =>
    Object.entries(o).map(
      ([k, [en, id]]) => [k, t(en, id)] as [string, string],
    );
  const navigate = useNavigate({ from: Route.fullPath });
  const set = (patch: Partial<CourseSearch>) =>
    navigate({
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
      resetScroll: false,
    });
  const results = filterCourses(search);
  const active = Boolean(
    search.q ||
    search.cat ||
    search.level ||
    search.mode ||
    (search.price && search.price !== "all"),
  );

  return (
    <>
      <section className="border-b bg-secondary text-foreground">
        <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">
            {t("Programs & training", "Katalog kursus & pelatihan")}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {t(
              "Find the right program — from two-day laboratory classes to online courses you can take any time.",
              "Temukan program yang sesuai — dari kelas laboratorium 2 hari hingga kursus video yang bisa dipelajari kapan saja.",
            )}
          </p>
          <div className="relative mt-6 max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              aria-label={t("Search programs", "Cari program")}
              placeholder={t(
                "Search programs, topics, or skills…",
                "Cari program, topik, atau keterampilan…",
              )}
              defaultValue={search.q}
              onChange={(e) => set({ q: e.target.value || undefined })}
              className="h-12 rounded-full border-0 bg-background pl-11 shadow-sm ring-1 ring-border"
            />
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b bg-background/95 backdrop-blur">
        <div className="no-scrollbar mx-auto flex max-w-content gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          <Chip on={!search.cat} onClick={() => set({ cat: undefined })}>
            {t("All", "Semua")}
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip
              key={c.id}
              on={search.cat === c.id}
              onClick={() => set({ cat: c.id })}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <SlidersHorizontal className="size-4" /> Filter
          </span>
          <FilterSelect
            label="Level"
            value={search.level ?? "all"}
            onChange={(v) =>
              set({
                level: v === "all" ? undefined : (v as CourseSearch["level"]),
              })
            }
            options={[
              ["all", t("All levels", "Semua level")],
              ...LEVELS.map((l) => [l, l] as [string, string]),
            ]}
          />
          <FilterSelect
            label="Format"
            value={search.mode ?? "all"}
            onChange={(v) =>
              set({
                mode: v === "all" ? undefined : (v as CourseSearch["mode"]),
              })
            }
            options={[
              ["all", "Online & offline"],
              ["offline", "Offline"],
              ["online", "Online"],
            ]}
          />
          <FilterSelect
            label={t("Price", "Harga")}
            value={search.price ?? "all"}
            onChange={(v) =>
              set({ price: v === "all" ? undefined : (v as PriceFilter) })
            }
            options={opts(PRICES)}
          />
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted-foreground" aria-live="polite">
              {results.length} {t("programs", "program")}
            </span>
            <FilterSelect
              label={t("Sort", "Urutkan")}
              value={search.sort ?? "recommended"}
              onChange={(v) =>
                set({ sort: v === "recommended" ? undefined : (v as Sort) })
              }
              options={opts(SORTS)}
            />
          </div>
        </div>

        {results.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        ) : (
          <div className="grid place-items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <p className="font-semibold">
              {t(
                "No programs match these filters.",
                "Tidak ada program yang cocok dengan filter ini.",
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(
                "Try another keyword or clear the filters.",
                "Coba kata kunci lain atau hapus filter.",
              )}
            </p>
          </div>
        )}
        {active && (
          <Button
            variant="ghost"
            className="mt-6"
            onClick={() => navigate({ search: {}, replace: true })}
          >
            <X /> {t("Clear all filters", "Hapus semua filter")}
          </Button>
        )}
      </section>
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className="h-9 min-w-36 rounded-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(([v, l]) => (
          <SelectItem key={v} value={v}>
            {l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
