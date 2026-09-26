import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Refrigerator, Plus, Sparkles, Check, ArrowRight 
} from 'lucide-react';

interface PantryItem {
  id: string;
  name: string;
  category: 'produce' | 'dairy' | 'protein' | 'grains' | 'spices';
}

const DEFAULT_PANTRY_ITEMS: PantryItem[] = [
  // Produce
  { id: 'p1', name: 'Fresh Baby Spinach', category: 'produce' },
  { id: 'p2', name: 'Ripe Tomatoes', category: 'produce' },
  { id: 'p3', name: 'Garlic Cloves', category: 'produce' },
  { id: 'p4', name: 'Red Onion', category: 'produce' },
  { id: 'p5', name: 'Cremini Mushrooms', category: 'produce' },
  { id: 'p6', name: 'Broccoli Florets', category: 'produce' },
  { id: 'p7', name: 'Bell Pepper', category: 'produce' },
  { id: 'p8', name: 'Avocado', category: 'produce' },

  // Dairy & Eggs
  { id: 'd1', name: 'Farm Fresh Eggs', category: 'dairy' },
  { id: 'd2', name: 'Sharp Cheddar Cheese', category: 'dairy' },
  { id: 'd3', name: 'Grated Parmesan', category: 'dairy' },
  { id: 'd4', name: 'Greek Yogurt', category: 'dairy' },
  { id: 'd5', name: 'Unsalted Butter', category: 'dairy' },
  { id: 'd6', name: 'Whole Milk', category: 'dairy' },

  // Protein
  { id: 'pr1', name: 'Chicken Breast', category: 'protein' },
  { id: 'pr2', name: 'Firm Tofu', category: 'protein' },
  { id: 'pr3', name: 'Canned Black Beans', category: 'protein' },
  { id: 'pr4', name: 'Canned Chickpeas', category: 'protein' },
  { id: 'pr5', name: 'Ground Turkey / Beef', category: 'protein' },

  // Grains & Staples
  { id: 'g1', name: 'Leftover Cooked Rice', category: 'grains' },
  { id: 'g2', name: 'Penne / Spaghetti Pasta', category: 'grains' },
  { id: 'g3', name: 'Sourdough Bread', category: 'grains' },
  { id: 'g4', name: 'Rolled Oats', category: 'grains' },
  { id: 'g5', name: 'Flour Tortillas', category: 'grains' },

  // Spices & Condiments
  { id: 's1', name: 'Extra Virgin Olive Oil', category: 'spices' },
  { id: 's2', name: 'Low Sodium Soy Sauce', category: 'spices' },
  { id: 's3', name: 'Red Chili Flakes', category: 'spices' },
  { id: 's4', name: 'Black Pepper & Sea Salt', category: 'spices' },
  { id: 's5', name: 'Smoked Paprika', category: 'spices' },
  { id: 's6', name: 'Dried Oregano / Basil', category: 'spices' },
];

interface PantryPageProps {
  onGenerateFromPantry: (ingredientsText: string) => void;
}

export const PantryPage: React.FC<PantryPageProps> = ({ onGenerateFromPantry }) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>(['d1', 'd2', 'p1', 'p3']);
  const [customItemName, setCustomItemName] = useState('');
  const [customCategory, setCustomCategory] = useState<PantryItem['category']>('produce');
  const [items, setItems] = useState<PantryItem[]>(DEFAULT_PANTRY_ITEMS);

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;

    const newItem: PantryItem = {
      id: `custom_${Date.now()}`,
      name: customItemName.trim(),
      category: customCategory,
    };

    setItems((prev) => [newItem, ...prev]);
    setSelectedIds((prev) => [...prev, newItem.id]);
    setCustomItemName('');
  };

  const handleGenerate = () => {
    const selectedNames = items
      .filter((item) => selectedIds.includes(item.id))
      .map((item) => item.name);

    if (selectedNames.length === 0) return;

    onGenerateFromPantry(selectedNames.join(', '));
    navigate('/studio');
  };

  const categories = [
    { key: 'produce', label: '🥬 Fresh Produce' },
    { key: 'dairy', label: '🧀 Dairy & Eggs' },
    { key: 'protein', label: '🥩 Meat & Proteins' },
    { key: 'grains', label: '🍚 Grains & Base Staples' },
    { key: 'spices', label: '🌿 Oils, Herbs & Sauces' },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-200 bg-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Refrigerator className="w-5 h-5" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Virtual Kitchen & Pantry Stock
              </h1>
            </div>
            <p className="text-sm text-slate-600">
              Select items available in your fridge or pantry to synthesize custom interactive recipes.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={selectedIds.length === 0}
              className="btn-primary text-xs sm:text-sm py-2.5 px-5 rounded-xl font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize from Stock ({selectedIds.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Custom Item Bar */}
      <div className="glass-panel p-4 sm:p-5 border border-slate-200 bg-white shadow-xs">
        <form onSubmit={handleAddCustom} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Add Custom Ingredient:</span>
          </div>

          <input
            type="text"
            value={customItemName}
            onChange={(e) => setCustomItemName(e.target.value)}
            placeholder="e.g. Kimchi, Coconut Milk, Goat Cheese..."
            className="flex-1 w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />

          <select
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="produce">Produce</option>
            <option value="dairy">Dairy / Eggs</option>
            <option value="protein">Protein</option>
            <option value="grains">Grains / Bread</option>
            <option value="spices">Spices / Oils</option>
          </select>

          <button
            type="submit"
            disabled={!customItemName.trim()}
            className="btn-secondary text-xs py-2 px-4 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 shrink-0 font-semibold"
          >
            Add to Pantry
          </button>
        </form>
      </div>

      {/* Selected Items Counter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 px-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">{selectedIds.length} items selected</span>
          <span>• Click any item card to toggle in/out of stock</span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedIds(items.map((i) => i.id))}
            className="text-blue-600 hover:text-blue-700 underline font-semibold"
          >
            Select All
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="text-slate-500 hover:text-slate-700 underline font-medium"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const categoryItems = items.filter((item) => item.category === cat.key);
          if (categoryItems.length === 0) return null;

          return (
            <div key={cat.key} className="glass-panel p-6 border border-slate-200 bg-white space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <span>{cat.label}</span>
                </h3>
                <span className="text-xs text-slate-500">
                  {categoryItems.filter((i) => selectedIds.includes(i.id)).length} / {categoryItems.length} in stock
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categoryItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-medium line-clamp-1">
                        {item.name}
                      </span>

                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
