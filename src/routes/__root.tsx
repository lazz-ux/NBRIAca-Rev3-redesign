import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotFoundPage } from "@/components/error-pages";
import { MobileTabBar, SiteFooter, SiteHeader } from "@/components/site-shell";
import { CartProvider } from "@/lib/cart";
import { LangProvider, readLang } from "@/lib/i18n";
import type { Lang } from "@/lib/text";

import "../styles.css";

const SITE_NAME: Record<Lang, string> = {
  en: "NBRI Academy — Advancing Battery Knowledge. Empowering Industry.",
  id: "NBRI Academy — Memajukan Pengetahuan Baterai. Memberdayakan Industri.",
};
const SITE_DESCRIPTION: Record<Lang, string> = {
  en: "Advancing battery knowledge and professional capabilities through research-driven education, industry-relevant training, and practical learning experiences.",
  id: "Memajukan pengetahuan baterai dan kapabilitas profesional melalui pendidikan berbasis riset, pelatihan yang relevan bagi industri, dan pengalaman belajar praktis.",
};

export const Route = createRootRoute({
  beforeLoad: () => ({ lang: readLang() }),
  head: ({ match }) => {
    const lang = match.context.lang;
    const siteName = SITE_NAME[lang];
    const siteDescription = SITE_DESCRIPTION[lang];
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: siteName,
        },
        {
          name: "description",
          content: siteDescription,
        },
        {
          property: "og:title",
          content: siteName,
        },
        {
          property: "og:description",
          content: siteDescription,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
      ],
      links: [
        {
          rel: "icon",
          href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔋</text></svg>",
        },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..800&display=swap",
        },
      ],
    };
  },
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { lang } = Route.useRouteContext();
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        <LangProvider initial={lang}>
          <TooltipProvider>
            <CartProvider>
              <SiteHeader />
              <main className="min-h-[70vh]">{children}</main>
              <SiteFooter />
              <MobileTabBar />
            </CartProvider>
          </TooltipProvider>
        </LangProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
