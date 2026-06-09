import { Link, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  const { lang, setLang, t } = useI18n();
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "nav.home" },
    { href: "/menu", label: "nav.menu" },
    { href: "/gallery", label: "nav.gallery" },
    { href: "/events", label: "nav.events" },
    { href: "/chef", label: "nav.chef" },
    { href: "/reviews", label: "nav.reviews" },
    { href: "/catering", label: "nav.catering" },
    { href: "/contact", label: "nav.contact" },
  ];

  const languages = [
    { code: "ru", label: "RU" },
    { code: "it", label: "IT" },
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "zh", label: "ZH" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold text-primary tracking-wide">
          La Scarpetta
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                  lang === l.code ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <Link href="/reservations" className="hidden sm:inline-flex">
            <Button variant="default" size="sm" className="font-semibold">
              {t("nav.reservations")}
            </Button>
          </Link>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/" className="font-serif text-2xl font-bold text-primary">
                  La Scarpetta
                </Link>
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-lg font-medium ${
                        location === link.href ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {t(link.label)}
                    </Link>
                  ))}
                  <Link
                    href="/reservations"
                    className={`text-lg font-medium ${
                      location === "/reservations" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {t("nav.reservations")}
                  </Link>
                </div>
                <div className="mt-4 flex gap-2">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`text-sm font-semibold px-3 py-2 rounded ${
                        lang === l.code ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
