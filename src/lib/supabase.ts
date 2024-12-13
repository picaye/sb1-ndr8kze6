import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykwvxfqbqvjbvzulnqmj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrd3Z4ZnFicXZqYnZ6dWxucW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcxMzk4NjksImV4cCI6MjAyMjcxNTg2OX0.GKdcN4QFI-mhgN8kHk6ZPRuQPqE-fsf8HBGjh5AeqWk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit'
  },
  db: {
    schema: 'public'
  }
});