import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PhoneCall, 
  PhoneOff, 
  Store, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Volume2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function CallingModal() {
  const { 
    activeCallSession, 
    endCurrentCall, 
    t, 
    language, 
    location 
  } = useApp();

  if (!activeCallSession) return null;

  const { shop, status, transcript = [], statusText, priceQuoted, stockStatus } = activeCallSession;
  const isCompleted = status === 'completed';

  useEffect(() => {
    if (isCompleted && stockStatus === 'available') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#9B724D', '#D5BBA3', '#7E5938', '#E5D3C2']
        });
      } catch (e) {
        // confetti fallback
      }
    }
  }, [isCompleted, stockStatus]);

  const shopDisplayName = (language === 'te' && shop.nameTe) ? shop.nameTe : shop.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pastel-900/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white border border-pastel-200 shadow-soft-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Active Call Card */}
        <div className="bg-gradient-to-b from-pastel-100 via-pastel-50 to-white p-6 border-b border-pastel-200 text-center relative">
          
          {/* Top AI Dialer Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/90 border border-pastel-200 shadow-sm text-[11px] font-semibold text-pastel-700 mb-4">
            <span className="w-2 h-2 rounded-full bg-pastel-600 animate-ping"></span>
            <span>{t.dialingTitle}</span>
          </div>

          {/* Shop Avatar & Radar Ripple */}
          <div className="relative w-20 h-20 mx-auto mb-3 flex items-center justify-center">
            {!isCompleted ? (
              <>
                <div className="absolute inset-0 rounded-full bg-pastel-300/40 animate-pulse-ring"></div>
                <div className="absolute inset-0 rounded-full bg-pastel-400/20 animate-pulse-ring" style={{ animationDelay: '0.7s' }}></div>
              </>
            ) : null}

            <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-soft border-2 transition-transform ${
              isCompleted 
                ? (stockStatus === 'available' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-red-50 border-red-300 text-red-700')
                : 'bg-white border-pastel-300 text-pastel-800'
            }`}>
              {isCompleted ? (
                stockStatus === 'available' ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />
              ) : (
                <Store className="w-8 h-8 text-pastel-600" />
              )}
            </div>
          </div>

          {/* Store Name & Phone */}
          <h3 className="text-lg font-bold text-pastel-900 font-serif">
            {shopDisplayName}
          </h3>
          <p className="text-xs font-mono text-pastel-500 mt-0.5">
            {shop.phone} • {shop.distanceKm} km away
          </p>

          {/* Status Chip */}
          <div className="mt-3">
            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              status === 'dialing' || status === 'ringing' 
                ? 'bg-amber-100 text-amber-800' 
                : status === 'talking' 
                ? 'bg-pastel-200 text-pastel-900 animate-pulse'
                : stockStatus === 'available' 
                ? 'bg-emerald-100 text-emerald-800 font-semibold' 
                : 'bg-stone-200 text-stone-800'
            }`}>
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{statusText || 'Processing...'}</span>
            </span>
          </div>

          {/* Animated Audio Waveform when talking */}
          {status === 'talking' && (
            <div className="flex items-center justify-center space-x-1.5 mt-4 h-6">
              <span className="w-1 bg-pastel-500 rounded-full animate-wave-bar" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-1 bg-pastel-600 rounded-full animate-wave-bar" style={{ animationDelay: '0.3s' }}></span>
              <span className="w-1 bg-pastel-700 rounded-full animate-wave-bar" style={{ animationDelay: '0.5s' }}></span>
              <span className="w-1 bg-pastel-500 rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1 bg-pastel-400 rounded-full animate-wave-bar" style={{ animationDelay: '0.4s' }}></span>
            </div>
          )}
        </div>

        {/* Live Conversation Transcript */}
        <div className="p-4 overflow-y-auto flex-1 bg-pastel-50/50 space-y-3 min-h-[160px] max-h-[260px]">
          <div className="flex items-center justify-between text-[11px] text-pastel-500 px-1">
            <span className="font-semibold uppercase tracking-wider">{t.liveTranscript}</span>
            <span className="flex items-center space-x-1 text-pastel-600 font-medium">
              <Volume2 className="w-3.5 h-3.5" />
              <span>AI Speech Engine</span>
            </span>
          </div>

          {transcript.length === 0 ? (
            <div className="py-8 text-center text-xs text-pastel-400">
              <Clock className="w-5 h-5 mx-auto mb-1 opacity-50 animate-spin" style={{ animationDuration: '3s' }} />
              <p>Connecting call to local merchant...</p>
            </div>
          ) : (
            transcript.map((line, idx) => {
              const isAi = line.speaker === 'ai';
              return (
                <div 
                  key={idx} 
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} animate-fade-in`}
                >
                  <span className="text-[10px] text-pastel-500 mb-0.5 px-2">
                    {isAi ? t.aiVoice : `${shopDisplayName}:`}
                  </span>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm ${
                    isAi 
                      ? 'bg-white border border-pastel-200 text-pastel-900 rounded-tl-sm' 
                      : 'bg-pastel-600 text-white rounded-tr-sm font-medium'
                  }`}>
                    {line.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Call Completion Stock Report Card */}
        {isCompleted && (
          <div className="p-4 bg-white border-t border-pastel-200 space-y-3">
            <div className={`p-3.5 rounded-2xl border ${
              stockStatus === 'available' 
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
                : 'bg-stone-50 border-stone-200 text-stone-900'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {stockStatus === 'available' ? t.statusInStock : t.statusOutOfStock}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Quoted Price: <strong className="text-pastel-900 text-sm">{priceQuoted}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-stone-200 font-mono">
                    98% Confidence
                  </span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-emerald-100 flex items-center space-x-2 text-[11px] text-stone-600">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-pastel-600" />
                <span className="truncate">{shop.fullAddress || shop.address}</span>
              </div>
            </div>

            {/* Direct Actions: Map Directions + Call Merchant directly */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name + ' ' + (location.areaName || ''))}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-pastel-100 hover:bg-pastel-200 text-pastel-900 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-pastel-700" />
                <span>{t.directions}</span>
              </a>

              <a
                href={`tel:${shop.phone}`}
                className="py-2.5 px-3 rounded-xl bg-pastel-600 hover:bg-pastel-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t.callDirectly}</span>
              </a>
            </div>
          </div>
        )}

        {/* Footer Bottom Controls */}
        <div className="p-4 bg-pastel-50 border-t border-pastel-200 flex items-center justify-between">
          {!isCompleted ? (
            <button
              onClick={endCurrentCall}
              className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-sm transition active:scale-95"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>
          ) : (
            <button
              onClick={endCurrentCall}
              className="w-full py-3 px-4 rounded-2xl bg-pastel-700 hover:bg-pastel-800 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-sm transition active:scale-95"
            >
              <span>{t.close}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

