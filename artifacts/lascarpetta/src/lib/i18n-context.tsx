import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "ru" | "it" | "en" | "fr" | "zh";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  ru: {
    "nav.home": "Главная",
    "nav.menu": "Меню",
    "nav.gallery": "Галерея",
    "nav.events": "События",
    "nav.chef": "Шеф-повар",
    "nav.reviews": "Отзывы",
    "nav.reservations": "Бронь",
    "nav.catering": "Кейтеринг",
    "nav.contact": "Контакты",
    "hero.title": "La Scarpetta",
    "hero.subtitle": "Настоящая итальянская траттория в сердце Москвы",
    "hero.cta": "Забронировать столик",
    "common.loading": "Загрузка...",
    "common.error": "Произошла ошибка",
    "home.about.title": "Наша история",
    "home.about.text": "La Scarpetta — это уютная семейная итальянская траттория в сердце Москвы. Мы не роскошный ресторан, а место, где настоящая итальянская кухня встречается с искренним гостеприимством. Гости приходят сюда, чтобы попробовать карбонару такой, какой она должна быть, выпить честного итальянского вина и почувствовать, что оказались на итальянской кухне. Уютно, по-домашнему и по-настоящему аутентично.",
    "home.specials.title": "Фирменные блюда",
    "home.specials.cta": "Смотреть всё меню",
    "home.chef.text": "Рестораном управляют итальянские владельцы с шеф-поваром Марко Якеттой (из Фабриано, Италия, в Москве с 2002 года) и Доном Джулио. Мы привозим настоящий вкус Италии в Москву.",
    "home.chef.cta": "Читать нашу историю",
  },
  it: {
    "nav.home": "Home",
    "nav.menu": "Menu",
    "nav.gallery": "Galleria",
    "nav.events": "Eventi",
    "nav.chef": "Chef",
    "nav.reviews": "Recensioni",
    "nav.reservations": "Prenotazioni",
    "nav.catering": "Catering",
    "nav.contact": "Contatti",
    "hero.title": "La Scarpetta",
    "hero.subtitle": "Un'autentica trattoria italiana nel cuore di Mosca",
    "hero.cta": "Prenota un tavolo",
    "common.loading": "Caricamento...",
    "common.error": "Si è verificato un errore",
    "home.about.title": "La Nostra Storia",
    "home.about.text": "La Scarpetta è una calda trattoria italiana a conduzione familiare nel cuore di Mosca. Non siamo un ristorante di lusso, ma un luogo dove la vera cucina italiana incontra una genuina ospitalità. Gli ospiti vengono qui per assaggiare la carbonara come si deve, sorseggiare un onesto vino italiano e sentirsi trasportati in una cucina italiana. È intima, vissuta e profondamente autentica.",
    "home.specials.title": "I Nostri Speciali",
    "home.specials.cta": "Vedi il menu completo",
    "home.chef.text": "Gestito da proprietari italiani con lo chef Marco Iachetta (da Fabriano, Italia, a Mosca dal 2002) e Don Giulio. Portiamo il vero sapore dell'Italia a Mosca.",
    "home.chef.cta": "La nostra storia",
  },
  en: {
    "nav.home": "Home",
    "nav.menu": "Menu",
    "nav.gallery": "Gallery",
    "nav.events": "Events",
    "nav.chef": "Chef",
    "nav.reviews": "Reviews",
    "nav.reservations": "Reservations",
    "nav.catering": "Catering",
    "nav.contact": "Contact",
    "hero.title": "La Scarpetta",
    "hero.subtitle": "An authentic Italian trattoria in the heart of Moscow",
    "hero.cta": "Book a Table",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "home.about.title": "Our Story",
    "home.about.text": "La Scarpetta is a warm, family-run Italian trattoria in the heart of Moscow. We are not a luxury restaurant, but a place where real Italian cooking meets genuine hospitality. Guests come here to taste carbonara the way it was meant to be made, sip honest Italian wine, and feel transported to an Italian kitchen. It's intimate, lived-in, and deeply authentic.",
    "home.specials.title": "Chef's Specials",
    "home.specials.cta": "View Full Menu",
    "home.chef.text": "Managed by Italian owners with head chef Marco Iachetta (from Fabriano, Italy, in Moscow since 2002) and Don Giulio. We bring the true taste of Italy to Moscow.",
    "home.chef.cta": "Read Our Story",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.menu": "Menu",
    "nav.gallery": "Galerie",
    "nav.events": "Événements",
    "nav.chef": "Chef",
    "nav.reviews": "Avis",
    "nav.reservations": "Réservations",
    "nav.catering": "Traiteur",
    "nav.contact": "Contact",
    "hero.title": "La Scarpetta",
    "hero.subtitle": "Une trattoria italienne authentique au cœur de Moscou",
    "hero.cta": "Réserver une table",
    "common.loading": "Chargement...",
    "common.error": "Une erreur s'est produite",
    "home.about.title": "Notre Histoire",
    "home.about.text": "La Scarpetta est une chaleureuse trattoria italienne familiale au cœur de Moscou. Nous ne sommes pas un restaurant de luxe, mais un endroit où la vraie cuisine italienne rencontre une hospitalité sincère. Les clients viennent ici pour goûter la carbonara comme elle doit l'être, siroter un honnête vin italien et se sentir transportés dans une cuisine italienne. C'est intime, vécu et profondément authentique.",
    "home.specials.title": "Nos Spécialités",
    "home.specials.cta": "Voir le menu complet",
    "home.chef.text": "Géré par des propriétaires italiens avec le chef Marco Iachetta (de Fabriano, Italie, à Moscou depuis 2002) et Don Giulio. Nous apportons le vrai goût de l'Italie à Moscou.",
    "home.chef.cta": "Notre histoire",
  },
  zh: {
    "nav.home": "首页",
    "nav.menu": "菜单",
    "nav.gallery": "画廊",
    "nav.events": "活动",
    "nav.chef": "主厨",
    "nav.reviews": "评论",
    "nav.reservations": "预订",
    "nav.catering": "餐饮",
    "nav.contact": "联系我们",
    "hero.title": "La Scarpetta",
    "hero.subtitle": "莫斯科市中心地道的意大利小餐馆",
    "hero.cta": "预订餐桌",
    "common.loading": "加载中...",
    "common.error": "发生错误",
    "home.about.title": "我们的故事",
    "home.about.text": "La Scarpetta 是位于莫斯科市中心一家温馨的家庭式意大利小餐馆。我们不是豪华餐厅，而是一个真正的意大利烹饪与真诚款待相遇的地方。客人来这里品尝正宗的意大利面，品味纯正的意大利葡萄酒，感受置身意大利厨房的氛围。这里亲切、朴实，充满真实的意大利气息。",
    "home.specials.title": "主厨特选",
    "home.specials.cta": "查看完整菜单",
    "home.chef.text": "由意大利老板经营，主厨马可·亚切塔（来自意大利法布里亚诺，2002年起在莫斯科）和唐·朱利奥。我们将意大利的真实味道带到莫斯科。",
    "home.chef.cta": "阅读我们的故事",
  }
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("la-scarpetta-lang");
    return (saved as Language) || "ru";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("la-scarpetta-lang", newLang);
  };

  const t = (key: string, variables?: Record<string, string | number>) => {
    let str = translations[lang][key] || translations["en"][key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        str = str.replace(`{{${k}}}`, String(v));
      });
    }
    return str;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
