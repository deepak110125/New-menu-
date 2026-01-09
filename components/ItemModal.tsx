import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Eye, Ban } from 'lucide-react';
import { MenuItem, SizeOption, AddOn, CartItem } from '../types';

interface ItemModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
  onOpenAR: (item: MenuItem) => void;
}

type Tab = 'Info' | 'Ingredients' | 'Allergens' | 'Nutrition';

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onAddToCart, onOpenAR }) => {
  const [selectedSize, setSelectedSize] = useState<SizeOption>(item.sizes[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(item.basePrice);
  const [activeTab, setActiveTab] = useState<Tab>('Info');

  const isAvailable = item.isAvailable !== false;

  useEffect(() => {
    const sizePrice = selectedSize?.priceModifier || 0;
    const addOnsPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    setTotalPrice((item.basePrice + sizePrice + addOnsPrice) * quantity);
  }, [selectedSize, selectedAddOns, quantity, item.basePrice]);

  const handleAddToCart = () => {
    if (!isAvailable) return;
    const cartItem: CartItem = {
      ...item,
      cartItemId: Math.random().toString(36).substr(2, 9),
      selectedSize,
      selectedAddOns,
      quantity,
      totalPrice
    };
    onAddToCart(cartItem);
    onClose();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Info':
        return (
          <div className="animate-in fade-in duration-300">
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.description}</p>
            {item.pairingNote && (
               <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
                 <span className="font-semibold">Pairing Note:</span> {item.pairingNote}
               </div>
            )}
            
            {/* Sizes & Addons embedded in Info tab for this design */}
            {item.sizes.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Size</h4>
                    <div className="flex flex-wrap gap-2">
                        {item.sizes.map(size => (
                        <button
                            key={size.id}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedSize.id === size.id 
                                ? 'bg-gray-900 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {size.label} {size.priceModifier > 0 && `(+$${size.priceModifier})`}
                        </button>
                        ))}
                    </div>
                </div>
            )}

            {item.addOns.length > 0 && (
                <div className="mt-6">
                     <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Add Ons</h4>
                     <div className="space-y-2">
                        {item.addOns.map(addon => {
                             const isSelected = selectedAddOns.some(a => a.id === addon.id);
                             return (
                                 <button
                                    key={addon.id}
                                    onClick={() => {
                                        if (isSelected) setSelectedAddOns(prev => prev.filter(a => a.id !== addon.id));
                                        else setSelectedAddOns(prev => [...prev, addon]);
                                    }}
                                    className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${
                                        isSelected ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-gray-100 hover:bg-gray-50'
                                    }`}
                                 >
                                    <span className="text-sm">{addon.name}</span>
                                    <span className="text-xs font-semibold">+${addon.price}</span>
                                 </button>
                             )
                        })}
                     </div>
                </div>
            )}
          </div>
        );
      case 'Ingredients':
        return (
          <div className="animate-in fade-in duration-300">
             {item.ingredients ? (
                 <p className="text-gray-600 text-sm leading-relaxed">{item.ingredients}</p>
             ) : (
                 <p className="text-gray-500 text-sm italic">Detailed ingredient information is available upon request from our staff.</p>
             )}
          </div>
        );
      case 'Allergens':
        return (
            <div className="flex gap-2 flex-wrap animate-in fade-in duration-300">
                {item.isGlutenFree && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Gluten Free</span>}
                {item.isVegetarian && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Vegetarian</span>}
                {item.allergens?.map((allergen, idx) => (
                    <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-100">
                        Contains {allergen}
                    </span>
                ))}
                {!item.isVegetarian && !item.isGlutenFree && (!item.allergens || item.allergens.length === 0) && (
                    <span className="text-gray-500 text-sm">Please ask staff about specific allergens.</span>
                )}
            </div>
        );
      case 'Nutrition':
        return (
            <div className="animate-in fade-in duration-300 space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 text-sm">Calories</span>
                    <span className="font-bold text-gray-900">{item.calories || 'N/A'}</span>
                </div>
                {item.nutrition && (
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-gray-50 rounded-xl text-center">
                            <span className="block text-xs text-gray-500 mb-1">Protein</span>
                            <span className="font-semibold text-gray-900">{item.nutrition.protein}g</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl text-center">
                            <span className="block text-xs text-gray-500 mb-1">Carbs</span>
                            <span className="font-semibold text-gray-900">{item.nutrition.carbs}g</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl text-center">
                            <span className="block text-xs text-gray-500 mb-1">Fats</span>
                            <span className="font-semibold text-gray-900">{item.nutrition.fats}g</span>
                        </div>
                    </div>
                )}
                {!item.nutrition && !item.calories && (
                    <p className="text-gray-500 text-sm italic">Nutritional information unavailable.</p>
                )}
            </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="absolute top-4 right-4 z-20">
            <button 
                onClick={onClose}
                className="bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 no-scrollbar">
            {/* Main Image */}
            <div className="p-4 pb-0 relative group">
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className={`w-full aspect-square object-cover rounded-3xl shadow-sm ${!isAvailable ? 'grayscale opacity-80' : ''}`}
                />
                {!isAvailable && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-lg border-2 border-white backdrop-blur-sm">
                        Sold Out
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="font-serif text-2xl font-bold text-gray-900 max-w-[70%]">{item.name}</h2>
                    <span className="font-serif text-2xl font-medium text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>

                {/* Buttons Row - AR View and ADD */}
                <div className="flex gap-3 mb-8">
                    <button 
                        onClick={() => onOpenAR(item)}
                        disabled={!isAvailable}
                        className={`flex-1 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg uppercase tracking-wide text-xs sm:text-sm ${isAvailable ? 'bg-gray-900 hover:bg-gray-800 text-white shadow-gray-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        <Eye className="w-4 h-4" />
                        <span>AR View</span>
                    </button>
                    <button 
                        onClick={handleAddToCart}
                        disabled={!isAvailable}
                        className={`flex-[1.5] border-2 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-wide text-xs sm:text-sm ${isAvailable ? 'bg-white hover:bg-gray-50 text-black border-black' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`}
                    >
                        {isAvailable ? <Plus className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        <span>{isAvailable ? 'Add' : 'Unavailable'}</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 mb-6 overflow-x-auto no-scrollbar">
                    {(['Info', 'Ingredients', 'Allergens', 'Nutrition'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                                activeTab === tab ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[100px]">
                    {renderTabContent()}
                </div>
            </div>
        </div>

        {/* Quantity Footer */}
        {isAvailable && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <span>Quantity</span>
                <div className="flex items-center gap-4 bg-white rounded-lg px-2 py-1 border border-gray-200">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-gray-900"><Minus className="w-4 h-4"/></button>
                    <span className="font-medium text-gray-900 w-4 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-gray-900"><Plus className="w-4 h-4"/></button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};