import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL_FALLBACK = 'https://zwbzqccsliazsrrdvhnf.supabase.co';
const SUPABASE_ANON_KEY_FALLBACK = 'sb_publishable_YK-LZbQQOgKNZn1W0aOZdw_c5rGfk1L';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK).trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_FALLBACK).trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
