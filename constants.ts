import { MenuItem, Category } from './types';

export const CATEGORIES: Category[] = ['Starters', 'Mains', 'Desserts', 'Drinks'];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Truffle & Wild Mushroom Risotto',
    description: 'Arborio rice slowly cooked with porcini stock, finished with parmesan crisp and fresh shaved black truffle.',
    basePrice: 24,
    category: 'Mains',
    image: 'https://picsum.photos/seed/risotto/600/400',
    calories: 650,
    preparationTime: '25 min',
    isChefsChoice: true,
    isVegetarian: true,
    sizes: [
      { id: 's1', label: 'Regular', priceModifier: 0 },
      { id: 's2', label: 'Large (Shareable)', priceModifier: 12 },
    ],
    addOns: [
      { id: 'a1', name: 'Extra Truffle Shavings', price: 8 },
      { id: 'a2', name: 'Grilled Chicken', price: 6 },
    ],
    pairingNote: 'Pairs beautifully with a bold Pinot Noir or an oaked Chardonnay.'
  },
  {
    id: '2',
    name: 'Pan-Seared Scallops',
    description: 'Jumbo diver scallops served over cauliflower purée with crispy pancetta and a lemon butter reduction.',
    basePrice: 18,
    category: 'Starters',
    image: 'https://picsum.photos/seed/scallops/600/400',
    calories: 320,
    preparationTime: '15 min',
    isBestseller: true,
    isGlutenFree: true,
    sizes: [
      { id: 's1', label: '3 pieces', priceModifier: 0 },
      { id: 's2', label: '5 pieces', priceModifier: 10 },
    ],
    addOns: [
      { id: 'a3', name: 'Extra Bread', price: 3 },
      { id: 'a4', name: 'Caviar Topping', price: 15 },
    ],
    pairingNote: 'Excellent with a crisp Sauvignon Blanc.'
  },
  {
    id: '3',
    name: 'Wagyu Beef Burger',
    description: 'A5 Wagyu patty, brioche bun, aged cheddar, caramelized onions, and our signature truffle aioli.',
    basePrice: 32,
    category: 'Mains',
    image: 'https://picsum.photos/seed/burger/600/400',
    calories: 950,
    preparationTime: '20 min',
    isBestseller: true,
    sizes: [
      { id: 's1', label: 'Single Patty', priceModifier: 0 },
      { id: 's2', label: 'Double Patty', priceModifier: 14 },
    ],
    addOns: [
      { id: 'a5', name: 'Fried Egg', price: 2 },
      { id: 'a6', name: 'Avocado', price: 3 },
      { id: 'a7', name: 'Bacon', price: 4 },
    ],
    pairingNote: 'Best enjoyed with a robust Cabernet Sauvignon or a craft IPA.'
  },
  {
    id: '4',
    name: 'Spicy Tuna Tartare',
    description: 'Fresh yellowfin tuna, sesame oil, sriracha, avocado mousse, served with wonton crisps.',
    basePrice: 20,
    category: 'Starters',
    image: 'https://picsum.photos/seed/tartare/600/400',
    calories: 280,
    preparationTime: '10 min',
    isSpicy: true,
    sizes: [
      { id: 's1', label: 'Standard', priceModifier: 0 },
    ],
    addOns: [
      { id: 'a8', name: 'Extra Wonton Crisps', price: 2 },
    ],
    pairingNote: 'Try with a dry Riesling or Sake.'
  },
  {
    id: '5',
    name: 'Molten Lava Cake',
    description: 'Dark chocolate cake with a molten center, served with Madagascar vanilla bean ice cream.',
    basePrice: 14,
    category: 'Desserts',
    image: 'https://picsum.photos/seed/lava/600/400',
    calories: 550,
    preparationTime: '15 min',
    isChefsChoice: true,
    isVegetarian: true,
    sizes: [
      { id: 's1', label: 'Standard', priceModifier: 0 },
    ],
    addOns: [
      { id: 'a9', name: 'Extra Ice Cream', price: 3 },
      { id: 'a10', name: 'Fresh Berries', price: 4 },
    ],
    pairingNote: 'Perfect with a glass of Port or an Espresso Martini.'
  },
  {
    id: '6',
    name: 'Artisan Cocktail Flight',
    description: 'A tasting trio of our signature cocktails: Smoked Old Fashioned, Basil Gimlet, and Passionfruit Sour.',
    basePrice: 28,
    category: 'Drinks',
    image: 'https://picsum.photos/seed/cocktails/600/400',
    calories: 400,
    preparationTime: '5 min',
    sizes: [
      { id: 's1', label: 'Flight (3 minis)', priceModifier: 0 },
      { id: 's2', label: 'Full Size Trio', priceModifier: 20 },
    ],
    addOns: [],
    pairingNote: 'Enjoy as a starter or dessert companion.'
  }
];
