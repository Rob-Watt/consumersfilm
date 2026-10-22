"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import AccountDialog from "./AccountDialog";
import { getSupabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Remembers that this visitor has seen the sign-up window (by any route), so
// the first-visit prompt never shows twice or interrupts them. If storage is
// blocked, treat it as seen rather than prompting on every visit.
const SEEN_KEY = "consumers:welcome-seen";
export const welcomeSeen = {
  get() {
    try {
      return Boolean(localStorage.getItem(SEEN_KEY));
    } catch {
      return true;
    }
  },
  set() {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}
  },
};

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [dialog, setDialog] = useState(null); // "join" | "login" | null

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      // Tidy the address bar after arriving from a magic link.
      const params = new URLSearchParams(window.location.search);
      if (params.has("code")) {
        params.delete("code");
        const query = params.toString();
        window.history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : ""));
      }
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const openDialog = useCallback((mode) => {
    if (mode) welcomeSeen.set();
    setDialog(mode);
  }, []);

  const value = {
    session,
    ready,
    openDialog,
    signOut: () => getSupabase()?.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AccountDialog mode={dialog} onSwitch={openDialog} onClose={() => setDialog(null)} />
    </AuthContext.Provider>
  );
}
