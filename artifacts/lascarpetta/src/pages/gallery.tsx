import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { SEO } from "@/components/seo/seo";
import { getLangField } from "@/lib/get-lang-field";
import { useListGalleryPhotos } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const TYPES = [
  { key: null, ru: "Все", it: "Tutto", en: "All", fr: "Tout", zh: "全部" },
  { key: "dishes", ru: "Блюда", it: "Piatti", en: "Dishes", fr: "Plats", zh: "菜肴" },
  { key: "interior", ru: "Интерьер", it: "Interno", en: "Interior", fr: "Intérieur", zh: "室内" },
  { key: "events", ru: "События", it: "Eventi", en: "Events", fr: "Événements", zh: "活动" },
  { key: "daily", ru: "Жизнь ресторана", it: "Vita del ristorante", en: "Daily Life", fr: "Vie quotidienne", zh: "日常生活" },
];

export default function GalleryPage() {
  const { lang } = useI18n();
  const [activeType, setActiveType] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data: photos, isLoading } = useListGalleryPhotos({
    type: activeType as any,
  });

  return (
    <>
      <SEO
        title="Galleria — La Scarpetta"
        description="Galleria fotografica del ristorante La Scarpetta di Mosca. Piatti, interni, eventi."
      />

      <section className="py-20 bg-primary text-primary-foreground text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-6xl font-bold"
        >
          {lang === "ru" ? "Галерея" : lang === "it" ? "Galleria" : lang === "fr" ? "Galerie" : lang === "zh" ? "画廊" : "Gallery"}
        </motion.h1>
      </section>

      {/* Type filter */}
      <div className="sticky top-16 z-40 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto min-w-max">
            {TYPES.map((type) => (
              <button
                key={String(type.key)}
                onClick={() => setActiveType(type.key)}
                className={`px-5 py-2 text-sm font-semibold transition-colors rounded-none border-b-2 whitespace-nowrap ${
                  activeType === type.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-primary"
                }`}
              >
                {(type as any)[lang] || type.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
              layout
            >
              <AnimatePresence>
                {photos?.map((photo) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="aspect-square overflow-hidden cursor-pointer group relative"
                    onClick={() => setLightbox(photo.imageUrl)}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={getLangField(photo, "caption", lang) || "La Scarpetta"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {getLangField(photo, "caption", lang) && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <p className="text-white text-sm font-medium">{getLangField(photo, "caption", lang)}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          {!isLoading && (!photos || photos.length === 0) && (
            <p className="text-center text-muted-foreground py-16">
              {lang === "ru" ? "Фотографии скоро появятся" : "Photos coming soon"}
            </p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white"
              onClick={() => setLightbox(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={lightbox}
              alt="Gallery"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
