import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { deviceSync } from '../services/deviceSyncService';
import { audioTones } from '../utils/audioTones';
import { 
  Cpu, 
  MapPin, 
  Mic, 
  Volume2, 
  PhoneCall, 
  Database, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function DeviceSyncModal({ isOpen, onClose }) {
  const { 
    location, 
    updateAreaName, 
    isCloudDbConnected, 
    setCallPermissionGranted 
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState({
    location: location.isGpsGranted,
    mic: false,
    audio: true,
    telephony: true,
    database: isCloudDbConnected
  });

  if (!isOpen) return null;

  const handleSyncAll = async () => {
    setIsSyncing(true);
    const results = await deviceSync.syncAll();

    if (results.location.granted && results.location.area) {
      updateAreaName(results.location.area);
    }

    setSyncResults({
      location: results.location.granted,
      mic: results.microphone.granted,
      audio: results.audio.ready,
      telephony: true,
      database: isCloudDbConnected
    });

    setCallPermissionGranted(true);
    setIsSyncing(false);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#9B724D', '#D5BBA3', '#7E5938', '#E5D3C2']
      });
    } catch (e) {}
  };

  const testSpeaker = () => {
    audioTones.playDialBeep(900, 1400, 0.15);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-pastel-900/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white border border-pastel-200 shadow-soft-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-pastel-100 to-pastel-50 border-b border-pastel-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-pastel-200 shadow-sm flex items-center justify-center text-pastel-700">
              <Cpu className="w-5 h-5 text-pastel-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-pastel-900 font-serif">
                డివైజ్ హార్డ్‌వేర్ & పర్మిషన్స్ సింక్
              </h3>
              <p className="text-[11px] text-pastel-600">
                లొకేషన్, మైక్రోఫోన్, ఆడియో & డేటాబేస్ సిస్టమ్
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
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          
          {/* Main 1-Click Sync Button */}
          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pastel-600 to-pastel-700 hover:from-pastel-700 hover:to-pastel-800 text-white font-semibold flex items-center justify-center space-x-2 shadow-soft transition active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'అన్నింటినీ సింక్ చేస్తోంది...' : 'అన్నింటినీ ఒకే క్లిక్‌తో సింక్ చేయండి (Sync All) ⚡'}</span>
          </button>

          <p className="text-[10px] text-pastel-500 text-center">
            GPS, మైక్రోఫోన్, స్పీకర్ మరియు క్లౌడ్ డేటాబేస్ ఆటోమేటిక్‌గా యాక్టివేట్ అవుతాయి.
          </p>

          {/* Hardware List Cards */}
          <div className="space-y-2 pt-2">
            
            {/* 1. Location Card */}
            <div className="p-3 rounded-2xl bg-pastel-50 border border-pastel-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-pastel-200 flex items-center justify-center text-pastel-700">
                  <MapPin className="w-4 h-4 text-pastel-600" />
                </div>
                <div>
                  <p className="font-bold text-pastel-900">GPS లొకేషన్ (Location & Area)</p>
                  <p className="text-[10px] text-pastel-600 truncate max-w-[200px]">
                    {location.areaName}
                  </p>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                syncResults.location ? 'bg-emerald-100 text-emerald-800' : 'bg-pastel-200 text-pastel-700'
              }`}>
                {syncResults.location ? '✓ Synced' : 'Ready'}
              </span>
            </div>

            {/* 2. Microphone Card */}
            <div className="p-3 rounded-2xl bg-pastel-50 border border-pastel-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-pastel-200 flex items-center justify-center text-pastel-700">
                  <Mic className="w-4 h-4 text-pastel-600" />
                </div>
                <div>
                  <p className="font-bold text-pastel-900">మైక్రోఫోన్ (Voice Speech Input)</p>
                  <p className="text-[10px] text-pastel-500">
                    AI తో నేరుగా మాట్లాడటానికి వాయిస్ మైక్
                  </p>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                syncResults.mic ? 'bg-emerald-100 text-emerald-800' : 'bg-pastel-200 text-pastel-700'
              }`}>
                {syncResults.mic ? '✓ Granted' : 'Ready'}
              </span>
            </div>

            {/* 3. Audio & Speaker Card */}
            <div className="p-3 rounded-2xl bg-pastel-50 border border-pastel-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-pastel-200 flex items-center justify-center text-pastel-700">
                  <Volume2 className="w-4 h-4 text-pastel-600" />
                </div>
                <div>
                  <p className="font-bold text-pastel-900">ఆడియో స్పీకర్ & TTS ఇంజిన్</p>
                  <p className="text-[10px] text-pastel-500">
                    అచ్చ తెలుగు సహజ స్వరాలు & రింగ్‌టోన్స్
                  </p>
                </div>
              </div>

              <button
                onClick={testSpeaker}
                className="px-2.5 py-1 rounded-lg bg-white border border-pastel-300 text-pastel-800 text-[10px] font-bold hover:bg-pastel-100 transition"
              >
                Test Sound
              </button>
            </div>

            {/* 4. Telephony Dialer Card */}
            <div className="p-3 rounded-2xl bg-pastel-50 border border-pastel-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-pastel-200 flex items-center justify-center text-pastel-700">
                  <PhoneCall className="w-4 h-4 text-pastel-600" />
                </div>
                <div>
                  <p className="font-bold text-pastel-900">ఫోన్ కాలింగ్ డయలర్</p>
                  <p className="text-[10px] text-pastel-500">
                    AI ఆటోమేటిక్ డయలింగ్ & సెల్యులార్ డైరెక్ట్ కాల్
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ✓ Active
              </span>
            </div>

            {/* 5. Database Sync Card */}
            <div className="p-3 rounded-2xl bg-pastel-50 border border-pastel-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-pastel-200 flex items-center justify-center text-pastel-700">
                  <Database className="w-4 h-4 text-pastel-600" />
                </div>
                <div>
                  <p className="font-bold text-pastel-900">క్లౌడ్ డేటాబేస్ సింక్</p>
                  <p className="text-[10px] text-pastel-500">
                    {isCloudDbConnected ? 'Supabase PostgreSQL క్లౌడ్ కనెక్ట్ అయింది' : 'లోకల్ పెర్సిస్టెంట్ డేటాబేస్ యాక్టివ్'}
                  </p>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isCloudDbConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-pastel-200 text-pastel-700'
              }`}>
                {isCloudDbConnected ? 'Cloud Online' : 'Local Hybrid'}
              </span>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-pastel-50 border-t border-pastel-200 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-pastel-700 text-white font-semibold text-xs"
          >
            పూర్తయింది (Done)
          </button>
        </div>

      </div>
    </div>
  );
}

