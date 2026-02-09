// Re-export the hub's shared Supabase client
// This ensures all modules use the same auth session
export { supabase } from '@/core/auth/supabase';
