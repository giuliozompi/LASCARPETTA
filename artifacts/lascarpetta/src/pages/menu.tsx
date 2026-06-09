import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { SEO } from "@/components/seo/seo";
import { getLangField } from "@/lib/get-lang-field";
import { useListMenuCategories, useListDishes } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuPage() {
  const { t, lang } = useI18n();
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const { data: categories, isLoading: catsLoading } = useListMenuCategories({ lang });
  const { data: dishes, isLoading: dishesLoading } = useListDishes({
    categoryId: activeCategoryId ?? undefined,
    lang,
  });

  const filteredDishes = dishes?.filter(d => d.available) ?? [];

  return (
    <>
      <SEO
        title={`${t("nav.menu")} — La Scarpetta`}
        description="Menu italiano autentico. Antipasti, pasta fresca, pizza, secondi, dolci. Ristorante La Scarpetta, Mosca."
      />

      {/* Hero */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-6xl font-bold mb-4"
        >
          {t("nav.menu")}
        </motion.h1>
        <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
          {lang === "ru" && "Блюда из сердца Италии, приготовленные с любовью"}
          {lang === "it" && "Piatti dal cuore dell'Italia, preparati con amore"}
          {lang === "en" && "Dishes from the heart of Italy, prepared with love"}
          {lang === "fr" && "Des plats du cœur de l'Italie, préparés avec amour"}
          {lang === "zh" && "来自意大利心脏的菜肴，用爱烹饪"}
        </p>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-16 z-40 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex gap-2 py-4 min-w-max">
            <button
              onClick={() => setActiveCategoryId(null)}
              className={`px-5 py-2 text-sm font-semibold transition-colors rounded-none border-b-2 ${
                activeCategoryId === null
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-primary"
              }`}
            >
              {lang === "ru" ? "Все" : lang === "it" ? "Tutto" : lang === "fr" ? "Tout" : lang === "zh" ? "全部" : "All"}
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-5 py-2 text-sm font-semibold transition-colors rounded-none border-b-2 whitespace-nowrap ${
                  activeCategoryId === cat.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-primary"
                }`}
              >
                {getLangField(cat, "name", lang)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dishes */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {dishesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.07 } },
                hidden: {},
              }}
            >
              {filteredDishes.map((dish) => (
                <motion.div
                  key={dish.id}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="bg-card border border-border overflow-hidden group hover:shadow-lg transition-shadow duration-300"
                >
                  {dish.imageUrl && (
                    <div className="h-52 overflow-hidden">
                      <img
                        src={dish.imageUrl}
                        alt={getLangField(dish, "name", lang)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif text-xl leading-tight">
                        {getLangField(dish, "name", lang)}
                      </h3>
                      <span className="text-primary font-bold whitespace-nowrap text-lg">
                        {Number(dish.price).toLocaleString()} {dish.currency}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {getLangField(dish, "desc", lang)}
                    </p>
                    {dish.allergens && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        {lang === "ru" ? "Аллергены" : lang === "it" ? "Allergeni" : lang === "fr" ? "Allergènes" : lang === "zh" ? "过敏原" : "Allergens"}: {dish.allergens}
                      </p>
                    )}
                    {dish.featured && (
                      <Badge className="mt-3 bg-primary/10 text-primary border-primary/20 text-xs">
                        {lang === "ru" ? "Фирменное" : lang === "it" ? "Signature" : lang === "fr" ? "Signature" : lang === "zh" ? "招牌菜" : "Signature"}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!dishesLoading && filteredDishes.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">{t("common.loading")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
