import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PhoneCall, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Trash2,
  ExternalLink
} from 'lucide-react';

export function DialerLogsView() {
  const { callLogs, t, language, location } = useApp();
  const [expandedLogId, setExpandedLogId] = useState(null);

  const toggleExpand = (idx) => {
    setExpandedLogId(expandedLogId === idx ? null : idx);
  };

  return (
    <div className="max-w-xl mx-auto p-4 pb-24 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-pastel-200">
        <div>
          <h2 className="text-base font-bold text-pastel-900 font-serif">
            {t.recentCalls}
          </h2>
          <p className="text-xs text-pastel-500">
            {t.appName} automated store verification records
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-pastel-100 text-pastel-800 text-xs font-semibold">
          {callLogs.length} calls
        </span>
      </div>

      {callLogs.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-pastel-200 p-8 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-pastel-100 mx-auto flex items-center justify-center text-pastel-500 mb-3">
            <PhoneCall className="w-6 h-6" />
          </div>
          <p className="text-xs text-pastel-600 max-w-xs mx-auto leading-relaxed">
            {t.noCallsYet}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {callLogs.map((log, idx) => {
            const isExpanded = expandedLogId === idx;
            const isInStock = log.stockStatus === 'available';

            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-pastel-200 shadow-xs overflow-hidden transition"
              >
                {/* Header row */}
                <div 
                  onClick={() => toggleExpand(idx)}
                  className="p-4 cursor-pointer hover:bg-pastel-50/50 flex items-start justify-between"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isInStock 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}>
                      {isInStock ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-pastel-900">
                        {log.shopName}
                      </h4>
                      <p className="text-[11px] text-pastel-500">
                        Product: <span className="font-semibold text-pastel-800">{log.product || 'Inquiry'}</span>
                      </p>
                      <p className="text-[10px] text-pastel-400 mt-0.5 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{log.timestamp} • {log.distanceKm} km away</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isInStock 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-stone-200 text-stone-700'
                    }`}>
                      {isInStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <span className="text-xs font-bold text-pastel-900 mt-1">
                      {log.priceQuoted}
                    </span>

                    <button className="text-pastel-400 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Transcript + Direct Actions */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-pastel-100 bg-pastel-50/40 space-y-3 animate-fade-in">
                    
                    {/* Transcript snippet */}
                    {log.transcript && log.transcript.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-pastel-500 uppercase tracking-wider mb-2">
                          Call Transcript:
                        </p>
                        <div className="space-y-1.5 pl-2 border-l-2 border-pastel-200">
                          {log.transcript.map((line, lIdx) => (
                            <p key={lIdx} className="text-xs text-pastel-800 leading-snug">
                              <strong className={line.speaker === 'ai' ? 'text-pastel-600' : 'text-stone-700'}>
                                {line.speaker === 'ai' ? 'AI: ' : 'Shop: '}
                              </strong>
                              {line.text}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Address */}
                    <div className="text-[11px] text-pastel-600 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-pastel-500 flex-shrink-0" />
                      <span className="truncate">{log.address}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 pt-1">
                      <a
                        href={`tel:${log.phone}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-pastel-600 hover:bg-pastel-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Store</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(log.shopName + ' ' + (location.areaName || ''))}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-white border border-pastel-200 hover:bg-pastel-50 text-pastel-900 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-pastel-600" />
                        <span>Directions</span>
                      </a>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

