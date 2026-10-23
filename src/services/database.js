import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from environment or runtime localStorage settings
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const localConfig = (() => {
  try {
    const saved = localStorage.getItem('ai_dialer_db_config');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
})();

const supabaseUrl = localConfig.supabaseUrl || envUrl;
const supabaseAnonKey = localConfig.supabaseKey || envKey;

// Initialize Supabase Client if valid credentials exist
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isCloudDbConnected = Boolean(supabase);

/**
 * Save custom Supabase credentials dynamically from App UI
 */
export function setCustomDatabaseConfig(url, key) {
  if (url && key) {
    localStorage.setItem('ai_dialer_db_config', JSON.stringify({ supabaseUrl: url, supabaseKey: key }));
  } else {
    localStorage.removeItem('ai_dialer_db_config');
  }
}

export function getCustomDatabaseConfig() {
  try {
    const saved = localStorage.getItem('ai_dialer_db_config');
    return saved ? JSON.parse(saved) : { supabaseUrl: envUrl, supabaseKey: envKey };
  } catch (e) {
    return { supabaseUrl: '', supabaseKey: '' };
  }
}

// ---------------------------------------------------------
// DATABASE SERVICES (Cloud Supabase + Local Hybrid Fallback)
// ---------------------------------------------------------

/**
 * 1. RECEPTION RECORDS
 */
export async function getDbReceptionRecords() {
  // Try Cloud Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reception_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Map database fields to app model
        return data.map(r => ({
          id: r.id,
          tokenNumber: r.token_number,
          date: r.date,
          time: r.time,
          name: r.name,
          age: r.age,
          village: r.village,
          phone: r.phone,
          category: r.category,
          allocatedSlot: r.allocated_slot,
          status: r.status,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, using local cache:', err);
    }
  }

  // Fallback to local storage
  try {
    const saved = localStorage.getItem('ai_dialer_reception_records');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export async function insertDbReceptionRecord(record) {
  // Always update local storage first for instant zero-latency UI
  try {
    const existing = JSON.parse(localStorage.getItem('ai_dialer_reception_records') || '[]');
    const updated = [record, ...existing];
    localStorage.setItem('ai_dialer_reception_records', JSON.stringify(updated));
  } catch (e) {}

  // Sync to Cloud Supabase
  if (supabase) {
    try {
      await supabase.from('reception_records').insert([
        {
          id: String(record.id || Date.now()),
          token_number: String(record.tokenNumber || ''),
          date: String(record.date || new Date().toLocaleDateString()),
          time: String(record.time || new Date().toLocaleTimeString()),
          name: record.name,
          age: String(record.age || ''),
          village: record.village,
          phone: record.phone,
          category: record.category || 'Hospital OP',
          allocated_slot: record.allocatedSlot,
          status: record.status || 'Confirmed',
        }
      ]);
    } catch (err) {
      console.warn('Supabase insert failed:', err);
    }
  }

  return record;
}

/**
 * 2. BUSINESS PROFILES
 */
export async function getDbBusinessProfile(categoryId) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('category', categoryId)
        .single();

      if (!error && data) {
        return {
          businessName: data.business_name,
          tagline: data.tagline,
          doctorName: data.doctor_name,
          opTimings: data.op_timings,
          doctorArrivalTime: data.doctor_arrival_time,
          dailySlotLimit: data.daily_slot_limit,
          currentBookedSlots: data.current_booked_slots,
          isDoctorOnLeave: data.is_doctor_on_leave,
          isHolidayToday: data.is_holiday_today,
          address: data.address,
          voiceGender: data.voice_gender,
        };
      }
    } catch (err) {}
  }

  try {
    const saved = localStorage.getItem('ai_dialer_biz_profile');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export async function upsertDbBusinessProfile(categoryId, profile) {
  try {
    localStorage.setItem('ai_dialer_biz_profile', JSON.stringify(profile));
  } catch (e) {}

  if (supabase) {
    try {
      await supabase.from('business_profiles').upsert([
        {
          category: categoryId,
          business_name: profile.businessName,
          tagline: profile.tagline,
          doctor_name: profile.doctorName,
          op_timings: profile.opTimings,
          doctor_arrival_time: profile.doctorArrivalTime,
          daily_slot_limit: profile.dailySlotLimit,
          current_booked_slots: profile.currentBookedSlots,
          is_doctor_on_leave: profile.isDoctorOnLeave,
          is_holiday_today: profile.isHolidayToday,
          address: profile.address,
          voice_gender: profile.voiceGender,
          updated_at: new Date().toISOString()
        }
      ], { onConflict: 'category' });
    } catch (err) {}
  }
}

/**
 * 3. SQL SCHEMA SCRIPT (For Supabase SQL Editor)
 */
export const SQL_SCHEMA = `-- Execute this in Supabase SQL Editor:
create table if not exists reception_records (
  id text primary key,
  token_number text,
  date text,
  time text,
  name text,
  age text,
  village text,
  phone text,
  category text,
  allocated_slot text,
  status text default 'Confirmed',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists business_profiles (
  category text primary key,
  business_name text,
  tagline text,
  doctor_name text,
  op_timings text,
  doctor_arrival_time text,
  daily_slot_limit integer,
  current_booked_slots integer,
  is_doctor_on_leave boolean default false,
  is_holiday_today boolean default false,
  address text,
  voice_gender text default 'female',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) with Public Access policies
alter table reception_records enable row level security;
alter table business_profiles enable row level security;

create policy "Allow public all access on reception_records" on reception_records for all using (true) with check (true);
create policy "Allow public all access on business_profiles" on business_profiles for all using (true) with check (true);
`;
