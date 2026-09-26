/**
 * Comprehensive culinary dictionary containing food ingredients,
 * pantry staples, proteins, produce, dairy, grains, seasonings, and dishes.
 */
export const CULINARY_LEXICON: string[] = [
  // Dairy & Dairy Alternatives
  'egg', 'eggs', 'egg yolk', 'egg white', 'cheese', 'cheddar', 'mozzarella', 'parmesan', 'feta', 
  'ricotta', 'brie', 'gouda', 'paneer', 'milk', 'cream', 'heavy cream', 'sour cream', 'butter', 
  'ghee', 'yogurt', 'curd', 'tofu', 'tempeh', 'mayo', 'mayonnaise', 'cottage cheese', 'provolone',
  'mascarpone', 'almond milk', 'oat milk', 'soy milk', 'coconut milk', 'buttermilk',

  // Poultry, Meat, Seafood & Plant Proteins
  'chicken', 'chicken breast', 'chicken thigh', 'wings', 'meat', 'beef', 'steak', 'ground beef', 
  'pork', 'bacon', 'ham', 'sausage', 'chorizo', 'turkey', 'lamb', 'mutton', 'duck', 'fish', 
  'salmon', 'tuna', 'cod', 'tilapia', 'trout', 'halibut', 'shrimp', 'prawn', 'prawns', 'crab', 
  'lobster', 'squid', 'calamari', 'clam', 'clams', 'mussel', 'mussels', 'anchovy', 'anchovies', 
  'sardine', 'sardines', 'seitan', 'scallop', 'scallops', 'octopus',

  // Grains, Pasta, Bakery & Starches
  'rice', 'jasmine rice', 'basmati', 'brown rice', 'pasta', 'spaghetti', 'penne', 'macaroni', 
  'fettuccine', 'linguine', 'lasagna', 'noodle', 'noodles', 'ramen', 'udon', 'soba', 'vermicelli', 
  'bread', 'sourdough', 'baguette', 'pita', 'naan', 'tortilla', 'wrap', 'oats', 'oatmeal', 
  'flour', 'cornstarch', 'quinoa', 'couscous', 'barley', 'cereal', 'toast', 'polenta', 'semolina',
  'pancake', 'waffle', 'crepe', 'croissant',

  // Legumes & Beans
  'bean', 'beans', 'black beans', 'kidney beans', 'chickpea', 'chickpeas', 'garbanzo', 'lentil', 
  'lentils', 'dal', 'dhal', 'daal', 'peas', 'edamame', 'soy', 'soybeans', 'pinto beans', 'cannellini',

  // Vegetables & Produce
  'spinach', 'kale', 'lettuce', 'cabbage', 'arugula', 'bok choy', 'greens', 'garlic', 'garlic clove', 
  'onion', 'onions', 'shallot', 'shallots', 'scallion', 'scallions', 'green onion', 'leek', 'leeks', 
  'chives', 'tomato', 'tomatoes', 'potato', 'potatoes', 'sweet potato', 'carrot', 'carrots', 'celery', 
  'pepper', 'peppers', 'bell pepper', 'capsicum', 'chili', 'chilli', 'jalapeno', 'habanero', 'mushroom', 
  'mushrooms', 'broccoli', 'cauliflower', 'zucchini', 'courgette', 'cucumber', 'eggplant', 'aubergine', 
  'squash', 'pumpkin', 'asparagus', 'corn', 'artichoke', 'radish', 'beet', 'beetroot', 
  'ginger', 'avocado', 'olive', 'olives', 'green beans', 'yam',

  // Fruits
  'lemon', 'lime', 'orange', 'apple', 'banana', 'berry', 'berries', 'strawberry', 'blueberry', 
  'raspberry', 'blackberry', 'mango', 'pineapple', 'grape', 'grapes', 'peach', 'plum', 'pear', 
  'coconut', 'fig', 'date', 'dates', 'raisin', 'raisins', 'pomegranate', 'watermelon', 'melon', 'cherry',

  // Seasonings, Spices, Oils & Condiments
  'oil', 'olive oil', 'sesame oil', 'canola oil', 'vegetable oil', 'coconut oil', 'avocado oil',
  'salt', 'sea salt', 'black pepper', 'sugar', 'brown sugar', 'honey', 'maple syrup', 'soy sauce', 
  'tamari', 'fish sauce', 'oyster sauce', 'vinegar', 'balsamic', 'apple cider vinegar', 'sauce', 
  'tomato sauce', 'tomato paste', 'marinara', 'pesto', 'ketchup', 'mustard', 'sriracha', 'hot sauce', 
  'turmeric', 'cumin', 'coriander', 'paprika', 'chili powder', 'cayenne', 'curry', 'curry powder', 
  'masala', 'garam masala', 'cinnamon', 'nutmeg', 'cardamom', 'clove', 'cloves', 'oregano', 'basil', 
  'parsley', 'thyme', 'rosemary', 'dill', 'mint', 'cilantro', 'bay leaf', 'sesame', 'sesame seeds',

  // Nuts & Seeds
  'nut', 'nuts', 'almond', 'almonds', 'walnut', 'walnuts', 'cashew', 'cashews', 'peanut', 
  'peanuts', 'pecan', 'pecans', 'pistachio', 'chia', 'flax', 'sunflower seeds', 'pumpkin seeds',

  // Cooking Dishes & Preparations
  'cook', 'cooking', 'bake', 'baking', 'fry', 'frying', 'sauté', 'saute', 'roast', 'roasting', 
  'grill', 'grilling', 'boil', 'boiling', 'simmer', 'steam', 'recipe', 'meal', 'dish', 'food', 
  'breakfast', 'lunch', 'dinner', 'snack', 'soup', 'salad', 'stew', 'curry', 'skillet', 
  'casserole', 'omelet', 'omelette', 'frittata', 'stir fry', 'stirfry', 'sandwich', 'burger', 'taco', 
  'burrito', 'fridge', 'pantry', 'leftover', 'leftovers', 'ingredient', 'ingredients', 'broth', 'stock'
];

export const NON_CULINARY_INDICATORS = [
  'python', 'javascript', 'typescript', 'java', 'c++', 'golang', 'rust', 'ruby', 'php', 'sql',
  'code', 'coding', 'terminal', 'compile', 'react', 'css', 'html', 'git', 'github', 'bug', 'debug', 
  'function', 'class', 'president', 'prime minister', 'election', 'politics', 'football', 'soccer', 
  'cricket', 'nba', 'score', 'match', 'iphone', 'android', 'battery', 'screen', 'laptop', 'windows', 
  'macbook', 'car', 'engine', 'repair', 'mechanic', 'crypto', 'bitcoin', 'stock', 'shares', 'finance', 
  'calculate', 'derivative', 'integral', 'weather forecast', 'translate', 'essay', 'poem', 'write a poem',
  'solve', 'homework', 'algorithm', 'movie', 'song', 'lyrics', 'game', 'playstation', 'xbox'
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
  if (/([a-z])\1{3,}/.test(clean)) {
    return {
      isValid: false,
      reason: 'Repeated character keyboard mash detected. Please enter real food ingredients.',
    };
  }

  // 4. Consonant mash check (words with 4+ consonants and no vowels like "asdfghjk", "sdfghjk")
  const words = clean.split(/[\s,;+]+/);
  const isVowellessMash = words.some((w) => w.length >= 4 && !/[aeiouy]/.test(w));
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

  // 6. STRICT FOOD MATCH: Must contain at least one recognized culinary keyword with word boundary match
  const hasFoodKeyword = CULINARY_LEXICON.some((keyword) => matchesWordBoundary(clean, keyword));

  if (!hasFoodKeyword) {
    return {
      isValid: false,
      reason: 'No recognized food or kitchen ingredients found. Please enter items like eggs, pasta, garlic, cheese, or chicken.',
    };
  }

  return { isValid: true };
}
