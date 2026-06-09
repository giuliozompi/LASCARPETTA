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
