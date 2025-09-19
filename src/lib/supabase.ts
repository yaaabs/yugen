import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug environment variables
console.log('🔧 Environment Variables Check:');
console.log('- VITE_SUPABASE_URL:', supabaseUrl);
console.log('- VITE_SUPABASE_ANON_KEY length:', supabaseAnonKey?.length || 0);
console.log('- VITE_SUPABASE_ANON_KEY (first 20):', supabaseAnonKey?.substring(0, 20) + '...');

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).debugSupabase = {
    url: supabaseUrl,
    keyLength: supabaseAnonKey?.length || 0,
    keyStart: supabaseAnonKey?.substring(0, 20),
    hasValidConfig: !!(supabaseUrl && supabaseAnonKey)
  };
  console.log('🐛 Debug info available at window.debugSupabase');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('supabaseUrl:', supabaseUrl);
  console.error('supabaseAnonKey length:', supabaseAnonKey?.length || 0);
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});

// Health check function to verify connection
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Supabase Key (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
    
    const { data, error } = await supabase
      .from('dph_projects')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection error:', error);
      return false;
    }
    
    console.log('✅ Supabase connected successfully');
    console.log('📊 Sample data:', data);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
};

export default supabase;