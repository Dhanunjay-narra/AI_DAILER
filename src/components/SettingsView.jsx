import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { makeRealCellularCall } from '../services/telephonyService';
import { 
  Globe, 
  Volume2, 
  Radio, 
  Key, 
  Trash2, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  Smartphone,
  Database,
  PhoneCall,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';

export function SettingsView({ onOpenLanguageModal, onOpenDatabaseModal }) {
  const { 
    t, 
    language, 
    languagesList, 
    user, 
    logout, 
    soundEnabled, 
    setSoundEnabled,
    isCloudDbConnected 
  } = useApp();

  // Bland.ai API Key state (pre-filled with verified active key)
  const [blandKey, setBlandKey] = useState(() => {
    return localStorage.getItem('ai_dialer_bland_key') || 'org_6f69a9550569a54358572b48cb479e4416c1445d841c748aea1056c612a1c485494f1e493e5c6e78a3ff69';
  });

  // Fast2SMS API Key state
  const [fast2SmsKey, setFast2SmsKey] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_dialer_sms_config');
      return saved ? JSON.parse(saved).fast2SmsKey || '' : '';
    } catch {
      return '';
    }
  });

  // Live Call Test State
  const [testPhoneNumber, setTestPhoneNumber] = useState(user?.phone ? user.phone.replace(/\D/g, '').slice(-10) : '9848012345');
  const [isCallingTest, setIsCallingTest] = useState(false);
  const [callTestResult, setCallTestResult] = useState(null);

  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  const currentLang = languagesList.find(l => l.code === language) || languagesList[0];

  const handleSaveApiKeys = (e) => {
    e.preventDefault();
    localStorage.setItem('ai_dialer_bland_key', blandKey.trim());
    
    const smsConfig = { fast2SmsKey: fast2SmsKey.trim() };
    localStorage.setItem('ai_dialer_sms_config', JSON.stringify(smsConfig));

    setSavedSuccessMsg('✓ సెట్టింగ్స్ విజయవంతంగా భద్రపరచబడ్డాయి!');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  const handleTriggerLiveCall = async () => {
    if (!testPhoneNumber || testPhoneNumber.replace(/\D/g, '').length < 10) {
      alert('దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ రాయండి');
      return;
    }

    setIsCallingTest(true);
    setCallTestResult(null);

    const prompt = language === 'te'
      ? 'మీరు AI డయలర్ అసిస్టెంట్. యూజర్‌కి తెలుగులో మర్యాదగా మాట్లాడి, "నమస్కారం! ఇది AI DIALER నుండి లైవ్ టెస్ట్ కాల్. మీ సిస్టమ్ మరియు వాయిస్ కాల్ విజయవంతంగా కనెక్ట్ అయ్యాయి" అని చెప్పండి.'
      : 'You are AI DIALER assistant. Greet politely and inform the receiver that this is a live test call from AI DIALER and their telephony system is connected successfully.';

    const result = await makeRealCellularCall(testPhoneNumber, prompt, blandKey.trim());
    setIsCallingTest(false);
    setCallTestResult(result);
  };

  const handleClearHistory = () => {
    if (confirm('అన్ని కాల్ లాగ్స్ మరియు తాత్కాలిక కాష్ క్లియర్ చేయాలా?')) {
      localStorage.removeItem('ai_dialer_call_logs');
      localStorage.removeItem('ai_dialer_reception_records');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 pb-28 space-y-4 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-pastel-900 font-serif">
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-pastel-500">
          రియల్ కాలింగ్ గేట్‌వే, SMS మరియు డేటాబేస్ సెట్టింగ్స్
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

      {/* Database Section */}
      <div className="rounded-2xl bg-white border border-pastel-200 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-pastel-800 uppercase tracking-wider flex items-center space-x-1.5">
          <Database className="w-4 h-4 text-pastel-600" />
          <span>డేటాబేస్ స్టోరేజ్ (Database Storage)</span>
        </h3>

        <div className="flex items-center justify-between p-3 rounded-xl bg-pastel-50 border border-pastel-200">
          <div>
            <p className="text-xs font-bold text-pastel-900">
              {isCloudDbConnected ? '🟢 Supabase Cloud Database' : '🟡 Local Storage Database'}
            </p>
            <p className="text-[10px] text-pastel-500">
              {isCloudDbConnected ? 'డేటా క్లౌడ్‌లో సురక్షితంగా సింక్ అవుతోంది' : 'బ్రౌజర్ లోకల్ స్టోరేజ్‌లో సేవ్ అవుతోంది'}
            </p>
          </div>

          <button
            onClick={onOpenDatabaseModal}
            className="px-3 py-1.5 rounded-lg bg-pastel-600 text-white text-xs font-semibold hover:bg-pastel-700 transition"
          >
            కాన్ఫిగర్ చేయండి
          </button>
        </div>
      </div>

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

      {/* REAL TELEPHONY CALLING GATEWAY SECTION */}
      <div className="rounded-2xl bg-white border border-pastel-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-pastel-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Radio className="w-4 h-4 text-pastel-600" />
            <span>రియల్ టెలిఫోనీ కాలింగ్ (Bland.ai Voice Gateway)</span>
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pastel-100 text-pastel-800 font-semibold">
            Live Cellular
          </span>
        </div>

        <p className="text-[11px] text-pastel-600 leading-relaxed">
          మొబైల్ ఫోన్‌లకు నిజమైన సెల్యులార్ కాల్స్ పంపడానికి Bland.ai వాయిస్ ఇంజిన్ ఉపయోగపడుతుంది.
        </p>

        {/* API Key Form */}
        <form onSubmit={handleSaveApiKeys} className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-pastel-800">
                Bland.ai API Secret Key / Org Token:
              </label>
              <a 
                href="https://app.bland.ai/dashboard?page=settings" 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] text-pastel-600 hover:text-pastel-900 underline flex items-center space-x-0.5"
              >
                <span>Bland.ai Dashboard</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="text"
              value={blandKey}
              onChange={(e) => setBlandKey(e.target.value)}
              placeholder="org_... లేదా sk_live_..."
              className="w-full px-3 py-2 rounded-xl bg-pastel-50 border border-pastel-200 text-xs text-pastel-900 focus:outline-none focus:border-pastel-500 font-mono"
            />
            <p className="text-[10px] text-pastel-400 mt-1">
              💡 గమనిక: Bland.ai నుండి మీ Secret API Key ని ఇక్కడ నమోదు చేయండి.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-pastel-800">
                Fast2SMS API Key (రియల్ మొబైల్ SMS ల కోసం):
              </label>
              <a 
                href="https://www.fast2sms.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] text-pastel-600 hover:text-pastel-900 underline flex items-center space-x-0.5"
              >
                <span>Fast2SMS.com</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="text"
              value={fast2SmsKey}
              onChange={(e) => setFast2SmsKey(e.target.value)}
              placeholder="భారతీయ నంబర్లకు SMS పంపడానికి Fast2SMS API కీ..."
              className="w-full px-3 py-2 rounded-xl bg-pastel-50 border border-pastel-200 text-xs text-pastel-900 focus:outline-none focus:border-pastel-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-pastel-600 hover:bg-pastel-700 text-white text-xs font-semibold shadow-xs transition"
            >
              కీలు సేవ్ చేయండి (Save Keys)
            </button>
            {savedSuccessMsg && (
              <span className="text-[11px] font-semibold text-emerald-600 animate-fade-in">
                {savedSuccessMsg}
              </span>
            )}
          </div>
        </form>

        {/* Live Test Call Directly To User's Mobile Phone */}
        <div className="mt-4 pt-3 border-t border-pastel-200/70">
          <h4 className="text-xs font-bold text-pastel-800 mb-2 flex items-center space-x-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-pastel-600" />
            <span>మీ మొబైల్ నంబర్‌కు లైవ్ టెస్ట్ కాల్ చేయండి (Live Test Call)</span>
          </h4>

          <div className="flex space-x-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-xs text-pastel-400 font-mono">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="10 అంకెల మొబైల్ నంబర్"
                className="w-full pl-11 pr-3 py-2 rounded-xl bg-pastel-50 border border-pastel-200 text-xs font-mono text-pastel-900 focus:outline-none focus:border-pastel-500"
              />
            </div>

            <button
              type="button"
              onClick={handleTriggerLiveCall}
              disabled={isCallingTest}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-pastel-600 to-pastel-700 hover:from-pastel-700 hover:to-pastel-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs disabled:opacity-50 transition"
            >
              {isCallingTest ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>కనెక్ట్ చేస్తోంది...</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>నాకు కాల్ చేయి</span>
                </>
              )}
            </button>
          </div>

          {/* Test Call Status Feedback */}
          {callTestResult && (
            <div className={`mt-2.5 p-3 rounded-xl text-xs border animate-fade-in ${
              callTestResult.status === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {callTestResult.status === 'success' ? (
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>కాల్ మీ ఫోన్‌కు పంపబడింది!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">{callTestResult.message}</p>
                  {callTestResult.callId && (
                    <p className="text-[10px] font-mono text-emerald-600">Call ID: {callTestResult.callId}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>కాల్ కనెక్ట్ అవ్వలేదు (API Message)</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-snug">{callTestResult.message}</p>
                  {callTestResult.isAuthFailure && (
                    <div className="p-2 rounded-lg bg-white/70 border border-amber-300 text-[10px] text-amber-900 space-y-1">
                      <p className="font-semibold">💡 సహాయం (Fix Instruction):</p>
                      <p>
                        Bland.ai డ్యాష్‌బోర్డ్ ➔ Settings ➔ API Keys లో ఉండే పూర్తి Secret API Key ని ఇక్కడ ఎంటర్ చేయండి.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Audio & Sound FX */}
      <div className="rounded-2xl bg-white border border-pastel-200 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-pastel-800 uppercase tracking-wider flex items-center space-x-1.5">
          <Volume2 className="w-4 h-4 text-pastel-600" />
          <span>ఆడియో & రింగ్ టోన్స్ (Audio & Sound Effects)</span>
        </h3>

        <div className="flex items-center justify-between p-2">
          <div>
            <p className="text-xs font-semibold text-pastel-900">ఫోన్ డయలర్ రింగ్ టోన్స్</p>
            <p className="text-[10px] text-pastel-500">కాల్ సమయంలో అసలైన టెలిఫోన్ డయల్ టోన్‌లను ప్లే చేస్తుంది</p>
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
          <span>డేటా & కాల్ లాగ్స్ క్లియర్ చేయండి (Clear Cache)</span>
        </button>
      </div>

      {/* Version Tag */}
      <div className="text-center pt-2 text-[11px] text-pastel-400">
        AI DIALER v1.0.0 • Classic Pastel White & Brown Edition
      </div>
    </div>
  );
}
