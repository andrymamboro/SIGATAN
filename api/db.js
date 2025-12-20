// db.js - Koneksi Supabase untuk seluruh aplikasi
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wfctxoulksmervtxghwr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_P-1TRDahxuSxl8DFcne2cA_b6NHo2Ow';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Gunakan: import { supabase } from '@/api/db';
