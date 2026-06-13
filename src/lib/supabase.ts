import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jeqqjtfiieojjhwvqeew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcXFqdGZpaWVvampod3ZxZWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzQ4NzcsImV4cCI6MjA5Njg1MDg3N30.-IFoTrZaD9WFINMbrGai_wkf3Hnqwdbcst1Mx3GvTmU';

// التأكد من وجود قيمة دائماً لمنع توقف البناء
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder"
);