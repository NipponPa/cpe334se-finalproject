import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a custom Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: globalThis.localStorage || {
      // Fallback storage implementation if localStorage is not available
      getItem: (key: string) => {
        try {
          return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
        } catch {
          return null
        }
      },
      setItem: (key: string, value: string) => {
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value)
          }
        } catch {
          // Ignore storage errors
        }
      },
      removeItem: (key: string) => {
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key)
          }
        } catch {
          // Ignore storage errors
        }
      }
    }
  }
})
