import { useI18n } from "@/lib/i18n-context";
import { SEO } from "@/components/seo/seo";
import { getLangField } from "@/lib/get-lang-field";
import { useListEvents } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function EventsPage() {
  const { lang } = useI18n();
  const { data: events, isLoading } = useListEvents({ lang });

  const today = new Date().toISOString().split("T")[0];
  const upcoming = events?.filter(e => e.date >= today) ?? [];
  const past = events?.filter(e => e.date < today) ?? [];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString(
      lang === "ru" ? "ru-RU" : lang === "zh" ? "zh-CN" : lang === "fr" ? "fr-FR" : lang === "it" ? "it-IT" : "en-GB",
      { day: "numeric", month: "long", year: "numeric" }
    );
  };

  type EventItem = NonNullable<typeof events>[number];
  const EventCard = ({ event }: { event: EventItem }) => (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
      className="bg-card border border-border overflow-hidden group hover:shadow-lg transition-shadow"
    >
      {event.imageUrl && (
        <div className="h-56 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={getLangField(event, "title", lang)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(event.date)}</span>
        </div>
        <h3 className="font-serif text-2xl mb-3">{getLangField(event, "title", lang)}</h3>
        <p className="text-muted-foreground leading-relaxed">{getLangField(event, "desc", lang)}</p>
      </div>
    </motion.div>
  );

  return (
    <>
      <SEO
        title={`${lang === "ru" ? "События" : lang === "it" ? "Eventi" : lang === "fr" ? "Événements" : lang === "zh" ? "活动" : "Events"} — La Scarpetta`}
        description="Events and special evenings at La Scarpetta Italian restaurant in Moscow."
      />

      <section className="py-20 bg-primary text-primary-foreground text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-6xl font-bold"
        >
          {lang === "ru" ? "События" : lang === "it" ? "Eventi" : lang === "fr" ? "Événements" : lang === "zh" ? "活动" : "Events"}
        </motion.h1>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div className="mb-16">
                  <h2 className="font-serif text-3xl text-primary mb-8">
                    {lang === "ru" ? "Предстоящие события" : lang === "it" ? "Prossimi eventi" : lang === "fr" ? "Événements à venir" : lang === "zh" ? "即将举行的活动" : "Upcoming Events"}
                  </h2>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
                  >
                    {upcoming.map(e => <EventCard key={e.id} event={e} />)}
                  </motion.div>
                </div>
              )}

              {past.length > 0 && (
                <div>
                  <h2 className="font-serif text-3xl text-muted-foreground mb-8">
                    {lang === "ru" ? "Прошедшие события" : lang === "it" ? "Eventi passati" : lang === "fr" ? "Événements passés" : lang === "zh" ? "过去的活动" : "Past Events"}
                  </h2>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
                  >
                    {past.map(e => <EventCard key={e.id} event={e} />)}
                  </motion.div>
                </div>
              )}

              {upcoming.length === 0 && past.length === 0 && (
                <p className="text-center text-muted-foreground py-16 text-lg">
                  {lang === "ru" ? "События скоро появятся" : "Events coming soon"}
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
