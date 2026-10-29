// Referência TypeScript para uma futura migração de build/React.
// O site HTML/CSS/JS atual carrega supabaseClient.js; navegadores não executam .ts diretamente.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lwizmrqmtbxnxivnjhpa.supabase.co';
const supabaseAnonKey = 'sb_publishable_qXbC8hMXisdaoidhWkAoRw_BoOo55Ne';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
