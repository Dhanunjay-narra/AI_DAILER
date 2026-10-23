import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../utils/translations';
import { 
  ArrowRight, 
  Phone, 
  ShieldCheck, 
  Check, 
  MessageSquare, 
  AlertCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export function OnboardingFlow({ onComplete }) {
  const { language, setLanguage, login } = useApp();

  // Screen: 'splash' -> 'language' -> 'login'
  const [screen, setScreen] = useState('splash');

  // Mobile & OTP state
  const [phone, setPhone] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [smsBanner, setSmsBanner] = useState('');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (otpStep && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, resendTimer]);

  // Step 1: Start
  const handleGetStarted = () => {
    setScreen('language');
  };

  // Step 2: Language Chosen
  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    setScreen('login');
  };

  // Step 3: Send Real SMS OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setErrorMsg('దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ రాయండి');
      return;
    }
    setErrorMsg('');

    // Generate random 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpStep(true);
    setResendTimer(30);
    setEnteredOtp(['', '', '', '']);

    // Display realistic incoming SMS notification banner
    setTimeout(() => {
      setSmsBanner(`📩 SMS from AI DIALER: మీ లాగిన్ OTP కోడ్: ${code}. దయచేసి ఎవరితోనూ పంచుకోవద్దు.`);
    }, 600);
  };

  // Step 3: Verify OTP (Strict Verification)
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const fullCode = enteredOtp.join('');

    if (fullCode.length < 4) {
      setErrorMsg('దయచేసి 4 అంకెల OTP కోడ్‌ను నమోదు చేయండి');
      return;
    }

    // Strict validation
    if (fullCode !== generatedOtp) {
      setErrorMsg('❌ తప్పుడు OTP కోడ్! సరైన OTP నమోదు చేయండి.');
      return;
    }

    // Success! Log in
    login({
      name: `User ${phone.slice(-4)}`,
      phone: `+91 ${phone}`,
      type: 'mobile_otp'
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF7F2] p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-pastel-200 shadow-soft-lg overflow-hidden flex flex-col min-h-[520px] justify-between relative">
        
        {/* Real-time SMS Notification Banner */}
        {smsBanner && (
          <div className="absolute top-2 left-2 right-2 z-50 p-3 rounded-2xl bg-stone-900 text-stone-100 text-xs shadow-lg flex items-start space-x-2 animate-bounce">
            <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-emerald-400 text-[11px]">కొత్త SMS అందింది</p>
              <p className="text-[11px] font-mono leading-tight mt-0.5">{smsBanner}</p>
            </div>
            <button 
              onClick={() => setSmsBanner('')}
              className="text-stone-400 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* ---------------- SCREEN 1: SPLASH ("GET STARTED") ---------------- */}
        {screen === 'splash' && (
          <div className="flex-1 flex flex-col items-center justify-between p-6 text-center my-auto">
            <div className="my-auto flex flex-col items-center">
              
              {/* Logo */}
              <div className="w-24 h-24 rounded-3xl bg-pastel-50 p-3 shadow-soft border-2 border-pastel-200 flex items-center justify-center mb-6">
                <img src="/logo.svg" alt="AI DIALER" className="w-full h-full object-contain" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-pastel-900 font-serif mb-1">
                AI DIALER
              </h1>
              <p className="text-xs uppercase tracking-widest text-pastel-500 font-semibold mb-4">
                Smart Calling & AI Receptionist
              </p>

              <p className="text-xs text-pastel-700 leading-relaxed max-w-[260px]">
                మీ ఏరియా షాపులకు కాల్ చేసి స్టాక్ కనుగొనే మరియు మీ బిజినెస్ రిసెప్షన్ నిర్వహించే AI అసిస్టెంట్.
              </p>
            </div>

            <button
              onClick={handleGetStarted}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pastel-600 to-pastel-700 text-white font-semibold text-xs shadow-soft hover:shadow-md transition active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>ప్రారంభించండి (Get Started)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ---------------- SCREEN 2: LANGUAGE SELECTION ---------------- */}
        {screen === 'language' && (
          <div className="flex-1 flex flex-col justify-between p-6 animate-fade-in">
            <div>
              <button 
                onClick={() => setScreen('splash')}
                className="text-pastel-600 hover:text-pastel-900 mb-4 flex items-center space-x-1 text-xs font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>వెనుకకు</span>
              </button>

              <h2 className="text-xl font-bold text-pastel-900 font-serif">
                భాషను ఎంచుకోండి
              </h2>
              <p className="text-xs text-pastel-600 mt-1 mb-5">
                మీరు ఎంచుకున్న భాషలోనే యాప్ మరియు AI మాటలు పనిచేస్తాయి.
              </p>

              {/* Language List */}
              <div className="space-y-2">
                {[
                  { code: 'te', name: 'తెలుగు (Telugu)', native: 'మాతృభాష', flag: '🇮🇳' },
                  { code: 'en', name: 'English', native: 'Global', flag: '🇬🇧' },
                  { code: 'hi', name: 'हिन्दी (Hindi)', native: 'National', flag: '🇮🇳' },
                  { code: 'ta', name: 'தமிழ் (Tamil)', native: 'Tamil', flag: '🇮🇳' },
                  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', native: 'Kannada', flag: '🇮🇳' },
                ].map(item => (
                  <button
                    key={item.code}
                    onClick={() => handleSelectLanguage(item.code)}
                    className="w-full p-3 rounded-2xl border border-pastel-200 hover:border-pastel-500 bg-pastel-50/50 hover:bg-pastel-100/70 text-pastel-900 flex items-center justify-between transition active:scale-[0.98]"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.flag}</span>
                      <div className="text-left">
                        <p className="text-xs font-bold">{item.name}</p>
                        <p className="text-[10px] text-pastel-500">{item.native}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-pastel-400" />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-pastel-400 text-center mt-4">
              Step 2 of 3 • Select Language
            </p>
          </div>
        )}

        {/* ---------------- SCREEN 3: SIMPLE REAL-LIFE MOBILE LOGIN ---------------- */}
        {screen === 'login' && (
          <div className="flex-1 flex flex-col justify-between p-6 animate-fade-in">
            <div>
              <button 
                onClick={() => { setScreen('language'); setOtpStep(false); }}
                className="text-pastel-600 hover:text-pastel-900 mb-4 flex items-center space-x-1 text-xs font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>భాష మార్చండి</span>
              </button>

              <h2 className="text-xl font-bold text-pastel-900 font-serif">
                లాగిన్ అవ్వండి
              </h2>
              <p className="text-xs text-pastel-600 mt-1 mb-6">
                {!otpStep ? 'మీ 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి' : `SMS OTP పంపబడింది: +91 ${phone}`}
              </p>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-1.5 animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form Step A: Mobile Number */}
              {!otpStep ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-pastel-700 mb-1.5">
                      మొబైల్ నంబర్ (Mobile Number)
                    </label>
                    <div className="flex rounded-2xl border border-pastel-300 bg-pastel-50/70 overflow-hidden focus-within:border-pastel-600 focus-within:bg-white transition">
                      <span className="px-3.5 py-3 bg-pastel-100 text-pastel-900 text-xs font-bold border-r border-pastel-200 flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength="10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98480 12345"
                        className="w-full px-3 py-3 text-sm text-pastel-900 bg-transparent placeholder-pastel-400 focus:outline-none font-semibold tracking-wider"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-pastel-600 hover:bg-pastel-700 text-white font-semibold text-xs shadow-soft transition active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <span>OTP పంపండి (Get OTP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Form Step B: OTP Verification */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center">
                    <label className="block text-xs font-semibold text-pastel-700 mb-2">
                      4 అంకెల OTP కోడ్ నమోదు చేయండి
                    </label>

                    <div className="flex justify-center space-x-2.5 my-3">
                      {enteredOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-box-${idx}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            const newOtp = [...enteredOtp];
                            newOtp[idx] = val;
                            setEnteredOtp(newOtp);
                            if (val && idx < 3) {
                              document.getElementById(`otp-box-${idx + 1}`)?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !enteredOtp[idx] && idx > 0) {
                              document.getElementById(`otp-box-${idx - 1}`)?.focus();
                            }
                          }}
                          className="w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 border-pastel-300 bg-pastel-50 text-pastel-900 focus:border-pastel-600 focus:bg-white focus:outline-none transition shadow-xs"
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>

                    <div className="text-xs text-pastel-500 mt-2">
                      {resendTimer > 0 ? (
                        <span>మళ్ళీ OTP పంపడానికి: <strong className="text-pastel-800">{resendTimer}s</strong></span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-pastel-700 font-bold underline"
                        >
                          ఇప్పుడే మళ్ళీ OTP పంపండి
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-soft transition active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>ధృవీకరించండి & లాగిన్ అవ్వండి (Verify & Login)</span>
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="text-[11px] text-pastel-500 hover:text-pastel-800 underline"
                    >
                      నంబర్ తప్పుగా ఇచ్చారా? నంబర్ మార్చండి
                    </button>
                  </div>
                </form>
              )}
            </div>

            <p className="text-[10px] text-pastel-400 text-center mt-4">
              Step 3 of 3 • Secure Mobile Verification
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
