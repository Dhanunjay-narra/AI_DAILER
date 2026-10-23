import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  X, 
  Server, 
  Cloud, 
  HardDrive,
  Key,
  Globe
} from 'lucide-react';
import { 
  getCustomDatabaseConfig, 
  setCustomDatabaseConfig, 
  SQL_SCHEMA,
  supabase 
} from '../services/database';

export function DatabaseModal({ isOpen, onClose }) {
  const currentConfig = getCustomDatabaseConfig();
  const [url, setUrl] = useState(currentConfig.supabaseUrl || '');
  const [key, setKey] = useState(currentConfig.supabaseKey || '');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const isConnected = Boolean(url && key);

  const handleSave = (e) => {
    e.preventDefault();
    setCustomDatabaseConfig(url.trim(), key.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      window.location.reload();
    }, 1000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-pastel-900/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-pastel-200 shadow-soft-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-pastel-100 to-pastel-50 border-b border-pastel-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-pastel-200 shadow-sm flex items-center justify-center text-pastel-700">
              <Database className="w-5 h-5 text-pastel-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-pastel-900 font-serif">
                క్లౌడ్ డేటాబేస్ కనెక్షన్ (Cloud Database Setup)
              </h3>
              <p className="text-[11px] text-pastel-600">
                Supabase (PostgreSQL) లేదా లోకల్ డేటాబేస్
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-pastel-100 hover:bg-pastel-200 flex items-center justify-center text-pastel-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Status Card */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isConnected 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center space-x-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isConnected ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
              }`}>
                {isConnected ? <Cloud className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-bold text-xs">
                  {isConnected ? 'క్లౌడ్ డేటాబేస్ కనెక్ట్ అయింది (Cloud DB Active)' : 'లోకల్ పెర్సిస్టెంట్ డేటాబేస్ యాక్టివ్ (Local Storage Active)'}
                </p>
                <p className="text-[10px] opacity-80">
                  {isConnected ? 'డేటా మొత్తం సురక్షితంగా క్లౌడ్‌లో స్టోర్ అవుతోంది' : 'డేటా ప్రస్తుతానికి మీ బ్రౌజర్‌లో సేవ్ అవుతోంది. ఉచిత Supabase క్లౌడ్‌కి కనెక్ట్ చేయవచ్చు.'}
                </p>
              </div>
            </div>

            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              isConnected ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
            }`}>
              {isConnected ? 'Online' : 'Local'}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-3 p-3.5 rounded-2xl bg-pastel-50 border border-pastel-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-pastel-900 uppercase tracking-wider text-[11px] flex items-center space-x-1">
                <Server className="w-3.5 h-3.5 text-pastel-600" />
                <span>Supabase డేటాబేస్ వివరాలు:</span>
              </h4>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-pastel-600 hover:text-pastel-900 font-semibold flex items-center space-x-0.5"
              >
                <span>ఉచిత Supabase అకౌంట్</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-pastel-700 mb-1">
                Supabase Project URL:
              </label>
              <div className="flex items-center bg-white rounded-xl border border-pastel-200 px-2.5 py-1.5 focus-within:border-pastel-500">
                <Globe className="w-3.5 h-3.5 text-pastel-400 mr-2" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full text-xs text-pastel-900 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-pastel-700 mb-1">
                Supabase Public Anon Key:
              </label>
              <div className="flex items-center bg-white rounded-xl border border-pastel-200 px-2.5 py-1.5 focus-within:border-pastel-500">
                <Key className="w-3.5 h-3.5 text-pastel-400 mr-2" />
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full text-xs text-pastel-900 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-pastel-600 hover:bg-pastel-700 text-white font-semibold text-xs transition active:scale-95 shadow-xs"
            >
              డేటాబేస్ లింక్ చేయండి & సేవ్ చేయండి (Save & Connect)
            </button>

            {savedSuccess && (
              <p className="text-[11px] text-emerald-700 font-bold text-center">
                ✓ డేటాబేస్ కాన్ఫిగరేషన్ సేవ్ అయింది! పేజీ రీలోడ్ అవుతోంది...
              </p>
            )}
          </form>

          {/* SQL Table Creation Script */}
          <div className="p-3.5 rounded-2xl bg-white border border-pastel-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-pastel-900 text-xs">డేటాబేస్ టేబుల్స్ స్క్రిప్ట్ (SQL Schema)</p>
                <p className="text-[10px] text-pastel-500">
                  Supabase SQL Editor లో ఒక్కసారి పేస్ట్ చేసి రన్ చేయండి
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopySql}
                className="px-2.5 py-1.5 rounded-lg bg-pastel-100 hover:bg-pastel-200 text-pastel-800 text-[11px] font-semibold flex items-center space-x-1"
              >
                {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'కాపీ అయింది!' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-2.5 rounded-xl bg-stone-900 text-stone-100 font-mono text-[10px] overflow-x-auto max-h-36">
              {SQL_SCHEMA}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-pastel-50 border-t border-pastel-200 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-pastel-700 text-white text-xs font-semibold"
          >
            పూర్తయింది (Done)
          </button>
        </div>

      </div>
    </div>
  );
}

