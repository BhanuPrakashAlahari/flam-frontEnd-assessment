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
  { id: 'p4', name: 'Onion', category: 'produce' },
  { id: 'p5', name: 'Mushrooms', category: 'produce' },
  { id: 'p6', name: 'Bell Pepper', category: 'produce' },

  // Dairy & Eggs
  { id: 'd1', name: 'Eggs', category: 'dairy' },
  { id: 'd2', name: 'Cheddar Cheese', category: 'dairy' },
  { id: 'd3', name: 'Parmesan', category: 'dairy' },
  { id: 'd4', name: 'Butter', category: 'dairy' },
  { id: 'd5', name: 'Milk', category: 'dairy' },

  // Protein
  { id: 'pr1', name: 'Chicken Breast', category: 'protein' },
  { id: 'pr2', name: 'Tofu', category: 'protein' },
  { id: 'pr3', name: 'Black Beans', category: 'protein' },
  { id: 'pr4', name: 'Chickpeas', category: 'protein' },

  // Grains & Staples
  { id: 'g1', name: 'Rice', category: 'grains' },
  { id: 'g2', name: 'Pasta', category: 'grains' },
  { id: 'g3', name: 'Bread', category: 'grains' },
  { id: 'g4', name: 'Oats', category: 'grains' },

  // Spices & Condiments
  { id: 's1', name: 'Olive Oil', category: 'spices' },
  { id: 's2', name: 'Soy Sauce', category: 'spices' },
  { id: 's3', name: 'Black Pepper & Salt', category: 'spices' },
  { id: 's4', name: 'Chili Flakes', category: 'spices' },
];

interface PantryPageProps {
  onGenerateFromPantry: (ingredientsText: string) => void;
}

export const PantryPage: React.FC<PantryPageProps> = ({ onGenerateFromPantry }) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>(['d1', 'd2', 'p1', 'p3']);
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Refrigerator className="w-6 h-6 text-blue-600" />
            <span>Virtual Kitchen Stock</span>
          </h1>
          <p className="text-xs text-slate-500">
            Select items available in your kitchen to generate a matching recipe.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={selectedIds.length === 0}
          className="btn-primary text-xs sm:text-sm py-2 px-4 rounded-xl flex items-center gap-1.5 font-semibold disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>Cook with {selectedIds.length} Selected</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Add Custom */}
      <form onSubmit={handleAddCustom} className="flex gap-2">
        <input
          type="text"
          value={customItemName}
          onChange={(e) => setCustomItemName(e.target.value)}
          placeholder="Add custom ingredient (e.g. Avocado, Avocado Oil)..."
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
        />
        <button
          type="submit"
          disabled={!customItemName.trim()}
          className="btn-secondary text-xs py-2 px-4 rounded-xl font-medium shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Selection Grid */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
          <span>Click any item to toggle in/out of stock:</span>
          <div className="flex gap-2 font-medium">
            <button
              type="button"
              onClick={() => setSelectedIds(items.map((i) => i.id))}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Select All
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-slate-500 hover:text-slate-700 underline"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-2.5 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between gap-2 text-xs sm:text-sm ${
                  isSelected
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <span className="truncate">{item.name}</span>
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
