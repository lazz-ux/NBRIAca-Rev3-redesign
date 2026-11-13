import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  Menu,
  UserRound,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLang } from "@/lib/i18n";
import type { Lang } from "@/lib/text";
import { cn } from "@/lib/utils";
import { SOCIAL_ICONS, WhatsAppIcon } from "@/components/brand-icons";
import { CONTACT } from "@/lib/fixtures";
import { whatsappLink } from "@/lib/catalog";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center ${className ?? ""}`}>
      <img
        src="/LOGO NBRI ACADEMY (ORIGINAL).png"
        alt="NBRI Academy"
        className="h-9 w-auto"
      />
    </Link>
  );
}

const NAV = [
  { to: "/", en: "Home", id: "Beranda", exact: true },
  { to: "/courses", en: "Programs", id: "Program", exact: false },
  { to: "/schedule", en: "Training Calendar", id: "Jadwal", exact: false },
] as const;

/** EN / ID toggle. English is the default; the choice is kept in a cookie. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  const options: { value: Lang; label: string; name: string }[] = [
    { value: "en", label: "EN", name: "English" },
    { value: "id", label: "ID", name: "Bahasa Indonesia" },
  ];
  return (
    <div
      role="group"
      aria-label={t("Language", "Bahasa")}
      className={cn(
        "inline-flex h-10 items-center rounded-full border bg-background p-1",
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          lang={o.value}
          aria-pressed={lang === o.value}
          aria-label={o.name}
          title={o.name}
          onClick={() => lang !== o.value && setLang(o.value)}
          className={cn(
            "h-8 rounded-full px-3 text-xs font-bold transition-colors motion-reduce:transition-none",
            lang === o.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SignInButton() {
  const { t } = useLang();
  return (
    <Link
      to="/signin"
      className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 motion-reduce:transition-none"
    >
      <UserRound className="size-4" aria-hidden="true" />
      {t("Sign in", "Masuk")}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center gap-6 px-4 sm:px-6">
        <Logo />
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label={t("Main", "Utama")}
        >
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact }}
              className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-accent-foreground motion-reduce:transition-none"
            >
              {t(n.en, n.id)}
            </Link>
          ))}
          <Link
            to="/courses/$slug"
            params={{ slug: "industrial-training" }}
            className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none"
          >
            {t("Industrial Training", "Pelatihan Industri")}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className="hidden text-muted-foreground hover:text-foreground lg:inline-flex"
          >
            <a
              href={whatsappLink(
                t(
                  "Hello NBRI Academy, I have a question.",
                  "Halo NBRI Academy, saya ingin bertanya.",
                ),
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Contact us", "Hubungi kami")}
            </a>
          </Button>
          <LanguageSwitcher />
          <SignInButton />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={t("Open menu", "Buka menu")}
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  {t(
                    "Explore NBRI Academy programs",
                    "Jelajahi program NBRI Academy",
                  )}
                </SheetDescription>
              </SheetHeader>
              <nav
                className="grid gap-1 px-4"
                aria-label={t("Mobile menu", "Menu seluler")}
              >
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    activeOptions={{ exact: n.exact }}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 font-semibold text-muted-foreground data-[status=active]:bg-secondary data-[status=active]:text-accent-foreground"
                  >
                    {t(n.en, n.id)}
                  </Link>
                ))}
                <Link
                  to="/courses/$slug"
                  params={{ slug: "industrial-training" }}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 font-semibold text-muted-foreground"
                >
                  {t("Industrial Training", "Pelatihan Industri")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function MobileTabBar() {
  const { t } = useLang();
  const item =
    "flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-muted-foreground data-[status=active]:text-primary";
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label={t("Bottom navigation", "Navigasi bawah")}
    >
      <Link to="/" activeOptions={{ exact: true }} className={item}>
        <Home className="size-5" />
        {t("Home", "Beranda")}
      </Link>
      <Link to="/courses" className={item}>
        <GraduationCap className="size-5" />
        {t("Programs", "Program")}
      </Link>
      <Link to="/schedule" className={item}>
        <CalendarDays className="size-5" />
        {t("Calendar", "Jadwal")}
      </Link>
      <Link to="/signin" className={item}>
        <UserRound className="size-5" />
        {t("Sign in", "Masuk")}
      </Link>
    </nav>
  );
}

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="border-t bg-secondary pb-24 text-muted-foreground md:pb-0">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm">
            {t(
              "Advancing battery knowledge and professional capabilities through research-driven education, industry-relevant training, and practical learning experiences.",
              "Memajukan pengetahuan baterai dan kapabilitas profesional melalui pendidikan berbasis riset, pelatihan yang relevan bagi industri, dan pengalaman belajar praktis.",
            )}
          </p>
          <p className="max-w-sm text-sm">
            {t(
              "Connecting research, industry, and innovation to advance the global battery ecosystem.",
              "Menghubungkan riset, industri, dan inovasi untuk memajukan ekosistem baterai global.",
            )}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <h2 className="font-display text-base font-bold text-foreground">
            {t("Programs", "Program")}
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/courses"
                search={{ cat: "battery-school" }}
                className="hover:text-primary"
              >
                Battery School
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                search={{ cat: "industrial" }}
                className="hover:text-primary"
              >
                Industrial Training
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                search={{ cat: "tot" }}
                className="hover:text-primary"
              >
                Training of Trainers
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                search={{ cat: "edutech" }}
                className="hover:text-primary"
              >
                Online Learning
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3 text-sm">
          <h2 className="font-display text-base font-bold text-foreground">
            {t("Contact", "Kontak")}
          </h2>
          <p className="flex gap-2.5">
            <MapPin
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>{CONTACT.address}</span>
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2.5 hover:text-primary"
              >
                <Mail
                  className="size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(
                  t("Hello NBRI Academy", "Halo NBRI Academy"),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 hover:text-primary"
              >
                <WhatsAppIcon className="size-4 shrink-0 text-primary" />
                <span>
                  <span className="sr-only">WhatsApp </span>
                  {CONTACT.whatsappDisplay}
                </span>
              </a>
            </li>
          </ul>
          <div className="pt-2">
            <h3 className="mb-2 text-xs font-bold tracking-wide text-foreground uppercase">
              {t("Follow NBRI", "Ikuti NBRI")}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {CONTACT.social.map((s) => {
                const Icon = SOCIAL_ICONS[s.network];
                return (
                  <li key={s.network}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`NBRI ${s.label}`}
                      title={s.label}
                      className="grid size-9 place-items-center rounded-full border border-primary/20 bg-background text-navy transition-colors hover:bg-primary hover:text-primary-foreground motion-reduce:transition-none"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-content px-4 py-5 text-xs sm:px-6">
          © {new Date().getFullYear()} National Battery Research Institute.{" "}
          {t("All rights reserved.", "Hak cipta dilindungi.")}
        </div>
      </div>
    </footer>
  );
}
