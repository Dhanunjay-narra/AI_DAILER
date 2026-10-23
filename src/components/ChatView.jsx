import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { searchShopsForProduct } from '../services/storeDatabase';
import { executeAiCallToShop } from '../services/aiCallingService';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Store, 
  PhoneCall, 
  CheckCircle, 
  MapPin, 
  Navigation,
  Bot,
  User,
  ArrowRight,
  Loader2
} from 'lucide-react';

export function ChatView() {
  const { 
    t, 
    language, 
    location, 
    addCallLog, 
    setActiveCallSession,
    setDiscoveredShops,
    user
  } = useApp();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: t.aiGreeting,
      timestamp: 'Now',
      type: 'greeting'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Handle Speech Recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'te' ? 'te-IN' : (language === 'hi' ? 'hi-IN' : 'en-US');
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const handleSendQuery = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isProcessing) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI thinking and locating nearby shops in user's area
    setTimeout(() => {
      const shopsFound = searchShopsForProduct(textToSend, location.areaName);
      setDiscoveredShops(shopsFound);

      const aiResponse = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: language === 'te' 
          ? `నేను మీ "${location.areaName}" ప్రాంతంలో ఈ ప్రొడక్ట్ కోసం ${shopsFound.length} షాపులను గుర్తించాను. స్టాక్ ఉందో లేదో ధృవీకరించడానికి నేను ఇప్పుడే ఈ షాపులకు కాల్ చేయమంటారా?`
          : `I found ${shopsFound.length} shops in "${location.areaName}" matching "${textToSend}". Shall I autonomously dial them to verify stock & price for you?`,
        shops: shopsFound,
        product: textToSend,
        type: 'shop_suggestion',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1100);
  };

  // Launch AI Call to a shop
  const handleInitiateAiCall = async (shop) => {
    setActiveCallSession({
      shop,
      status: 'dialing',
      transcript: [],
      statusText: 'Connecting...'
    });

    const result = await executeAiCallToShop(shop, language, (update) => {
      setActiveCallSession(prev => ({
        ...prev,
        ...update
      }));
    });

    addCallLog(result);

    // Append AI report message in chat
    const stockReportMessage = {
      id: `report-${Date.now()}`,
      sender: 'ai',
      text: language === 'te'
        ? `📞 "${shop.nameTe || shop.name}" కి కాల్ పూర్తయింది. ఫలితం: ${result.stockStatus === 'available' ? '✅ స్టాక్ ఉంది!' : '❌ స్టాక్ అయిపోయింది.'} ధర: ${result.priceQuoted}`
        : `📞 Call finished with "${shop.name}". Result: ${result.stockStatus === 'available' ? '✅ In Stock!' : '❌ Out of Stock.'} Quoted: ${result.priceQuoted}`,
      type: 'call_summary',
      result,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, stockReportMessage]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] max-w-xl mx-auto">
      
      {/* Chat Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              {/* Sender Tag */}
              <div className="flex items-center space-x-1.5 mb-1 px-1">
                {isUser ? (
                  <>
                    <span className="text-[10px] text-pastel-500 font-medium">{user?.name || 'You'}</span>
                    <div className="w-4 h-4 rounded-full bg-pastel-300 flex items-center justify-center text-[9px] text-pastel-900">
                      <User className="w-2.5 h-2.5" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 rounded-full bg-pastel-600 flex items-center justify-center text-[9px] text-white">
                      <Bot className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[10px] text-pastel-600 font-semibold">{t.appName}</span>
                  </>
                )}
                <span className="text-[9px] text-pastel-400">• {msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`p-3.5 rounded-2xl max-w-[88%] text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-pastel-600 text-white rounded-tr-sm font-medium'
                    : 'bg-white border border-pastel-200 text-pastel-900 rounded-tl-sm'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* If shops are discovered, render interactive store call cards */}
                {msg.shops && msg.shops.length > 0 && (
                  <div className="mt-3.5 space-y-2 pt-2 border-t border-pastel-100">
                    <p className="text-[11px] font-bold text-pastel-800 uppercase tracking-wider flex items-center space-x-1">
                      <Store className="w-3.5 h-3.5 text-pastel-600" />
                      <span>{t.shopsFound} ({msg.shops.length}):</span>
                    </p>

                    {msg.shops.map((shop, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-pastel-50 border border-pastel-200 flex items-center justify-between hover:bg-pastel-100/70 transition"
                      >
                        <div className="mr-2">
                          <h5 className="font-semibold text-pastel-900 text-xs">
                            {(language === 'te' && shop.nameTe) ? shop.nameTe : shop.name}
                          </h5>
                          <p className="text-[10px] text-pastel-500">
                            {shop.distanceKm} km away • {shop.address}
                          </p>
                        </div>

                        <button
                          onClick={() => handleInitiateAiCall(shop)}
                          className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-pastel-600 hover:bg-pastel-700 active:scale-95 text-white text-[11px] font-semibold flex items-center space-x-1 shadow-sm transition"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>AI Call</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-pastel-500 text-xs py-2 px-3 bg-white/70 rounded-2xl border border-pastel-200 w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-pastel-600" />
            <span>Scanning shops in {location.areaName}...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-1.5 bg-[#FAF7F2]">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { label: t.quick1, query: '500ml Plastic Containers' },
            { label: t.quick2, query: '10mm Drill Bit Set' },
            { label: t.quick3, query: 'Organic Turmeric & Neem Oil' },
            { label: t.quick4, query: 'Type-C Charger' },
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(chip.query)}
              className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white border border-pastel-200 hover:border-pastel-400 hover:bg-pastel-50 text-[11px] text-pastel-700 transition shadow-xs"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Bar */}
      <div className="p-3 bg-white/95 border-t border-pastel-200 shadow-soft">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(input);
          }}
          className="flex items-center space-x-2"
        >
          {/* Speech Mic Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition active:scale-95 shadow-sm border ${
              isListening
                ? 'bg-red-500 text-white animate-pulse border-red-600'
                : 'bg-pastel-50 text-pastel-700 border-pastel-200 hover:bg-pastel-100'
            }`}
            title="Speak query"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chatPlaceholder}
            className="flex-1 py-2.5 px-3.5 bg-pastel-50 rounded-2xl border border-pastel-200 text-xs text-pastel-900 placeholder-pastel-400 focus:outline-none focus:border-pastel-500 focus:bg-white transition"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="w-10 h-10 rounded-2xl bg-pastel-600 hover:bg-pastel-700 disabled:opacity-40 text-white flex items-center justify-center shadow-soft active:scale-95 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}

