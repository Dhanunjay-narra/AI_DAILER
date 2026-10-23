import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';

export function SplashModal({ onComplete, onOpenLanguageSelector }) {
  const { t, language, languagesList } = useApp();
  const currentLangObj = languagesList.find(l => l.code === language) || languagesList[0];

  const [fade, setFade] = useState(false);

  const handleStart = () => {
    setFade(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#FAF7F2] via-[#F5EFEB] to-[#EFE7DE] p-6 transition-opacity duration-400 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Top Language Bar */}
      <div className="w-full max-w-md flex justify-between items-center pt-4">
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-pastel-200 shadow-sm text-xs text-pastel-700">
          <Sparkles className="w-3.5 h-3.5 text-pastel-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="font-medium tracking-wide">AI VOICE DIALER</span>
        </div>

        <button
          onClick={onOpenLanguageSelector}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-pastel-200 text-pastel-800 text-xs font-medium shadow-sm hover:bg-pastel-50 transition active:scale-95"
        >
          <span className="text-sm">{currentLangObj.flag}</span>
          <span>{currentLangObj.name}</span>
          <Globe className="w-3.5 h-3.5 text-pastel-500 ml-1" />
        </button>
      </div>

      {/* Center Branding & Logo */}
      <div className="flex flex-col items-center text-center my-auto px-4 max-w-sm">
        
        {/* Animated Ripple Logo Container */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute w-40 h-40 rounded-full bg-pastel-300/30 animate-pulse-ring"></div>
          <div className="absolute w-32 h-32 rounded-full bg-pastel-400/20 animate-pulse-ring" style={{ animationDelay: '0.6s' }}></div>
          
          <div className="relative w-28 h-28 rounded-3xl bg-white p-3.5 shadow-soft-lg border-2 border-pastel-200 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/logo.svg" 
              alt="AI DIALER Logo" 
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-pastel-900 font-serif mb-2">
          AI DIALER
        </h1>

        <p className="text-xs uppercase tracking-widest text-pastel-500 font-semibold mb-4">
          Autonomous Store Calling
        </p>

        {/* Tagline translated */}
        <p className="text-sm text-pastel-700 leading-relaxed font-sans px-2">
          {t.tagline}
        </p>

        {/* Pastel Color Aesthetic Pills */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          <span className="w-2.5 h-2.5 rounded-full bg-white border border-pastel-300 shadow-sm" title="Pastel White"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-pastel-200" title="Almond Latte"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-pastel-400" title="Warm Mocha"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-pastel-600" title="Espresso Brown"></span>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="w-full max-w-sm pb-8 flex flex-col items-center">
        <button
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pastel-600 to-pastel-700 text-white font-medium text-sm shadow-soft-lg hover:shadow-xl hover:from-pastel-700 hover:to-pastel-800 active:scale-[0.98] transition flex items-center justify-center space-x-2"
        >
          <span>{t.getStarted}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-pastel-500 mt-4 text-center">
          Classic Pastel White & Warm Brown Edition
        </p>
      </div>

    </div>
  );
}

