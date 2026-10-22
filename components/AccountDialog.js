"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase } from "../lib/supabase";
import { site } from "../lib/site";

const copy = {
  join: {
    title: "Stay in the loop",
    intro: `Get news on ${site.title}: release dates, screenings and shop drops.`,
    button: "Sign up",
    done: "Thanks — you're on the list.",
  },
  login: {
    title: "Log in",
    intro: "Continue with Google, or enter your email and we'll send you a link. New here? Either way creates your account.",
    button: "Email me a link",
    done: "Check your email for your log-in link.",
  },
};

export default function AccountDialog({ mode, onSwitch, onClose }) {
  const dialogRef = useRef(null);
  const [email, setEmail] = useState("");
  const [updates, setUpdates] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (mode && !dialog.open) {
      // Fresh form each time it opens; switching between modes keeps the email.
      setEmail("");
      setUpdates(false);
      dialog.showModal();
    }
    if (!mode && dialog.open) dialog.close();
    setStatus("idle");
    setMessage("");
  }, [mode]);

  // Put the cursor in the email box once the form is on screen.
  useEffect(() => {
    if (mode && status === "idle") dialogRef.current?.querySelector("input[type=email]")?.focus();
  }, [mode, status]);

  if (!mode) return <dialog ref={dialogRef} className="account-dialog" />;
  const text = copy[mode];

  const subscribe = async (supabase, source) => {
    const { error } = await supabase.from("subscribers").insert({ email: email.trim().toLowerCase(), source });
    // 23505 = already on the list, which is fine.
    if (error && error.code !== "23505") throw error;
    return error?.code === "23505";
  };

  const signInWithGoogle = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setStatus("error");
      setMessage("Log-in isn't connected yet. Please try again soon.");
      return;
    }
    setStatus("sending");
    // Leaves the site for Google, then returns here logged in.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + window.location.pathname },
    });
    if (error) {
      setStatus("error");
      setMessage("Couldn't reach Google. Please try again.");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      setStatus("error");
      setMessage("Sign-up isn't connected yet. Please try again soon.");
      return;
    }
    setStatus("sending");
    try {
      if (mode === "join") {
        const already = await subscribe(supabase, "site");
        setMessage(already ? "You're already on the list — thanks!" : text.done);
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { emailRedirectTo: window.location.origin + window.location.pathname },
        });
        if (error) throw error;
        if (updates) await subscribe(supabase, "account");
        setMessage(text.done);
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please check the address and try again.");
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="account-dialog"
      aria-labelledby="account-dialog-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="account-dialog__panel">
        <button type="button" className="account-dialog__close" aria-label="Close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <p className="account-dialog__wordmark">{site.title}</p>
        <h2 id="account-dialog-title" className="account-dialog__title">{text.title}</h2>
        <p className="account-dialog__intro">{text.intro}</p>

        {status === "done" ? (
          <p className="account-dialog__done" role="status">{message}</p>
        ) : (
          <>
            {mode === "login" && (
              <>
                <button
                  type="button"
                  className="account-dialog__google"
                  onClick={signInWithGoogle}
                  disabled={status === "sending"}
                >
                  <GoogleLogo />
                  Continue with Google
                </button>
                <p className="account-dialog__or">or</p>
              </>
            )}
            <form className="account-dialog__form" onSubmit={onSubmit}>
              <label className="visually-hidden" htmlFor="account-email">Email address</label>
              <input
                id="account-email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {mode === "login" && (
                <label className="account-dialog__check">
                  <input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} />
                  Also send me news about {site.title}
                </label>
              )}
              <button type="submit" className="account-dialog__submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : text.button}
              </button>
              {status === "error" && <p className="account-dialog__error" role="alert">{message}</p>}
              <p className="account-dialog__fine">
                You can unsubscribe at any time. <a href="/privacy/">Privacy policy</a>
              </p>
            </form>
          </>
        )}

        <p className="account-dialog__switch">
          {mode === "join" ? (
            <>Have an account? <button type="button" onClick={() => onSwitch("login")}>Log in</button></>
          ) : (
            <>Just want updates? <button type="button" onClick={() => onSwitch("join")}>Join the email list</button></>
          )}
        </p>
      </div>
    </dialog>
  );
}

// Google's standard "G" mark (required by Google's sign-in branding rules).
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
