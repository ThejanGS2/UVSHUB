const { createClient } = require('@supabase/supabase-js');

// These should be configured in your .env file
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
