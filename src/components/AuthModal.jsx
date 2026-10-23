import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, User, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export function AuthModal({ isOpen, onClose }) {
  const { t, login } = useApp();

  const [authMode, setAuthMode] = useState('phone'); // 'phone' | 'email' | 'username'
  const [isSignUp, setIsSignUp] = useState(false);

  // Phone & OTP state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Email / Username state
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    setOtpStep(true);
    setTimer(30);
    setIsTimerActive(true);
    // Prefill demo OTP after brief moment for ease of testing
    setTimeout(() => {
      setOtpCode(['5', '8', '2', '9']);
    }, 800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 4) {
      alert('Please enter complete 4-digit OTP');
      return;
    }
    login({
      name: `User ${phoneNumber.slice(-4)}`,
      phone: `+91 ${phoneNumber}`,
      type: 'phone_otp',
      avatar: '👤'
    });
    onClose();
  };

  const handleEmailUsernameAuth = (e) => {
    e.preventDefault();
    login({
      name: authMode === 'email' ? email.split('@')[0] : username,
      email: authMode === 'email' ? email : `${username}@aidialer.app`,
      type: authMode,
      avatar: '👤'
    });
    onClose();
  };

  const handleGuestDemo = () => {
    login({
      name: 'Pavan (Demo User)',
      phone: '+91 98480 12345',
      email: 'pavan@aidialer.app',
      isGuest: true,
      avatar: '✨'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pastel-900/50 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white border border-pastel-200 shadow-soft-lg overflow-hidden flex flex-col">
        
        {/* Top Header Card */}
        <div className="p-6 bg-gradient-to-b from-pastel-100/90 to-pastel-50 border-b border-pastel-200 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-soft mx-auto mb-3 border border-pastel-200 flex items-center justify-center">
            <img src="/logo.svg" alt="AI DIALER" className="w-full h-full object-contain" />
          </div>

          <h2 className="text-xl font-bold text-pastel-900 font-serif">
            {isSignUp ? t.createAccountTitle : t.welcomeBack}
          </h2>
          <p className="text-xs text-pastel-600 mt-1 max-w-xs mx-auto">
            {t.appName} - {t.tagline}
          </p>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-4 inline-flex p-1 bg-white/80 rounded-xl border border-pastel-200 text-xs">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setOtpStep(false); }}
              className={`px-4 py-1.5 rounded-lg font-medium transition ${
                !isSignUp ? 'bg-pastel-600 text-white shadow-sm' : 'text-pastel-700 hover:text-pastel-900'
              }`}
            >
              {t.signIn}
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setOtpStep(false); }}
              className={`px-4 py-1.5 rounded-lg font-medium transition ${
                isSignUp ? 'bg-pastel-600 text-white shadow-sm' : 'text-pastel-700 hover:text-pastel-900'
              }`}
            >
              {t.signUp}
            </button>
          </div>
        </div>

        {/* Auth Method Selector Tabs */}
        <div className="flex border-b border-pastel-100 bg-pastel-50/40 px-3 pt-3">
          <button
            onClick={() => { setAuthMode('phone'); setOtpStep(false); }}
            className={`flex-1 pb-2.5 text-xs font-medium flex items-center justify-center space-x-1.5 border-b-2 transition ${
              authMode === 'phone'
                ? 'border-pastel-600 text-pastel-900 font-semibold'
                : 'border-transparent text-pastel-500 hover:text-pastel-700'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{t.phoneWithOtp}</span>
          </button>

          <button
            onClick={() => setAuthMode('email')}
            className={`flex-1 pb-2.5 text-xs font-medium flex items-center justify-center space-x-1.5 border-b-2 transition ${
              authMode === 'email'
                ? 'border-pastel-600 text-pastel-900 font-semibold'
                : 'border-transparent text-pastel-500 hover:text-pastel-700'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{t.emailPass}</span>
          </button>

          <button
            onClick={() => setAuthMode('username')}
            className={`flex-1 pb-2.5 text-xs font-medium flex items-center justify-center space-x-1.5 border-b-2 transition ${
              authMode === 'username'
                ? 'border-pastel-600 text-pastel-900 font-semibold'
                : 'border-transparent text-pastel-500 hover:text-pastel-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.usernamePass}</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Method 1: Phone + OTP */}
          {authMode === 'phone' && (
            <div>
              {!otpStep ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-pastel-700 mb-1.5">
                      {t.phoneWithOtp}
                    </label>
                    <div className="flex rounded-2xl border border-pastel-200 bg-pastel-50 overflow-hidden focus-within:border-pastel-500 focus-within:bg-white transition">
                      <span className="px-3 py-3 bg-pastel-100 text-pastel-800 text-xs font-semibold border-r border-pastel-200 flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength="10"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="98480 12345"
                        className="w-full px-3 py-3 text-sm text-pastel-900 bg-transparent placeholder-pastel-400 focus:outline-none font-medium tracking-wide"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-pastel-600 text-white font-medium text-sm shadow-soft hover:bg-pastel-700 active:scale-[0.98] transition flex items-center justify-center space-x-2"
                  >
                    <span>{t.sendOtp}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                  <div className="text-center">
                    <p className="text-xs text-pastel-500">
                      {t.otpSentTo} <span className="font-semibold text-pastel-800">+91 {phoneNumber}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="text-[11px] text-pastel-600 underline mt-0.5"
                    >
                      Change Number
                    </button>
                  </div>

                  {/* 4 Digit OTP Inputs */}
                  <div className="flex justify-center space-x-3 my-4">
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          const newCode = [...otpCode];
                          newCode[index] = val;
                          setOtpCode(newCode);
                          if (val && index < 3) {
                            document.getElementById(`otp-${index + 1}`)?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                            document.getElementById(`otp-${index - 1}`)?.focus();
                          }
                        }}
                        className="w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 border-pastel-200 bg-pastel-50 text-pastel-900 focus:border-pastel-600 focus:bg-white focus:outline-none transition"
                      />
                    ))}
                  </div>

                  {/* Timer & Resend */}
                  <div className="text-center text-xs text-pastel-500">
                    {isTimerActive ? (
                      <span>{t.resendOtpIn} <strong className="text-pastel-700">{timer}{t.seconds}</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-pastel-600 font-semibold underline"
                      >
                        {t.resendNow}
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-pastel-600 text-white font-medium text-sm shadow-soft hover:bg-pastel-700 active:scale-[0.98] transition flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.verifyOtp}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Method 2: Email & Password */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailUsernameAuth} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-pastel-700 mb-1">
                  {t.enterEmail}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-3 rounded-2xl border border-pastel-200 bg-pastel-50 text-sm text-pastel-900 focus:outline-none focus:border-pastel-500 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-pastel-700 mb-1">
                  {t.enterPassword}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-3 rounded-2xl border border-pastel-200 bg-pastel-50 text-sm text-pastel-900 focus:outline-none focus:border-pastel-500 focus:bg-white transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-pastel-600 text-white font-medium text-sm shadow-soft hover:bg-pastel-700 active:scale-[0.98] transition flex items-center justify-center space-x-2 mt-2"
              >
                <span>{isSignUp ? t.signUp : t.signIn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Method 3: Username & Password */}
          {authMode === 'username' && (
            <form onSubmit={handleEmailUsernameAuth} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-pastel-700 mb-1">
                  {t.enterUsername}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. rahul_kumar"
                  className="w-full px-3.5 py-3 rounded-2xl border border-pastel-200 bg-pastel-50 text-sm text-pastel-900 focus:outline-none focus:border-pastel-500 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-pastel-700 mb-1">
                  {t.enterPassword}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-3 rounded-2xl border border-pastel-200 bg-pastel-50 text-sm text-pastel-900 focus:outline-none focus:border-pastel-500 focus:bg-white transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-pastel-600 text-white font-medium text-sm shadow-soft hover:bg-pastel-700 active:scale-[0.98] transition flex items-center justify-center space-x-2 mt-2"
              >
                <span>{isSignUp ? t.signUp : t.signIn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pastel-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-pastel-400">or quick access</span>
            </div>
          </div>

          {/* Instant 1-Click Guest / Demo Button */}
          <button
            type="button"
            onClick={handleGuestDemo}
            className="w-full py-3 px-4 rounded-2xl bg-pastel-50 hover:bg-pastel-100 border border-pastel-200 text-pastel-800 text-xs font-semibold flex items-center justify-center space-x-2 transition"
          >
            <Sparkles className="w-4 h-4 text-pastel-500" />
            <span>{t.guestLogin}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

