import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { auth, db, firestoreEnabled } from "../lib/firebase";

function withTimeout(promise, ms, timeoutMessage) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(timeoutMessage)), ms)),
  ]);
}

function Register(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [emailActuallySent, setEmailActuallySent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    setEmailActuallySent(false);

    const appendInfo = (msg) => setInfo((prev) => (prev ? `${prev} ${msg}` : msg));

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const displayName = name.trim();
      const result = await withTimeout(
        createUserWithEmailAndPassword(auth, normalizedEmail, password),
        15000,
        "Timed out while creating account"
      );

      try {
        await withTimeout(updateProfile(result.user, { displayName }), 10000, "Timed out while updating profile");
      } catch (profileErr) {
        console.warn("Profile update delayed:", profileErr);
        appendInfo("Account created. Profile sync is delayed due to connectivity.");
      }

      let verificationDelivered = false;
      let verificationFailureCode = "";
      try {
        await withTimeout(sendEmailVerification(result.user), 10000, "Timed out while sending verification email");
        verificationDelivered = true;
      } catch (firstVerificationErr) {
        // Fallback path: fresh sign-in can recover from transient token/session issues.
        try {
          await withTimeout(signOut(auth), 8000, "Timed out while refreshing session");
          const retry = await withTimeout(
            signInWithEmailAndPassword(auth, normalizedEmail, password),
            12000,
            "Timed out while retrying sign in"
          );
          await withTimeout(sendEmailVerification(retry.user), 10000, "Timed out while retrying verification email");
          verificationDelivered = true;
        } catch (retryErr) {
          const retryCode = retryErr?.code || firstVerificationErr?.code || "";
          verificationFailureCode = retryCode;
          if (retryCode === "auth/too-many-requests") {
            appendInfo("Verification email is temporarily rate-limited by Firebase.");
          } else {
            appendInfo("Account created, but we could not send verification email right now. Please log in and use 'Resend verification email'.");
          }
        }
      }

      if (!verificationDelivered) {
        if (verificationFailureCode === "auth/too-many-requests") {
          try {
            await withTimeout(signOut(auth), 8000, "Timed out while finalizing registration");
          } catch (signOutErr) {
            console.warn("Post-registration sign out delayed:", signOutErr);
          }

          setRegisteredEmail(normalizedEmail);
          setVerificationSent(true);
          setEmailActuallySent(false);
          setInfo(
            "Account created, but Firebase temporarily blocked verification email due to rate limits. Please wait a few minutes, then log in and click 'Resend verification email'."
          );
          return;
        }

        try {
          if (auth.currentUser) {
            await withTimeout(deleteUser(auth.currentUser), 10000, "Timed out while rolling back account");
          }
        } catch (rollbackErr) {
          console.warn("Account rollback failed:", rollbackErr);
        }

        try {
          await withTimeout(signOut(auth), 8000, "Timed out while signing out");
        } catch {
          // Ignore sign out failure during rollback.
        }

        setError("Verification email could not be sent, so account was not created. Please try again in a few minutes.");
        return;
      }

      if (db && firestoreEnabled) {
        const [firstName = "", ...rest] = displayName.split(/\s+/).filter(Boolean);
        const lastName = rest.join(" ");

        const profilePayload = {
          username: displayName,
          displayName,
          firstName,
          lastName,
          email: normalizedEmail,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const batch = writeBatch(db);
        batch.set(doc(db, "users", result.user.uid), profilePayload, { merge: true });
        batch.set(doc(db, "Users", result.user.uid), profilePayload, { merge: true });
        try {
          await withTimeout(batch.commit(), 10000, "Timed out while saving profile data");
        } catch (syncErr) {
          console.warn("Firestore profile save delayed:", syncErr);
          appendInfo("Verification email sent. Firestore profile sync is delayed and will retry later.");
        }
      }

      try {
        await withTimeout(signOut(auth), 8000, "Timed out while finalizing registration");
      } catch (signOutErr) {
        console.warn("Post-registration sign out delayed:", signOutErr);
      }
      setRegisteredEmail(normalizedEmail);
      setVerificationSent(true);
      setEmailActuallySent(true);

      setInfo("Account created. Verification email sent successfully. Please check Inbox and Spam/Junk/Promotions.");
    } catch (err) {
      const code = err?.code || "";
      const message = String(err?.message || "").toLowerCase();
      if (code === "auth/email-already-in-use") {
        setError("This email is already registered. Try logging in and resend verification if needed.");
        setInfo("If you just created this account, go to Login and use 'Resend verification email'.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else if (message.includes("timed out")) {
        setError("Request timed out. If account was created, use Login and resend verification email.");
      } else {
        setError("Unable to create account right now. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="section-shell flex min-h-[70vh] items-center justify-center py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
        <aside className="brand-gradient hidden p-8 text-white md:block">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="mt-4 text-sm text-slate-100/85">Register once to access quick quote submissions and shipment updates.</p>
        </aside>

        <div className="p-8">
          {verificationSent ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
              <h2 className="text-2xl font-bold text-emerald-700">Check your inbox</h2>
              <p className="mt-3 text-sm text-slate-700">
                {emailActuallySent ? (
                  <>
                    We sent a verification link to <span className="font-semibold">{registeredEmail}</span>.
                    Please verify your email before logging in.
                  </>
                ) : (
                  <>
                    Your account was created for <span className="font-semibold">{registeredEmail}</span>, but verification email is temporarily delayed.
                    Please use Login and click <span className="font-semibold">Resend verification email</span> after a short wait.
                  </>
                )}
              </p>
              <p className="mt-2 text-xs text-slate-600">
                If you do not find the email in Inbox, please check Spam, Junk, or Promotions and mark it as "Not Spam".
              </p>
              {info && <p className="mt-3 text-xs text-slate-700">{info}</p>}
              <button
                onClick={() => navigate("/login")}
                className="mt-5 w-full rounded-lg bg-[var(--brand-700)] p-3 text-white"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <h2 className="mb-6 text-2xl font-bold">Register</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-3"
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-3"
                  required
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-3 pr-16"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--brand-700)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <button disabled={loading} className="w-full rounded-lg bg-[var(--brand-700)] p-3 text-white hover:brightness-110 disabled:opacity-60">
                  {loading ? "Creating account..." : "Register"}
                </button>

                {error && <p className="text-sm text-red-600">{error}</p>}
                {info && <p className="text-sm text-slate-700">{info}</p>}
              </form>

              <p className="mt-4 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-[var(--brand-700)]">
                  Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;