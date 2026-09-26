import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Refrigerator, Plus, Sparkles, Check, ArrowRight } from 'lucide-react';

interface PantryItem {
  id: string;
  name: string;
  category: 'produce' | 'dairy' | 'protein' | 'grains' | 'spices';
}

const DEFAULT_PANTRY_ITEMS: PantryItem[] = [
  // Produce
  { id: 'p1', name: 'Fresh Spinach', category: 'produce' },
  { id: 'p2', name: 'Tomatoes', category: 'produce' },
  { id: 'p3', name: 'Garlic', category: 'produce' },
  { id: 'p4', name: 'Yellow Onion', category: 'produce' },
  { id: 'p5', name: 'Button Mushrooms', category: 'produce' },
  { id: 'p6', name: 'Bell Pepper', category: 'produce' },

  // Dairy & Eggs
  { id: 'd1', name: 'Eggs', category: 'dairy' },
  { id: 'd2', name: 'Cheddar Cheese', category: 'dairy' },
  { id: 'd3', name: 'Parmesan', category: 'dairy' },
  { id: 'd4', name: 'Butter', category: 'dairy' },
  { id: 'd5', name: 'Whole Milk', category: 'dairy' },

  // Protein
  { id: 'pr1', name: 'Chicken Breast', category: 'protein' },
  { id: 'pr2', name: 'Firm Tofu', category: 'protein' },
  { id: 'pr3', name: 'Black Beans', category: 'protein' },
  { id: 'pr4', name: 'Chickpeas', category: 'protein' },

  // Grains & Staples
  { id: 'g1', name: 'Jasmine Rice', category: 'grains' },
  { id: 'g2', name: 'Pasta', category: 'grains' },
  { id: 'g3', name: 'Sourdough Bread', category: 'grains' },
  { id: 'g4', name: 'Rolled Oats', category: 'grains' },

  // Spices & Condiments
  { id: 's1', name: 'Extra Virgin Olive Oil', category: 'spices' },
  { id: 's2', name: 'Soy Sauce', category: 'spices' },
  { id: 's3', name: 'Black Pepper & Salt', category: 'spices' },
  { id: 's4', name: 'Red Chili Flakes', category: 'spices' },
];

const CATEGORIES = [
  { key: 'all', label: 'All Items' },
  { key: 'produce', label: 'Produce' },
  { key: 'dairy', label: 'Dairy & Eggs' },
  { key: 'protein', label: 'Protein' },
  { key: 'grains', label: 'Grains' },
  { key: 'spices', label: 'Spices & Oils' },
];

interface PantryPageProps {
  onGenerateFromPantry: (ingredientsText: string) => void;
}

export const PantryPage: React.FC<PantryPageProps> = ({ onGenerateFromPantry }) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>(['d1', 'd2', 'p1', 'p3']);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customItemName, setCustomItemName] = useState('');
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
      category: 'produce',
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

  const visibleItems = activeCategory === 'all'
    ? items
    : items.filter((i) => i.category === activeCategory);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Refrigerator className="w-7 h-7 text-blue-600" />
            <span>Virtual Kitchen Stock</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Toggle ingredients currently available in your kitchen to generate an exact recipe.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={selectedIds.length === 0}
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 rounded-2xl flex items-center gap-2 font-bold self-start sm:self-auto disabled:opacity-50 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Cook with {selectedIds.length} Selected</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category Pills & Quick Add */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`text-xs py-1.5 px-3 rounded-xl border transition-all font-semibold ${
                activeCategory === cat.key
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Custom Item Form */}
        <form onSubmit={handleAddCustom} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={customItemName}
            onChange={(e) => setCustomItemName(e.target.value)}
            placeholder="Add custom item..."
            className="flex-1 sm:w-48 bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
          />
          <button
            type="submit"
            disabled={!customItemName.trim()}
            className="btn-secondary text-xs py-1.5 px-3 rounded-xl font-bold shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Selection Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
          <span className="font-semibold text-slate-700">
            Showing {visibleItems.length} items ({selectedIds.length} currently checked):
          </span>
          <div className="flex gap-3 font-semibold">
            <button
              type="button"
              onClick={() => setSelectedIds(items.map((i) => i.id))}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Select All
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-slate-500 hover:text-slate-800 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {visibleItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all flex items-center justify-between gap-2.5 text-xs sm:text-sm ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold shadow-2xs ring-2 ring-blue-100'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                }`}
              >
                <span className="truncate">{item.name}</span>
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-2xs' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
