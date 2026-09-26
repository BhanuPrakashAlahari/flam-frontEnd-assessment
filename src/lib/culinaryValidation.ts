/**
 * Comprehensive culinary dictionary containing food ingredients,
 * pantry staples, proteins, produce, dairy, grains, seasonings, and dishes.
 */
export const CULINARY_LEXICON: string[] = [
  // Dairy & Dairy Alternatives
  'egg', 'eggs', 'egg yolk', 'egg white', 'cheese', 'cheddar', 'mozzarella', 'parmesan', 'feta', 
  'ricotta', 'brie', 'gouda', 'paneer', 'milk', 'cream', 'heavy cream', 'sour cream', 'butter', 
  'ghee', 'yogurt', 'curd', 'dahi', 'tofu', 'tempeh', 'mayo', 'mayonnaise', 'cottage cheese', 'provolone',
  'mascarpone', 'almond milk', 'oat milk', 'soy milk', 'coconut milk', 'buttermilk', 'chaas', 'lassi',
  'malai', 'khoa', 'mawa', 'condensed milk', 'halloumi', 'swiss cheese', 'goat cheese',

  // Poultry, Meat, Seafood & Plant Proteins
  'chicken', 'chicken breast', 'chicken thigh', 'chicken drumstick', 'wings', 'meat', 'beef', 'steak', 'ground beef', 
  'pork', 'bacon', 'ham', 'sausage', 'chorizo', 'turkey', 'lamb', 'mutton', 'duck', 'fish', 
  'salmon', 'tuna', 'cod', 'tilapia', 'trout', 'halibut', 'shrimp', 'prawn', 'prawns', 'crab', 
  'lobster', 'squid', 'calamari', 'clam', 'clams', 'mussel', 'mussels', 'anchovy', 'anchovies', 
  'sardine', 'sardines', 'seitan', 'scallop', 'scallops', 'octopus', 'soya', 'soya chunks', 'nutrela',
  'keema', 'mince', 'ground meat',

  // Grains, Pasta, Bakery & Starches
  'rice', 'jasmine rice', 'basmati', 'brown rice', 'white rice', 'poha', 'puffed rice', 'murmura',
  'pasta', 'spaghetti', 'penne', 'macaroni', 'fettuccine', 'linguine', 'lasagna', 'fusilli', 'rotini',
  'noodle', 'noodles', 'ramen', 'udon', 'soba', 'vermicelli', 'maggi', 'chow mein', 'hakka',
  'bread', 'sourdough', 'baguette', 'pita', 'naan', 'roti', 'chapati', 'paratha', 'puri', 'poori',
  'bhatura', 'kulcha', 'tortilla', 'taco', 'wrap', 'oats', 'oatmeal', 'rolled oats',
  'flour', 'all purpose flour', 'wheat flour', 'atta', 'maida', 'besan', 'gram flour', 'cornstarch', 
  'corn flour', 'quinoa', 'couscous', 'barley', 'cereal', 'toast', 'polenta', 'semolina', 'sooji', 'rava',
  'pancake', 'waffle', 'crepe', 'croissant', 'bagel', 'bun', 'buns', 'dosa', 'idli', 'upma', 'khichdi',

  // Legumes & Beans
  'bean', 'beans', 'black beans', 'kidney beans', 'rajma', 'chickpea', 'chickpeas', 'chana', 'garbanzo', 
  'lentil', 'lentils', 'dal', 'dhal', 'daal', 'toor dal', 'moong dal', 'urad dal', 'masoor dal',
  'peas', 'green peas', 'edamame', 'soy', 'soybeans', 'pinto beans', 'cannellini',

  // Vegetables & Produce
  'spinach', 'palak', 'methi', 'fenugreek', 'kale', 'lettuce', 'cabbage', 'arugula', 'bok choy', 'greens', 
  'garlic', 'garlic clove', 'onion', 'onions', 'shallot', 'shallots', 'scallion', 'scallions', 'green onion', 
  'leek', 'leeks', 'chives', 'tomato', 'tomatoes', 'potato', 'potatoes', 'aloo', 'sweet potato', 
  'carrot', 'carrots', 'celery', 'pepper', 'peppers', 'bell pepper', 'capsicum', 'chili', 'chilli', 
  'green chili', 'red chili', 'jalapeno', 'habanero', 'mushroom', 'mushrooms', 'broccoli', 'cauliflower', 
  'gobi', 'zucchini', 'courgette', 'cucumber', 'eggplant', 'aubergine', 'brinjal', 'baingan', 'bhindi', 
  'okra', 'ladyfinger', 'squash', 'pumpkin', 'lauki', 'bottle gourd', 'karela', 'bitter gourd',
  'asparagus', 'corn', 'sweet corn', 'baby corn', 'artichoke', 'radish', 'mooli', 'beet', 'beetroot', 
  'ginger', 'adrak', 'avocado', 'olive', 'olives', 'green beans', 'yam', 'drumstick', 'coriander leaves',
  'mint leaves', 'curry leaves', 'cilantro', 'pudina', 'dhania', 'spring onion',

  // Fruits
  'lemon', 'lime', 'orange', 'apple', 'banana', 'berry', 'berries', 'strawberry', 'blueberry', 
  'raspberry', 'blackberry', 'mango', 'pineapple', 'grape', 'grapes', 'peach', 'plum', 'pear', 
  'coconut', 'fig', 'date', 'dates', 'raisin', 'raisins', 'pomegranate', 'watermelon', 'melon', 'cherry',
  'papaya', 'guava', 'kiwi',

  // Seasonings, Spices, Oils & Condiments
  'oil', 'olive oil', 'sesame oil', 'canola oil', 'vegetable oil', 'coconut oil', 'avocado oil', 'mustard oil',
  'salt', 'sea salt', 'black pepper', 'sugar', 'brown sugar', 'jaggery', 'honey', 'maple syrup', 'soy sauce', 
  'tamari', 'fish sauce', 'oyster sauce', 'vinegar', 'balsamic', 'apple cider vinegar', 'sauce', 
  'tomato sauce', 'tomato paste', 'marinara', 'pesto', 'ketchup', 'mustard', 'sriracha', 'hot sauce', 
  'turmeric', 'haldi', 'cumin', 'jeera', 'coriander', 'dhania powder', 'paprika', 'chili powder', 'cayenne', 
  'curry', 'curry powder', 'masala', 'garam masala', 'chaat masala', 'sambhar', 'sambar', 'rasam', 
  'cinnamon', 'nutmeg', 'cardamom', 'elaichi', 'clove', 'cloves', 'laung', 'oregano', 'basil', 
  'parsley', 'thyme', 'rosemary', 'dill', 'mint', 'bay leaf', 'tez patta', 'sesame', 'sesame seeds', 'til',
  'hing', 'asafoetida', 'tamarind', 'amchur', 'kasuri methi', 'mustard seeds', 'rai',

  // Nuts & Seeds
  'nut', 'nuts', 'almond', 'almonds', 'badam', 'walnut', 'walnuts', 'akhrot', 'cashew', 'cashews', 'kaju', 
  'peanut', 'peanuts', 'pecan', 'pecans', 'pistachio', 'pista', 'chia', 'flax', 'sunflower seeds', 'pumpkin seeds',

  // Cooking Dishes, Verbs & Meal Concepts
  'cook', 'cooking', 'bake', 'baking', 'fry', 'frying', 'sauté', 'saute', 'roast', 'roasting', 
  'grill', 'grilling', 'boil', 'boiling', 'simmer', 'steam', 'recipe', 'meal', 'dish', 'food', 
  'breakfast', 'lunch', 'dinner', 'snack', 'soup', 'salad', 'stew', 'curry', 'skillet', 
  'casserole', 'omelet', 'omelette', 'frittata', 'stir fry', 'stirfry', 'sandwich', 'burger', 'taco', 
  'burrito', 'pizza', 'biryani', 'pulao', 'fried rice', 'gravy', 'smoothie', 'shake', 'beverage',
  'fridge', 'pantry', 'leftover', 'leftovers', 'ingredient', 'ingredients', 'broth', 'stock',
  'spicy', 'crispy', 'healthy', 'protein', 'vegan', 'vegetarian', 'keto', 'low carb', 'delicious'
];

export const NON_CULINARY_INDICATORS = [
  'python', 'javascript', 'typescript', 'java', 'c++', 'golang', 'rust', 'ruby', 'php', 'sql',
  'code', 'coding', 'terminal', 'compile', 'react', 'css', 'html', 'git', 'github', 'bug', 'debug', 
  'function', 'class', 'president', 'prime minister', 'election', 'politics', 'football', 'soccer', 
  'cricket match', 'nba score', 'iphone 15', 'iphone 16', 'android update', 'battery health', 
  'laptop repair', 'windows 11', 'macbook pro', 'engine repair', 'mechanic', 'crypto', 'bitcoin', 
  'stock market', 'shares trading', 'derivative calculus', 'weather forecast tomorrow', 
  'write a poem', 'solve homework', 'machine learning algorithm', 'playstation 5', 'xbox series'
];

export interface CulinaryValidationResult {
  isValid: boolean;
  reason?: string;
}

function matchesWordBoundary(text: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
  return regex.test(text);
}

/**
 * Strictly verifies whether the input string contains valid culinary or ingredient information.
 */
export function validateCulinaryInput(input: string): CulinaryValidationResult {
  const clean = input.toLowerCase().trim();

  // 1. Length check
  if (!clean || clean.length < 2) {
    return {
      isValid: false,
      reason: 'Please enter at least one ingredient (e.g. eggs, spinach, garlic).',
    };
  }

  // 2. Pure numbers or special symbols check (e.g. "123456", "!@#$%^")
  if (/^[0-9\s.,!@#$%^&*()_+\-=[\]{};':"\\|<>/?]+$/.test(clean)) {
    return {
      isValid: false,
      reason: 'Numbers or symbols alone are not valid ingredients. Please enter real food items.',
    };
  }

  // 3. Repeated character mash (e.g. "aaaaaaa", "zzzzzz")
  if (/([a-z])\1{4,}/.test(clean)) {
    return {
      isValid: false,
      reason: 'Repeated character keyboard mash detected. Please enter real food ingredients.',
    };
  }

  // 4. Consonant mash check (words with 5+ consonants and no vowels like "asdfghjk", "sdfghjk")
  const words = clean.split(/[\s,;+]+/);
  const isVowellessMash = words.some((w) => w.length >= 5 && !/[aeiouy]/.test(w));
  if (isVowellessMash) {
    return {
      isValid: false,
      reason: 'Unrecognized keyboard mash detected. Please enter cooking ingredients.',
    };
  }

  // 5. Explicit non-food domain check (e.g. coding, automotive, sports, politics)
  const containsNonFood = NON_CULINARY_INDICATORS.some((term) => matchesWordBoundary(clean, term));
  if (containsNonFood) {
    return {
      isValid: false,
      reason: 'This application only generates recipes for food ingredients and culinary requests.',
    };
  }

  // 6. Food match check
  const hasFoodKeyword = CULINARY_LEXICON.some((keyword) => matchesWordBoundary(clean, keyword));

  // If input contains at least 3 normal alphabetic letters and no non-food indicator, let it pass
  if (!hasFoodKeyword && clean.length > 25) {
    // Longer natural descriptions are allowed through to the intelligent generator
    return { isValid: true };
  }

  if (!hasFoodKeyword && clean.length <= 25) {
    // Check if any word has reasonable culinary context
    const hasPlausibleIngredient = words.some((w) => w.length >= 3 && /[aeiouy]/.test(w));
    if (!hasPlausibleIngredient) {
      return {
        isValid: false,
        reason: 'No recognized food or kitchen ingredients found. Please enter items like eggs, pasta, garlic, cheese, or chicken.',
      };
    }
  }

  return { isValid: true };
}

