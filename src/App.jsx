import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
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
import { OnboardingFlow } from './components/OnboardingFlow';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';

function MainAppContent() {
  const { user, activeTab } = useApp();

  // Modals
  const [showCategorySetup, setShowCategorySetup] = useState(false);
  const [showCustomDialer, setShowCustomDialer] = useState(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // If user is not logged in, show the clean 3-step Onboarding Flow
  // Step 1: Splash ("Get Started") -> Step 2: Language -> Step 3: Mobile Phone + SMS OTP
  if (!user) {
    return <OnboardingFlow onComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#3C2A21] flex justify-center">
      
      {/* Mobile Shell Wrapper */}
      <div className="w-full max-w-md min-h-screen bg-[#FAF7F2] flex flex-col relative shadow-soft-lg border-x border-pastel-200/60">
        
        {/* Minimalist Top Header */}
        <Header />

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
              onOpenCategorySetup={() => setShowCategorySetup(true)}
            />
          )}
        </main>

        {/* Bottom Navigation Dock */}
        <BottomNav onOpenCustomDialer={() => setShowCustomDialer(true)} />

        {/* Global Modals */}
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
