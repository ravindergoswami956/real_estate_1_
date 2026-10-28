import { supabase, isSupabaseConfigured } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

const LOCAL_SESSION_KEY = 'guruji_admin_session_auth';

export const AuthService = {
  // Check if admin is currently authenticated
  async getCurrentUser(): Promise<AdminUser | null> {
    // 1. Check local session storage first
    try {
      const stored = sessionStorage.getItem(LOCAL_SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email && parsed.expiresAt > Date.now()) {
          return {
            id: parsed.id,
            email: parsed.email,
            role: 'admin'
          };
        } else {
          sessionStorage.removeItem(LOCAL_SESSION_KEY);
        }
      }
    } catch {
      sessionStorage.removeItem(LOCAL_SESSION_KEY);
    }

    // 2. Check Supabase auth session
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          return {
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin'
          };
        }
      } catch (err) {
        console.warn('Supabase auth get session failed:', err);
      }
    }

    return null;
  },

  // Login handler
  async login(email: string, password: string): Promise<{ user: AdminUser | null; error: string | null }> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Direct Admin Master Password Check
    // Master Admin Password: "Admin77#!"
    const validMasterPasswords = ['Admin77#!', 'Guruji@Sector57', 'admin12345'];
    
    if (validMasterPasswords.includes(password)) {
      const adminEmail = cleanEmail || 'admin@gurujiproperty.com';
      const user: AdminUser = {
        id: `admin-${Date.now()}`,
        email: adminEmail,
        role: 'admin'
      };
      sessionStorage.setItem(
        LOCAL_SESSION_KEY,
        JSON.stringify({
          ...user,
          expiresAt: Date.now() + 1000 * 60 * 60 * 24 // 24 hours
        })
      );
      return { user, error: null };
    }

    // 2. Fallback to Supabase Auth cloud credentials if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (!error && data?.user) {
          const user: AdminUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            role: 'admin'
          };
          sessionStorage.setItem(
            LOCAL_SESSION_KEY,
            JSON.stringify({
              ...user,
              expiresAt: Date.now() + 1000 * 60 * 60 * 24
            })
          );
          return { user, error: null };
        }
      } catch (err: any) {
        console.warn('Supabase auth sign in error:', err);
      }
    }

    return { 
      user: null, 
      error: 'Invalid administrator credentials. Password for admin is: Admin77#!' 
    };
  },

  // Logout handler
  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    sessionStorage.removeItem(LOCAL_SESSION_KEY);
  }
};
