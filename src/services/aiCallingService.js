import { audioTones } from '../utils/audioTones';

// Global audio tracker
let activeAudioElement = null;
let audioQueue = [];
let isQueuePlaying = false;

export function stopSpeaking() {
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (e) {}
    activeAudioElement = null;
  }
  audioQueue = [];
  isQueuePlaying = false;

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

/**
 * Natural Neural Speech Synthesis for Indian languages (Telugu, Hindi, Tamil, Kannada) and Global languages
 * Uses Google TTS audio engine for crystal-clear native human Telugu/Indic pronunciation,
 * with graceful fallback to browser Web Speech API.
 */
export function speakText(text, langCode = 'te', gender = 'female', onEndCallback = () => {}) {
  stopSpeaking();
  if (!text || !text.trim()) return;

  const cleanText = text.replace(/[*_#]/g, '').trim();

  // Helper to split text into digestible phrases under 150 chars for Google TTS
  const splitIntoPhrases = (str, maxLen = 140) => {
    const sentences = str.split(/(?<=[.?!,;।\n])\s+/);
    const chunks = [];
    let current = '';

    for (const part of sentences) {
      if ((current + ' ' + part).length <= maxLen) {
        current = current ? current + ' ' + part : part;
      } else {
        if (current) chunks.push(current);
        if (part.length > maxLen) {
          // Subdivide long clause
          const words = part.split(' ');
          let sub = '';
          for (const w of words) {
            if ((sub + ' ' + w).length <= maxLen) {
              sub = sub ? sub + ' ' + w : w;
            } else {
              if (sub) chunks.push(sub);
              sub = w;
            }
          }
          current = sub;
        } else {
          current = part;
        }
      }
    }
    if (current) chunks.push(current);
    return chunks.length > 0 ? chunks : [str];
  };

  const chunks = splitIntoPhrases(cleanText);

  // Play audio chunks sequentially using high-fidelity native Google neural TTS
  const playNextChunk = (index) => {
    if (index >= chunks.length) {
      isQueuePlaying = false;
      onEndCallback();
      return;
    }

    const chunk = chunks[index];
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(langCode)}&q=${encodeURIComponent(chunk)}`;
    
    const audio = new Audio(ttsUrl);
    activeAudioElement = audio;
    isQueuePlaying = true;

    audio.onended = () => {
      playNextChunk(index + 1);
    };

    audio.onerror = () => {
      console.warn('Google TTS audio playback failed, falling back to Web Speech API');
      fallbackWebSpeech(cleanText, langCode, gender, onEndCallback);
    };

    audio.play().catch((err) => {
      console.warn('Autoplay blocked or audio failed, falling back:', err);
      fallbackWebSpeech(cleanText, langCode, gender, onEndCallback);
    });
  };

  playNextChunk(0);
}

// Fallback to browser SpeechSynthesis if network audio is blocked
function fallbackWebSpeech(text, langCode, gender, onEndCallback) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEndCallback();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Pick best available voice
    const voices = window.speechSynthesis.getVoices();
    let matchedVoice = voices.find(v => 
      v.lang.toLowerCase().replace('_', '-').startsWith(langCode.toLowerCase())
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.lang = langCode === 'te' ? 'te-IN' : (langCode === 'hi' ? 'hi-IN' : langCode);
    utterance.pitch = gender === 'female' ? 1.15 : 0.88;
    utterance.rate = 0.95;

    utterance.onend = () => onEndCallback();
    utterance.onerror = () => onEndCallback();

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    onEndCallback();
  }
}

/**
 * Executes an automated call to a shop
 * @param {Object} shop
 * @param {string} language
 * @param {Function} onUpdate - callback with current status & live transcript
 */
export async function executeAiCallToShop(shop, language = 'te', onUpdate = () => {}) {
  audioTones.playDialBeep();
  onUpdate({
    status: 'dialing',
    currentShop: shop,
    transcript: [],
    progress: 10,
    statusText: `Dialing ${shop.phone}...`
  });

  await new Promise(r => setTimeout(r, 1200));

  audioTones.startRinging();
  onUpdate({
    status: 'ringing',
    currentShop: shop,
    transcript: [],
    progress: 25,
    statusText: 'Ringing... waiting for shopkeeper to answer'
  });

  await new Promise(r => setTimeout(r, 2600));

  audioTones.stopRinging();
  audioTones.playCallConnected();

  onUpdate({
    status: 'connected',
    currentShop: shop,
    transcript: [],
    progress: 40,
    statusText: 'Connected - AI speaking to store owner'
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
      statusText: line.speaker === 'ai' ? 'AI inquiring about product stock...' : 'Merchant responding...'
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
    statusText: shop.stockStatus === 'available' ? 'Stock Confirmed!' : 'Out of Stock'
  };

  onUpdate(finalResult);
  return finalResult;
}
