import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase configuration provided by the user
export const SUPABASE_PROJECT_ID = 'hywzqdaknoogcbdzsxcn';
export const DEFAULT_SUPABASE_URL = 'https://hywzqdaknoogcbdzsxcn.supabase.co';

// Read from Vite environment variables (or fall back to project URL)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClientInstance: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey.trim() !== '');
};

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClientInstance) {
    try {
      supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseClientInstance;
};

// Direct client for code that checks connection or queries
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
