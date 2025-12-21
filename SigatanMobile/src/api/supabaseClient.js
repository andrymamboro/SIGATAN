// Supabase client setup
import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan anon key project Supabase Anda
const SUPABASE_URL = 'https://wfctxoulksmervtxghwr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_P-1TRDahxuSxl8DFcne2cA_b6NHo2Ow';

// Untuk keamanan, sebaiknya gunakan environment variable untuk menyimpan key Anda.

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
