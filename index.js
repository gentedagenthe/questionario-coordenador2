import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://wlfxwtzjlbuzyigzspms.supabase.co';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'SUA_ANON_KEY_AQUI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
