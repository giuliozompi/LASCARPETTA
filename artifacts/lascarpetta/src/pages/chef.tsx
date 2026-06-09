import { useI18n } from "@/lib/i18n-context";
import { SEO } from "@/components/seo/seo";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ChefPage() {
  const { lang } = useI18n();

  const content = {
    ru: {
      title: "Наши шеф-повара",
      subtitle: "Два итальянца, один общий дом — Москва",
      marco: {
        name: "Марко Яккетта",
        role: "Шеф-повар",
        bio1: "Марко Яккетта родился в Фабриано — маленьком городке в регионе Марке, где его семья по сей день управляет рестораном «La Vecchia Cartiera». Кулинарное мастерство досталось ему по наследству: с детства он наблюдал, как мама и бабушка превращали простые продукты в произведения искусства.",
        bio2: "В 2002 году Марко приехал в Москву — тогда здесь ещё не было настоящей итальянской культуры. Он помог изменить это. Спустя более двадцати лет его carbonara остаётся одним из самых обсуждаемых блюд города. Его философия проста: лучшие натуральные продукты, рецепты из детства, любовь в каждой тарелке.",
        bio3: "La Scarpetta — это его дом в Москве. Не просто ресторан, а место, где итальянская культура встречает русское гостеприимство.",
      },
      giulio: {
        name: "Дон Джулио",
        role: "Совладелец и душа ресторана",
        bio1: "Дон Джулио — сердце и душа La Scarpetta. Именно он создал атмосферу настоящей итальянской траттории в Москве — тёплой, семейной, живой.",
        bio2: "Вместе с Марко они воссоздали вкус итальянского детства: лимончелло в подарок после ужина, горячий приём каждого гостя, итальянская музыка в зале. La Scarpetta — это их общая страсть и миссия.",
      },
      cta: "Забронировать столик",
    },
    it: {
      title: "I Nostri Chef",
      subtitle: "Due italiani, una casa comune — Mosca",
      marco: {
        name: "Marco Iachetta",
        role: "Chef",
        bio1: "Marco Iachetta è nato a Fabriano, una piccola città nelle Marche, dove la sua famiglia gestisce tuttora il ristorante 'La Vecchia Cartiera'. L'arte culinaria è nel suo DNA: fin da bambino ha osservato la madre e la nonna trasformare ingredienti semplici in capolavori.",
        bio2: "Nel 2002 Marco è arrivato a Mosca — allora non esisteva ancora una vera cultura italiana. Lui ha contribuito a cambiarla. Dopo più di vent'anni, la sua carbonara rimane uno dei piatti più apprezzati della città. La sua filosofia è semplice: i migliori ingredienti naturali, ricette d'infanzia, amore in ogni piatto.",
        bio3: "La Scarpetta è la sua casa a Mosca. Non solo un ristorante, ma un luogo dove la cultura italiana incontra l'ospitalità russa.",
      },
      giulio: {
        name: "Don Giulio",
        role: "Comproprietario e anima del ristorante",
        bio1: "Don Giulio è il cuore e l'anima di La Scarpetta. È lui ad aver creato l'atmosfera di una vera trattoria italiana a Mosca — calda, familiare, viva.",
        bio2: "Insieme a Marco hanno ricreato il sapore dell'infanzia italiana: il limoncello in omaggio dopo cena, l'accoglienza calorosa di ogni ospite, la musica italiana in sala. La Scarpetta è la loro passione comune e la loro missione.",
      },
      cta: "Prenota un tavolo",
    },
    en: {
      title: "Our Chefs",
      subtitle: "Two Italians, one home — Moscow",
      marco: {
        name: "Marco Iachetta",
        role: "Head Chef",
        bio1: "Marco Iachetta was born in Fabriano, a small town in Le Marche region, where his family still runs the restaurant 'La Vecchia Cartiera'. Culinary mastery is in his DNA: from childhood he watched his mother and grandmother transform simple ingredients into masterpieces.",
        bio2: "In 2002 Marco arrived in Moscow — at that time there was no real Italian culture here. He helped change that. More than twenty years later, his carbonara remains one of the most talked-about dishes in the city. His philosophy is simple: the finest natural ingredients, childhood recipes, love in every dish.",
        bio3: "La Scarpetta is his home in Moscow. Not just a restaurant, but a place where Italian culture meets Russian hospitality.",
      },
      giulio: {
        name: "Don Giulio",
        role: "Co-owner and Soul of the Restaurant",
        bio1: "Don Giulio is the heart and soul of La Scarpetta. He created the atmosphere of a true Italian trattoria in Moscow — warm, familiar, alive.",
        bio2: "Together with Marco, they have recreated the taste of an Italian childhood: a complimentary limoncello after dinner, a warm welcome for every guest, Italian music in the dining room. La Scarpetta is their shared passion and mission.",
      },
      cta: "Book a Table",
    },
    fr: {
      title: "Nos Chefs",
      subtitle: "Deux Italiens, une maison commune — Moscou",
      marco: {
        name: "Marco Iachetta",
        role: "Chef",
        bio1: "Marco Iachetta est né à Fabriano, une petite ville des Marches, où sa famille gère encore le restaurant 'La Vecchia Cartiera'. L'art culinaire est dans son ADN.",
        bio2: "En 2002, Marco est arrivé à Moscou où la culture italienne authentique était absente. Il a contribué à la changer. Sa carbonara reste l'un des plats les plus appréciés de la ville.",
        bio3: "La Scarpetta est sa maison à Moscou — un lieu où la culture italienne rencontre l'hospitalité russe.",
      },
      giulio: {
        name: "Don Giulio",
        role: "Copropriétaire et âme du restaurant",
        bio1: "Don Giulio est le cœur et l'âme de La Scarpetta. C'est lui qui a créé l'atmosphère d'une vraie trattoria italienne à Moscou — chaleureuse, familiale, vivante.",
        bio2: "Ensemble avec Marco, ils ont recréé le goût de l'enfance italienne: un limoncello offert après le dîner, un accueil chaleureux, de la musique italienne en salle.",
      },
      cta: "Réserver une table",
    },
    zh: {
      title: "我们的厨师",
      subtitle: "两位意大利人，一个共同的家——莫斯科",
      marco: {
        name: "马可·亚凯塔",
        role: "主厨",
        bio1: "马可·亚凯塔出生于意大利马尔凯大区的法布里亚诺，他的家族至今仍在当地经营着'La Vecchia Cartiera'餐厅。烹饪艺术是他的天赋。",
        bio2: "2002年，马可来到莫斯科——那时这里还没有真正的意大利文化。二十多年后，他的卡波纳拉至今仍是城中最受追捧的菜肴之一。",
        bio3: "La Scarpetta是他在莫斯科的家，一个意大利文化与俄罗斯热情相遇的地方。",
      },
      giulio: {
        name: "唐·朱利奥",
        role: "共同经营者与餐厅灵魂",
        bio1: "唐·朱利奥是La Scarpetta的心脏与灵魂。他在莫斯科创造了一个真正意大利小餐馆的氛围——温暖、家庭式、充满活力。",
        bio2: "他与马可一起重现了意大利童年的味道：饭后赠送的柠檬酒、对每位客人的热情欢迎，以及餐厅中流淌的意大利音乐。",
      },
      cta: "预订餐桌",
    },
  };

  const c = content[lang] || content.en;

  return (
    <>
      <SEO
        title={`${c.title} — La Scarpetta`}
        description="Marco Iachetta e Don Giulio — i fondatori e l'anima di La Scarpetta, ristorante italiano a Mosca."
      />

      <section className="py-20 bg-primary text-primary-foreground text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-6xl font-bold mb-4"
        >
          {c.title}
        </motion.h1>
        <p className="text-primary-foreground/80 text-lg">{c.subtitle}</p>
      </section>

      {/* Marco Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative">
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  <img
                    src="/chef-marco.jpg"
                    alt="Chef Marco Iachetta"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80";
                    }}
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 -z-10" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">{c.marco.role}</p>
              <h2 className="font-serif text-4xl md:text-5xl mb-8">{c.marco.name}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{c.marco.bio1}</p>
                <p>{c.marco.bio2}</p>
                <p>{c.marco.bio3}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Giulio Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:order-2"
            >
              <div className="relative">
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  <img
                    src="/chef-giulio.jpg"
                    alt="Don Giulio"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=600&q=80";
                    }}
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 -z-10" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:order-1"
            >
              <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">{c.giulio.role}</p>
              <h2 className="font-serif text-4xl md:text-5xl mb-8">{c.giulio.name}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{c.giulio.bio1}</p>
                <p>{c.giulio.bio2}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl italic leading-relaxed mb-10"
          >
            {lang === "ru" && '"Мы хотим открыть вам традиционный вкус итальянской кухни, который помним с детства, ведь именно так готовили для нас наши мамы и бабушки."'}
            {lang === "it" && '"Vogliamo mostrarvi il sapore tradizionale della cucina italiana che ricordiamo dall\'infanzia, come cucinavano per noi le nostre mamme e nonne."'}
            {lang === "en" && '"We want to show you the traditional taste of Italian cuisine that we remember from childhood, the way our mothers and grandmothers cooked for us."'}
            {lang === "fr" && '"Nous voulons vous faire découvrir le goût traditionnel de la cuisine italienne que nous nous rappelons de notre enfance."'}
            {lang === "zh" && '"我们想让您品尝到我们童年记忆中的意大利传统美食，就像我们的母亲和祖母为我们烹饪的那样。"'}
          </motion.blockquote>
          <Link href="/reservations">
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-none px-10"
            >
              {c.cta}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
