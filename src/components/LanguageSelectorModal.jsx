import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Check, X, Globe } from 'lucide-react';

export function LanguageSelectorModal({ isOpen, onClose }) {
  const { language, setLanguage, languagesList, t } = useApp();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = languagesList.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pastel-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-pastel-200 shadow-soft-lg overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-pastel-100 flex items-center justify-between bg-pastel-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-pastel-200 flex items-center justify-center text-pastel-700">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-pastel-900 font-serif">
                {t.selectLanguage}
              </h3>
              <p className="text-xs text-pastel-500">
                {t.chooseYourLanguage}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-pastel-100/70 hover:bg-pastel-200 flex items-center justify-center text-pastel-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-pastel-100">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-pastel-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language / భాష శోధించండి..."
              className="w-full pl-9 pr-4 py-2 bg-pastel-50 rounded-xl text-xs text-pastel-900 placeholder-pastel-400 border border-pastel-200 focus:outline-none focus:border-pastel-500"
            />
          </div>
        </div>

        {/* Language List */}
        <div className="p-3 overflow-y-auto space-y-1.5 flex-1">
          {filteredLanguages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => handleSelect(item.code)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition border ${
                  isSelected 
                    ? 'bg-pastel-100/90 border-pastel-400 text-pastel-900 font-semibold shadow-sm' 
                    : 'bg-white hover:bg-pastel-50 border-transparent text-pastel-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.flag}</span>
                  <div className="text-left">
                    <p className="text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-pastel-500 font-normal">{item.nativeName}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-pastel-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-pastel-50/50 border-t border-pastel-100 text-center">
          <p className="text-[11px] text-pastel-500">
            AI DIALER dynamically switches voice & translations instantly.
          </p>
        </div>
      </div>
    </div>
  );
}

