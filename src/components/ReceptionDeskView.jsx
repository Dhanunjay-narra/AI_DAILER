import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_CATEGORIES, exportRecordsToCSV } from '../services/receptionistService';
import { 
  Building2, 
  Users, 
  Clock, 
  PhoneCall, 
  PhoneIncoming, 
  FileSpreadsheet, 
  Settings2, 
  CalendarOff, 
  UserCheck, 
  UserX, 
  CheckCircle2, 
  Search,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Sliders
} from 'lucide-react';

export function ReceptionDeskView({ onOpenCategorySetup, onOpenCustomDialer }) {
  const { 
    selectedCategory, 
    businessProfile, 
    updateBusinessProfile, 
    receptionRecords, 
    setActiveInboundCall,
    language 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingLimit, setIsEditingLimit] = useState(false);

  const currentCatObj = BUSINESS_CATEGORIES.find(c => c.id === selectedCategory) || BUSINESS_CATEGORIES[0];
  const totalSlots = businessProfile.dailySlotLimit || 150;
  const bookedSlots = businessProfile.currentBookedSlots || receptionRecords.length || 39;
  const remainingSlots = Math.max(0, totalSlots - bookedSlots);

  // Quick adjust limit
  const handleAdjustLimit = (delta) => {
    const newLimit = Math.max(1, totalSlots + delta);
    updateBusinessProfile({ dailySlotLimit: newLimit });
  };

  const handleSetExactLimit = (val) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      updateBusinessProfile({ dailySlotLimit: num });
    }
  };

  // Filter records
  const filteredRecords = receptionRecords.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phone.includes(searchQuery) ||
    (r.village && r.village.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExportExcel = () => {
    exportRecordsToCSV(receptionRecords, `${businessProfile.businessName || 'AI_Reception'}_OP_Bookings.csv`);
  };

  return (
    <div className="max-w-xl mx-auto p-4 pb-24 space-y-4">
      
      {/* Top Business Card */}
      <div className="p-4 rounded-3xl bg-white border border-pastel-200 shadow-soft space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-pastel-100 border border-pastel-200 shadow-xs flex items-center justify-center text-2xl">
              {currentCatObj.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-pastel-900 font-serif leading-tight">
                  {businessProfile.businessName}
                </h2>
              </div>
              <p className="text-[11px] text-pastel-600 mt-0.5">
                {currentCatObj.nameTe.split('/')[0]} • {businessProfile.address || 'నరసరావుపేట'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCategorySetup}
            className="p-2 rounded-xl bg-pastel-50 hover:bg-pastel-100 border border-pastel-200 text-pastel-700 transition"
            title="విభాగం & సెట్టింగ్స్ మార్చండి"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        {/* Status Indicators: Doctor Availability & Holiday */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto no-scrollbar">
          {selectedCategory === 'hospital' && (
            <button
              onClick={() => updateBusinessProfile({ isDoctorOnLeave: !businessProfile.isDoctorOnLeave })}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition ${
                businessProfile.isDoctorOnLeave 
                  ? 'bg-red-100 text-red-800 border border-red-200' 
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {businessProfile.isDoctorOnLeave ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              <span>{businessProfile.isDoctorOnLeave ? 'డాక్టర్ సెలవులో ఉన్నారు (On Leave)' : 'డాక్టర్ అందుబాటులో ఉన్నారు (Available)'}</span>
            </button>
          )}

          <button
            onClick={() => updateBusinessProfile({ isHolidayToday: !businessProfile.isHolidayToday })}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition ${
              businessProfile.isHolidayToday 
                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                : 'bg-pastel-100 text-pastel-800 border border-pastel-200'
            }`}
          >
            <CalendarOff className="w-3.5 h-3.5" />
            <span>{businessProfile.isHolidayToday ? 'ఈరోజు సెలవు (Holiday Today)' : 'సంస్థ ఓపెన్ లో ఉంది (Open)'}</span>
          </button>
        </div>

        {/* Timings info pill */}
        <div className="p-2.5 rounded-2xl bg-pastel-50/80 border border-pastel-100 flex items-center justify-between text-xs text-pastel-700">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-pastel-600" />
            <span>సమయాలు: <strong>{businessProfile.opTimings || '10:00 AM - 2:00 PM'}</strong></span>
          </div>
          {businessProfile.doctorArrivalTime && (
            <span className="text-[11px] text-pastel-500">
              డాక్టర్ అరైవల్: {businessProfile.doctorArrivalTime}
            </span>
          )}
        </div>
      </div>

      {/* Dynamic OP Capacity Manager Box (User requested: OP 150 fixed kadhu, entha kavalantay antha!) */}
      <div className="p-3.5 rounded-3xl bg-white border border-pastel-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-pastel-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-pastel-600" />
              <span>ఈరోజు OP పరిమితి కంట్రోలర్ (Dynamic OP Limit)</span>
            </h3>
            <p className="text-[10px] text-pastel-500">
              హాస్పిటల్ ఇష్టానుసారం రోజుకు ఎన్ని OPలైనా మార్చుకోవచ్చు
            </p>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleAdjustLimit(-5)}
              className="w-7 h-7 rounded-lg bg-pastel-100 hover:bg-pastel-200 text-pastel-800 font-bold flex items-center justify-center active:scale-95 transition"
              title="-5 OPs"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              value={totalSlots}
              onChange={(e) => handleSetExactLimit(e.target.value)}
              className="w-14 py-1 text-center font-bold text-sm text-pastel-900 rounded-lg border border-pastel-300 bg-pastel-50 focus:bg-white focus:outline-none"
            />
            <button
              onClick={() => handleAdjustLimit(5)}
              className="w-7 h-7 rounded-lg bg-pastel-100 hover:bg-pastel-200 text-pastel-800 font-bold flex items-center justify-center active:scale-95 transition"
              title="+5 OPs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Limit Presets */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <span className="text-[10px] text-pastel-400 font-medium">ప్రిసెట్స్:</span>
          {[25, 40, 50, 75, 100, 150, 200, 300].map(limitVal => (
            <button
              key={limitVal}
              onClick={() => handleSetExactLimit(limitVal)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                totalSlots === limitVal
                  ? 'bg-pastel-600 text-white shadow-xs'
                  : 'bg-pastel-50 hover:bg-pastel-100 border border-pastel-200 text-pastel-700'
              }`}
            >
              {limitVal}
            </button>
          ))}
        </div>

        {/* 3 Status Counters */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2.5 rounded-2xl bg-pastel-50 border border-pastel-200">
            <p className="text-[10px] uppercase font-bold text-pastel-600">సెట్ చేసిన పరిమితి</p>
            <p className="text-lg font-bold text-pastel-900 mt-0.5 font-serif">{totalSlots}</p>
          </div>

          <div className="p-2.5 rounded-2xl bg-pastel-100/70 border border-pastel-300">
            <p className="text-[10px] uppercase font-bold text-pastel-700">నమోదైన OP లు</p>
            <p className="text-lg font-bold text-pastel-900 mt-0.5 font-serif">{bookedSlots}</p>
          </div>

          <div className={`p-2.5 rounded-2xl border ${
            remainingSlots === 0 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <p className="text-[10px] uppercase font-bold">{remainingSlots === 0 ? 'కోటా నిండింది' : 'మిగిలినవి'}</p>
            <p className="text-lg font-bold mt-0.5 font-serif">{remainingSlots}</p>
          </div>
        </div>
      </div>

      {/* Main Interactive AI Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        
        {/* Simulate Incoming Call (Inbound) */}
        <button
          onClick={() => setActiveInboundCall({ caller: '+91 98480 22334', origin: 'నరసరావుపేట' })}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-pastel-600 to-pastel-700 hover:from-pastel-700 hover:to-pastel-800 text-white shadow-soft transition active:scale-[0.98] text-left flex items-center justify-between"
        >
          <div>
            <div className="flex items-center space-x-1.5 font-bold text-xs">
              <PhoneIncoming className="w-4 h-4" />
              <span>ఇన్‌కమింగ్ కాల్ టెస్ట్ చేయండి</span>
            </div>
            <p className="text-[10px] text-pastel-100 mt-0.5">
              AI రిసెప్షనిస్ట్ పేషెంట్ తో సహజంగా మాట్లాడే డెమో
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-pastel-200" />
        </button>

        {/* Custom Outbound Number Dialer */}
        <button
          onClick={onOpenCustomDialer}
          className="p-3.5 rounded-2xl bg-white hover:bg-pastel-50 border border-pastel-300 text-pastel-900 shadow-xs transition active:scale-[0.98] text-left flex items-center justify-between"
        >
          <div>
            <div className="flex items-center space-x-1.5 font-bold text-xs text-pastel-900">
              <PhoneCall className="w-4 h-4 text-pastel-600" />
              <span>కస్టమ్ నంబర్ AI కాలర్</span>
            </div>
            <p className="text-[10px] text-pastel-500 mt-0.5">
              ఏదైనా నంబర్ ఇచ్చి వివరాలు అడగండి
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-pastel-400" />
        </button>

      </div>

      {/* Table Records Header & Search + Excel Download */}
      <div className="pt-2 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-pastel-900 font-serif">
              {selectedCategory === 'hospital' ? 'నేటి పేషెంట్ OP జాబితా (Registered OPs)' : 'కస్టమర్ విచారణలు (Inquiries)'}
            </h3>
            <p className="text-[11px] text-pastel-500">
              AI స్వయంచాలకంగా సేకరించి నిల్వ చేసిన వివరాలు
            </p>
          </div>

          <button
            onClick={handleExportExcel}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
            title="Excel షీట్ లోకి సేవ్ చేయండి"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel డౌన్‌లోడ్</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-pastel-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="పేరు, ఊరు లేదా మొబైల్ నంబర్ ద్వారా శోధించండి..."
            className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-pastel-200 text-xs text-pastel-900 focus:outline-none focus:border-pastel-500"
          />
        </div>

        {/* Appointments Table List */}
        <div className="space-y-2">
          {filteredRecords.length === 0 ? (
            <div className="py-8 text-center bg-white rounded-2xl border border-pastel-200 text-xs text-pastel-400">
              ఏ రికార్డులు కనుగొనబడలేదు. "ఇన్‌కమింగ్ కాల్ టెస్ట్ చేయండి" నొక్కండి!
            </div>
          ) : (
            filteredRecords.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-pastel-200 shadow-xs flex items-center justify-between hover:border-pastel-400 transition"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-pastel-100 border border-pastel-200 text-pastel-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    #{item.tokenNumber}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-pastel-900">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-pastel-600">
                      వయస్సు: {item.age} • ఊరు: <span className="font-semibold text-pastel-800">{item.village}</span>
                    </p>
                    <p className="text-[10px] text-pastel-400 mt-0.5">
                      Phone: <span className="font-mono text-pastel-700">{item.phone}</span> • Slot: {item.allocatedSlot}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {item.status || 'Confirmed'}
                  </span>
                  <p className="text-[9px] text-pastel-400 mt-1">
                    {item.time}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
