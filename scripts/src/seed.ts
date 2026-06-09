import { db, adminUsersTable, menuCategoriesTable, dishesTable, galleryPhotosTable, eventsTable, reviewsTable, cateringMenusTable } from "@workspace/db";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  // Admin user
  const hash = await bcrypt.hash("scarpetta2024!", 12);
  await db.insert(adminUsersTable).values({ username: "admin", passwordHash: hash }).onConflictDoNothing();
  console.log("✓ Admin user: admin / scarpetta2024!");

  // Menu categories
  const [antipasti] = await db.insert(menuCategoriesTable).values([
    { slug: "antipasti", nameRu: "Антипасти", nameIt: "Antipasti", nameEn: "Antipasti", nameFr: "Antipasti", nameZh: "开胃菜", sortOrder: 1 },
  ]).onConflictDoNothing().returning();
  const [primi] = await db.insert(menuCategoriesTable).values([
    { slug: "primi-piatti", nameRu: "Первые блюда", nameIt: "Primi Piatti", nameEn: "First Courses", nameFr: "Premiers plats", nameZh: "第一道菜", sortOrder: 2 },
  ]).onConflictDoNothing().returning();
  const [secondi] = await db.insert(menuCategoriesTable).values([
    { slug: "secondi-piatti", nameRu: "Вторые блюда", nameIt: "Secondi Piatti", nameEn: "Main Courses", nameFr: "Plats principaux", nameZh: "主菜", sortOrder: 3 },
  ]).onConflictDoNothing().returning();
  const [dolci] = await db.insert(menuCategoriesTable).values([
    { slug: "dolci", nameRu: "Десерты", nameIt: "Dolci", nameEn: "Desserts", nameFr: "Desserts", nameZh: "甜点", sortOrder: 4 },
  ]).onConflictDoNothing().returning();

  // Use existing cats if they were already seeded
  const allCats = await db.select().from(menuCategoriesTable);
  const ant = antipasti ?? allCats.find(c => c.slug === "antipasti");
  const pri = primi ?? allCats.find(c => c.slug === "primi-piatti");
  const sec = secondi ?? allCats.find(c => c.slug === "secondi-piatti");
  const dol = dolci ?? allCats.find(c => c.slug === "dolci");

  console.log("✓ Menu categories");

  // Dishes
  if (ant) {
    await db.insert(dishesTable).values([
      {
        categoryId: ant.id, nameRu: "Брускетта с томатами", nameIt: "Bruschetta al pomodoro", nameEn: "Bruschetta with tomatoes", nameFr: "Bruschetta aux tomates", nameZh: "番茄烤面包片",
        descRu: "Хрустящий хлеб, спелые томаты, базилик, оливковое масло", descIt: "Pane croccante, pomodori maturi, basilico, olio d'oliva", descEn: "Crispy bread, ripe tomatoes, basil, olive oil", descFr: "Pain croustillant, tomates mûres, basilic, huile d'olive", descZh: "脆面包片配成熟番茄、罗勒和橄榄油",
        price: "450", currency: "RUB", available: true, featured: false,
        imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80"
      },
      {
        categoryId: ant.id, nameRu: "Карпаччо из говядины", nameIt: "Carpaccio di manzo", nameEn: "Beef Carpaccio", nameFr: "Carpaccio de bœuf", nameZh: "牛肉薄片",
        descRu: "Тонко нарезанная говядина, руккола, пармезан, трюфельное масло", descIt: "Manzo tagliato finemente, rucola, parmigiano, olio al tartufo", descEn: "Thinly sliced beef, arugula, parmesan, truffle oil", descFr: "Bœuf tranché finement, roquette, parmesan, huile de truffe", descZh: "薄切牛肉配芝麻菜、帕尔玛干酪和松露油",
        price: "890", currency: "RUB", available: true, featured: true,
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80"
      },
      {
        categoryId: ant.id, nameRu: "Буррата с томатами", nameIt: "Burrata con pomodori", nameEn: "Burrata with tomatoes", nameFr: "Burrata aux tomates", nameZh: "布拉塔奶酪配番茄",
        descRu: "Свежая буррата, томаты чери, песто из базилика, оливковое масло первого отжима", descIt: "Burrata fresca, pomodorini, pesto al basilico, olio extra vergine", descEn: "Fresh burrata, cherry tomatoes, basil pesto, extra virgin olive oil", descFr: "Burrata fraîche, tomates cerises, pesto au basilic, huile d'olive vierge extra", descZh: "新鲜布拉塔奶酪、樱桃番茄、罗勒青酱、特级初榨橄榄油",
        price: "750", currency: "RUB", available: true, featured: false,
        imageUrl: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&q=80"
      },
    ]).onConflictDoNothing();
  }

  if (pri) {
    await db.insert(dishesTable).values([
      {
        categoryId: pri.id, nameRu: "Карбонара", nameIt: "Carbonara", nameEn: "Carbonara", nameFr: "Carbonara", nameZh: "卡波纳拉面",
        descRu: "Спагетти, гуанчале, яйцо, пекорино, чёрный перец — классический римский рецепт без сливок", descIt: "Spaghetti, guanciale, uovo, pecorino, pepe nero — ricetta romana classica senza panna", descEn: "Spaghetti, guanciale, egg, pecorino, black pepper — classic Roman recipe without cream", descFr: "Spaghetti, guanciale, œuf, pecorino, poivre noir — recette romaine classique sans crème", descZh: "意大利面、意大利咸肉、鸡蛋、佩科里诺干酪、黑胡椒——不加奶油的经典罗马食谱",
        price: "690", currency: "RUB", available: true, featured: true,
        imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80"
      },
      {
        categoryId: pri.id, nameRu: "Ризотто с белыми грибами", nameIt: "Risotto ai porcini", nameEn: "Porcini mushroom risotto", nameFr: "Risotto aux cèpes", nameZh: "牛肝菌烩饭",
        descRu: "Рис Арборио, белые грибы, пармезан, белое вино, сливочное масло", descIt: "Riso Arborio, porcini, parmigiano, vino bianco, burro", descEn: "Arborio rice, porcini mushrooms, parmesan, white wine, butter", descFr: "Riz Arborio, cèpes, parmesan, vin blanc, beurre", descZh: "阿波里奥米、牛肝菌、帕尔玛干酪、白葡萄酒、黄油",
        price: "820", currency: "RUB", available: true, featured: true,
        imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80"
      },
      {
        categoryId: pri.id, nameRu: "Паппарделле с кабаном", nameIt: "Pappardelle al cinghiale", nameEn: "Pappardelle with wild boar", nameFr: "Pappardelle au sanglier", nameZh: "野猪肉宽面条",
        descRu: "Широкая яичная паста, рагу из дикого кабана, красное вино, розмарин", descIt: "Pasta all'uovo larga, ragù di cinghiale, vino rosso, rosmarino", descEn: "Wide egg pasta, wild boar ragù, red wine, rosemary", descFr: "Pâtes larges aux œufs, ragù de sanglier, vin rouge, romarin", descZh: "宽鸡蛋面配野猪肉酱、红葡萄酒和迷迭香",
        price: "950", currency: "RUB", available: true, featured: false,
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80"
      },
      {
        categoryId: pri.id, nameRu: "Паста Путтанеска", nameIt: "Pasta alla puttanesca", nameEn: "Pasta Puttanesca", nameFr: "Pasta alla puttanesca", nameZh: "普塔内斯卡意面",
        descRu: "Спагетти, томаты, оливки, каперсы, анчоусы, чеснок, пеперончино", descIt: "Spaghetti, pomodori, olive, capperi, acciughe, aglio, peperoncino", descEn: "Spaghetti, tomatoes, olives, capers, anchovies, garlic, peperoncino", descFr: "Spaghetti, tomates, olives, câpres, anchois, ail, peperoncino", descZh: "意面、番茄、橄榄、刺山柑、凤尾鱼、大蒜、辣椒",
        price: "620", currency: "RUB", available: true, featured: false,
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80"
      },
    ]).onConflictDoNothing();
  }

  if (sec) {
    await db.insert(dishesTable).values([
      {
        categoryId: sec.id, nameRu: "Тальята из говядины", nameIt: "Tagliata di manzo", nameEn: "Beef tagliata", nameFr: "Tagliata de bœuf", nameZh: "意式牛排",
        descRu: "Говяжий стейк на гриле, руккола, пармезан, бальзамик", descIt: "Bistecca di manzo alla griglia, rucola, parmigiano, balsamico", descEn: "Grilled beef steak, arugula, parmesan, balsamic", descFr: "Steak de bœuf grillé, roquette, parmesan, balsamique", descZh: "烤牛排配芝麻菜、帕尔玛干酪和香醋",
        price: "1450", currency: "RUB", available: true, featured: true,
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80"
      },
      {
        categoryId: sec.id, nameRu: "Треска по-итальянски", nameIt: "Baccalà alla italiana", nameEn: "Italian-style cod", nameFr: "Morue à l'italienne", nameZh: "意式鳕鱼",
        descRu: "Треска, томаты, оливки, каперсы, свежие травы", descIt: "Baccalà, pomodori, olive, capperi, erbe fresche", descEn: "Cod, tomatoes, olives, capers, fresh herbs", descFr: "Morue, tomates, olives, câpres, herbes fraîches", descZh: "鳕鱼、番茄、橄榄、刺山柑、新鲜香草",
        price: "1200", currency: "RUB", available: true, featured: false,
        imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80"
      },
    ]).onConflictDoNothing();
  }

  if (dol) {
    await db.insert(dishesTable).values([
      {
        categoryId: dol.id, nameRu: "Тирамису", nameIt: "Tiramisù", nameEn: "Tiramisu", nameFr: "Tiramisu", nameZh: "提拉米苏",
        descRu: "Классический тирамису, маскарпоне, бисквит савоярди, эспрессо", descIt: "Tiramisù classico, mascarpone, savoiardi, espresso", descEn: "Classic tiramisu, mascarpone, savoiardi biscuits, espresso", descFr: "Tiramisu classique, mascarpone, boudoirs, espresso", descZh: "经典提拉米苏，马斯卡彭奶酪、手指饼干、浓缩咖啡",
        price: "480", currency: "RUB", available: true, featured: true,
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80"
      },
      {
        categoryId: dol.id, nameRu: "Панна Котта", nameIt: "Panna Cotta", nameEn: "Panna Cotta", nameFr: "Panna Cotta", nameZh: "意式奶冻",
        descRu: "Нежный сливочный десерт с ягодным соусом", descIt: "Delicato dessert alla panna con coulis di frutti di bosco", descEn: "Delicate cream dessert with berry coulis", descFr: "Délicat dessert à la crème avec coulis de fruits rouges", descZh: "细腻奶油甜点配浆果酱汁",
        price: "420", currency: "RUB", available: true, featured: false,
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80"
      },
    ]).onConflictDoNothing();
  }

  console.log("✓ Dishes");

  // Gallery photos
  await db.insert(galleryPhotosTable).values([
    { type: "interior", imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", captionRu: "Уютный интерьер", captionEn: "Cosy interior", sortOrder: 1 },
    { type: "interior", imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", captionRu: "Обеденный зал", captionEn: "Dining room", sortOrder: 2 },
    { type: "dishes", imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80", captionRu: "Карбонара", captionEn: "Carbonara", sortOrder: 3 },
    { type: "dishes", imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80", captionRu: "Ризотто", captionEn: "Risotto", sortOrder: 4 },
    { type: "dishes", imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80", captionRu: "Тирамису", captionEn: "Tiramisu", sortOrder: 5 },
    { type: "interior", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80", captionRu: "Барная стойка", captionEn: "Bar", sortOrder: 6 },
    { type: "events", imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80", captionRu: "Вечер живой музыки", captionEn: "Live music evening", sortOrder: 7 },
    { type: "daily", imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80", captionRu: "Шеф-повар за работой", captionEn: "Chef at work", sortOrder: 8 },
    { type: "dishes", imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80", captionRu: "Карпаччо", captionEn: "Carpaccio", sortOrder: 9 },
    { type: "interior", imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", captionRu: "Вечерний зал", captionEn: "Evening dining", sortOrder: 10 },
  ]).onConflictDoNothing();

  console.log("✓ Gallery photos");

  // Events
  await db.insert(eventsTable).values([
    {
      titleRu: "Вечер живой итальянской музыки", titleIt: "Serata di musica italiana dal vivo", titleEn: "Italian Live Music Evening", titleFr: "Soirée de musique italienne live", titleZh: "意大利现场音乐之夜",
      descRu: "Каждую пятницу в La Scarpetta звучит живая итальянская музыка. Приходите насладиться отличной едой и атмосферой настоящей Италии.", descEn: "Every Friday, La Scarpetta comes alive with Italian live music. Come enjoy great food and the atmosphere of real Italy.", descIt: "Ogni venerdì La Scarpetta si anima con musica italiana dal vivo. Venite a godere di ottimo cibo e dell'atmosfera dell'Italia vera.", descFr: "Chaque vendredi, La Scarpetta s'anime avec de la musique italienne live.", descZh: "每周五，La Scarpetta餐厅都有意大利现场音乐表演。",
      date: "2026-06-13", published: true,
      imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80"
    },
    {
      titleRu: "Дегустация вин из Тосканы", titleIt: "Degustazione di vini toscani", titleEn: "Tuscan Wine Tasting", titleFr: "Dégustation de vins toscans", titleZh: "托斯卡纳葡萄酒品鉴",
      descRu: "Специальный вечер с дегустацией вин из лучших виноделен Тосканы в сопровождении итальянских закусок.", descEn: "A special evening with a tasting of wines from the finest Tuscan wineries, accompanied by Italian appetizers.", descIt: "Una serata speciale con una degustazione di vini dalle migliori cantine toscane.", descFr: "Une soirée spéciale avec une dégustation de vins des meilleures caves toscanes.", descZh: "一个特别的晚上，品鉴来自托斯卡纳最佳酒庄的葡萄酒，搭配意大利小食。",
      date: "2026-06-20", published: true,
      imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80"
    },
    {
      titleRu: "Мастер-класс по приготовлению пасты", titleIt: "Masterclass sulla pasta", titleEn: "Pasta Making Masterclass", titleFr: "Masterclass sur les pâtes", titleZh: "意大利面制作大师班",
      descRu: "Шеф Марко приглашает вас на мастер-класс по приготовлению свежей итальянской пасты. Вы научитесь делать тесто и лепить тальолини своими руками.", descEn: "Chef Marco invites you to a fresh pasta making masterclass. You will learn to make pasta dough and shape tagliolini by hand.", descIt: "Lo chef Marco vi invita a un masterclass sulla pasta fresca. Imparerete a fare la sfoglia e a formare i tagliolini a mano.", descFr: "Le chef Marco vous invite à un masterclass de fabrication de pâtes fraîches.", descZh: "马可大厨邀请您参加新鲜意大利面制作大师班，学习手工制作面团和细意面。",
      date: "2026-07-05", published: true,
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
    },
  ]).onConflictDoNothing();

  console.log("✓ Events");

  // Reviews
  await db.insert(reviewsTable).values([
    { authorName: "Мария С.", rating: 5, text: "Лучшая карбонара в Москве! Без сливок, именно так, как должно быть. Атмосфера просто волшебная, чувствуешь себя в Риме.", approved: true, source: "Google", lang: "ru" },
    { authorName: "Alessandro B.", rating: 5, text: "Finalmente una vera carbonara a Mosca! Marco è un grande chef, la cucina è autentica. Ci tornerò di sicuro.", approved: true, source: "TripAdvisor", lang: "it" },
    { authorName: "James T.", rating: 5, text: "Absolutely incredible! The risotto with porcini was divine, and the staff made us feel like family. This is the real Italy in Moscow.", approved: true, source: "Google", lang: "en" },
    { authorName: "Анна К.", rating: 5, text: "Давно не ела такой вкусной пасты! Марко — настоящий итальянский шеф. Хожу сюда уже 3 года.", approved: true, source: "Yandex", lang: "ru" },
    { authorName: "Sophie M.", rating: 4, text: "Excellente cuisine italienne authentique. Le tiramisu était parfait. Ambiance chaleureuse et accueil irréprochable.", approved: true, source: "TripAdvisor", lang: "fr" },
    { authorName: "Дмитрий В.", rating: 5, text: "Отличный ресторан! Ценители итальянской кухни оценят. Порции большие, всё очень вкусно, персонал приветливый.", approved: true, source: "Google", lang: "ru" },
    { authorName: "李明", rating: 5, text: "非常棒的意大利餐厅！卡波纳拉面非常正宗，服务也很热情。推荐给所有喜欢意大利美食的朋友。", approved: true, source: "Google", lang: "zh" },
  ]).onConflictDoNothing();

  console.log("✓ Reviews");

  // Catering menus
  await db.insert(cateringMenusTable).values([
    {
      nameRu: "Классическое итальянское меню", nameIt: "Menu italiano classico", nameEn: "Classic Italian Menu", nameFr: "Menu italien classique", nameZh: "经典意大利菜单",
      descRu: "Антипасти, свежая паста, основные блюда, десерты. Идеально для корпоративных мероприятий и семейных торжеств.", descEn: "Antipasti, fresh pasta, main courses, desserts. Perfect for corporate events and family celebrations.", descIt: "Antipasti, pasta fresca, secondi, dolci. Ideale per eventi aziendali e feste di famiglia.", descFr: "Antipasti, pâtes fraîches, plats principaux, desserts. Idéal pour les événements d'entreprise.", descZh: "开胃菜、新鲜意面、主菜、甜点。非常适合公司活动和家庭庆典。",
      pricePerPerson: "3500", currency: "RUB", minGuests: 20, maxGuests: 200, active: true,
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
    },
    {
      nameRu: "Фуршет в итальянском стиле", nameIt: "Buffet all'italiana", nameEn: "Italian-Style Buffet", nameFr: "Buffet à l'italienne", nameZh: "意大利风格自助餐",
      descRu: "Лёгкий фуршет с итальянскими закусками, мини-сэндвичами, брускеттами и десертами.", descEn: "Light buffet with Italian appetizers, mini sandwiches, bruschetta and desserts.", descIt: "Buffet leggero con antipasti italiani, mini tramezzini, bruschette e dolci.", descFr: "Buffet léger avec antipasti italiens, mini sandwichs, bruschettas et desserts.", descZh: "轻型自助餐，配意大利开胃菜、迷你三明治、烤面包片和甜点。",
      pricePerPerson: "2200", currency: "RUB", minGuests: 30, maxGuests: 300, active: true,
      imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80"
    },
    {
      nameRu: "Банкет Premium", nameIt: "Banchetto Premium", nameEn: "Premium Banquet", nameFr: "Banquet Premium", nameZh: "高级宴会套餐",
      descRu: "Полный банкет с несколькими сменами блюд: антипасти, первые и вторые блюда из premium продуктов, сыры, десерты.", descEn: "Full banquet with multiple courses: antipasti, first and main courses with premium ingredients, cheeses, desserts.", descIt: "Banchetto completo con più portate: antipasti, primi e secondi con ingredienti premium, formaggi, dolci.", descFr: "Banquet complet avec plusieurs services: antipasti, premiers et plats principaux avec ingrédients premium, fromages, desserts.", descZh: "全套宴会，多道菜服务：开胃菜、使用优质食材的头盘和主菜、奶酪、甜点。",
      pricePerPerson: "5500", currency: "RUB", minGuests: 20, maxGuests: 100, active: true,
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
    },
  ]).onConflictDoNothing();

  console.log("✓ Catering menus");
  console.log("\n✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
