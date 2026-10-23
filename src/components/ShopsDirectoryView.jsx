import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORY_SHOPS } from '../services/storeDatabase';
import { executeAiCallToShop } from '../services/aiCallingService';
import { Store, PhoneCall, Star, MapPin, Navigation, Filter } from 'lucide-react';

export function ShopsDirectoryView() {
  const { 
    t, 
    language, 
    location, 
    addCallLog, 
    setActiveCallSession 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');

  const allCategoryShops = [
    ...CATEGORY_SHOPS.plastic.map(s => ({ ...s, category: 'plastic' })),
    ...CATEGORY_SHOPS.hardware.map(s => ({ ...s, category: 'hardware' })),
    ...CATEGORY_SHOPS.general.map(s => ({ ...s, category: 'general' })),
  ];

  const filtered = activeCategory === 'all' 
    ? allCategoryShops 
    : allCategoryShops.filter(s => s.category === activeCategory);

  const handleCallShop = async (shop) => {
    setActiveCallSession({
      shop,
      status: 'dialing',
      transcript: [],
      statusText: 'Connecting...'
    });

    const result = await executeAiCallToShop(shop, language, (update) => {
      setActiveCallSession(prev => ({
        ...prev,
        ...update
      }));
    });

    addCallLog(result);
  };

  return (
    <div className="max-w-xl mx-auto p-4 pb-24 space-y-4">
      
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-pastel-900 font-serif">
          {t.allShopsInArea}
        </h2>
        <p className="text-xs text-pastel-500 flex items-center space-x-1 mt-0.5">
          <MapPin className="w-3 h-3 text-pastel-600" />
          <span>Near {location.areaName}</span>
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Stores' },
          { id: 'plastic', label: 'Plastics & Containers' },
          { id: 'hardware', label: 'Hardware & Tools' },
          { id: 'general', label: 'Supermarkets' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              activeCategory === cat.id
                ? 'bg-pastel-600 text-white shadow-sm'
                : 'bg-white border border-pastel-200 text-pastel-700 hover:bg-pastel-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stores List */}
      <div className="space-y-3">
        {filtered.map((shop, idx) => {
          const displayName = (language === 'te' && shop.nameTe) ? shop.nameTe : shop.name;

          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-pastel-200 shadow-xs flex items-center justify-between hover:border-pastel-400 transition"
            >
              <div className="space-y-1 mr-3">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-pastel-900">
                    {displayName}
                  </h4>
                  <div className="flex items-center space-x-0.5 text-amber-600 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{shop.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-pastel-600">
                  {shop.type}
                </p>

                <p className="text-[11px] text-pastel-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{shop.address}, {location.areaName} • <strong className="text-pastel-700">{shop.distanceKm} km</strong></span>
                </p>
              </div>

              {/* Call Shop Action */}
              <button
                onClick={() => handleCallShop(shop)}
                className="flex-shrink-0 px-3.5 py-2.5 rounded-xl bg-pastel-600 hover:bg-pastel-700 active:scale-95 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>AI Call</span>
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}

