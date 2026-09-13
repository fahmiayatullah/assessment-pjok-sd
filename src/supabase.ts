import { createClient } from '@supabase/supabase-js';

// Baca environment variables Vite
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Bersihkan trailing slash dan spasi dari input
export const supabaseUrl = typeof rawUrl === 'string' ? rawUrl.trim().replace(/\/+$/, '') : '';
export const supabaseAnonKey = typeof rawKey === 'string' ? rawKey.trim() : '';

// Periksa apakah konfigurasi Supabase lengkap dan valid
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase Configuration Warning] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum terpasang dengan benar di environment variables.\n' +
    'Jika menggunakan Vercel: Masuk ke Project Settings -> Environment Variables, tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY, lalu lakukan Redeploy.'
  );
}

// Inisialisasi client Supabase
// Jika env belum diset pada saat build, gunakan fallback dummy valid URL agar client tidak crash saat inisialisasi
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key'
);