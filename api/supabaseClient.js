// Supabase client setup untuk aplikasi web
import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan anon key project Supabase Anda
// const SUPABASE_URL = 'https://your-project.supabase.co';
// const SUPABASE_ANON_KEY = 'your-anon-key';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;


// Environment variables should be set in a .env file or your deployment environment, not directly in JS files.
// Example .env usage (do not include in this JS file):
// NEXT_PUBLIC_SUPABASE_URL=https://wfctxoulksmervtxghwr.supabase.co
// NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_P-1TRDahxuSxl8DFcne2cA_b6NHo2Ow


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
