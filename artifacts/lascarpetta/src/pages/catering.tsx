import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { SEO } from "@/components/seo/seo";
import { getLangField } from "@/lib/get-lang-field";
import { useListCateringMenus, useCreateCateringBooking } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, ChefHat } from "lucide-react";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  eventDate: z.string().min(1),
  eventLocation: z.string().optional(),
  guests: z.number().min(1),
  cateringMenuId: z.number().min(1),
  comment: z.string().optional(),
});

export default function CateringPage() {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const { data: menus, isLoading } = useListCateringMenus({ lang });
  const createBooking = useCreateCateringBooking();
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", eventDate: "", eventLocation: "", guests: 20, cateringMenuId: 0, comment: "" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await createBooking.mutateAsync({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          eventDate: data.eventDate,
          eventLocation: data.eventLocation || null,
          guests: data.guests,
          cateringMenuId: data.cateringMenuId,
          comment: data.comment || null,
          lang,
        },
      });
      toast({
        title: lang === "ru" ? "Заявка отправлена!" : lang === "it" ? "Prenotazione inviata!" : "Booking submitted!",
        description: lang === "ru" ? "Мы свяжемся с вами для уточнения деталей." : "We will contact you to discuss the details.",
      });
      reset();
      setSelectedMenuId(null);
    } catch {
      toast({ title: t("common.error"), variant: "destructive" });
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const labels = {
    title: { ru: "Кейтеринг", it: "Catering", en: "Catering", fr: "Traiteur", zh: "餐饮服务" },
    subtitle: { ru: "Итальянская кухня на вашем мероприятии", it: "La cucina italiana al vostro evento", en: "Italian cuisine at your event", fr: "La cuisine italienne à votre événement", zh: "意大利美食在您的活动中" },
    menuSection: { ru: "Наши меню", it: "I nostri menu", en: "Our Menus", fr: "Nos menus", zh: "我们的菜单" },
    from: { ru: "от", it: "da", en: "from", fr: "à partir de", zh: "起价" },
    perPerson: { ru: "руб/чел", it: "rub/pers", en: "RUB/person", fr: "RUB/pers", zh: "卢布/人" },
    minGuests: { ru: "Мин. гостей", it: "Ospiti min.", en: "Min. guests", fr: "Invités min.", zh: "最少人数" },
    bookTitle: { ru: "Забронировать кейтеринг", it: "Prenota catering", en: "Book Catering", fr: "Réserver le traiteur", zh: "预订餐饮服务" },
    submit: { ru: "Отправить заявку", it: "Invia prenotazione", en: "Submit Request", fr: "Envoyer la demande", zh: "提交预订" },
  };
  const l = (k: keyof typeof labels) => (labels[k] as any)[lang] || (labels[k] as any).en;

  return (
    <>
      <SEO
        title={`${l("title")} — La Scarpetta`}
        description="Italian catering for events in Moscow from La Scarpetta restaurant. Corporate events, banquets, private parties."
      />

      <section className="py-20 bg-primary text-primary-foreground text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-6xl font-bold mb-4"
        >
          {l("title")}
        </motion.h1>
        <p className="text-primary-foreground/80 text-lg">{l("subtitle")}</p>
      </section>

      {/* Catering Menus */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl text-primary mb-10 text-center">{l("menuSection")}</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-80 bg-muted animate-pulse" />)}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
            >
              {menus?.map((menu) => (
                <motion.div
                  key={menu.id}
                  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                  className={`bg-card border overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                    selectedMenuId === menu.id ? "border-primary shadow-lg ring-2 ring-primary" : "border-border"
                  }`}
                  onClick={() => {
                    setSelectedMenuId(menu.id);
                    setValue("cateringMenuId", menu.id);
                  }}
                >
                  {menu.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={menu.imageUrl}
                        alt={getLangField(menu, "name", lang)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-serif text-2xl mb-2">{getLangField(menu, "name", lang)}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{getLangField(menu, "desc", lang)}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary font-bold text-lg">
                          {l("from")} {Number(menu.pricePerPerson).toLocaleString()} {l("perPerson")}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {l("minGuests")}: {menu.minGuests}–{menu.maxGuests}
                        </p>
                      </div>
                      {selectedMenuId === menu.id && (
                        <ChefHat className="w-6 h-6 text-primary" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl text-primary mb-10 text-center">{l("bookTitle")}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{lang === "ru" ? "Имя" : "Name"} *</label>
                  <Input {...register("name")} className="rounded-none" />
                  {errors.name && <p className="text-destructive text-sm mt-1">Required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{lang === "ru" ? "Телефон" : "Phone"} *</label>
                  <Input {...register("phone")} type="tel" className="rounded-none" />
                  {errors.phone && <p className="text-destructive text-sm mt-1">Required</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input {...register("email")} type="email" className="rounded-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{lang === "ru" ? "Дата мероприятия" : "Event date"} *</label>
                  <Input {...register("eventDate")} type="date" min={today} className="rounded-none" />
                  {errors.eventDate && <p className="text-destructive text-sm mt-1">Required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{lang === "ru" ? "Кол-во гостей" : "Guests"} *</label>
                  <Input {...register("guests", { valueAsNumber: true })} type="number" min={1} className="rounded-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{lang === "ru" ? "Место проведения" : "Event location"}</label>
                <Input {...register("eventLocation")} className="rounded-none" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{lang === "ru" ? "Меню" : "Menu"} *</label>
                <Select onValueChange={(v) => { setValue("cateringMenuId", Number(v)); setSelectedMenuId(Number(v)); }}>
                  <SelectTrigger className="rounded-none">
                    <SelectValue placeholder={lang === "ru" ? "Выберите меню" : "Select a menu"} />
                  </SelectTrigger>
                  <SelectContent>
                    {menus?.map(m => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {getLangField(m, "name", lang)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cateringMenuId && <p className="text-destructive text-sm mt-1">Required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{lang === "ru" ? "Пожелания" : "Special requests"}</label>
                <Textarea {...register("comment")} rows={4} className="rounded-none resize-none" />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-none"
                disabled={createBooking.isPending}
              >
                {createBooking.isPending ? t("common.loading") : l("submit")}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}
