import React from 'react';
import { Flame, Bookmark, Ban } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  onOpenAR: (item: MenuItem) => void;
  onOpenModal: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onOpenModal, onOpenAR }) => {
  const isAvailable = item.isAvailable !== false; // Default to true if undefined

  return (
    <div 
      onClick={() => onOpenModal(item)}
      className={`relative bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:shadow-md hover:border-amber-200 transition-all group mt-3 ${!isAvailable ? 'opacity-75 grayscale-[0.5]' : ''}`}
    >
      {/* Image Section with AR Button & Badges */}
      <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        
        {/* Badges on Image */}
        {!isAvailable && (
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                 <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                    <Ban className="w-3 h-3" /> Sold Out
                 </span>
             </div>
        )}

        {isAvailable && item.isChefsChoice && (
            <div className="absolute top-2 left-2 bg-gray-900 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-gray-800 shadow-sm">
            <Bookmark className="w-2.5 h-2.5 fill-current" /> Chef's Fav
            </div>
        )}
        {isAvailable && !item.isChefsChoice && item.isBestseller && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
            <Flame className="w-2.5 h-2.5 fill-current" /> Popular
            </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
           <div className="flex justify-between items-start">
              <h3 className={`font-bold leading-tight pr-6 line-clamp-2 ${!isAvailable ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{item.name}</h3>
               {/* Veg/Non-Veg Icon */}
              <div className={`flex-shrink-0 absolute top-3 right-3 flex items-center justify-center w-4 h-4 border ${item.isVegetarian ? 'border-green-600' : 'border-red-600'} p-0.5 rounded-[4px] bg-white`}>
                <div className={`w-full h-full rounded-full ${item.isVegetarian ? 'bg-green-600' : 'bg-red-600'}`}></div>
              </div>
           </div>
           <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-serif font-semibold text-gray-900 text-lg">${item.basePrice}</span>
          <button 
            className={`font-medium text-xs px-4 py-2 rounded-xl transition-colors ${!isAvailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
          >
            {isAvailable ? 'More Info' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};