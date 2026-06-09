import { Link } from "wouter";
import { useI18n } from "@/lib/i18n-context";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-foreground text-background py-12 md:py-16 mt-auto">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        <div className="md:col-span-1">
          <Link href="/" className="font-serif text-3xl font-bold tracking-wide text-primary-foreground">
            La Scarpetta
          </Link>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold mb-4 text-primary-foreground">
            {t("nav.contact")}
          </h3>
          <address className="not-italic text-sm text-muted-foreground space-y-2">
            <p>Obolensky per., 9</p>
            <p>Khamovniki district, Moscow</p>
            <p className="mt-4">
              <a href="tel:+74992466228" className="hover:text-primary-foreground transition-colors">
                +7 499 246 62 28
              </a>
            </p>
            <p className="mt-2">
              <a href="https://instagram.com/la_scarpetta_msc" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">
                @la_scarpetta_msc
              </a>
            </p>
          </address>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold mb-4 text-primary-foreground">
            {t("nav.menu")}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/menu" className="hover:text-primary-foreground transition-colors">
                {t("nav.menu")}
              </Link>
            </li>
            <li>
              <Link href="/catering" className="hover:text-primary-foreground transition-colors">
                {t("nav.catering")}
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-primary-foreground transition-colors">
                {t("nav.events")}
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-primary-foreground transition-colors">
                {t("nav.gallery")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold mb-4 text-primary-foreground">
            {t("nav.chef")}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/chef" className="hover:text-primary-foreground transition-colors">
                {t("nav.chef")}
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-primary-foreground transition-colors">
                {t("nav.reviews")}
              </Link>
            </li>
            <li>
              <Link href="/reservations" className="hover:text-primary-foreground transition-colors">
                {t("nav.reservations")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-12 pt-8 border-t border-muted/20 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} La Scarpetta. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span>Moscow</span>
          <span>&bull;</span>
          <span>Italian Trattoria</span>
        </div>
      </div>
    </footer>
  );
}
