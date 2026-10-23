import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, LogOut } from 'lucide-react';

export function Header() {
  const { location, requestGpsLocation, user, logout } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-pastel-200 px-4 py-3 transition">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-white p-1 border border-pastel-200 shadow-xs flex items-center justify-center">
            <img src="/logo.svg" alt="AI DIALER" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-pastel-900 tracking-tight font-serif leading-none">
              AI DIALER
            </h1>
            <p className="text-[10px] text-pastel-500 font-medium tracking-wide mt-0.5">
              AI కాలింగ్ & రిసెప్షనిస్ట్
            </p>
          </div>
        </div>

        {/* Right: GPS Locality & Profile */}
        <div className="flex items-center space-x-2">
          
          {/* Quick GPS Location Badge */}
          <button
            onClick={requestGpsLocation}
            disabled={location.isDetecting}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white border border-pastel-200 text-pastel-800 text-[11px] font-semibold hover:bg-pastel-50 transition shadow-xs"
            title="GPS లొకేషన్ రిఫ్రెష్ చేయండి"
          >
            <MapPin className={`w-3 h-3 text-pastel-600 ${location.isDetecting ? 'animate-bounce' : ''}`} />
            <span className="truncate max-w-[110px]">
              {location.isDetecting ? 'లొకేషన్...' : location.areaName.split(',')[0]}
            </span>
          </button>

          {/* User Profile / Logout */}
          {user && (
            <button
              onClick={logout}
              className="w-8 h-8 rounded-full bg-pastel-200 border border-pastel-300 flex items-center justify-center text-xs font-bold text-pastel-800 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-xs"
              title="లాగౌట్ అవ్వండి"
            >
              {user.name ? user.name.slice(-2) : '👤'}
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
