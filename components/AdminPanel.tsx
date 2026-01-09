import React, { useState } from 'react';
import { MenuItem, SizeOption, AddOn, Order, OrderStatus, RestaurantInfo, NutritionInfo } from '../types';
import { 
  Plus, Trash2, Save, Clock, Flame, Leaf, Wheat, 
  LayoutGrid, ClipboardList, Settings, XCircle, 
  ChefHat, AlertCircle, DollarSign, Image as ImageIcon, Tags,
  Utensils, AlertTriangle, Activity, Edit2, CheckCircle, Ban, X, ArrowLeft, Search, Box
} from 'lucide-react';

interface AdminPanelProps {
  items: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  onUpdateItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  restaurantInfo: RestaurantInfo;
  onUpdateRestaurant: (info: RestaurantInfo) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  onClose: () => void;
}

type Tab = 'menu' | 'orders' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  items,
  onAddItem, 
  onUpdateItem,
  onDeleteItem,
  orders, 
  onUpdateOrderStatus, 
  restaurantInfo, 
  onUpdateRestaurant,
  categories,
  onAddCategory,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [allergenInput, setAllergenInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for New/Edit Item
  const initialItemState: Partial<MenuItem> = {
    name: '',
    description: '',
    basePrice: 0,
    category: categories[0] || 'Mains',
    image: '',
    arModelUrl: '',
    calories: 0,
    preparationTime: '',
    isBestseller: false,
    isChefsChoice: false,
    isSpicy: false,
    isVegetarian: false,
    isGlutenFree: false,
    isAvailable: true,
    sizes: [{ id: 's1', label: 'Regular', priceModifier: 0 }],
    addOns: [],
    pairingNote: '',
    ingredients: '',
    allergens: [],
    nutrition: { protein: 0, carbs: 0, fats: 0 }
  };

  const [formData, setFormData] = useState<Partial<MenuItem>>(initialItemState);

  const startEdit = (item: MenuItem) => {
      setEditingId(item.id);
      setFormData({
          ...item,
          sizes: [...item.sizes],
          addOns: [...item.addOns],
          allergens: [...(item.allergens || [])],
          nutrition: { ...(item.nutrition || { protein: 0, carbs: 0, fats: 0 }) }
      });
      setShowItemForm(true);
  };

  const cancelEdit = () => {
      setEditingId(null);
      setFormData(initialItemState);
      setShowItemForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.basePrice) return;

    if (editingId) {
        // Update existing
        onUpdateItem({
            ...formData,
            id: editingId
        } as MenuItem);
        alert('Item updated successfully!');
        cancelEdit();
    } else {
        // Create new
        const item: MenuItem = {
            ...formData as MenuItem,
            id: Math.random().toString(36).substr(2, 9),
            image: formData.image || 'https://picsum.photos/seed/default/600/400', // Fallback
            isAvailable: formData.isAvailable !== false // default true
        };
        onAddItem(item);
        setFormData(initialItemState);
        setShowItemForm(false);
        alert('Item added successfully!');
    }
  };

  const updateFormData = (field: keyof MenuItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNutrition = (field: keyof NutritionInfo, value: number) => {
      setFormData(prev => ({
          ...prev,
          nutrition: {
              protein: 0,
              carbs: 0,
              fats: 0,
              ...(prev.nutrition || {}),
              [field]: value
          }
      }));
  };

  const addAllergen = () => {
      if (allergenInput.trim()) {
          setFormData(prev => ({
              ...prev,
              allergens: [...(prev.allergens || []), allergenInput.trim()]
          }));
          setAllergenInput('');
      }
  };

  const removeAllergen = (index: number) => {
      setFormData(prev => ({
          ...prev,
          allergens: prev.allergens?.filter((_, i) => i !== index)
      }));
  };

  // --- Dynamic Field Handlers ---
  const addSize = () => {
    const newSize: SizeOption = { id: Math.random().toString(36).substr(2, 5), label: '', priceModifier: 0 };
    setFormData(prev => ({ ...prev, sizes: [...(prev.sizes || []), newSize] }));
  };

  const updateSize = (id: string, field: keyof SizeOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes?.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const removeSize = (id: string) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes?.filter(s => s.id !== id) }));
  };

  const addAddOn = () => {
    const newAddOn: AddOn = { id: Math.random().toString(36).substr(2, 5), name: '', price: 0 };
    setFormData(prev => ({ ...prev, addOns: [...(prev.addOns || []), newAddOn] }));
  };

  const updateAddOn = (id: string, field: keyof AddOn, value: any) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns?.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const removeAddOn = (id: string) => {
    setFormData(prev => ({ ...prev, addOns: prev.addOns?.filter(a => a.id !== id) }));
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col md:flex-row animate-in slide-in-from-bottom duration-300">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-900 text-white flex flex-col justify-between shrink-0 md:h-full overflow-hidden">
        <div>
            <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                <div className="bg-amber-500 p-2 rounded-lg">
                    <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-lg leading-tight">Admin Panel</h2>
                    <p className="text-xs text-gray-400">Manage Restaurant</p>
                </div>
            </div>
            
            <nav className="p-4 space-y-2">
                <button 
                    onClick={() => setActiveTab('menu')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'menu' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                    <LayoutGrid className="w-5 h-5" />
                    <span className="font-medium">Menu Manager</span>
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                    <ClipboardList className="w-5 h-5" />
                    <div className="flex-1 flex justify-between items-center">
                        <span className="font-medium">Orders</span>
                        {orders.filter(o => o.status === 'Pending').length > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {orders.filter(o => o.status === 'Pending').length}
                            </span>
                        )}
                    </div>
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </button>
            </nav>
        </div>
        
        <div className="p-4 border-t border-gray-800">
            <button onClick={onClose} className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors">
                <XCircle className="w-4 h-4" />
                <span>Exit Admin</span>
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
        
        {/* === MENU MANAGEMENT TAB === */}
        {activeTab === 'menu' && (
          <div className="max-w-5xl mx-auto">
            {!showItemForm ? (
                // --- LIST VIEW ---
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 font-serif">Current Menu</h2>
                                <p className="text-gray-500">Manage your dishes and availability.</p>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search menu..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                setEditingId(null);
                                setFormData(initialItemState);
                                setShowItemForm(true);
                            }}
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Item
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredItems.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex gap-4 group hover:border-amber-200 transition-colors">
                                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100 relative">
                                    <img src={item.image} alt={item.name} className={`w-full h-full object-cover ${item.isAvailable === false ? 'grayscale' : ''}`} />
                                    {item.isAvailable === false && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <Ban className="text-white w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-bold text-lg text-gray-900 truncate">{item.name}</h4>
                                            <div className="flex gap-1 shrink-0">
                                                 <button 
                                                    onClick={() => startEdit(item)} 
                                                    className="p-2 bg-gray-50 hover:bg-amber-100 text-gray-600 hover:text-amber-700 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => onDeleteItem(item.id)}
                                                    className="p-2 bg-gray-50 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-1">{item.category} • ${item.basePrice}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 mt-2">
                                         <button 
                                            onClick={() => onUpdateItem({...item, isAvailable: !(item.isAvailable !== false)})}
                                            className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-colors ${item.isAvailable !== false ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                        >
                                            {item.isAvailable !== false ? (
                                                <><CheckCircle className="w-3.5 h-3.5"/> Available</>
                                            ) : (
                                                <><Ban className="w-3.5 h-3.5"/> Sold Out</>
                                            )}
                                        </button>
                                        {item.isBestseller && <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-bold">Popular</span>}
                                        {item.arModelUrl && <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-bold flex items-center gap-1"><Box className="w-3 h-3"/> AR</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredItems.length === 0 && (
                             <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
                                <p>No items found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // --- FORM VIEW ---
                <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-center mb-6">
                         <div className="flex items-center gap-4">
                            <button 
                                onClick={cancelEdit} 
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                                title="Back to List"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-900 font-serif">
                                {editingId ? 'Edit Item' : 'Add New Item'}
                            </h2>
                         </div>
                        {editingId && (
                            <button onClick={cancelEdit} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
                                <X className="w-4 h-4" /> Cancel
                            </button>
                        )}
                    </div>
                    
                    <form id="item-form" onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
                        
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Basic Information</h3>
                                 <label className="flex items-center gap-2 cursor-pointer">
                                    <span className="text-sm font-medium text-gray-700">Available</span>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isAvailable !== false ? 'bg-green-500' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.isAvailable !== false ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden"
                                        checked={formData.isAvailable !== false}
                                        onChange={(e) => updateFormData('isAvailable', e.target.checked)}
                                    />
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.name}
                                        onChange={e => updateFormData('name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                        placeholder="e.g. Lobster Thermidor"
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select 
                                        value={formData.category}
                                        onChange={e => updateFormData('category', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-white"
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea 
                                        required
                                        value={formData.description}
                                        onChange={e => updateFormData('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                        placeholder="Describe the dish in detail..."
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Price ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            required
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.basePrice || ''}
                                            onChange={e => updateFormData('basePrice', parseFloat(e.target.value))}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="url"
                                            value={formData.image}
                                            onChange={e => updateFormData('image', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">AR Model URL</label>
                                    <div className="relative">
                                        <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="url"
                                            value={formData.arModelUrl || ''}
                                            onChange={e => updateFormData('arModelUrl', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                            placeholder="https://example.com/model.glb"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attributes */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Details & Attributes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="text"
                                            value={formData.preparationTime}
                                            onChange={e => updateFormData('preparationTime', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                            placeholder="e.g. 15-20 min"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                                    <div className="relative">
                                        <Flame className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="number"
                                            value={formData.calories || ''}
                                            onChange={e => updateFormData('calories', parseFloat(e.target.value))}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                            placeholder="e.g. 650"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <input type="checkbox" checked={formData.isVegetarian} onChange={e => updateFormData('isVegetarian', e.target.checked)} className="accent-amber-600 w-4 h-4"/>
                                    <Leaf className="w-4 h-4 text-green-600" /> <span className="text-sm font-medium">Vegetarian</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <input type="checkbox" checked={formData.isGlutenFree} onChange={e => updateFormData('isGlutenFree', e.target.checked)} className="accent-amber-600 w-4 h-4"/>
                                    <Wheat className="w-4 h-4 text-amber-600" /> <span className="text-sm font-medium">Gluten Free</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <input type="checkbox" checked={formData.isSpicy} onChange={e => updateFormData('isSpicy', e.target.checked)} className="accent-amber-600 w-4 h-4"/>
                                    <Flame className="w-4 h-4 text-red-600" /> <span className="text-sm font-medium">Spicy</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <input type="checkbox" checked={formData.isChefsChoice} onChange={e => updateFormData('isChefsChoice', e.target.checked)} className="accent-amber-600 w-4 h-4"/>
                                    <ChefHat className="w-4 h-4 text-gray-800" /> <span className="text-sm font-medium">Chef's Choice</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <input type="checkbox" checked={formData.isBestseller} onChange={e => updateFormData('isBestseller', e.target.checked)} className="accent-amber-600 w-4 h-4"/>
                                    <AlertCircle className="w-4 h-4 text-orange-500" /> <span className="text-sm font-medium">Bestseller</span>
                                </label>
                            </div>
                        </div>

                        {/* Ingredients, Allergens & Nutrition */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Ingredients, Allergens & Nutrition</h3>
                            
                            {/* Ingredients */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Utensils className="w-4 h-4 text-gray-500"/> Ingredients List
                                </label>
                                <textarea 
                                    value={formData.ingredients}
                                    onChange={e => updateFormData('ingredients', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                    placeholder="e.g. Arborio rice, vegetable stock, wild mushrooms, parmesan cheese..."
                                />
                            </div>

                            {/* Allergens */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-gray-500"/> Allergens
                                </label>
                                <div className="flex gap-2 mb-3 flex-wrap">
                                    {formData.allergens?.map((allergen, idx) => (
                                        <span key={idx} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-red-100">
                                            {allergen}
                                            <button type="button" onClick={() => removeAllergen(idx)} className="hover:text-red-900"><XCircle className="w-3 h-3"/></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={allergenInput}
                                        onChange={e => setAllergenInput(e.target.value)}
                                        placeholder="Add allergen (e.g. Nuts)" 
                                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-amber-500"
                                        onKeyDown={e => {
                                            if(e.key === 'Enter') {
                                                e.preventDefault();
                                                addAllergen();
                                            }
                                        }}
                                    />
                                    <button type="button" onClick={addAllergen} className="px-4 py-2 bg-gray-100 rounded-xl font-medium text-gray-600 hover:bg-gray-200">Add</button>
                                </div>
                            </div>

                            {/* Nutrition Macros */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-gray-500"/> Nutrition Macros (grams)
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-xs text-gray-500 mb-1 block">Protein</span>
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={formData.nutrition?.protein || ''}
                                            onChange={e => updateNutrition('protein', parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 mb-1 block">Carbs</span>
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={formData.nutrition?.carbs || ''}
                                            onChange={e => updateNutrition('carbs', parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 mb-1 block">Fats</span>
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={formData.nutrition?.fats || ''}
                                            onChange={e => updateNutrition('fats', parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Configuration: Sizes & Addons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Sizes */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sizes</h3>
                                    <button type="button" onClick={addSize} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Add Size</button>
                                </div>
                                <div className="space-y-3">
                                    {formData.sizes?.map((size, idx) => (
                                        <div key={size.id} className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Label (e.g. Large)" 
                                                value={size.label}
                                                onChange={e => updateSize(size.id, 'label', e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-amber-500"
                                            />
                                            <input 
                                                type="number" 
                                                placeholder="Price +$" 
                                                value={size.priceModifier}
                                                onChange={e => updateSize(size.id, 'priceModifier', parseFloat(e.target.value))}
                                                className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-amber-500"
                                            />
                                            {formData.sizes && formData.sizes.length > 1 && (
                                                <button type="button" onClick={() => removeSize(size.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Add-ons */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Add-Ons</h3>
                                    <button type="button" onClick={addAddOn} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Add Option</button>
                                </div>
                                <div className="space-y-3">
                                    {formData.addOns?.map((addon, idx) => (
                                        <div key={addon.id} className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Name (e.g. Extra Cheese)" 
                                                value={addon.name}
                                                onChange={e => updateAddOn(addon.id, 'name', e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-amber-500"
                                            />
                                            <input 
                                                type="number" 
                                                placeholder="Price $" 
                                                value={addon.price}
                                                onChange={e => updateAddOn(addon.id, 'price', parseFloat(e.target.value))}
                                                className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-amber-500"
                                            />
                                            <button type="button" onClick={() => removeAddOn(addon.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    {(!formData.addOns || formData.addOns.length === 0) && (
                                        <p className="text-sm text-gray-400 italic">No add-ons configured.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* AI Context */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Sommelier AI Context</h3>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pairing Note</label>
                            <textarea 
                                value={formData.pairingNote}
                                onChange={e => updateFormData('pairingNote', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                placeholder="e.g. Pairs well with a light Pinot Noir..."
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button 
                                type="submit"
                                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-amber-200 transition-all flex items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {editingId ? 'Update Item' : 'Save Item'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
          </div>
        )}

        {/* === ORDERS TAB === */}
        {activeTab === 'orders' && (
             <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Incoming Orders</h2>
                
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200">
                        <ClipboardList className="w-16 h-16 text-gray-200 mb-4" />
                        <p className="text-gray-500">No active orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.slice().reverse().map(order => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-2">
                                    <div className="flex gap-4 items-center">
                                        <span className="font-mono text-sm font-bold text-gray-500">#{order.id}</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                                            order.status === 'Pending' ? 'bg-red-100 text-red-700' :
                                            order.status === 'Preparing' ? 'bg-amber-100 text-amber-700' :
                                            order.status === 'Ready' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(order.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                                <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-bold text-gray-900">{order.customerName}</p>
                                                <p className="text-sm text-gray-500">Table: {order.tableNumber}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-xl text-gray-900">${order.totalPrice.toFixed(2)}</p>
                                                <p className="text-xs text-gray-500">{order.items.length} items</p>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-100 pt-3 space-y-3">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex flex-col">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-800">
                                                            <span className="font-bold text-gray-900">{item.quantity}x</span> {item.name} <span className="text-gray-500">({item.selectedSize.label})</span>
                                                        </span>
                                                        <span className="text-gray-600 font-medium">${item.totalPrice.toFixed(2)}</span>
                                                    </div>
                                                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                                                        <div className="pl-5 text-xs text-gray-500 mt-1">
                                                            <span className="font-medium text-gray-400 uppercase tracking-wider text-[10px]">Add-ons: </span>
                                                            {item.selectedAddOns.map(addon => addon.name).join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                                        <button 
                                            onClick={() => onUpdateOrderStatus(order.id, 'Preparing')}
                                            disabled={order.status !== 'Pending'}
                                            className="flex-1 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Start Prep
                                        </button>
                                        <button 
                                            onClick={() => onUpdateOrderStatus(order.id, 'Ready')}
                                            disabled={order.status !== 'Preparing'}
                                            className="flex-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Mark Ready
                                        </button>
                                        <button 
                                            onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                                            disabled={order.status !== 'Ready'}
                                            className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Delivered
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        )}

        {/* === SETTINGS TAB === */}
        {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 font-serif">Restaurant Settings</h2>
                
                {/* General Info */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-amber-500" />
                        General Information
                    </h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                        <input 
                            type="text" 
                            value={restaurantInfo.name}
                            onChange={(e) => onUpdateRestaurant({...restaurantInfo, name: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                value={restaurantInfo.logo || ''}
                                onChange={(e) => onUpdateRestaurant({...restaurantInfo, logo: e.target.value})}
                                placeholder="https://..."
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                            {restaurantInfo.logo && (
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                    <img src={restaurantInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Categories Management */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Tags className="w-5 h-5 text-amber-500" />
                        Menu Categories
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <span key={cat} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                                {cat}
                            </span>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Add New Category</label>
                        <div className="flex gap-3">
                            <input 
                                type="text" 
                                value={newCategoryInput}
                                onChange={(e) => setNewCategoryInput(e.target.value)}
                                placeholder="e.g. Specials"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                            <button 
                                onClick={() => {
                                    if(newCategoryInput.trim()) {
                                        onAddCategory(newCategoryInput.trim());
                                        setNewCategoryInput('');
                                    }
                                }}
                                disabled={!newCategoryInput.trim()}
                                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};