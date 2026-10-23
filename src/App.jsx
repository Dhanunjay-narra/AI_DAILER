import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashModal } from './components/SplashModal';
import { AuthModal } from './components/AuthModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ChatView } from './components/ChatView';
import { DialerLogsView } from './components/DialerLogsView';
import { ShopsDirectoryView } from './components/ShopsDirectoryView';
import { SettingsView } from './components/SettingsView';
import { CallingModal } from './components/CallingModal';
import { ReceptionDeskView } from './components/ReceptionDeskView';
import { CategorySetupModal } from './components/CategorySetupModal';
import { InboundCallModal } from './components/InboundCallModal';
import { OutboundCustomCallModal } from './components/OutboundCustomCallModal';
import { DatabaseModal } from './components/DatabaseModal';

function MainAppContent() {
  const { user, activeTab } = useApp();

  // Splash screen state: show on startup
  const [showSplash, setShowSplash] = useState(true);

  // Auth modal: open if user is not logged in after splash
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Language modal state
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Category setup modal state
  const [showCategorySetup, setShowCategorySetup] = useState(false);

  // Custom Outbound Call modal state
  const [showCustomDialer, setShowCustomDialer] = useState(false);

  // Database modal state
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!user) {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#3C2A21] flex justify-center">
      
      {/* Mobile Shell Wrapper */}
      <div className="w-full max-w-md min-h-screen bg-[#FAF7F2] flex flex-col relative shadow-soft-lg border-x border-pastel-200/60">
        
        {/* Top Header */}
        <Header onOpenLanguageModal={() => setShowLanguageModal(true)} />

        {/* Active Tab View */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'reception' && (
            <ReceptionDeskView 
              onOpenCategorySetup={() => setShowCategorySetup(true)}
              onOpenCustomDialer={() => setShowCustomDialer(true)}
              onOpenDatabaseModal={() => setShowDatabaseModal(true)}
            />
          )}
          {activeTab === 'chat' && <ChatView />}
          {activeTab === 'dialer' && <DialerLogsView />}
          {activeTab === 'shops' && <ShopsDirectoryView />}
          {activeTab === 'settings' && (
            <SettingsView 
              onOpenLanguageModal={() => setShowLanguageModal(true)} 
              onOpenDatabaseModal={() => setShowDatabaseModal(true)}
            />
          )}
        </main>

        {/* Bottom Navigation Dock */}
        <BottomNav onOpenCustomDialer={() => setShowCustomDialer(true)} />

        {/* Modals */}
        <CallingModal />
        <InboundCallModal />
        
        <CategorySetupModal 
          isOpen={showCategorySetup} 
          onClose={() => setShowCategorySetup(false)} 
        />

        <OutboundCustomCallModal
          isOpen={showCustomDialer}
          onClose={() => setShowCustomDialer(false)}
        />

        <DatabaseModal
          isOpen={showDatabaseModal}
          onClose={() => setShowDatabaseModal(false)}
        />

        {showSplash && (
          <SplashModal 
            onComplete={handleSplashComplete} 
            onOpenLanguageSelector={() => setShowLanguageModal(true)} 
          />
        )}

        <AuthModal 
          isOpen={showAuthModal && !user} 
          onClose={() => setShowAuthModal(false)} 
        />

        <LanguageSelectorModal 
          isOpen={showLanguageModal} 
          onClose={() => setShowLanguageModal(false)} 
        />

      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
