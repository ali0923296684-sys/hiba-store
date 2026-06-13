import { createClient } from '@supabase/supabase-js';

// تم وضع البيانات مباشرة لضمان نجاح البناء على Cloudflare
const supabaseUrl = 'https://jeqqjtfiieojjhwvqeew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcXFqdGZpaWVvampod3ZxZWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzQ4NzcsImV4cCI6MjA5Njg1MDg3N30.-IFoTrZaD9WFINMbrGai_wkf3Hnqwdbcst1Mx3GvTmU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);