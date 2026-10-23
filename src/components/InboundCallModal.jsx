import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { audioTones } from '../utils/audioTones';
import { speakText, stopSpeaking } from '../services/aiCallingService';
import { 
  PhoneCall, 
  PhoneOff, 
  Send, 
  CheckCircle2, 
  Volume2, 
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Multilingual dialogue templates for natural human-like AI Receptionist
const RECEPTION_SCRIPTS = {
  te: {
    greeting: (biz) => `నమస్కారం అండి! మేము ${biz} నుంచి మాట్లాడుతున్నాం. చెప్పండి, మీకు ఎలా సహాయపడగలను?`,
    askName: 'సరేనండి, తప్పకుండా OP నమోదు చేస్తాను. దయచేసి మీ పూర్తి పేరు చెప్పండి?',
    askAge: (name) => `సరే ${name} గారు, మీ వయస్సు (Age) ఎంత అండి?`,
    askVillage: 'సరేనండి, మీది ఏ ఊరు లేదా గ్రామం?',
    askPhone: 'ధన్యవాదాలు అండి. కన్ఫర్మేషన్ SMS కోసం మీ మొబైల్ నంబర్ చెప్పగలరా?',
    confirmBooking: (docArrival, tokenNum, patientTime) => 
      `సరేనండి, మీ వివరాలన్నీ విజయవంతంగా నమోదయ్యాయి! డాక్టర్ గారు ఉదయం ${docArrival} కి వస్తారు. మీ టోకెన్ నంబర్ ${tokenNum}. మీరు దయచేసి ${patientTime} కి హాస్పిటల్‌కు రండి. ధన్యవాదాలు!`,
    quotaFull: (limit) => 
      `నమస్కారం అండి, ఈరోజు మా హాస్పిటల్ OP రిజిస్ట్రేషన్ కోటా (${limit} OP లు) పూర్తయింది. దయచేసి మీరు రేపు ఉదయం 8 గంటలకు కాల్ చేయండి లేదా అత్యవసరమైతే మా ఎమర్జెన్సీ వార్డును సంప్రదించండి. ధన్యవాదాలు!`,
    holiday: (biz) => 
      `నమస్కారం అండి, మేము ${biz} నుంచి మాట్లాడుతున్నాం. ఈరోజు మా సంస్థకు సెలవు అండి. దయచేసి మీరు రేపు ఉదయం పనివేళల్లో సంప్రదించండి. ధన్యవాదాలు!`,
    doctorLeave: (biz, arrival) => 
      `నమస్కారం అండి, మేము ${biz} నుంచి మాట్లాడుతున్నాం. డాక్టర్ గారు ఈరోజు అత్యవసర సెలవులో ఉన్నారు. దయచేసి మీరు రేపు ఉదయం ${arrival} కి రండి. ధన్యవాదాలు!`,
    quickReplies: {
      1: ['నమస్తే అండి, OP రాసుకోండి', 'డాక్టర్ అపాయింట్‌మెంట్ కావాలి'],
      2: ['నా పేరు ధనుంజయ్', 'నా పేరు కిరణ్ కుమార్'],
      3: ['34 సంవత్సరాలు', '42 సంవత్సరాలు'],
      4: ['నరసరావుపేట', 'చిలకలూరిపేట'],
      5: ['98480 22334', '94401 88990']
    }
  },
  en: {
    greeting: (biz) => `Hello! Welcome to ${biz} Reception. How may I assist you today?`,
    askName: 'Certainly, I will register your appointment. May I know your full name?',
    askAge: (name) => `Thank you ${name}, what is your age?`,
    askVillage: 'Understood. Which village or town are you visiting from?',
    askPhone: 'Thank you. Please provide your mobile number for confirmation:',
    confirmBooking: (docArrival, tokenNum, patientTime) => 
      `All details registered successfully! Doctor arrives at ${docArrival}. Your Token Number is #${tokenNum}. Please arrive at ${patientTime}. Thank you!`,
    quotaFull: (limit) => 
      `Hello, today's OP registration quota of ${limit} patients has been reached. Please contact us tomorrow morning at 8:00 AM or visit our 24/7 Emergency desk.`,
    holiday: (biz) => 
      `Hello, this is ${biz}. Today is an official holiday for our facility. Please contact us tomorrow during regular hours. Thank you!`,
    doctorLeave: (biz, arrival) => 
      `Hello, this is ${biz}. The Doctor is on emergency leave today. Please visit us tomorrow at ${arrival}. Thank you!`,
    quickReplies: {
      1: ['Hello, I want to book an OP appointment', 'I need doctor consultation'],
      2: ['My name is Dhanunjay', 'My name is Kiran Kumar'],
      3: ['34 years', '42 years'],
      4: ['Narasaraopet', 'Chilakaluripet'],
      5: ['98480 22334', '94401 88990']
    }
  },
  hi: {
    greeting: (biz) => `नमस्ते! हम ${biz} से बात कर रहे हैं। बताइए, हम आपकी क्या सहायता कर सकते हैं?`,
    askName: 'जी बिल्कुल, मैं आपका OP रजिस्टर कर रहा हूँ। कृपया अपना पूरा नाम बताएं?',
    askAge: (name) => `धन्यवाद ${name} जी, आपकी उम्र कितनी है?`,
    askVillage: 'आप किस गांव या शहर से आ रहे हैं?',
    askPhone: 'कन्फर्मेशन के लिए अपना मोबाइल नंबर बताएं?',
    confirmBooking: (docArrival, tokenNum, patientTime) => 
      `आपका विवरण दर्ज हो गया है! डॉक्टर साहब सुबह ${docArrival} बजे आएंगे। आपका टोकन नंबर #${tokenNum} है। कृपया आप ${patientTime} बजे आएं। धन्यवाद!`,
    quotaFull: (limit) => 
      `नमस्ते, आज की ${limit} OP की सीमा पूरी हो चुकी है। कृपया कल सुबह संपर्क करें या इमरजेंसी वार्ड में आएं।`,
    holiday: (biz) => `नमस्ते, आज अस्पताल में अवकाश है। कृपया कल संपर्क करें।`,
    doctorLeave: (biz, arrival) => `नमस्ते, डॉक्टर साहब आज अवकाश पर हैं। कृपया कल सुबह ${arrival} बजे आएं।`,
    quickReplies: {
      1: ['नमस्ते, OP बुक करना है', 'डॉक्टर से मिलना है'],
      2: ['मेरा नाम धनंजय है', 'मेरा नाम किरण है'],
      3: ['34 साल', '42 साल'],
      4: ['नरसारावपेट', 'चिलकलूरिपेट'],
      5: ['98480 22334', '94401 88990']
    }
  },
  ta: {
    greeting: (biz) => `வணக்கம்! ${biz} மருத்துவமனையிலிருந்து பேசுகிறோம். உங்களுக்கு என்ன உதவி வேண்டும்?`,
    askName: 'நிச்சயமாக OP பதிவு செய்கிறேன். உங்கள் முழு பெயரை கூறுங்கள்?',
    askAge: (name) => `நன்றி ${name}, உங்கள் வயது என்ன?`,
    askVillage: 'நீங்கள் எந்த ஊரிலிருந்து வருகிறீர்கள்?',
    askPhone: 'உங்கள் மொபைல் எண்ணை கூறுங்கள்?',
    confirmBooking: (docArrival, tokenNum, patientTime) => 
      `விவரங்கள் பதிவாகிவிட்டன! மருத்துவர் ${docArrival} மணிக்கு வருவார். உங்கள் டோக்கன் எண் #${tokenNum}. தயவுசெய்து ${patientTime} மணிக்கு வாருங்கள்!`,
    quotaFull: (limit) => `வணக்கம், இன்றைய ${limit} OP வரம்பு முடிந்துவிட்டது. நாளை வாருங்கள்.`,
    holiday: (biz) => `இன்று மருத்துவமனைக்கு விடுமுறை.`,
    doctorLeave: (biz, arrival) => `மருத்துவர் இன்று விடுப்பில் உள்ளார். நாளை ${arrival} மணிக்கு வாருங்கள்.`,
    quickReplies: {
      1: ['OP பதிவு செய்ய வேண்டும்', 'மருத்துவரை பார்க்க வேண்டும்'],
      2: ['என் பெயர் தனுஞ்சய்', 'என் பெயர் கிரண்'],
      3: ['34 வயது', '42 வயது'],
      4: ['நரசராவுபேட்டை', 'சிலகலூரிபேட்டை'],
      5: ['98480 22334', '94401 88990']
    }
  },
  kn: {
    greeting: (biz) => `ನಮಸ್ಕಾರ! ನಾವು ${biz} ಆಸ್ಪತ್ರೆಯಿಂದ ಮಾತನಾಡುತ್ತಿದ್ದೇವೆ. ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?`,
    askName: 'ಖಂಡಿತವಾಗಿಯೂ OP ನೊಂದಾಯಿಸುತ್ತೇನೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ತಿಳಿಸಿ?',
    askAge: (name) => `ಧನ್ಯವಾದಗಳು ${name}, ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?`,
    askVillage: 'ನಿಮ್ಮ ಊರು ಅಥವಾ ಗ್ರಾಮ ಯಾವುದು?',
    askPhone: 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ತಿಳಿಸಿ?',
    confirmBooking: (docArrival, tokenNum, patientTime) => 
      `ವಿವರಗಳು ನೊಂದಾಯಿಸಲಾಗಿದೆ! ವೈದ್ಯರು ${docArrival} ಗಂಟೆಗೆ ಬರುತ್ತಾರೆ. ನಿಮ್ಮ ಟೋಕನ್ #${tokenNum}. ದಯವಿಟ್ಟು ${patientTime} ಗಂಟೆಗೆ ಬನ್ನಿ!`,
    quotaFull: (limit) => `ಇಂದಿನ ${limit} OP ಕೋಟಾ ಮುಗಿದಿದೆ. ದಯವಿಟ್ಟು ನಾಳೆ ಬನ್ನಿ.`,
    holiday: (biz) => `ಇಂದು ಆಸ್ಪತ್ರೆಗೆ ರಜೆ ಇದೆ.`,
    doctorLeave: (biz, arrival) => `ವೈದ್ಯರು ಇಂದು ರಜೆಯಲ್ಲಿದ್ದಾರೆ. ನಾಳೆ ${arrival} ಬನ್ನಿ.`,
    quickReplies: {
      1: ['OP ನೊಂದಾಯಿಸಬೇಕು', 'ವೈದ್ಯರನ್ನು ಭೇಟಿಯಾಗಬೇಕು'],
      2: ['ನನ್ನ ಹೆಸರು ಧನುಂಜಯ್', 'ನನ್ನ ಹೆಸರು ಕಿರಣ್'],
      3: ['34 ವರ್ಷ', '42 ವರ್ಷ'],
      4: ['ನರಸರಾವ್ಪೇಟೆ', 'ಚಿಲಕಲೂರಿಪೇಟೆ'],
      5: ['98480 22334', '94401 88990']
    }
  }
};

export function InboundCallModal() {
  const { 
    activeInboundCall, 
    endCurrentCall, 
    businessProfile, 
    selectedCategory, 
    addReceptionRecord, 
    language 
  } = useApp();

  const [callState, setCallState] = useState('ringing'); // 'ringing' | 'connected' | 'completed'
  const [currentStep, setCurrentStep] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [collectedData, setCollectedData] = useState({
    name: '',
    age: '',
    village: '',
    phone: '',
  });
  const [userInput, setUserInput] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const chatScrollRef = useRef(null);

  const scripts = RECEPTION_SCRIPTS[language] || RECEPTION_SCRIPTS.te;
  const bizName = businessProfile.businessName || 'హాస్పిటల్';
  const voiceGender = businessProfile.voiceGender || 'female';
  const totalLimit = businessProfile.dailySlotLimit || 150;
  const bookedCount = businessProfile.currentBookedSlots || 39;
  const doctorArrival = businessProfile.doctorArrivalTime || '10:00 AM';

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    if (activeInboundCall) {
      setCallState('ringing');
      setTranscript([]);
      setCurrentStep(0);
      audioTones.startRinging();

      const autoAnswerTimer = setTimeout(() => {
        handleAnswerCall();
      }, 2200);

      return () => {
        clearTimeout(autoAnswerTimer);
        audioTones.stopRinging();
        stopSpeaking();
      };
    }
  }, [activeInboundCall]);

  if (!activeInboundCall) return null;

  const aiSpeak = (text) => {
    setIsAiSpeaking(true);
    speakText(text, language, voiceGender, () => {
      setIsAiSpeaking(false);
    });
  };

  const handleAnswerCall = async () => {
    audioTones.stopRinging();
    audioTones.playCallConnected();
    setCallState('connected');

    // Rule 1: Hospital Holiday Today
    if (businessProfile.isHolidayToday) {
      const holidayMsg = scripts.holiday(bizName);
      setTranscript([{ speaker: 'ai', text: holidayMsg }]);
      aiSpeak(holidayMsg);

      setTimeout(() => {
        setCallState('completed');
        audioTones.playCallEnded();
      }, 4500);
      return;
    }

    // Rule 2: Doctor On Leave Today
    if (selectedCategory === 'hospital' && businessProfile.isDoctorOnLeave) {
      const leaveMsg = scripts.doctorLeave(bizName, doctorArrival);
      setTranscript([{ speaker: 'ai', text: leaveMsg }]);
      aiSpeak(leaveMsg);

      setTimeout(() => {
        setCallState('completed');
        audioTones.playCallEnded();
      }, 4500);
      return;
    }

    // Rule 3: Dynamic OP limit check! (If booked >= custom limit set by hospital)
    if (bookedCount >= totalLimit) {
      const quotaMsg = scripts.quotaFull(totalLimit);
      setTranscript([{ speaker: 'ai', text: quotaMsg }]);
      aiSpeak(quotaMsg);

      setTimeout(() => {
        setCallState('completed');
        audioTones.playCallEnded();
      }, 4800);
      return;
    }

    // Rule 4: Normal Natural Human Greeting
    const greetingMsg = scripts.greeting(bizName);
    setTranscript([{ speaker: 'ai', text: greetingMsg }]);
    aiSpeak(greetingMsg);
    setCurrentStep(1);
  };

  const handleAutoReplyStep = (patientText) => {
    const text = patientText || userInput;
    if (!text) return;

    setTranscript(prev => [...prev, { speaker: 'user', text }]);
    setUserInput('');

    // Step 1: Patient asks for OP
    if (currentStep === 1) {
      setTimeout(() => {
        const aiQuestion = scripts.askName;
        setTranscript(prev => [...prev, { speaker: 'ai', text: aiQuestion }]);
        aiSpeak(aiQuestion);
        setCurrentStep(2);
      }, 700);
    }
    // Step 2: Patient gives Name
    else if (currentStep === 2) {
      setCollectedData(prev => ({ ...prev, name: text }));
      setTimeout(() => {
        const aiQuestion = scripts.askAge(text);
        setTranscript(prev => [...prev, { speaker: 'ai', text: aiQuestion }]);
        aiSpeak(aiQuestion);
        setCurrentStep(3);
      }, 700);
    }
    // Step 3: Patient gives Age
    else if (currentStep === 3) {
      setCollectedData(prev => ({ ...prev, age: text }));
      setTimeout(() => {
        const aiQuestion = scripts.askVillage;
        setTranscript(prev => [...prev, { speaker: 'ai', text: aiQuestion }]);
        aiSpeak(aiQuestion);
        setCurrentStep(4);
      }, 700);
    }
    // Step 4: Patient gives Village
    else if (currentStep === 4) {
      setCollectedData(prev => ({ ...prev, village: text }));
      setTimeout(() => {
        const aiQuestion = scripts.askPhone;
        setTranscript(prev => [...prev, { speaker: 'ai', text: aiQuestion }]);
        aiSpeak(aiQuestion);
        setCurrentStep(5);
      }, 700);
    }
    // Step 5: Patient gives Phone -> Complete booking with token
    else if (currentStep === 5) {
      const finalPhone = text;
      const nextTokenNum = bookedCount + 1;
      const patientArrivalTime = '12:00 PM';

      setCollectedData(prev => ({ ...prev, phone: finalPhone }));

      setTimeout(() => {
        const finalMsg = scripts.confirmBooking(doctorArrival, nextTokenNum, patientArrivalTime);
        setTranscript(prev => [...prev, { speaker: 'ai', text: finalMsg }]);
        aiSpeak(finalMsg);
        setCallState('completed');
        audioTones.playCallEnded();

        addReceptionRecord({
          id: `rec-${Date.now()}`,
          tokenNumber: nextTokenNum,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          name: collectedData.name || 'ధనుంజయ్ (Dhanunjay)',
          age: collectedData.age || '34',
          village: collectedData.village || 'నరసరావుపేట (Narasaraopet)',
          phone: finalPhone || '+91 98480 22334',
          category: selectedCategory === 'hospital' ? 'Hospital OP' : 'Customer Booking',
          allocatedSlot: `${patientArrivalTime} (డాక్టర్ వచ్చే సమయం ${doctorArrival})`,
          status: 'Confirmed'
        });

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#9B724D', '#D5BBA3', '#7E5938', '#E5D3C2']
          });
        } catch (e) {}
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-pastel-900/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white border border-pastel-200 shadow-soft-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Card */}
        <div className="p-4 bg-gradient-to-b from-pastel-100 via-pastel-50 to-white border-b border-pastel-200 text-center relative">
          
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-pastel-200 shadow-xs text-[10px] font-bold uppercase tracking-wider text-pastel-700 mb-2">
            <span className={`w-2 h-2 rounded-full ${callState === 'ringing' ? 'bg-amber-500 animate-ping' : 'bg-emerald-600'}`}></span>
            <span>{callState === 'ringing' ? 'ఇన్‌కమింగ్ కాల్ రింగ్ అవుతోంది (Incoming Call)' : 'AI రిసెప్షనిస్ట్ లైవ్ కాల్'}</span>
          </div>

          <h3 className="text-base font-bold text-pastel-900 font-serif">
            {bizName}
          </h3>
          <p className="text-xs text-pastel-600">
            Caller: <span className="font-mono font-semibold">+91 98480 22334</span>
          </p>

          <div className="flex items-center justify-center space-x-2 mt-1 text-[11px] text-pastel-600">
            <span>భాష: <strong className="uppercase">{language}</strong></span>
            <span>•</span>
            <span>వాయిస్: <strong>{voiceGender === 'female' ? '👩 అమ్మాయి' : '👨 అబ్బాయి'}</strong></span>
            <span>•</span>
            <span>కోటా: <strong>{bookedCount}/{totalLimit}</strong></span>
          </div>

          {/* Audio Waveform when AI speaks */}
          {isAiSpeaking && (
            <div className="flex items-center justify-center space-x-1 mt-3 h-5">
              <span className="w-1 bg-pastel-600 rounded-full animate-wave-bar" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-1 bg-pastel-700 rounded-full animate-wave-bar" style={{ animationDelay: '0.3s' }}></span>
              <span className="w-1 bg-pastel-500 rounded-full animate-wave-bar" style={{ animationDelay: '0.5s' }}></span>
              <span className="w-1 bg-pastel-600 rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }}></span>
            </div>
          )}
        </div>

        {/* Live Conversation Transcript */}
        <div className="p-4 overflow-y-auto flex-1 bg-pastel-50/50 space-y-3 min-h-[200px] max-h-[300px]">
          {transcript.map((line, idx) => {
            const isAi = line.speaker === 'ai';
            return (
              <div 
                key={idx} 
                className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} animate-fade-in`}
              >
                <span className="text-[9px] text-pastel-500 mb-0.5 px-2">
                  {isAi ? `🤖 AI రిసెప్షనిస్ట్ (${voiceGender === 'female' ? 'అమ్మాయి' : 'అబ్బాయి'}):` : '👤 కాలర్ / పేషెంట్:'}
                </span>
                <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-xs ${
                  isAi 
                    ? 'bg-white border border-pastel-200 text-pastel-900 rounded-tl-sm' 
                    : 'bg-pastel-600 text-white rounded-tr-sm font-medium'
                }`}>
                  {line.text}
                </div>
              </div>
            );
          })}
          <div ref={chatScrollRef} />
        </div>

        {/* Quick Answer Buttons */}
        {callState === 'connected' && currentStep > 0 && currentStep <= 5 && (
          <div className="p-2.5 bg-white border-t border-pastel-100">
            <p className="text-[10px] text-pastel-500 font-semibold mb-1.5 px-1 uppercase tracking-wider">
              త్వరిత సమాధానాలు (Quick replies as caller):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {scripts.quickReplies?.[currentStep]?.map((ans, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAutoReplyStep(ans)}
                  className="px-3 py-1.5 rounded-xl bg-pastel-50 hover:bg-pastel-100 border border-pastel-200 text-xs font-medium text-pastel-800 transition active:scale-95 shadow-xs"
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Completion Notice */}
        {callState === 'completed' && (
          <div className="p-3.5 bg-emerald-50/90 border-t border-emerald-200 text-xs text-emerald-950 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>OP నమోదు పూర్తయింది (Token Allotted & Saved to Database!)</span>
            </div>
            <p className="text-[11px] text-emerald-900">
              వివరాలు Excel షీట్ లోకి సేవ్ చేయబడ్డాయి.
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="p-3 bg-pastel-50 border-t border-pastel-200 flex items-center justify-between">
          {callState === 'ringing' ? (
            <button
              onClick={handleAnswerCall}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-sm transition active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>కాల్ ఎత్తండి (Answer Call)</span>
            </button>
          ) : callState === 'connected' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAutoReplyStep();
              }}
              className="w-full flex items-center space-x-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="కాలర్ గా మీ సమాధానం రాయండి..."
                className="flex-1 py-2 px-3 rounded-xl border border-pastel-200 bg-white text-xs text-pastel-900 focus:outline-none focus:border-pastel-500"
              />
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="w-8 h-8 rounded-xl bg-pastel-600 hover:bg-pastel-700 disabled:opacity-40 text-white flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={endCurrentCall}
                className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700"
                title="కాల్ ముగించండి"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              onClick={endCurrentCall}
              className="w-full py-2.5 px-4 rounded-2xl bg-pastel-700 hover:bg-pastel-800 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-sm transition"
            >
              <span>మూసివేయండి (Done)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
