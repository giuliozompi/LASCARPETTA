import { useI18n } from "@/lib/i18n-context";
import { SEO } from "@/components/seo/seo";
import { useListReviews, useGetReviewStats, useCreateReview } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const schema = z.object({
  authorName: z.string().min(2, "Name required"),
  rating: z.number().min(1).max(5),
  text: z.string().min(10, "Please write at least 10 characters"),
});

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-colors"
        >
          <Star
            className={`w-7 h-7 ${(hover || value) >= star ? "fill-primary text-primary" : "text-muted-foreground"}`}
          />
        </button>
      ))}
    </div>
  );
}

function StarsDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${rating >= s ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const { data: reviews, refetch } = useListReviews({ approved: true });
  const { data: stats } = useGetReviewStats();
  const createReview = useCreateReview();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { authorName: "", rating: 0, text: "" },
  });
  const rating = watch("rating");

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await createReview.mutateAsync({ data: { ...data, lang } });
      toast({
        title: lang === "ru" ? "Отзыв отправлен" : lang === "it" ? "Recensione inviata" : "Review submitted",
        description: lang === "ru" ? "Спасибо! Ваш отзыв будет опубликован после проверки." : lang === "it" ? "Grazie! La tua recensione sarà pubblicata dopo la revisione." : "Thank you! Your review will be published after moderation.",
      });
      reset();
      refetch();
    } catch {
      toast({ title: t("common.error"), variant: "destructive" });
    }
  };

  const labels = {
    title: { ru: "Отзывы гостей", it: "Recensioni degli ospiti", en: "Guest Reviews", fr: "Avis des clients", zh: "客人评论" },
    writeReview: { ru: "Оставить отзыв", it: "Lascia una recensione", en: "Write a Review", fr: "Écrire un avis", zh: "写评论" },
    name: { ru: "Ваше имя", it: "Il tuo nome", en: "Your name", fr: "Votre nom", zh: "您的姓名" },
    review: { ru: "Ваш отзыв", it: "La tua recensione", en: "Your review", fr: "Votre avis", zh: "您的评论" },
    submit: { ru: "Отправить", it: "Invia", en: "Submit", fr: "Envoyer", zh: "提交" },
    reviews: { ru: "отзывов", it: "recensioni", en: "reviews", fr: "avis", zh: "条评论" },
  };
  const l = (key: keyof typeof labels) => (labels[key] as any)[lang] || (labels[key] as any).en;

  return (
    <>
      <SEO
        title={`${l("title")} — La Scarpetta`}
        description="Reviews from guests of La Scarpetta Italian restaurant in Moscow."
      />

      <section className="py-20 bg-primary text-primary-foreground text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-6xl font-bold mb-4"
        >
          {l("title")}
        </motion.h1>
        {stats && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <StarsDisplay rating={Math.round(stats.averageRating)} />
            <span className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
            <span className="text-primary-foreground/70">({stats.approvedCount} {l("reviews")})</span>
          </div>
        )}
      </section>

      {/* Reviews Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
          >
            {reviews?.map((review) => (
              <motion.div
                key={review.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="bg-card border border-border p-6 hover:shadow-md transition-shadow"
              >
                <StarsDisplay rating={review.rating} />
                <p className="mt-4 text-muted-foreground leading-relaxed italic">"{review.text}"</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-sm">{review.authorName}</span>
                  {review.source && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {review.source}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(review.createdAt).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-GB")}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {reviews?.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              {lang === "ru" ? "Отзывов пока нет. Будьте первым!" : "No reviews yet. Be the first!"}
            </p>
          )}
        </div>
      </section>

      {/* Review Form */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl text-primary mb-10 text-center">{l("writeReview")}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{l("name")}</label>
                <Input {...register("authorName")} className="rounded-none" />
                {errors.authorName && <p className="text-destructive text-sm mt-1">{errors.authorName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {lang === "ru" ? "Оценка" : lang === "it" ? "Valutazione" : lang === "fr" ? "Note" : lang === "zh" ? "评分" : "Rating"}
                </label>
                <StarRating value={rating} onChange={(v) => setValue("rating", v)} />
                {errors.rating && <p className="text-destructive text-sm mt-1">Please select a rating</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{l("review")}</label>
                <Textarea {...register("text")} rows={5} className="rounded-none resize-none" />
                {errors.text && <p className="text-destructive text-sm mt-1">{errors.text.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full rounded-none"
                disabled={createReview.isPending}
              >
                {createReview.isPending ? t("common.loading") : l("submit")}
              </Button>
            </form>

            {/* External review links */}
            <div className="mt-10 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {lang === "ru" ? "Также оставьте отзыв на:" : lang === "it" ? "Lascia anche una recensione su:" : "Also leave a review on:"}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="https://yandex.ru/maps/-/blah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline text-primary"
                >
                  Yandex Maps
                </a>
                <a
                  href="https://www.tripadvisor.com/Restaurant_Review-g298484-d7347957-Reviews-Restaurant_La_Scarpetta-Moscow_Central_Russia.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline text-primary"
                >
                  TripAdvisor
                </a>
                <a
                  href="https://www.facebook.com/La.Scarpetta.Msc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline text-primary"
                >
                  Facebook
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
