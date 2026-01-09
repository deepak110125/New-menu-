import React, { useState } from 'react';
import { CATEGORIES, MENU_ITEMS } from './constants';
import { MenuItem, Category, CartItem, Order, OrderStatus, RestaurantInfo } from './types';
import { MenuCard } from './components/MenuCard';
import { ItemModal } from './components/ItemModal';
import { ARViewer } from './components/ARViewer';
import { ChefAssistant } from './components/ChefAssistant';
import { AdminPanel } from './components/AdminPanel';
import { ShoppingBag, ChevronRight, UtensilsCrossed, Search, X, Lock, Leaf, Globe } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<string>('Mains');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [arItem, setArItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN');
  
  // App Data State (Lifted from constants to allow Admin updates)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: 'Lumière',
    logo: null
  });
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Admin Mode State
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // --- Derived state ---
  const filteredItems = menuItems.filter(item => 
    item.category === activeCategory && 
    (searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!isVegOnly || item.isVegetarian)
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- Handlers ---

  const handleAddToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const handleOpenAR = (item: MenuItem) => {
    setSelectedItem(null); // Close the details modal
    setArItem(item); // Open the AR viewer
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        customerName: 'Guest Table 4', // Mock data
        tableNumber: '4',
        items: [...cart],
        totalPrice: cartTotal,
        status: 'Pending',
        timestamp: Date.now()
    };

    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    setIsCartOpen(false);
    alert('Order Placed Successfully! Kitchen has been notified.');
  };

  // Admin Handlers
  const handleAddItem = (newItem: MenuItem) => {
    setMenuItems(prev => [newItem, ...prev]);
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
      setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleDeleteItem = (id: string) => {
      if(window.confirm('Are you sure you want to delete this item?')) {
          setMenuItems(prev => prev.filter(item => item.id !== id));
      }
  };

  const handleUpdateRestaurant = (info: RestaurantInfo) => {
    setRestaurantInfo(info);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleAddCategory = (newCat: string) => {
      if (!categories.includes(newCat)) {
          setCategories(prev => [...prev, newCat]);
      }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-gray-800 pb-20 selection:bg-yellow-200">
      
      {/* Admin Panel Overlay */}
      {isAdminOpen && (
        <AdminPanel 
            items={menuItems}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            restaurantInfo={restaurantInfo}
            onUpdateRestaurant={handleUpdateRestaurant}
            categories={categories}
            onAddCategory={handleAddCategory}
            onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-30 glass-panel border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden">
                {restaurantInfo.logo ? (
                    <img src={restaurantInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                    <UtensilsCrossed className="w-5 h-5" />
                )}
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-gray-900">{restaurantInfo.name}</h1>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Search - Desktop */}
             <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2"/>
                <input 
                    type="text" 
                    placeholder="Search menu..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-48"
                />
             </div>

             {/* Language Toggle */}
             <button 
                onClick={() => setLanguage(prev => prev === 'EN' ? 'FR' : 'EN')}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
                title="Switch Language"
             >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold">{language}</span>
             </button>

             {/* Admin Toggle Button (Hidden in plain sight) */}
             <button 
                onClick={() => setIsAdminOpen(true)}
                className="p-2 text-gray-300 hover:text-gray-900 transition-colors"
                title="Admin Panel"
             >
                 <Lock className="w-4 h-4" />
             </button>

            <button 
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors group"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Categories Scroll */}
        <div className="border-t border-gray-100 overflow-x-auto no-scrollbar">
            <div className="max-w-4xl mx-auto px-4 flex gap-8 h-12 items-center min-w-max">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`relative font-medium text-sm transition-colors py-3 px-2 ${
                            activeCategory === cat ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {cat}
                        {activeCategory === cat && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full layout-id-underline"></span>
                        )}
                    </button>
                ))}
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Search */}
        <div className="md:hidden mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <input 
                type="text" 
                placeholder="Find your favorite dish..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
        </div>

        <div className="mb-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif font-bold text-gray-900">{activeCategory}</h2>
                <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isVegOnly ? 'text-green-700' : 'text-gray-400 group-hover:text-gray-600'}`}>Veg Only</span>
                    <div className={`relative w-8 h-4 rounded-full transition-colors duration-300 ease-in-out ${isVegOnly ? 'bg-green-600' : 'bg-gray-300'}`}>
                        <div className={`absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${isVegOnly ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                    <input type="checkbox" className="hidden" checked={isVegOnly} onChange={(e) => setIsVegOnly(e.target.checked)} />
                </label>
            </div>
            <p className="text-gray-500 text-sm mt-1">Explore our curated selection.</p>
        </div>

        {/* List View Layout */}
        <div className="flex flex-col gap-4">
          {filteredItems.map(item => (
            <MenuCard 
              key={item.id} 
              item={item} 
              onOpenAR={handleOpenAR} 
              onOpenModal={(i) => setSelectedItem(i)}
            />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-4">
                <p className="text-gray-400 text-lg">
                    {isVegOnly ? "No vegetarian items found in this category." : "No items found matching your criteria."}
                </p>
                <button 
                    onClick={() => {
                        setSearchQuery(''); 
                        if(filteredItems.length === 0 && isVegOnly) {
                             // Keep category, just clear search or maybe they want to toggle off veg
                             setIsVegOnly(false);
                        } else {
                            setActiveCategory(categories[0] || 'Mains');
                        }
                    }}
                    className="mt-4 text-primary font-medium hover:underline"
                >
                    View all Items
                </button>
            </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
            <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="font-serif text-xl font-bold">Your Order</h2>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
                            <ShoppingBag className="w-16 h-16 opacity-20" />
                            <p>Your cart is empty.</p>
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="text-primary font-medium hover:underline"
                            >
                                Start Ordering
                            </button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.cartItemId} className="flex gap-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                        <button onClick={() => handleRemoveFromCart(item.cartItemId)} className="text-gray-300 hover:text-red-500">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500">{item.selectedSize.label}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.selectedAddOns.map(a => a.name).join(', ')}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Qty: {item.quantity}</span>
                                        <span className="font-semibold">${item.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-between mb-2 text-gray-600">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-6 text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Modals & Overlays */}
      {selectedItem && (
        <ItemModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onAddToCart={handleAddToCart}
          onOpenAR={handleOpenAR}
        />
      )}

      {arItem && (
        <ARViewer 
          item={arItem} 
          onClose={() => setArItem(null)} 
        />
      )}

      {/* Chat Assistant (Always visible in User Mode) */}
      {!isAdminOpen && <ChefAssistant />}
    </div>
  );
};

export default App;