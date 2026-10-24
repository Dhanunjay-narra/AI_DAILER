import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { makeRealCellularCall } from '../services/telephonyService';
import { 
  Globe, 
  Volume2, 
  Trash2, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Clock,
  MapPin,
  Sliders,
  ChevronRight,
  Database
} from 'lucide-react';

export function SettingsView({ onOpenLanguageModal, onOpenCategorySetup }) {
  const { 
    t, 
    language, 
    languagesList, 
    user, 
    logout, 
    soundEnabled, 
    setSoundEnabled,
    businessProfile,
    isCloudDbConnected 
  } = useApp();

  // Test Call State (Clean, user-facing)
  const [testPhoneNumber, setTestPhoneNumber] = useState(
    user?.phone ? user.phone.replace(/\D/g, '').slice(-10) : '9848012345'
  );
  const [isCallingTest, setIsCallingTest] = useState(false);
  const [callFeedback, setCallFeedback] = useState(null);

  const currentLang = languagesList.find(l => l.code === language) || languagesList[0];

  const handleTriggerLiveCall = async () => {
    if (!testPhoneNumber || testPhoneNumber.replace(/\D/g, '').length < 10) {
      alert('దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ రాయండి');
      return;
    }

    setIsCallingTest(true);
    setCallFeedback(null);

    const prompt = language === 'te'
      ? 'మీరు AI డయలర్ అసిస్టెంట్. యూజర్‌కి తెలుగులో మర్యాదగా మాట్లాడి, "నమస్కారం! ఇది AI DIALER నుండి లైవ్ టెస్ట్ కాల్. మీ సిస్టమ్ మరియు వాయిస్ కాల్ విజయవంతంగా కనెక్ట్ అయ్యాయి" అని చెప్పండి.'
      : 'You are AI DIALER assistant. Greet politely and inform the receiver that this is a live test call from AI DIALER and their telephony system is connected successfully.';

    try {
      const result = await makeRealCellularCall(testPhoneNumber, prompt);
      setIsCallingTest(false);
      
      if (result.status === 'success') {
        setCallFeedback({
          type: 'success',
          message: 'కాల్ విజయవంతంగా మీ ఫోన్‌కు పంపబడింది! కాసేపట్లో మీ మొబైల్ రింగ్ అవుతుంది.'
        });
      } else {
        setCallFeedback({
          type: 'error',
          message: 'కాల్ ప్రారంభం కాలేదు. దయచేసి నెట్‌వర్క్ చెక్ చేసి కొద్దిసేపటి తర్వాత మళ్ళీ ప్రయత్నించండి.'
        });
      }
    } catch {
      setIsCallingTest(false);
      setCallFeedback({
        type: 'error',
        message: 'సర్వర్ కనెక్షన్ లో సమస్య ఉంది. దయచేసి మళ్ళీ ప్రయత్నించండి.'
      });
    }
  };

  const handleClearHistory = () => {
    if (confirm('అన్ని కాల్ లాగ్స్ మరియు తాత్కాలిక కాష్ క్లియర్ చేయాలా?')) {
      localStorage.removeItem('ai_dialer_call_logs');
      localStorage.removeItem('ai_dialer_reception_records');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-pastel-900 font-serif">
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-pastel-500">
          మీ ఖాతా, వ్యాపార వివరాలు మరియు కాలింగ్ ప్రాధాన్యతలు
        </p>
      </div>

      {/* 1. User Profile Card */}
      {user && (
        <div className="p-4 rounded-3xl bg-white border border-pastel-200 shadow-soft flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pastel-200 to-pastel-300 border border-pastel-300 flex items-center justify-center text-lg font-bold text-pastel-900 shadow-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h4 className="text-sm font-bold text-pastel-900">{user.name}</h4>
              <p className="text-xs text-pastel-500 font-mono">{user.phone || '+91 98480 12345'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2.5 rounded-2xl text-stone-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
            title="లాగౌట్ అవ్వండి"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Business & Clinic Profile */}
      <div className="rounded-3xl bg-white border border-pastel-200 p-4 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-pastel-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-pastel-600" />
            <span>వ్యాపార సమాచారం (Business Profile)</span>
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
            ఆన్‌లైన్
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-pastel-50/70 border border-pastel-200 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-pastel-900 font-serif">
              {businessProfile.businessName || 'శ్రీ సాయి క్లినిక్'}
            </p>
            <span className="text-[10px] text-pastel-500 font-medium">
              OP కోటా: {businessProfile.dailySlotLimit || 150}/రోజు
            </span>
          </div>

          <div className="flex items-center text-[11px] text-pastel-600 space-x-3">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-pastel-500" />
              <span>{businessProfile.address || 'నరసరావుపేట'}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-pastel-500" />
              <span>{businessProfile.workingHours || '09:00 AM - 08:00 PM'}</span>
            </span>
          </div>
        </div>

        {onOpenCategorySetup && (
          <button
            onClick={onOpenCategorySetup}
            className="w-full py-2.5 px-3 rounded-xl bg-pastel-100 hover:bg-pastel-200 text-pastel-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-pastel-600" />
            <span>క్లినిక్ వివరాలు & పని వేళలు సవరించండి</span>
          </button>
        )}
      </div>

      {/* 3. Language Selection */}
      <div className="rounded-3xl bg-white border border-pastel-200 p-4 shadow-soft space-y-3">
        <h3 className="text-xs font-bold text-pastel-800 uppercase tracking-wider flex items-center space-x-1.5">
          <Globe className="w-4 h-4 text-pastel-600" />
          <span>యాప్ & వాయిస్ భాష (Language)</span>
        </h3>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-pastel-50 border border-pastel-200">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">{currentLang.flag}</span>
            <div>
              <p className="text-xs font-bold text-pastel-900">{currentLang.name}</p>
              <p className="text-[10px] text-pastel-500">{currentLang.nativeName}</p>
            </div>
          </div>

          <button
            onClick={onOpenLanguageModal}
            className="px-3.5 py-1.5 rounded-xl bg-pastel-600 text-white text-xs font-semibold hover:bg-pastel-700 transition shadow-xs"
          >
            మార్చండి
          </button>
        </div>
      </div>

      {/* 4. Smart AI Telephony & Live Test Call */}
      <div className="rounded-3xl bg-white border border-pastel-200 p-4 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-pastel-800 uppercase tracking-wider flex items-center space-x-1.5">
            <PhoneCall className="w-4 h-4 text-pastel-600" />
            <span>AI కాలింగ్ సేవలు (AI Calling Service)</span>
          </h3>
          <span className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>యాక్టివ్</span>
          </span>
        </div>

        <p className="text-[11px] text-pastel-600 leading-relaxed">
          AI రిసెప్షనిస్ట్ మరియు ఆటోమేటిక్ వాయిస్ కాలింగ్ సిస్టమ్ బ్యాకెండ్‌లో సిద్ధంగా ఉంది.
        </p>

        {/* Live Test Call Directly To User's Mobile Phone */}
        <div className="pt-2 border-t border-pastel-100">
          <label className="block text-xs font-semibold text-pastel-800 mb-1.5">
            మీ మొబైల్‌కు టెస్ట్ కాల్ పంపండి:
          </label>

          <div className="flex space-x-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs text-pastel-400 font-mono">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="10 అంకెల మొబైల్ నంబర్"
                className="w-full pl-11 pr-3 py-2.5 rounded-2xl bg-pastel-50 border border-pastel-200 text-xs font-mono font-semibold text-pastel-900 focus:outline-none focus:border-pastel-500"
              />
            </div>

            <button
              type="button"
              onClick={handleTriggerLiveCall}
              disabled={isCallingTest}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pastel-600 to-pastel-700 hover:from-pastel-700 hover:to-pastel-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-soft disabled:opacity-50 transition active:scale-95"
            >
              {isCallingTest ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>కనెక్ట్ చేస్తోంది...</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>కాల్ చేయి</span>
                </>
              )}
            </button>
          </div>

          {/* Test Call Clean Feedback */}
          {callFeedback && (
            <div className={`mt-2.5 p-3 rounded-2xl text-xs border animate-fade-in flex items-center space-x-2 ${
              callFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {callFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              )}
              <span className="leading-snug">{callFeedback.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* 5. Audio & Ring Tones */}
      <div className="rounded-3xl bg-white border border-pastel-200 p-4 shadow-soft space-y-3">
        <h3 className="text-xs font-bold text-pastel-800 uppercase tracking-wider flex items-center space-x-1.5">
          <Volume2 className="w-4 h-4 text-pastel-600" />
          <span>రింగ్ టోన్స్ & సౌండ్స్ (Sound Effects)</span>
        </h3>

        <div className="flex items-center justify-between p-2">
          <div>
            <p className="text-xs font-semibold text-pastel-900">ఫోన్ డయల్ టోన్‌లు</p>
            <p className="text-[10px] text-pastel-500">కాల్ సమయంలో అసలైన టెలిఫోన్ శబ్దాలను ప్లే చేస్తుంది</p>
          </div>

          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="w-5 h-5 accent-pastel-600 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* 6. Clear History */}
      <div className="pt-1">
        <button
          onClick={handleClearHistory}
          className="w-full py-3 px-4 rounded-2xl bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-xs"
        >
          <Trash2 className="w-4 h-4" />
          <span>కాల్ హిస్టరీ & తాత్కాలిక కాష్ క్లియర్ చేయండి</span>
        </button>
      </div>

      {/* Version Tag */}
      <div className="text-center pt-2 text-[11px] text-pastel-400">
        AI DIALER v1.0.0 • Classic Pastel White & Brown Edition
      </div>
    </div>
  );
}
