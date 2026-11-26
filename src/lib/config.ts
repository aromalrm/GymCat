const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? "";
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

export const supabaseConfig = {
  url,
  anonKey,
  isConfigured: url.length > 0 && anonKey.length > 0,
};
