import { useI18n } from "@/lib/i18n-context";
import { SEO } from "@/components/seo/seo";
import { useCreateReservation } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Phone, MapPin, Clock } from "lucide-react";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  date: z.string().min(1),
  time: z.string().min(1),
  guests: z.number().min(1).max(20),
  comment: z.string().optional(),
});

const TIMES = ["12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"];

export default function ReservationsPage() {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const createReservation = useCreateReservation();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", date: "", time: "", guests: 2, comment: "" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await createReservation.mutateAsync({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          date: data.date,
          time: data.time,
          guests: data.guests,
          comment: data.comment || null,
          lang,
        },
      });
      toast({
        title: lang === "ru" ? "Заявка отправлена!" : lang === "it" ? "Prenotazione inviata!" : lang === "fr" ? "Réservation envoyée!" : lang === "zh" ? "预订已发送！" : "Reservation submitted!",
        description: lang === "ru" ? "Наш менеджер свяжется с вами для подтверждения." : lang === "it" ? "Il nostro manager vi contatterà per la conferma." : "Our manager will contact you to confirm.",
      });
      reset();
    } catch {
      toast({ title: t("common.error"), variant: "destructive" });
    }
  };

  const labels = {
    title: { ru: "Бронирование столика", it: "Prenotazione tavolo", en: "Table Reservation", fr: "Réservation de table", zh: "预订餐桌" },
    name: { ru: "Имя", it: "Nome", en: "Name", fr: "Nom", zh: "姓名" },
    phone: { ru: "Телефон", it: "Telefono", en: "Phone", fr: "Téléphone", zh: "电话" },
    email: { ru: "Email (необязательно)", it: "Email (opzionale)", en: "Email (optional)", fr: "Email (optionnel)", zh: "电子邮件（可选）" },
    date: { ru: "Дата", it: "Data", en: "Date", fr: "Date", zh: "日期" },
    time: { ru: "Время", it: "Ora", en: "Time", fr: "Heure", zh: "时间" },
    guests: { ru: "Количество гостей", it: "Numero di ospiti", en: "Number of guests", fr: "Nombre de convives", zh: "客人人数" },
    comment: { ru: "Пожелания", it: "Richieste speciali", en: "Special requests", fr: "Demandes spéciales", zh: "特殊要求" },
    submit: { ru: "Отправить заявку", it: "Invia prenotazione", en: "Submit Request", fr: "Envoyer la demande", zh: "提交预订" },
  };
  const l = (k: keyof typeof labels) => (labels[k] as any)[lang] || (labels[k] as any).en;

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <SEO
        title={`${l("title")} — La Scarpetta`}
        description="Book a table at La Scarpetta Italian restaurant in Moscow. Оболенский переулок, 9."
      />

      <section className="py-20 bg-primary text-primary-foreground text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-6xl font-bold"
        >
          {l("title")}
        </motion.h1>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <motion.form
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{l("name")} *</label>
                    <Input {...register("name")} className="rounded-none" />
                    {errors.name && <p className="text-destructive text-sm mt-1">Required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{l("phone")} *</label>
                    <Input {...register("phone")} type="tel" className="rounded-none" />
                    {errors.phone && <p className="text-destructive text-sm mt-1">Required</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{l("email")}</label>
                  <Input {...register("email")} type="email" className="rounded-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{l("date")} *</label>
                    <Input {...register("date")} type="date" min={today} className="rounded-none" />
                    {errors.date && <p className="text-destructive text-sm mt-1">Required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{l("time")} *</label>
                    <Select onValueChange={(v) => setValue("time", v)}>
                      <SelectTrigger className="rounded-none">
                        <SelectValue placeholder={l("time")} />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMES.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.time && <p className="text-destructive text-sm mt-1">Required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{l("guests")} *</label>
                    <Select onValueChange={(v) => setValue("guests", Number(v))} defaultValue="2">
                      <SelectTrigger className="rounded-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{l("comment")}</label>
                  <Textarea {...register("comment")} rows={4} className="rounded-none resize-none" />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-none"
                  disabled={createReservation.isPending}
                >
                  {createReservation.isPending ? t("common.loading") : l("submit")}
                </Button>
              </motion.form>
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border p-6"
              >
                <h3 className="font-serif text-xl mb-6 text-primary">
                  {lang === "ru" ? "Контактная информация" : lang === "it" ? "Informazioni di contatto" : lang === "fr" ? "Informations de contact" : lang === "zh" ? "联系信息" : "Contact Information"}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Оболенский переулок, 9, к.1</p>
                      <p className="text-muted-foreground text-sm">м. Фрунзенская, Москва, 119021</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <a href="tel:+74992466228" className="hover:text-primary transition-colors">+7 499 246 62 28</a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{lang === "ru" ? "Пн–Пт: 12:00–23:00" : "Mon–Fri: 12:00–23:00"}</p>
                      <p>{lang === "ru" ? "Сб–Вс: 12:00–00:00" : "Sat–Sun: 12:00–00:00"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Yandex map */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="overflow-hidden border border-border"
              >
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=37.5899%2C55.7291&z=16&pt=37.5899%2C55.7291%2Cpm2rdm&l=map"
                  width="100%"
                  height="280"
                  frameBorder="0"
                  title="La Scarpetta on Yandex Maps"
                  allowFullScreen
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
