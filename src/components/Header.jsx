import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Globe, Volume2, VolumeX, Navigation, Edit2, Check, Cpu } from 'lucide-react';

export function Header({ onOpenLanguageModal, onOpenDeviceSync }) {
  const { 
    t, 
    language, 
    languagesList, 
    location, 
    requestGpsLocation, 
    updateAreaName, 
    soundEnabled, 
    setSoundEnabled,
    user,
    logout 
  } = useApp();

  const [isEditingArea, setIsEditingArea] = useState(false);
  const [tempArea, setTempArea] = useState(location.areaName);

  const currentLang = languagesList.find(l => l.code === language) || languagesList[0];

  const handleSaveArea = (e) => {
    e.preventDefault();
    if (tempArea.trim()) {
      updateAreaName(tempArea.trim());
      setIsEditingArea(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-pastel-200 px-4 py-2.5 transition">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-white p-1 border border-pastel-200 shadow-sm flex items-center justify-center">
            <img src="/logo.svg" alt="AI DIALER" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-pastel-900 tracking-tight font-serif leading-none">
              AI DIALER
            </h1>
            <span className="text-[10px] text-pastel-500 font-medium tracking-wide">
              Autonomous Store Calling
            </span>
          </div>
        </div>

        {/* Right Tools: Hardware Sync + Language + Sound + Profile */}
        <div className="flex items-center space-x-1.5">
          
          {/* Device Hardware Sync */}
          <button
            onClick={onOpenDeviceSync}
            className="w-8 h-8 rounded-full bg-white border border-pastel-200 text-pastel-700 flex items-center justify-center hover:bg-pastel-50 transition active:scale-95 shadow-sm"
            title="డివైజ్ హార్డ్‌వేర్ & పర్మిషన్స్ సింక్"
          >
            <Cpu className="w-4 h-4 text-pastel-600" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-8 h-8 rounded-full bg-white border border-pastel-200 text-pastel-700 flex items-center justify-center hover:bg-pastel-50 transition active:scale-95 shadow-sm"
            title={soundEnabled ? "Mute audio" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-pastel-600" /> : <VolumeX className="w-4 h-4 text-pastel-400" />}
          </button>

          {/* Language Switcher Pill */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-white border border-pastel-200 text-pastel-800 text-xs font-medium hover:bg-pastel-50 transition active:scale-95 shadow-sm"
          >
            <span>{currentLang.flag}</span>
            <span className="hidden sm:inline text-[11px] font-semibold">{currentLang.name}</span>
            <Globe className="w-3 h-3 text-pastel-500" />
          </button>

          {/* User Avatar */}
          {user && (
            <div 
              onClick={logout} 
              className="w-8 h-8 rounded-full bg-pastel-200 border border-pastel-300 flex items-center justify-center text-xs font-bold text-pastel-800 cursor-pointer hover:bg-pastel-300 transition shadow-sm"
              title={`Logged in as ${user.name}. Click to log out.`}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

      </div>

      {/* Location Bar */}
      <div className="max-w-xl mx-auto mt-2 pt-2 border-t border-pastel-100 flex items-center justify-between text-xs">
        
        {/* Current Area display or edit */}
        {!isEditingArea ? (
          <div className="flex items-center space-x-1.5 text-pastel-700 truncate mr-2">
            <MapPin className="w-3.5 h-3.5 text-pastel-500 flex-shrink-0" />
            <span className="font-medium truncate text-pastel-800">
              {location.areaName}
            </span>
            <button
              onClick={() => { setTempArea(location.areaName); setIsEditingArea(true); }}
              className="text-pastel-400 hover:text-pastel-700 p-0.5"
              title="Change location"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveArea} className="flex items-center space-x-1.5 flex-1 mr-2">
            <input
              type="text"
              value={tempArea}
              onChange={(e) => setTempArea(e.target.value)}
              placeholder="Enter locality / city..."
              className="px-2 py-0.5 rounded-lg border border-pastel-300 text-xs text-pastel-900 bg-white w-full max-w-[200px] focus:outline-none focus:border-pastel-600"
              autoFocus
            />
            <button
              type="submit"
              className="p-1 rounded-md bg-pastel-600 text-white hover:bg-pastel-700"
            >
              <Check className="w-3 h-3" />
            </button>
          </form>
        )}

        {/* GPS Button */}
        <button
          onClick={requestGpsLocation}
          disabled={location.isDetecting}
          className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
            location.isGpsGranted 
              ? 'bg-pastel-200/80 text-pastel-800' 
              : 'bg-white border border-pastel-200 text-pastel-600 hover:bg-pastel-50'
          }`}
        >
          <Navigation className={`w-3 h-3 text-pastel-600 ${location.isDetecting ? 'animate-spin' : ''}`} />
          <span>{location.isDetecting ? 'Detecting...' : (location.isGpsGranted ? 'GPS Active' : 'Use GPS')}</span>
        </button>

      </div>
    </header>
  );
}

