/* Treat Yourself — preset treat library.
 *
 * `sugar` is approximate grams of sugar in one typical serving.
 * Numbers are rounded, public nutrition-label averages — close enough to be
 * useful, not precise enough for anything clinical.
 */

const TREATS = [
  // ---------- Baked ----------
  { name: "Chocolate chip cookie", emoji: "🍪", sugar: 10, cat: "Baked", serving: "1 medium" },
  { name: "Brownie",               emoji: "🟫", sugar: 20, cat: "Baked", serving: "1 square" },
  { name: "Glazed donut",          emoji: "🍩", sugar: 12, cat: "Baked", serving: "1 donut" },
  { name: "Jelly donut",           emoji: "🍩", sugar: 14, cat: "Baked", serving: "1 donut" },
  { name: "Cupcake with frosting", emoji: "🧁", sugar: 22, cat: "Baked", serving: "1 cupcake" },
  { name: "Cinnamon roll",         emoji: "🌀", sugar: 24, cat: "Baked", serving: "1 roll" },
  { name: "Birthday cake slice",   emoji: "🎂", sugar: 30, cat: "Baked", serving: "1 slice" },
  { name: "Cheesecake slice",      emoji: "🍰", sugar: 28, cat: "Baked", serving: "1 slice" },
  { name: "Tiramisu",              emoji: "🥄", sugar: 20, cat: "Baked", serving: "1 portion" },
  { name: "Croissant",             emoji: "🥐", sugar: 6,  cat: "Baked", serving: "1 plain" },
  { name: "Pain au chocolat",      emoji: "🥐", sugar: 10, cat: "Baked", serving: "1 pastry" },
  { name: "Macaron",               emoji: "🩷", sugar: 6,  cat: "Baked", serving: "1 macaron" },
  { name: "Churro",                emoji: "🥖", sugar: 11, cat: "Baked", serving: "1 churro" },
  { name: "Mochi",                 emoji: "🍡", sugar: 8,  cat: "Baked", serving: "1 piece" },
  { name: "Banana bread slice",    emoji: "🍞", sugar: 16, cat: "Baked", serving: "1 slice" },

  // ---------- Candy ----------
  { name: "Milk chocolate bar",    emoji: "🍫", sugar: 24, cat: "Candy", serving: "1.5 oz bar" },
  { name: "Dark chocolate square", emoji: "🍫", sugar: 5,  cat: "Candy", serving: "1 square" },
  { name: "Gummy bears",           emoji: "🐻", sugar: 31, cat: "Candy", serving: "small handful" },
  { name: "Sour candy",            emoji: "😝", sugar: 28, cat: "Candy", serving: "1 small pack" },
  { name: "M&M's",                 emoji: "🔴", sugar: 10, cat: "Candy", serving: "fun size" },
  { name: "Skittles",              emoji: "🌈", sugar: 11, cat: "Candy", serving: "fun size" },
  { name: "Starburst",             emoji: "⭐", sugar: 11, cat: "Candy", serving: "4 pieces" },
  { name: "Lollipop",              emoji: "🍭", sugar: 6,  cat: "Candy", serving: "1 pop" },
  { name: "Caramel chew",          emoji: "🟤", sugar: 5,  cat: "Candy", serving: "1 piece" },
  { name: "Marshmallow",           emoji: "☁️", sugar: 4,  cat: "Candy", serving: "1 large" },
  { name: "Candy apple",           emoji: "🍎", sugar: 40, cat: "Candy", serving: "1 apple" },
  { name: "Pocky",                 emoji: "🥢", sugar: 7,  cat: "Candy", serving: "5 sticks" },

  // ---------- Frozen ----------
  { name: "Ice cream scoop",       emoji: "🍨", sugar: 14, cat: "Frozen", serving: "1 scoop" },
  { name: "Ice cream cone",        emoji: "🍦", sugar: 22, cat: "Frozen", serving: "1 cone" },
  { name: "Frozen yogurt",         emoji: "🍧", sugar: 24, cat: "Frozen", serving: "small cup" },
  { name: "Milkshake",             emoji: "🥤", sugar: 45, cat: "Frozen", serving: "small" },
  { name: "Popsicle",              emoji: "🧊", sugar: 11, cat: "Frozen", serving: "1 bar" },
  { name: "Ice cream sandwich",    emoji: "🥪", sugar: 15, cat: "Frozen", serving: "1 sandwich" },

  // ---------- Drinks ----------
  { name: "Boba milk tea",         emoji: "🧋", sugar: 38, cat: "Drinks", serving: "16 oz" },
  { name: "Soda",                  emoji: "🥤", sugar: 39, cat: "Drinks", serving: "12 oz can" },
  { name: "Lemonade",              emoji: "🍋", sugar: 30, cat: "Drinks", serving: "12 oz" },
  { name: "Frappuccino",           emoji: "☕", sugar: 50, cat: "Drinks", serving: "grande" },
  { name: "Vanilla latte",         emoji: "☕", sugar: 20, cat: "Drinks", serving: "grande" },
  { name: "Hot chocolate",         emoji: "🍫", sugar: 24, cat: "Drinks", serving: "12 oz" },
  { name: "Energy drink",          emoji: "⚡", sugar: 27, cat: "Drinks", serving: "12 oz" },
  { name: "Orange juice",          emoji: "🧃", sugar: 21, cat: "Drinks", serving: "8 oz" },
  { name: "Sweet iced tea",        emoji: "🧊", sugar: 24, cat: "Drinks", serving: "12 oz" },

  // ---------- Snacks ----------
  { name: "Granola bar",           emoji: "🌾", sugar: 12, cat: "Snacks", serving: "1 bar" },
  { name: "Flavored yogurt",       emoji: "🥛", sugar: 17, cat: "Snacks", serving: "1 cup" },
  { name: "Pop-Tart",              emoji: "🍓", sugar: 16, cat: "Snacks", serving: "1 pastry" },
  { name: "Frosted cereal",        emoji: "🥣", sugar: 12, cat: "Snacks", serving: "1 bowl" },
  { name: "Rice krispie treat",    emoji: "🍚", sugar: 8,  cat: "Snacks", serving: "1 bar" },
  { name: "Honey",                 emoji: "🍯", sugar: 17, cat: "Snacks", serving: "1 tbsp" },
  { name: "Trail mix",             emoji: "🥜", sugar: 10, cat: "Snacks", serving: "1/3 cup" },

  // ---------- Fruit ----------
  { name: "Apple",                 emoji: "🍎", sugar: 19, cat: "Fruit", serving: "1 medium" },
  { name: "Banana",                emoji: "🍌", sugar: 14, cat: "Fruit", serving: "1 medium" },
  { name: "Strawberries",          emoji: "🍓", sugar: 7,  cat: "Fruit", serving: "1 cup" },
  { name: "Grapes",                emoji: "🍇", sugar: 15, cat: "Fruit", serving: "1 cup" },
  { name: "Mango",                 emoji: "🥭", sugar: 23, cat: "Fruit", serving: "1 cup" },
  { name: "Watermelon",            emoji: "🍉", sugar: 9,  cat: "Fruit", serving: "1 cup" },
];

const CATEGORY_ORDER = ["All", "Baked", "Candy", "Frozen", "Drinks", "Snacks", "Fruit", "Yours"];
