// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nmtpawlcmtfapqilkuva.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tdHBhd2xjbXRmYXBxaWxrdXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzQ2ODksImV4cCI6MjA2ODcxMDY4OX0.LoXNj1nYv_-F3m0AopsiGuzo7sliyp3pSzuldfVVPTA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});