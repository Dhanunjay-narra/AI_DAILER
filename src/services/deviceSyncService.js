// Central Device Hardware & Permissions Sync Service
// Handles: GPS Geolocation with Reverse Geocoding, Microphone Media Stream,
// Web Audio Context, Speech Recognition, and Telephony readiness.

import { audioTones } from '../utils/audioTones';
import { isCloudDbConnected } from './database';

export class DeviceSyncService {
  constructor() {
    this.status = {
      location: { granted: false, area: 'నరసరావుపేట (Narasaraopet)', lat: 16.2359, lon: 80.0499 },
      microphone: { granted: false, stream: null },
      audio: { ready: false },
      speechRecognition: { supported: false },
      telephony: { ready: true },
      database: { connected: isCloudDbConnected }
    };
  }

  // 1. Sync & Request GPS Location with Free Reverse Geocoding
  async syncLocation() {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve({ granted: false, error: 'Geolocation not supported' });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          let resolvedArea = `GPS: ${lat.toFixed(3)}, ${lon.toFixed(3)}`;

          try {
            // Free OpenStreetMap reverse geocoding (no API key needed)
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`, {
              headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || 'Your Area';
              const state = addr.state || '';
              resolvedArea = state ? `${city}, ${state}` : city;
            }
          } catch (e) {
            console.warn('Reverse geocoding fallback:', e);
          }

          this.status.location = { granted: true, area: resolvedArea, lat, lon };
          resolve(this.status.location);
        },
        (error) => {
          console.warn('Geolocation denied or timeout:', error);
          this.status.location.granted = false;
          resolve({ granted: false, error: error.message });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }

  // 2. Sync & Request Microphone Permission
  async syncMicrophone() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { granted: false, error: 'MediaDevices not supported' };
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.status.microphone = { granted: true, stream };
      // Stop stream immediately to release hardware mic until user actively talks
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
      }, 500);
      return { granted: true };
    } catch (err) {
      console.warn('Microphone permission denied:', err);
      this.status.microphone = { granted: false, error: err.name };
      return { granted: false, error: err.name };
    }
  }

  // 3. Sync & Pre-warm Audio / Speaker
  syncAudio() {
    try {
      audioTones.init();
      audioTones.playDialBeep(850, 1200, 0.08); // subtle feedback tone
      this.status.audio.ready = true;
      return { ready: true };
    } catch (e) {
      this.status.audio.ready = false;
      return { ready: false, error: e.message };
    }
  }

  // 4. Check Speech Recognition Support
  checkSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.status.speechRecognition.supported = Boolean(SpeechRecognition);
    return Boolean(SpeechRecognition);
  }

  // 5. Sync Everything All-At-Once with 1 Click!
  async syncAll() {
    this.syncAudio();
    this.checkSpeechRecognition();
    const micRes = await this.syncMicrophone();
    const locRes = await this.syncLocation();

    return {
      location: locRes,
      microphone: micRes,
      audio: this.status.audio,
      speechRecognition: this.status.speechRecognition,
      database: { connected: isCloudDbConnected }
    };
  }
}

export const deviceSync = new DeviceSyncService();

