import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Sensor {
  id: string;
  name: string;
  sensor_id: string;
  location: string;
  temperature: number;
  humidity: number;
  last_updated: string;
  is_active: boolean;
  created_at: string;
}
