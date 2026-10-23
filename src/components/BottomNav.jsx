import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, MessageSquare, PhoneCall, PhoneForwarded, Settings } from 'lucide-react';

export function BottomNav({ onOpenCustomDialer }) {
  const { activeTab, setActiveTab, t, callLogs, receptionRecords } = useApp();

  const navItems = [
    { 
      id: 'reception', 
      label: 'AI రిసెప్షన్', 
      icon: Building2, 
      badge: receptionRecords.length > 0 ? receptionRecords.length : null 
    },
    { 
      id: 'chat', 
      label: 'షాప్ సెర్చ్', 
      icon: MessageSquare 
    },
    { 
      id: 'custom_dialer', 
      label: 'కస్టమ్ కాల్', 
      icon: PhoneForwarded,
      isAction: true 
    },
    { 
      id: 'dialer', 
      label: 'లాగ్స్', 
      icon: PhoneCall, 
      badge: callLogs.length > 0 ? callLogs.length : null 
    },
    { 
      id: 'settings', 
      label: 'సెట్టింగ్స్', 
      icon: Settings 
    },
  ];

  const handleClick = (item) => {
    if (item.isAction) {
      onOpenCustomDialer();
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-pastel-200 py-1 px-2 shadow-soft">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition duration-200 ${
                isActive 
                  ? 'text-pastel-900 font-bold' 
                  : 'text-pastel-500 hover:text-pastel-800'
              }`}
            >
              {/* Active Pill indicator behind icon */}
              <div className={`p-1.5 rounded-xl transition ${
                isActive ? 'bg-pastel-200 text-pastel-900 shadow-xs' : ''
              }`}>
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>

              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[65px]">
                {item.label}
              </span>

              {/* Badge */}
              {item.badge && (
                <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-pastel-600 text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
