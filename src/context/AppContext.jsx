import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, LANGUAGES } from '../utils/translations';
import { audioTones } from '../utils/audioTones';
import { stopSpeaking } from '../services/aiCallingService';
import { BUSINESS_CATEGORIES } from '../services/receptionistService';
import { 
  getDbReceptionRecords, 
  insertDbReceptionRecord, 
  upsertDbBusinessProfile, 
  isCloudDbConnected 
} from '../services/database';
import { deviceSync } from '../services/deviceSyncService';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Language State - default to Telugu ('te') as requested
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('ai_dialer_lang') || 'te';
  });

  const t = translations[language] || translations.en;

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem('ai_dialer_lang', langCode);
  };

  // Auth State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ai_dialer_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('ai_dialer_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai_dialer_user');
  };

  // Business Category & AI Receptionist Profile State
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem('ai_dialer_category') || 'hospital';
  });

  const [businessProfile, setBusinessProfile] = useState(() => {
    const saved = localStorage.getItem('ai_dialer_biz_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const cat = BUSINESS_CATEGORIES.find(c => c.id === 'hospital') || BUSINESS_CATEGORIES[0];
    return cat.defaultSettings;
  });

  const updateBusinessProfile = (newProfile) => {
    setBusinessProfile(prev => {
      const updated = { ...prev, ...newProfile };
      upsertDbBusinessProfile(selectedCategory, updated);
      return updated;
    });
  };

  const changeCategory = (catId) => {
    setSelectedCategory(catId);
    localStorage.setItem('ai_dialer_category', catId);
    const cat = BUSINESS_CATEGORIES.find(c => c.id === catId);
    if (cat) {
      setBusinessProfile(cat.defaultSettings);
      upsertDbBusinessProfile(catId, cat.defaultSettings);
    }
  };

  // Reception Records (Patient OP bookings, Customer inquiries, Table bookings)
  const [receptionRecords, setReceptionRecords] = useState(() => {
    const saved = localStorage.getItem('ai_dialer_reception_records');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'rec-039',
        tokenNumber: 39,
        date: new Date().toLocaleDateString(),
        time: '10:15 AM',
        name: 'ధనుంజయ్ (Dhanunjay)',
        age: '34',
        village: 'నరసరావుపేట (Narasaraopet)',
        phone: '+91 98480 22334',
        category: 'Hospital OP',
        allocatedSlot: '12:00 PM (డాక్టర్ అరైవల్ 10:00 AM)',
        status: 'Confirmed'
      },
      {
        id: 'rec-038',
        tokenNumber: 38,
        date: new Date().toLocaleDateString(),
        time: '09:48 AM',
        name: 'వెంకటేశ్వర్లు (Venkateswarlu)',
        age: '52',
        village: 'చిలకలూరిపేట (Chilakaluripet)',
        phone: '+91 94401 98765',
        category: 'Hospital OP',
        allocatedSlot: '11:45 AM',
        status: 'Confirmed'
      }
    ];
  });

  // Hydrate from Cloud Database if available
  useEffect(() => {
    getDbReceptionRecords().then(records => {
      if (records && records.length > 0) {
        setReceptionRecords(records);
      }
    });
  }, []);

  const addReceptionRecord = (newRecord) => {
    insertDbReceptionRecord(newRecord);
    setReceptionRecords(prev => [newRecord, ...prev]);

    // Increment current booked counter
    setBusinessProfile(prev => {
      const updated = {
        ...prev,
        currentBookedSlots: (prev.currentBookedSlots || 0) + 1
      };
      upsertDbBusinessProfile(selectedCategory, updated);
      return updated;
    });
  };

  // Inbound Call Simulator State (AI Receptionist picking up incoming call)
  const [activeInboundCall, setActiveInboundCall] = useState(null);

  // Custom Outbound Call State (Dialing any custom number with custom questions)
  const [activeCustomOutboundCall, setActiveCustomOutboundCall] = useState(null);

  // Location State
  const [location, setLocation] = useState({
    areaName: 'నరసరావుపేట (Narasaraopet)',
    latitude: 16.2359,
    longitude: 80.0499,
    isGpsGranted: false,
    isDetecting: false,
  });

  const requestGpsLocation = async () => {
    setLocation(prev => ({ ...prev, isDetecting: true }));
    const locRes = await deviceSync.syncLocation();
    if (locRes && locRes.granted) {
      setLocation({
        areaName: locRes.area,
        latitude: locRes.lat,
        longitude: locRes.lon,
        isGpsGranted: true,
        isDetecting: false,
      });
    } else {
      setLocation(prev => ({
        ...prev,
        isGpsGranted: false,
        isDetecting: false,
      }));
    }
  };

  const updateAreaName = (newArea) => {
    setLocation(prev => ({
      ...prev,
      areaName: newArea,
      isGpsGranted: false,
    }));
  };

  // Calling Permission
  const [callPermissionGranted, setCallPermissionGranted] = useState(true);

  // Active Tab: 'reception' | 'custom_dialer' | 'chat' | 'dialer' | 'settings'
  const [activeTab, setActiveTab] = useState('reception');

  // Discovered Shops
  const [discoveredShops, setDiscoveredShops] = useState([]);

  // Call Logs
  const [callLogs, setCallLogs] = useState(() => {
    const saved = localStorage.getItem('ai_dialer_call_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const addCallLog = (logItem) => {
    setCallLogs(prev => {
      const updated = [logItem, ...prev];
      localStorage.setItem('ai_dialer_call_logs', JSON.stringify(updated));
      return updated;
    });
  };

  // Active Calling Modal State (Standard shop stock caller)
  const [activeCallSession, setActiveCallSession] = useState(null);

  const endCurrentCall = () => {
    audioTones.stopRinging();
    audioTones.playCallEnded();
    stopSpeaking();
    setActiveCallSession(null);
    setActiveInboundCall(null);
    setActiveCustomOutboundCall(null);
  };

  // Audio effects enabled
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languagesList: LANGUAGES,
        user,
        login,
        logout,
        selectedCategory,
        changeCategory,
        businessProfile,
        updateBusinessProfile,
        receptionRecords,
        addReceptionRecord,
        activeInboundCall,
        setActiveInboundCall,
        activeCustomOutboundCall,
        setActiveCustomOutboundCall,
        location,
        requestGpsLocation,
        updateAreaName,
        callPermissionGranted,
        setCallPermissionGranted,
        activeTab,
        setActiveTab,
        discoveredShops,
        setDiscoveredShops,
        callLogs,
        addCallLog,
        activeCallSession,
        setActiveCallSession,
        endCurrentCall,
        soundEnabled,
        setSoundEnabled,
        isCloudDbConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
