import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lhvrbtxqnsvnrallqaif.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodnJidHhxbnN2bnJhbGxxYWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MTgwNDksImV4cCI6MjA5MTk5NDA0OX0.zpDbA4SvieZn4zYkyH92x1OJ2sJw_kSqXzV820-_6ug';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);