import { createFileRoute, Link } from "@tanstack/react-router";
import { LogIn, UserPlus } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { whatsappLink } from "@/lib/catalog";
import { auth, AuthNotConfiguredError } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/signin")({
  head: ({ match }) => ({
    meta: [
      {
        title: `${match.context.lang === "id" ? "Masuk" : "Sign in"} — NBRI Academy`,
      },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const { t } = useLang();
  const [mode, setMode] = React.useState<"in" | "up">("in");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "");
    const password = String(f.get("password") ?? "");
    setPending(true);
    setError(null);
    try {
      if (mode === "in") await auth.signIn(email, password);
      else await auth.signUp(String(f.get("name") ?? ""), email, password);
    } catch (err) {
      setError(
        err instanceof AuthNotConfiguredError
          ? t(
              "Accounts are not open yet. Your details were not sent anywhere.",
              "Akun belum dibuka. Data Anda tidak dikirim ke mana pun.",
            )
          : t("Something went wrong. Please try again.", "Terjadi kesalahan. Coba lagi."),
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="bg-gradient-to-b from-secondary to-background">
      <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-bold">
          {t("Your learning account", "Akun belajar Anda")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t(
            "Track courses, progress and your participant level in one place.",
            "Pantau kursus, progres, dan level peserta Anda di satu tempat.",
          )}
        </p>
        <Tabs
          value={mode}
          onValueChange={(v) => {
            setMode(v as "in" | "up");
            setError(null);
          }}
          className="mt-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="in">{t("Sign in", "Masuk")}</TabsTrigger>
            <TabsTrigger value="up">
              {t("Create account", "Buat akun")}
            </TabsTrigger>
          </TabsList>
          {(["in", "up"] as const).map((m) => (
            <TabsContent key={m} value={m}>
              <form
                onSubmit={submit}
                className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm"
              >
                {m === "up" && (
                  <div className="space-y-2">
                    <Label htmlFor={`name-${m}`}>{t("Full name", "Nama lengkap")}</Label>
                    <Input id={`name-${m}`} name="name" autoComplete="name" required />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor={`email-${m}`}>Email</Label>
                  <Input id={`email-${m}`} name="email" type="email" autoComplete="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`pw-${m}`}>{t("Password", "Kata sandi")}</Label>
                  <Input
                    id={`pw-${m}`}
                    name="password"
                    type="password"
                    autoComplete={m === "in" ? "current-password" : "new-password"}
                    minLength={8}
                    required
                  />
                </div>
                {error && (
                  <Alert role="alert">
                    <AlertTitle>{t("Not available yet", "Belum tersedia")}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" disabled={pending} className="h-11 w-full rounded-full font-bold">
                  {m === "in" ? <LogIn /> : <UserPlus />}
                  {m === "in" ? t("Sign in", "Masuk") : t("Create account", "Buat akun")}
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("Need access now?", "Perlu akses sekarang?")}{" "}
          <a
            className="font-semibold text-primary underline-offset-4 hover:underline"
            href={whatsappLink(t("Hello NBRI Academy, I would like to open a learning account.", "Halo NBRI Academy, saya ingin membuka akun belajar."))}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Contact the team", "Hubungi tim")}
          </a>{" "}
          · <Link to="/courses" className="font-semibold text-primary underline-offset-4 hover:underline">{t("Browse programs", "Lihat program")}</Link>
        </p>
      </div>
    </section>
  );
}
