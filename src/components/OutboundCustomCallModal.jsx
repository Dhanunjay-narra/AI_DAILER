import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { audioTones } from '../utils/audioTones';
import { speakText, stopSpeaking } from '../services/aiCallingService';
import { 
  PhoneCall, 
  PhoneOff, 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function OutboundCustomCallModal({ isOpen, onClose }) {
  const { 
    addReceptionRecord, 
    addCallLog, 
    language 
  } = useApp();

  const [targetPhone, setTargetPhone] = useState('98480 54321');
  const [targetName, setTargetName] = useState('');
  const [questions, setQuestions] = useState([
    'మీ పూర్తి పేరు ఏమిటి? (Full Name)',
    'మీరు ఏమి చదువుకున్నారు? (Educational Qualification)'
  ]);
  const [newQuestionInput, setNewQuestionInput] = useState('');

  // Call simulation state
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // 'dialing' | 'ringing' | 'connected' | 'completed'
  const [transcript, setTranscript] = useState([]);
  const [recordedAnswers, setRecordedAnswers] = useState({});

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    if (newQuestionInput.trim()) {
      setQuestions([...questions, newQuestionInput.trim()]);
      setNewQuestionInput('');
    }
  };

  const handleRemoveQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleStartCall = async (e) => {
    e.preventDefault();
    if (!targetPhone || targetPhone.length < 10) {
      alert('దయచేసి 10 అంకెల మొబైల్ నంబర్ రాయండి');
      return;
    }
    if (questions.length === 0) {
      alert('కనీసం ఒక ప్రశ్నను జోడించండి');
      return;
    }

    setIsCalling(true);
    setCallStatus('dialing');
    setTranscript([]);
    audioTones.playDialBeep();

    await new Promise(r => setTimeout(r, 1200));

    // Ringing
    setCallStatus('ringing');
    audioTones.startRinging();

    await new Promise(r => setTimeout(r, 2500));

    // Connected!
    audioTones.stopRinging();
    audioTones.playCallConnected();
    setCallStatus('connected');

    const fullTranscript = [];

    // Step 1: AI Greeting
    const greeting = language === 'te'
      ? `నమస్కారం అండి! నేను AI అసిస్టెంట్‌ని. కొన్ని ముఖ్యమైన వివరాల కోసం మీకు కాల్ చేశాను. దయచేసి వివరాలు చెప్పగలరా?`
      : `Hello! I am an AI calling to collect requested information on behalf of our team.`;

    fullTranscript.push({ speaker: 'ai', text: greeting });
    setTranscript([...fullTranscript]);
    speakText(greeting, language);

    await new Promise(r => setTimeout(r, 3000));

    // Person agrees
    const agree = language === 'te' ? 'నమస్తే అండి, చెప్పండి ఏమి వివరాలు కావాలి?' : 'Yes, please ask.';
    fullTranscript.push({ speaker: 'user', text: agree });
    setTranscript([...fullTranscript]);

    await new Promise(r => setTimeout(r, 1500));

    // Sample automated answers for realistic preview
    const samplePersonAnswers = [
      language === 'te' ? 'నా పేరు సాయి రామ్ అండి' : 'My name is Sai Ram',
      language === 'te' ? 'నేను B.Tech (Computer Science) చదువుకున్నాను' : 'I completed B.Tech in Computer Science',
      language === 'te' ? 'నాకు 3 సంవత్సరాల అనుభవం ఉంది' : 'I have 3 years of experience'
    ];

    const answersCollected = {};

    // Loop through questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      fullTranscript.push({ speaker: 'ai', text: q });
      setTranscript([...fullTranscript]);
      speakText(q, language);

      await new Promise(r => setTimeout(r, 2600));

      const simulatedAns = samplePersonAnswers[i] || (language === 'te' ? 'అవునండి, వివరాలు సరిగ్గా ఉన్నాయి' : 'Confirmed');
      answersCollected[`question_${i + 1}`] = simulatedAns;
      fullTranscript.push({ speaker: 'user', text: simulatedAns });
      setTranscript([...fullTranscript]);

      await new Promise(r => setTimeout(r, 2000));
    }

    // Thank you
    const closing = language === 'te'
      ? 'వివరాలు అందించినందుకు చాలా ధన్యవాదాలు అండి. నమస్తే!'
      : 'Thank you very much for providing these details. Have a great day!';
    fullTranscript.push({ speaker: 'ai', text: closing });
    setTranscript([...fullTranscript]);
    speakText(closing, language);

    await new Promise(r => setTimeout(r, 2500));

    audioTones.playCallEnded();
    stopSpeaking();
    setCallStatus('completed');
    setRecordedAnswers(answersCollected);

    // Save record to database / Excel
    addReceptionRecord({
      id: `outbound-${Date.now()}`,
      tokenNumber: `OB-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: samplePersonAnswers[0] || 'సాయి రామ్ (Sai Ram)',
      age: 'Qualification: ' + (samplePersonAnswers[1] || 'B.Tech'),
      village: 'Custom Outbound Query',
      phone: `+91 ${targetPhone}`,
      category: 'Custom Number Inquiry',
      allocatedSlot: 'Recorded & Verified by AI',
      status: 'Collected'
    });

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#9B724D', '#D5BBA3', '#7E5938']
      });
    } catch (e) {}
  };

  const handleEndCall = () => {
    audioTones.stopRinging();
    audioTones.playCallEnded();
    stopSpeaking();
    setIsCalling(false);
    setCallStatus('idle');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-pastel-900/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white border border-pastel-200 shadow-soft-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-pastel-100 to-pastel-50 border-b border-pastel-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-pastel-200 shadow-sm flex items-center justify-center text-pastel-700">
              <PhoneCall className="w-5 h-5 text-pastel-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-pastel-900 font-serif">
                కస్టమ్ నంబర్ AI కాలర్ & డేటా కలెక్టర్
              </h3>
              <p className="text-[11px] text-pastel-600">
                ఏదైనా నంబర్ ఇచ్చి కావాల్సిన వివరాలు అడగండి
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

        {/* Content Area */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          
          {!isCalling ? (
            <form onSubmit={handleStartCall} className="space-y-4">
              
              {/* Target Phone */}
              <div>
                <label className="block text-xs font-bold text-pastel-800 uppercase tracking-wider mb-1.5">
                  కాల్ చేయవలసిన నంబర్ (Target Phone Number):
                </label>
                <div className="flex rounded-xl border border-pastel-200 bg-pastel-50 overflow-hidden focus-within:border-pastel-500 focus-within:bg-white transition">
                  <span className="px-3 py-2.5 bg-pastel-100 text-pastel-800 text-xs font-semibold border-r border-pastel-200 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={targetPhone}
                    onChange={(e) => setTargetPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98480 12345"
                    maxLength="10"
                    className="w-full px-3 py-2 text-xs text-pastel-900 bg-transparent placeholder-pastel-400 focus:outline-none font-medium"
                    required
                  />
                </div>
              </div>

              {/* Information / Questions List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-pastel-800 uppercase tracking-wider">
                    AI అడగవలసిన ప్రశ్నలు (Questions to ask):
                  </label>
                  <span className="text-[10px] text-pastel-500 font-medium">
                    {questions.length} ప్రశ్నలు
                  </span>
                </div>

                <div className="space-y-2">
                  {questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-pastel-50 border border-pastel-200 flex items-center justify-between text-xs text-pastel-900"
                    >
                      <span className="flex-1 mr-2 leading-snug">
                        <strong className="text-pastel-600 mr-1.5">{idx + 1}.</strong>
                        {q}
                      </span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-stone-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new question row */}
                <div className="flex space-x-2 pt-1">
                  <input
                    type="text"
                    value={newQuestionInput}
                    onChange={(e) => setNewQuestionInput(e.target.value)}
                    placeholder="కొత్త ప్రశ్న జోడించండి (ఉదా: మీ అనుభవం ఎంత?)..."
                    className="flex-1 px-3 py-2 rounded-xl border border-pastel-200 bg-white text-xs text-pastel-900 focus:outline-none focus:border-pastel-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-2 rounded-xl bg-pastel-100 hover:bg-pastel-200 text-pastel-800 text-xs font-semibold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>జోడించు</span>
                  </button>
                </div>
              </div>

              {/* Start Call Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pastel-600 to-pastel-700 hover:from-pastel-700 hover:to-pastel-800 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-soft transition active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>AI తో నంబర్‌కు కాల్ చేయించండి 📞</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              {/* Call Status Badge */}
              <div className="text-center pb-2">
                <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  callStatus === 'dialing' || callStatus === 'ringing' 
                    ? 'bg-amber-100 text-amber-800' 
                    : callStatus === 'connected' 
                    ? 'bg-pastel-200 text-pastel-900 animate-pulse'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>
                    {callStatus === 'dialing' && 'డయల్ చేస్తోంది (Dialing)...'}
                    {callStatus === 'ringing' && 'రింగ్ అవుతోంది (Ringing)...'}
                    {callStatus === 'connected' && 'కనెక్ట్ అయింది - AI మాట్లాడుతోంది'}
                    {callStatus === 'completed' && '✅ కాల్ ముగిసింది & సమాచారం రికార్డైంది'}
                  </span>
                </span>
                <p className="text-xs text-pastel-500 font-mono mt-1">
                  Target: +91 {targetPhone}
                </p>
              </div>

              {/* Transcript list */}
              <div className="space-y-2 p-3 bg-pastel-50 rounded-2xl border border-pastel-200 max-h-[240px] overflow-y-auto">
                {transcript.map((line, idx) => (
                  <div key={idx} className={`flex flex-col ${line.speaker === 'ai' ? 'items-start' : 'items-end'}`}>
                    <span className="text-[9px] text-pastel-400 px-1 mb-0.5">
                      {line.speaker === 'ai' ? 'AI అసిస్టెంట్:' : `వ్యక్తి (+91 ${targetPhone}):`}
                    </span>
                    <div className={`p-2.5 rounded-xl text-xs max-w-[85%] leading-snug ${
                      line.speaker === 'ai'
                        ? 'bg-white border border-pastel-200 text-pastel-900 rounded-tl-sm'
                        : 'bg-pastel-600 text-white rounded-tr-sm font-medium'
                    }`}>
                      {line.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Completion notice */}
              {callStatus === 'completed' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>వివరాలు సేకరించబడ్డాయి & డేటాబేస్ లో భద్రపరచబడ్డాయి!</span>
                  </div>
                  <p className="text-[11px] text-emerald-900">
                    సేకరించిన సమాధానాలు ఎక్సెల్ ఫైల్ గా ఎగుమతి చేసుకోవడానికి సిద్ధంగా ఉన్నాయి.
                  </p>
                </div>
              )}

              {/* Controls */}
              {callStatus !== 'completed' ? (
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition active:scale-95"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>కాల్ ముగించండి (End Call)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setIsCalling(false); setCallStatus('idle'); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-pastel-700 hover:bg-pastel-800 text-white text-xs font-semibold transition"
                >
                  <span>మరొక నంబర్ కి కాల్ చేయండి</span>
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

