import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_CATEGORIES } from '../services/receptionistService';
import { 
  Building2, 
  Clock, 
  Users, 
  CheckCircle2, 
  UserX, 
  CalendarOff, 
  Volume2, 
  X,
  Sparkles,
  MapPin
} from 'lucide-react';

export function CategorySetupModal({ isOpen, onClose }) {
  const { 
    selectedCategory, 
    changeCategory, 
    businessProfile, 
    updateBusinessProfile,
    language 
  } = useApp();

  const [localProfile, setLocalProfile] = useState({ ...businessProfile });

  if (!isOpen) return null;

  const currentCatObj = BUSINESS_CATEGORIES.find(c => c.id === selectedCategory) || BUSINESS_CATEGORIES[0];

  const handleSelectCategory = (catId) => {
    changeCategory(catId);
    const cat = BUSINESS_CATEGORIES.find(c => c.id === catId);
    if (cat) {
      setLocalProfile(cat.defaultSettings);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateBusinessProfile(localProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-pastel-900/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-pastel-200 shadow-soft-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-pastel-100 to-pastel-50 border-b border-pastel-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-pastel-200 shadow-sm flex items-center justify-center text-xl">
              {currentCatObj.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-pastel-900 font-serif">
                AI రిసెప్షనిస్ట్ కాన్ఫిగరేషన్ (Category Setup)
              </h3>
              <p className="text-[11px] text-pastel-600">
                రిసెప్షన్ స్థానంలో AI ని నియమించుకోండి
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

        {/* Form Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          
          {/* Step 1: Business Category Chooser */}
          <div>
            <label className="block text-xs font-bold text-pastel-800 uppercase tracking-wider mb-2">
              వ్యాపార విభాగం ఎంచుకోండి (Select Category):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUSINESS_CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-pastel-100/90 border-pastel-600 shadow-xs ring-1 ring-pastel-500'
                        : 'bg-pastel-50/60 border-pastel-200 hover:bg-pastel-100/50'
                    }`}
                  >
                    <span className="text-xl mb-1">{cat.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-pastel-900 leading-snug">
                        {language === 'te' ? cat.nameTe.split('/')[0] : cat.name.split('/')[0]}
                      </p>
                      <p className="text-[9px] text-pastel-500 line-clamp-1 mt-0.5">
                        {language === 'te' ? cat.descriptionTe : cat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form id="profileForm" onSubmit={handleSave} className="space-y-3.5 pt-2 border-t border-pastel-100">
            
            {/* Business / Hospital Name */}
            <div>
              <label className="block text-xs font-semibold text-pastel-800 mb-1">
                {selectedCategory === 'hospital' ? 'హాస్పిటల్ పేరు (Hospital Name)' : 'వ్యాపారం పేరు (Business Name)'}
              </label>
              <input
                type="text"
                value={localProfile.businessName}
                onChange={(e) => setLocalProfile({ ...localProfile, businessName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-pastel-200 bg-pastel-50 text-xs text-pastel-900 focus:outline-none focus:border-pastel-500 focus:bg-white"
                required
              />
            </div>

            {/* Doctor / Specialist Name (if hospital/clinic) */}
            {selectedCategory === 'hospital' && (
              <div>
                <label className="block text-xs font-semibold text-pastel-800 mb-1">
                  డాక్టర్ పేరు (Doctor / Specialist)
                </label>
                <input
                  type="text"
                  value={localProfile.doctorName}
                  onChange={(e) => setLocalProfile({ ...localProfile, doctorName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-pastel-200 bg-pastel-50 text-xs text-pastel-900 focus:outline-none focus:border-pastel-500"
                />
              </div>
            )}

            {/* Timings & Slots Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-pastel-800 mb-1">
                  {selectedCategory === 'hospital' ? 'OP వేళలు (Timings)' : 'పనివేళలు (Timings)'}
                </label>
                <input
                  type="text"
                  value={localProfile.opTimings}
                  onChange={(e) => setLocalProfile({ ...localProfile, opTimings: e.target.value })}
                  placeholder="10:00 AM - 2:00 PM"
                  className="w-full px-3 py-2 rounded-xl border border-pastel-200 bg-pastel-50 text-xs text-pastel-900 focus:outline-none focus:border-pastel-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pastel-800 mb-1">
                  {selectedCategory === 'hospital' ? 'రోజువారీ OP పరిమితి (Limit)' : 'రోజువారీ స్లాట్స్ (Capacity)'}
                </label>
                <input
                  type="number"
                  value={localProfile.dailySlotLimit}
                  onChange={(e) => setLocalProfile({ ...localProfile, dailySlotLimit: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-pastel-200 bg-pastel-50 text-xs text-pastel-900 focus:outline-none focus:border-pastel-500"
                />
              </div>
            </div>

            {/* Doctor Arrival Time & Address */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-pastel-800 mb-1">
                  {selectedCategory === 'hospital' ? 'డాక్టర్ వచ్చే సమయం (Arrival)' : 'ప్రారంభ సమయం (Start)'}
                </label>
                <input
                  type="text"
                  value={localProfile.doctorArrivalTime}
                  onChange={(e) => setLocalProfile({ ...localProfile, doctorArrivalTime: e.target.value })}
                  placeholder="10:00 AM"
                  className="w-full px-3 py-2 rounded-xl border border-pastel-200 bg-pastel-50 text-xs text-pastel-900 focus:outline-none focus:border-pastel-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pastel-800 mb-1">
                  ఊరు / చిరునామా (Address / City)
                </label>
                <input
                  type="text"
                  value={localProfile.address}
                  onChange={(e) => setLocalProfile({ ...localProfile, address: e.target.value })}
                  placeholder="నరసరావుపేట"
                  className="w-full px-3 py-2 rounded-xl border border-pastel-200 bg-pastel-50 text-xs text-pastel-900 focus:outline-none focus:border-pastel-500"
                />
              </div>
            </div>

            {/* AI Voice Persona Selection: Female or Male Voice */}
            <div className="p-3 rounded-2xl bg-pastel-50 border border-pastel-200 space-y-2">
              <label className="block text-xs font-bold text-pastel-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Volume2 className="w-3.5 h-3.5 text-pastel-600" />
                <span>AI మాటల స్వరం (Voice Gender):</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLocalProfile({ ...localProfile, voiceGender: 'female' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                    localProfile.voiceGender === 'female'
                      ? 'bg-pastel-600 text-white shadow-xs border-pastel-700'
                      : 'bg-white text-pastel-800 border-pastel-200 hover:bg-pastel-100'
                  }`}
                >
                  <span>👩 అమ్మాయి స్వరం (Female Voice)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalProfile({ ...localProfile, voiceGender: 'male' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                    localProfile.voiceGender === 'male'
                      ? 'bg-pastel-600 text-white shadow-xs border-pastel-700'
                      : 'bg-white text-pastel-800 border-pastel-200 hover:bg-pastel-100'
                  }`}
                >
                  <span>👨 అబ్బాయి స్వరం (Male Voice)</span>
                </button>
              </div>
            </div>

            {/* Dynamic Status Toggles: Doctor on Leave & Holiday Today */}
            <div className="space-y-2 pt-1">
              {/* Doctor Leave Toggle */}
              {selectedCategory === 'hospital' && (
                <div className="p-3 rounded-xl bg-white border border-pastel-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-pastel-900">డాక్టర్ గారు ఈరోజు సెలవులో ఉన్నారా?</p>
                    <p className="text-[10px] text-pastel-500">
                      ఆన్ చేస్తే: AI కాలర్లకు "డాక్టర్ ఈరోజు సెలవులో ఉన్నారు, రేపు రండి" అని చెబుతుంది.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localProfile.isDoctorOnLeave}
                    onChange={(e) => setLocalProfile({ ...localProfile, isDoctorOnLeave: e.target.checked })}
                    className="w-5 h-5 accent-pastel-600 rounded cursor-pointer"
                  />
                </div>
              )}

              {/* Holiday Toggle */}
              <div className="p-3 rounded-xl bg-white border border-pastel-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-pastel-900">ఈరోజు సెలవా? (Holiday Today)</p>
                  <p className="text-[10px] text-pastel-500">
                    ఆన్ చేస్తే: AI కాలర్లకు "ఈరోజు సెలవు అండి, రేపు రండి" అని చెబుతుంది.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={localProfile.isHolidayToday}
                  onChange={(e) => setLocalProfile({ ...localProfile, isHolidayToday: e.target.checked })}
                  className="w-5 h-5 accent-pastel-600 rounded cursor-pointer"
                />
              </div>
            </div>

          </form>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-pastel-50 border-t border-pastel-200 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-pastel-200 text-xs font-semibold text-pastel-700 hover:bg-pastel-100 transition"
          >
            రద్దు చేయండి
          </button>

          <button
            type="submit"
            form="profileForm"
            className="py-2.5 px-5 rounded-xl bg-pastel-600 hover:bg-pastel-700 text-white text-xs font-semibold shadow-soft transition active:scale-95"
          >
            సేవ్ చేయండి (Save Settings)
          </button>
        </div>

      </div>
    </div>
  );
}

