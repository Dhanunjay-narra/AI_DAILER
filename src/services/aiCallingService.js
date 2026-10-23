import { audioTones } from '../utils/audioTones';

// Audio Cache & Player
let currentAudio = null;

export function stopSpeaking() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

/**
 * Natural Human Voice Engine
 * Plays authentic native speech for Telugu, Hindi, Tamil, Kannada, and English.
 */
export function speakText(text, langCode = 'te', gender = 'female', onEndCallback = () => {}) {
  stopSpeaking();
  if (!text || !text.trim()) return;

  const cleanText = text.replace(/[*_#•]/g, '').trim();

  // Try High-Quality Neural Audio Stream first (natural human voice)
  try {
    const encoded = encodeURIComponent(cleanText);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(langCode)}&q=${encoded}`;
    
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    // Slight speed tuning for conversational warmth
    audio.playbackRate = 1.0;

    audio.onended = () => {
      currentAudio = null;
      onEndCallback();
    };

    audio.onerror = () => {
      console.warn('Neural audio fallback to local synthesis');
      fallbackSpeech(cleanText, langCode, gender, onEndCallback);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        fallbackSpeech(cleanText, langCode, gender, onEndCallback);
      });
    }
  } catch (err) {
    fallbackSpeech(cleanText, langCode, gender, onEndCallback);
  }
}

// Fallback Speech Synthesis if offline
function fallbackSpeech(text, langCode, gender, onEndCallback) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEndCallback();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(langCode.toLowerCase()));

    if (voice) {
      utterance.voice = voice;
    }

    utterance.lang = langCode === 'te' ? 'te-IN' : (langCode === 'hi' ? 'hi-IN' : 'en-US');
    utterance.pitch = gender === 'female' ? 1.05 : 0.9;
    utterance.rate = 0.92;

    utterance.onend = () => onEndCallback();
    utterance.onerror = () => onEndCallback();

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    onEndCallback();
  }
}

/**
 * Store Caller Simulation
 */
export async function executeAiCallToShop(shop, language = 'te', onUpdate = () => {}) {
  audioTones.playDialBeep();
  onUpdate({
    status: 'dialing',
    currentShop: shop,
    transcript: [],
    progress: 10,
    statusText: `కాల్ వెళ్తోంది: ${shop.phone}...`
  });

  await new Promise(r => setTimeout(r, 1200));

  audioTones.startRinging();
  onUpdate({
    status: 'ringing',
    currentShop: shop,
    transcript: [],
    progress: 25,
    statusText: 'రింగ్ అవుతోంది...'
  });

  await new Promise(r => setTimeout(r, 2600));

  audioTones.stopRinging();
  audioTones.playCallConnected();

  onUpdate({
    status: 'connected',
    currentShop: shop,
    transcript: [],
    progress: 40,
    statusText: 'కనెక్ట్ అయింది - AI మాట్లాడుతోంది'
  });

  const langKey = shop.sampleDialogue && shop.sampleDialogue[language] ? language : (shop.sampleDialogue?.en ? 'en' : 'te');
  const dialogueLines = shop.sampleDialogue?.[langKey] || [
    { speaker: 'ai', text: `నమస్కారం, మీ వద్ద ${shop.productQueried || 'వస్తువు'} స్టాక్ అందుబాటులో ఉందా?` },
    { speaker: 'shop', text: 'అవునండి, స్టాక్ అందుబాటులో ఉంది.' },
    { speaker: 'ai', text: 'చాలా ధన్యవాదాలు అండి!' }
  ];

  const transcript = [];

  for (let i = 0; i < dialogueLines.length; i++) {
    const line = dialogueLines[i];
    transcript.push(line);

    if (line.speaker === 'ai') {
      speakText(line.text, language, 'female');
    }

    onUpdate({
      status: 'talking',
      currentShop: shop,
      transcript: [...transcript],
      progress: 40 + Math.floor(((i + 1) / dialogueLines.length) * 45),
      statusText: line.speaker === 'ai' ? 'AI అడుగుతోంది...' : 'షాప్‌కీపర్ సమాధానం...'
    });

    const readingTime = Math.max(2200, line.text.length * 75);
    await new Promise(r => setTimeout(r, readingTime));
  }

  audioTones.playCallEnded();
  stopSpeaking();

  const finalResult = {
    status: 'completed',
    shopId: shop.id,
    shopName: shop.name,
    phone: shop.phone,
    address: shop.fullAddress,
    distanceKm: shop.distanceKm,
    stockStatus: shop.stockStatus,
    priceQuoted: shop.priceRange,
    confidence: shop.stockConfidence,
    product: shop.productQueried,
    transcript,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    progress: 100,
    statusText: shop.stockStatus === 'available' ? 'స్టాక్ లభ్యం!' : 'స్టాక్ లేదు'
  };

  onUpdate(finalResult);
  return finalResult;
}
