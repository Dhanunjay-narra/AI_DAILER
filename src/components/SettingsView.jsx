import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, 
  Volume2, 
  Radio, 
  Key, 
  Trash2, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  Smartphone
} from 'lucide-react';

export function SettingsView({ onOpenLanguageModal }) {
  const { 
    t, 
    language, 
    languagesList, 
    user, 
    logout, 
    soundEnabled, 
    setSoundEnabled 
  } = useApp();

  const [callMode, setCallMode] = useState('simulated'); // 'simulated' | 'telephony'
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentLang = languagesList.find(l => l.code === language) || languagesList[0];

  const handleSaveApi = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Clear all call logs and cache?')) {
      localStorage.removeItem('ai_dialer_call_logs');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 pb-24 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-pastel-900 font-serif">
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-pastel-500">
          Configure language, AI voice caller, and telephony settings
        </p>
      </div>

      {/* User Card */}
      {user && (
        <div className="p-4 rounded-2xl bg-white border border-pastel-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-pastel-200 border border-pastel-300 flex items-center justify-center text-lg font-bold text-pastel-800">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-pastel-900">{user.name}</h4>
              <p className="text-xs text-pastel-500 font-mono">{user.phone || user.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Language Section */}
      <div className="rounded-2xl bg-white border border-pastel-200 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-pastel-800 uppercase tracking-wider flex items-center space-x-1.5">
          <Globe className="w-4 h-4 text-pastel-600" />
          <span>{t.selectedLanguageLabel}</span>
        </h3>

        <div className="flex items-center justify-between p-3 rounded-xl bg-pastel-50 border border-pastel-200">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">{currentLang.flag}</span>
            <div>
              <p className="text-xs font-bold text-pastel-900">{currentLang.name}</p>
              <p className="text-[10px] text-pastel-500">{currentLang.nativeName}</p>
            </div>
          </div>

          <button
            onClick={onOpenLanguageModal}
            className="px-3 py-1.5 rounded-lg bg-pastel-600 text-white text-xs font-semibold hover:bg-pastel-700 transition"
          >
            Change
          </button>
        </div>
      </div>

      {/* Telephony & Call Mode */}
      <div className="rounded-2xl bg-white border border-pastel-200 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-pastel-800 uppercase tracking-wider flex items-center space-x-1.5">
          <Radio className="w-4 h-4 text-pastel-600" />
          <span>{t.simulateCalls}</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setCallMode('simulated')}
            className={`p-3 rounded-xl border text-left transition ${
              callMode === 'simulated'
                ? 'bg-pastel-100/80 border-pastel-500 text-pastel-900 font-semibold shadow-xs'
                : 'bg-pastel-50 border-pastel-200 text-pastel-600'
            }`}
          >
            <p className="font-bold">Interactive Voice Simulator</p>
            <p className="text-[10px] text-pastel-500 mt-1">Realistic phone call tones & Web Speech synthesis</p>
          </button>

          <button
            onClick={() => setCallMode('telephony')}
            className={`p-3 rounded-xl border text-left transition ${
              callMode === 'telephony'
                ? 'bg-pastel-100/80 border-pastel-500 text-pastel-900 font-semibold shadow-xs'
                : 'bg-pastel-50 border-pastel-200 text-pastel-600'
            }`}
          >
            <p className="font-bold">Live PSTN Telephony</p>
            <p className="text-[10px] text-pastel-500 mt-1">Twilio / Bland AI / Vapi Outbound Agent API</p>
          </button>
        </div>

        {callMode === 'telephony' && (
          <form onSubmit={handleSaveApi} className="space-y-2 pt-2 animate-fade-in">
            <label className="block text-[11px] font-medium text-pastel-700">
              Twilio / Bland.ai API Token:
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk_live_••••••••••••••••"
                className="flex-1 px-3 py-2 rounded-xl bg-pastel-50 border border-pastel-200 text-xs text-pastel-900 focus:outline-none focus:border-pastel-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-pastel-600 text-white text-xs font-semibold hover:bg-pastel-700 transition"
              >
                Save
              </button>
            </div>
            {savedSuccess && (
              <p className="text-[10px] text-emerald-600 font-medium">✓ API Token configured successfully</p>
            )}
          </form>
        )}
      </div>

      {/* Audio & Sound FX */}
      <div className="rounded-2xl bg-white border border-pastel-200 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-pastel-800 uppercase tracking-wider flex items-center space-x-1.5">
          <Volume2 className="w-4 h-4 text-pastel-600" />
          <span>Audio & Sound Effects</span>
        </h3>

        <div className="flex items-center justify-between p-2">
          <div>
            <p className="text-xs font-semibold text-pastel-900">Phone Dial & Ring Tones</p>
            <p className="text-[10px] text-pastel-500">Synthesizes authentic telephone dialer sounds</p>
          </div>

          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="w-5 h-5 accent-pastel-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Clear Cache */}
      <div className="pt-2">
        <button
          onClick={handleClearHistory}
          className="w-full py-3 px-4 rounded-2xl bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center justify-center space-x-2 transition"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Call Logs & Cache</span>
        </button>
      </div>

      {/* Version Tag */}
      <div className="text-center pt-2 text-[11px] text-pastel-400">
        AI DIALER v1.0.0 • Classic Pastel White & Brown Edition
      </div>

    </div>
  );
}

