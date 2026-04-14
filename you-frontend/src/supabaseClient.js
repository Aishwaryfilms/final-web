import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL_FALLBACK = 'https://zwbzqccsliazsrrdvhnf.supabase.co';
const SUPABASE_ANON_KEY_FALLBACK = 'sb_publishable_YK-LZbQQOgKNZn1W0aOZdw_c5rGfk1L';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK).trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_FALLBACK).trim();

let supabase;

if (supabaseUrl && supabaseAnonKey) {
	supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
	// Fallback stub: prevents runtime errors when VITE_ env vars are missing
	// Returns empty data and no-op auth so the app can render a UI without crashing.
	// This is safe for static previews; replace with real keys in GitHub Secrets for production.
	// eslint-disable-next-line no-console
	console.warn('[supabaseClient] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing — using stub client');

	const builder = () => {
		const b = {
			select: () => b,
			order: async () => ({ data: [], error: null }),
			single: async () => ({ data: null, error: null }),
		};
		return b;
	};

	supabase = {
		from: () => ({
			select: () => ({
				order: async () => ({ data: [], error: null }),
				single: async () => ({ data: null, error: null }),
			}),
			insert: () => ({
				select: () => ({ single: async () => ({ data: null, error: null }) }),
			}),
			delete: () => ({ eq: async () => ({ data: null, error: null }) }),
			update: () => ({ eq: async () => ({ data: null, error: null }) }),
		}),
		auth: {
			signInWithPassword: async () => ({ error: null }),
			signOut: async () => ({ error: null }),
		},
	};
}

export { supabase };
