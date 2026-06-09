import { useI18n } from "@/lib/i18n-context";
import { SEO } from "@/components/seo/seo";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";

export default function ContactPage() {
  const { lang } = useI18n();

  const content = {
    ru: {
      title: "Контакты",
      address: "Адрес",
      phone: "Телефон",
      hours: "Часы работы",
      social: "Мы в социальных сетях",
      weekdays: "Пн–Пт: 12:00–23:00",
      weekend: "Сб–Вс: 12:00–00:00",
      metro: "м. Фрунзенская",
    },
    it: {
      title: "Contatti",
      address: "Indirizzo",
      phone: "Telefono",
      hours: "Orari",
      social: "Seguici sui social",
      weekdays: "Lun–Ven: 12:00–23:00",
      weekend: "Sab–Dom: 12:00–00:00",
      metro: "Metro Frunzenskaya",
    },
    en: {
      title: "Contact",
      address: "Address",
      phone: "Phone",
      hours: "Opening Hours",
      social: "Follow us",
      weekdays: "Mon–Fri: 12:00–23:00",
      weekend: "Sat–Sun: 12:00–00:00",
      metro: "Metro Frunzenskaya",
    },
    fr: {
      title: "Contact",
      address: "Adresse",
      phone: "Téléphone",
      hours: "Horaires",
      social: "Suivez-nous",
      weekdays: "Lun–Ven: 12:00–23:00",
      weekend: "Sam–Dim: 12:00–00:00",
      metro: "Métro Frunzenskaya",
    },
    zh: {
      title: "联系我们",
      address: "地址",
      phone: "电话",
      hours: "营业时间",
      social: "关注我们",
      weekdays: "周一至周五：12:00–23:00",
      weekend: "周六至周日：12:00–00:00",
      metro: "地铁弗伦斯卡娅站",
    },
  };

  const c = content[lang] || content.en;

  return (
    <>
      <SEO
        title={`${c.title} — La Scarpetta`}
        description="La Scarpetta — Оболенский переулок, 9, Москва. Тел: +7 499 246 62 28. Итальянский ресторан."
      />

      <section className="py-20 bg-primary text-primary-foreground text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-6xl font-bold"
        >
          {c.title}
        </motion.h1>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden border border-border"
            >
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=37.5899%2C55.7291&z=16&pt=37.5899%2C55.7291%2Cpm2rdm&l=map"
                width="100%"
                height="450"
                frameBorder="0"
                title="La Scarpetta"
                allowFullScreen
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div>
                <h3 className="font-serif text-2xl text-primary mb-4">{c.address}</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-lg">Оболенский переулок, 9, к.1</p>
                    <p className="text-muted-foreground">{c.metro}</p>
                    <p className="text-muted-foreground">Москва, 119021</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-2xl text-primary mb-4">{c.phone}</h3>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href="tel:+74992466228" className="text-lg font-medium hover:text-primary transition-colors">
                    +7 499 246 62 28
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-2xl text-primary mb-4">{c.hours}</h3>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="space-y-1">
                    <p>{c.weekdays}</p>
                    <p>{c.weekend}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-2xl text-primary mb-4">{c.social}</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/la_scarpetta_msc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>@la_scarpetta_msc</span>
                  </a>
                  <a
                    href="https://www.facebook.com/La.Scarpetta.Msc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>La.Scarpetta.Msc</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
