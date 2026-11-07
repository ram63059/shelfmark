/**
 * Dictionaries used by the scoring checks.
 *
 * All sets are lowercase for case-insensitive matching.
 */

// ---------------------------------------------------------------------------
// Product nouns — what the product IS
// ---------------------------------------------------------------------------

export const PRODUCT_NOUNS: ReadonlySet<string> = new Set([
  // Apparel
  "shirt", "t-shirt", "tee", "polo", "blouse", "top", "tank", "camisole",
  "sweater", "sweatshirt", "hoodie", "cardigan", "pullover", "vest",
  "jacket", "coat", "blazer", "parka", "windbreaker", "anorak",
  "pants", "trousers", "jeans", "shorts", "skirt", "dress", "gown",
  "leggings", "joggers", "chinos", "overalls", "jumpsuit", "romper",
  "underwear", "boxers", "briefs", "bra", "lingerie", "socks", "stockings",
  "hat", "cap", "beanie", "headband", "scarf", "gloves", "mittens", "belt",
  "tie", "bow-tie", "suspenders", "robe", "pajamas", "swimsuit", "bikini",
  "trunks", "wetsuit", "uniform", "costume", "apron",

  // Footwear
  "shoe", "shoes", "sneaker", "sneakers", "boot", "boots", "sandal", "sandals",
  "slipper", "slippers", "loafer", "loafers", "heel", "heels", "flat", "flats",
  "moccasin", "moccasins", "clog", "clogs", "flip-flop", "flip-flops",

  // Accessories
  "bag", "handbag", "purse", "tote", "clutch", "backpack", "wallet",
  "watch", "bracelet", "necklace", "ring", "earring", "earrings",
  "pendant", "brooch", "anklet", "cufflinks", "sunglasses", "glasses",
  "keychain", "lanyard", "badge",

  // Electronics
  "phone", "smartphone", "tablet", "laptop", "computer", "desktop",
  "monitor", "display", "screen", "keyboard", "mouse", "trackpad",
  "speaker", "headphone", "headphones", "earbuds", "earphone", "earphones",
  "microphone", "webcam", "camera", "charger", "cable", "adapter",
  "hub", "dock", "router", "modem", "controller", "remote", "drone",
  "printer", "scanner", "projector", "console", "smartwatch",

  // Home & Kitchen
  "table", "desk", "chair", "stool", "bench", "sofa", "couch", "loveseat",
  "bed", "mattress", "pillow", "cushion", "blanket", "throw", "duvet",
  "comforter", "sheet", "sheets", "towel", "curtain", "curtains",
  "rug", "carpet", "mat", "lamp", "light", "chandelier", "fixture",
  "mirror", "shelf", "shelves", "bookcase", "cabinet", "drawer", "dresser",
  "wardrobe", "rack", "hanger", "basket", "bin", "organizer",
  "vase", "planter", "pot", "pan", "skillet", "wok", "saucepan",
  "oven", "toaster", "blender", "mixer", "grinder", "juicer",
  "kettle", "coffeemaker", "coffee-maker", "mug", "cup", "glass",
  "plate", "bowl", "tray", "utensil", "fork", "spoon", "knife",
  "cutting-board", "container", "jar", "bottle", "thermos", "tumbler",
  "candle", "diffuser", "frame", "clock", "coaster",

  // Beauty & Health
  "cream", "lotion", "serum", "moisturizer", "cleanser", "toner",
  "mask", "scrub", "oil", "balm", "lipstick", "lip-gloss", "foundation",
  "concealer", "primer", "powder", "blush", "bronzer", "highlighter",
  "mascara", "eyeliner", "eyeshadow", "palette", "brush", "sponge",
  "perfume", "cologne", "fragrance", "deodorant", "shampoo", "conditioner",
  "soap", "body-wash", "sunscreen", "supplement", "vitamin", "vitamins",
  "toothbrush", "toothpaste", "floss", "razor", "trimmer",

  // Sports & Outdoors
  "ball", "bat", "racket", "racquet", "net", "goal", "hoop",
  "helmet", "pad", "guard", "protector", "goggles", "harness",
  "tent", "sleeping-bag", "backpack", "cooler", "grill", "hammock",
  "bicycle", "bike", "scooter", "skateboard", "surfboard", "paddleboard",
  "kayak", "canoe", "ski", "snowboard", "weights", "dumbbell", "barbell",
  "kettlebell", "band", "mat", "roller", "jump-rope",

  // Toys & Games
  "toy", "game", "puzzle", "board-game", "card-game", "figurine",
  "doll", "plush", "stuffed-animal", "lego", "block", "blocks",
  "playset", "action-figure",

  // Food & Drink
  "snack", "bar", "chocolate", "candy", "gummy", "cookie", "biscuit",
  "chip", "chips", "cracker", "nut", "nuts", "mix", "granola",
  "tea", "coffee", "cocoa", "juice", "soda", "water", "wine", "beer",
  "spirits", "sauce", "syrup", "honey", "jam", "jelly", "spread",
  "seasoning", "spice", "herb", "powder", "flour", "sugar", "salt",
  "vinegar", "dressing", "marinade",

  // Stationery & Office
  "pen", "pencil", "marker", "highlighter", "notebook", "journal",
  "planner", "calendar", "folder", "binder", "envelope", "stamp",
  "tape", "stapler", "scissors", "eraser", "ruler", "paper",
  "sticker", "stickers", "label", "labels", "card", "cards",
  "poster", "print", "artwork", "canvas",

  // Pet
  "leash", "collar", "harness", "pet-bed", "pet-bowl", "pet-toy",
  "treat", "treats", "kibble", "litter", "aquarium", "terrarium",
  "cage", "crate",

  // Automotive
  "tire", "wheel", "bumper", "fender", "hood", "spoiler", "grille",
  "headlight", "taillight", "mirror", "wiper", "antenna",
  "seat-cover", "floor-mat", "car-charger",

  // Generic
  "kit", "set", "pack", "bundle", "case", "cover", "sleeve",
  "stand", "mount", "holder", "clip", "hook", "strap", "wrap",
  "tool", "gadget", "device", "accessory", "attachment", "replacement",
  "refill", "cartridge", "filter", "insert", "pad",
]);

// ---------------------------------------------------------------------------
// Descriptive attributes — material, color, size, audience, type modifiers
// ---------------------------------------------------------------------------

export const ATTRIBUTE_WORDS: ReadonlySet<string> = new Set([
  // Materials
  "cotton", "polyester", "nylon", "silk", "linen", "wool", "cashmere",
  "leather", "suede", "denim", "canvas", "mesh", "fleece", "velvet",
  "satin", "chiffon", "lace", "tweed", "corduroy", "bamboo", "hemp",
  "organic", "recycled", "synthetic", "stainless", "steel", "aluminum",
  "aluminium", "titanium", "copper", "brass", "bronze", "iron",
  "ceramic", "porcelain", "glass", "crystal", "wood", "wooden", "oak",
  "maple", "walnut", "pine", "birch", "teak", "mahogany", "bamboo",
  "plastic", "acrylic", "silicone", "rubber", "latex", "foam",
  "carbon-fiber", "fiberglass", "marble", "granite", "concrete", "stone",

  // Colors
  "red", "blue", "green", "yellow", "orange", "purple", "pink",
  "black", "white", "gray", "grey", "brown", "beige", "tan", "ivory",
  "cream", "gold", "silver", "navy", "teal", "turquoise", "coral",
  "magenta", "maroon", "burgundy", "olive", "charcoal", "indigo",
  "lavender", "mint", "sage", "peach", "rust", "sand", "slate",
  "multi-color", "multicolor", "clear", "transparent",

  // Sizes & dimensions
  "small", "medium", "large", "xl", "xxl", "xs", "xxs",
  "mini", "petite", "slim", "regular", "plus-size", "oversized",
  "tall", "short", "long", "wide", "narrow", "compact", "full-size",
  "king", "queen", "twin", "single", "double", "standard",

  // Audience / use-case
  "men", "mens", "men's", "women", "womens", "women's",
  "unisex", "kids", "children", "children's", "baby", "infant",
  "toddler", "teen", "youth", "adult", "senior", "maternity",
  "professional", "industrial", "commercial", "residential",
  "indoor", "outdoor", "travel", "portable", "waterproof",
  "water-resistant", "wireless", "bluetooth", "rechargeable",
  "adjustable", "foldable", "collapsible", "ergonomic",
  "lightweight", "heavy-duty", "premium", "deluxe", "luxury",
  "budget", "eco-friendly", "vegan", "cruelty-free", "natural",
  "hypoallergenic", "non-toxic", "bpa-free", "gluten-free",

  // Style / type modifiers
  "vintage", "retro", "modern", "contemporary", "classic",
  "minimalist", "boho", "bohemian", "rustic", "farmhouse",
  "industrial", "mid-century", "traditional", "casual", "formal",
  "athletic", "sporty", "dressy", "everyday", "limited-edition",
]);

// ---------------------------------------------------------------------------
// Promotional / filler words — flag when description is mostly fluff
// ---------------------------------------------------------------------------

export const PROMOTIONAL_WORDS: ReadonlySet<string> = new Set([
  "amazing", "awesome", "best", "bestselling", "best-selling",
  "breathtaking", "brilliant", "cutting-edge", "exclusive",
  "extraordinary", "fabulous", "fantastic", "game-changer",
  "gorgeous", "groundbreaking", "guaranteed", "incredible",
  "innovative", "jaw-dropping", "life-changing", "luxury",
  "magnificent", "marvelous", "mind-blowing", "must-have",
  "one-of-a-kind", "outstanding", "perfect", "phenomenal",
  "premium", "revolutionary", "sensational", "show-stopping",
  "spectacular", "stunning", "superb", "superior", "supreme",
  "top-notch", "top-quality", "ultimate", "unbeatable",
  "unbelievable", "unique", "unmatched", "unparalleled",
  "wonderful", "world-class", "wow",
  // Action fluff
  "buy-now", "don't-miss", "grab", "hurry", "limited-time",
  "order-now", "rush", "sale", "shop-now", "act-now", "act-fast",
]);

// ---------------------------------------------------------------------------
// Spec / key-detail keywords — signal concrete product information
// ---------------------------------------------------------------------------

export const SPEC_KEYWORDS: ReadonlySet<string> = new Set([
  // Material
  "material", "materials", "fabric", "composition", "made-from",
  "made-of", "constructed", "crafted", "woven", "knit", "knitted",

  // Dimensions / size
  "dimension", "dimensions", "size", "sizes", "sizing",
  "length", "width", "height", "depth", "diameter", "radius",
  "thickness", "volume", "capacity", "oz", "ounce", "ounces",
  "ml", "liter", "litre", "gallon", "quart", "pint", "cup",
  "inch", "inches", "foot", "feet", "cm", "centimeter", "centimetre",
  "mm", "millimeter", "millimetre", "meter", "metre",

  // Weight
  "weight", "weighs", "lb", "lbs", "pound", "pounds",
  "kg", "kilogram", "gram", "grams", "oz",

  // Ingredients / composition
  "ingredient", "ingredients", "contains", "formula", "formulation",
  "blend", "extract", "infused", "enriched", "fortified",

  // Compatibility
  "compatible", "compatibility", "fits", "works-with",
  "designed-for", "suitable-for", "supports",

  // Care instructions
  "care", "wash", "washable", "machine-wash", "hand-wash",
  "dry-clean", "tumble-dry", "iron", "bleach", "do-not-bleach",

  // Use case / specs
  "watt", "watts", "wattage", "volt", "voltage", "amp", "ampere",
  "mah", "battery", "runtime", "speed", "rpm", "psi",
  "resolution", "megapixel", "pixel", "fps", "hz", "hertz",
  "lumens", "kelvin", "decibel", "db",
  "waterproof", "water-resistant", "ip67", "ip68", "ipx4",
  "rating", "rated", "certified", "certification",
  "warranty", "guarantee", "lifespan", "shelf-life",
  "temperature", "range", "operating",
]);

// ---------------------------------------------------------------------------
// Generic / placeholder option names — signal lazy defaults
// ---------------------------------------------------------------------------

export const GENERIC_OPTION_NAMES: ReadonlySet<string> = new Set([
  "title",
  "option1",
  "option 1",
  "option2",
  "option 2",
  "option3",
  "option 3",
  "default",
  "default title",
]);

// ---------------------------------------------------------------------------
// Generic / meaningless tags
// ---------------------------------------------------------------------------

export const GENERIC_TAGS: ReadonlySet<string> = new Set([
  "new", "sale", "featured", "best-seller", "bestseller",
  "hot", "trending", "popular", "other", "general", "misc",
  "default", "uncategorized", "none", "",
]);
