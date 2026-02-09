import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setLoading: (isLoading: boolean) => void;
    signOut: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,

    setUser: (user) => set({ user }),
    setSession: (session) => set({ session, user: session?.user ?? null }),
    setLoading: (isLoading) => set({ isLoading }),

    signOut: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        set({ user: null, session: null });
    },

    initialize: async () => {
        set({ isLoading: true });

        if (!supabase) {
            set({ isLoading: false });
            return;
        }

        // Check current session
        const { data: { session } } = await supabase.auth.getSession();
        set({ session, user: session?.user ?? null, isLoading: false });

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event: any, session: any) => {
            set({ session, user: session?.user ?? null });
        });
    }
}));
