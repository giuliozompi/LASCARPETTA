import { Link } from "wouter";
import { useI18n } from "@/lib/i18n-context";
import { SEO } from "@/components/seo/seo";
import { Button } from "@/components/ui/button";
import { getLangField } from "@/lib/get-lang-field";
import { useGetFeaturedDishes, useListGalleryPhotos, useGetReviewStats, useListReviews } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function Home() {
  const { t, lang } = useI18n();

  const { data: featuredDishes, isLoading: isLoadingDishes } = useGetFeaturedDishes({ lang });
  const { data: galleryPhotos, isLoading: isLoadingPhotos } = useListGalleryPhotos({ limit: 4 });
  const { data: reviewStats } = useGetReviewStats();
  const { data: reviews } = useListReviews({ limit: 3, approved: true });

  return (
    <>
      <SEO 
        title={t("nav.home")} 
        description={t("hero.subtitle")} 
      />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="La Scarpetta Interior" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-6xl md:text-8xl font-bold mb-6 tracking-wide"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/reservations">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-none">
                {t("hero.cta")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="font-serif text-4xl text-primary mb-8">{t("home.about.title")}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("home.about.text")}
          </p>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl text-primary mb-12 text-center">{t("home.specials.title")}</h2>
          
          {isLoadingDishes ? (
            <div className="text-center">{t("common.loading")}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredDishes?.slice(0,3).map((dish) => (
                <div key={dish.id} className="bg-card shadow-lg overflow-hidden group">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={dish.imageUrl || "/dish-carbonara.png"} 
                      alt={getLangField(dish, "name", lang)} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl mb-2">{getLangField(dish, "name", lang)}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{getLangField(dish, "desc", lang)}</p>
                    <p className="text-primary font-bold text-xl">{dish.price} {dish.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link href="/menu">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-none">
                {t("home.specials.cta")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Chef Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex gap-4">
              <img src="/chef-marco.png" alt="Chef Marco" className="w-1/2 object-cover aspect-[3/4] rounded shadow-lg" />
              <img src="/chef-giulio.png" alt="Don Giulio" className="w-1/2 object-cover aspect-[3/4] rounded shadow-lg mt-12" />
            </div>
            <div>
              <h2 className="font-serif text-4xl text-primary mb-6">Marco & Giulio</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t("home.chef.text")}
              </p>
              <Link href="/chef">
                <Button variant="link" className="text-primary p-0 text-lg">{t("home.chef.cta")} &rarr;</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
