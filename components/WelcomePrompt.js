"use client";

import { useEffect, useRef } from "react";
import { useAuth, welcomeSeen } from "./AuthProvider";

// Opens the sign-up window once, a few seconds into a visitor's first visit.
export default function WelcomePrompt({ delay = 4000 }) {
  const { session, ready, openDialog } = useAuth();
  const sessionRef = useRef(session);
  sessionRef.current = session;

  useEffect(() => {
    if (!ready || welcomeSeen.get()) return;
    const timer = setTimeout(() => {
      // Re-check: they may have logged in or opened the window themselves.
      if (sessionRef.current || welcomeSeen.get()) return;
      openDialog("join");
    }, delay);
    return () => clearTimeout(timer);
  }, [ready, delay, openDialog]);

  return null;
}
