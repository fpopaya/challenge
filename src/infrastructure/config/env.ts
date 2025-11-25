export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const env = {
  logoUrl:
    import.meta.env.VITE_LOGO_URL ||
    'https://cdn.prod.website-files.com/647f4d1c528358bdb9d8ef3e/689216bacb36c723c46208df_brand-desktop.png',
}

export const CACHE_TIME = 5 * 60 * 1000
