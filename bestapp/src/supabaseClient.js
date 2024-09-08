// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://xqvflajilvgzbusdsihy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdmZsYWppbHZnemJ1c2RzaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ3MzIyNzYsImV4cCI6MjA0MDMwODI3Nn0.r_YEN3k3W0SQl_gFmusj_bvQLnAsZ9ExXI4I-PnTXuA';

export const supabase = createClient(supabaseUrl, supabaseKey);
