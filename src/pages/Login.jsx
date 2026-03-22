import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db, firestoreEnabled } from "../lib/firebase";

const USER_COLLECTION_PRIMARY = "Users";
const USER_COLLECTION_FALLBACK = "users";

async function getUserRole(uid) {
  if (!db || !firestoreEnabled || !uid) return "";

  const primaryRef = doc(db, USER_COLLECTION_PRIMARY, uid);
  const primarySnap = await getDoc(primaryRef);
  if (primarySnap.exists()) {
    const data = primarySnap.data();
    return String(data.role || data.accountRole || "");
  }

  const fallbackRef = doc(db, USER_COLLECTION_FALLBACK, uid);
  const fallbackSnap = await getDoc(fallbackRef);
  if (fallbackSnap.exists()) {
    const data = fallbackSnap.data();
    return String(data.role || data.accountRole || "");
  }

  return "";
}

async function getUserModeration(uid) {
  if (!db || !firestoreEnabled || !uid) {
    return { banned: false, deletedByAdmin: false, reportCount: 0, lastWarning: "" };
  }

  const [primarySnap, fallbackSnap] = await Promise.all([
    getDoc(doc(db, USER_COLLECTION_PRIMARY, uid)),
    getDoc(doc(db, USER_COLLECTION_FALLBACK, uid)),
  ]);

  const data = primarySnap.exists()
    ? primarySnap.data()
    : fallbackSnap.exists()
      ? fallbackSnap.data()
      : {};

  return {
    banned: Boolean(data.banned),
    deletedByAdmin: Boolean(data.deletedByAdmin),
    reportCount: Number(data.reportCount || 0),
    lastWarning: String(data.lastWarning || ""),
  };
}

async function upsertUserRole(uid, role, email) {
  if (!db || !firestoreEnabled || !uid) return;
  const payload = {
    role,
    email: String(email || "").toLowerCase(),
    updatedAt: serverTimestamp(),
  };
  await Promise.all([
    setDoc(doc(db, USER_COLLECTION_PRIMARY, uid), payload, { merge: true }),
    setDoc(doc(db, USER_COLLECTION_FALLBACK, uid), payload, { merge: true }),
  ]);
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInRole, setSignInRole] = useState("business");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    setShowResendVerification(false);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const result = await signInWithEmailAndPassword(auth, normalizedEmail, password);

      if (!result.user.emailVerified) {
        await signOut(auth);
        setError("Email not verified. Check Inbox and Spam/Junk/Promotions, then verify before logging in.");
        setShowResendVerification(true);
        return;
      }

      const existingRole = await getUserRole(result.user.uid);
      if (!existingRole) {
        await upsertUserRole(result.user.uid, signInRole, result.user.email);
      } else if (existingRole !== signInRole) {
        await signOut(auth);
        setError(`This account is registered as ${existingRole === "truck-owner" ? "Truck Owner" : "Business"}. Please select the correct sign-in option.`);
        return;
      }

      // Backfill role if missing in older profile docs.
      if (existingRole === "business" || existingRole === "truck-owner") {
        await upsertUserRole(result.user.uid, existingRole, result.user.email);
      }

      const moderation = await getUserModeration(result.user.uid);
      if (moderation.deletedByAdmin || moderation.banned) {
        await signOut(auth);
        setError("This account is blocked by admin due to policy violations. Contact support if this is a mistake.");
        return;
      }

      if (moderation.reportCount > 0 && moderation.lastWarning) {
        setInfo(moderation.lastWarning);
      }

      navigate("/");
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please wait a few minutes and try again.");
      } else {
        setError("Unable to sign in right now. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setInfo("");

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const result = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      await sendEmailVerification(result.user);
      await signOut(auth);
      setInfo("Verification email sent again. Please check Inbox and also Spam/Junk/Promotions.");
    } catch (err) {
      setError("Unable to resend verification email. Check your credentials and try again.");
      console.error(err);
    }
  };

  return (
    <div className="section-shell flex min-h-[70vh] items-center justify-center py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
        <aside className="brand-gradient hidden p-8 text-white md:block">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-4 text-sm text-slate-100/85">Sign in to manage your quote requests and track active shipments.</p>
        </aside>

        <div className="p-8">
          <h2 className="mb-6 text-2xl font-bold">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Sign in as</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 p-3 text-sm">
                  <input
                    type="radio"
                    name="signInRole"
                    value="business"
                    checked={signInRole === "business"}
                    onChange={(e) => setSignInRole(e.target.value)}
                  />
                  <span>Business</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 p-3 text-sm">
                  <input
                    type="radio"
                    name="signInRole"
                    value="truck-owner"
                    checked={signInRole === "truck-owner"}
                    onChange={(e) => setSignInRole(e.target.value)}
                  />
                  <span>Truck Owner</span>
                </label>
              </div>
            </div>

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
              {loading ? "Signing in..." : "Login"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {info && <p className="text-sm text-emerald-600">{info}</p>}
            {showResendVerification && (
              <button
                type="button"
                onClick={handleResendVerification}
                className="w-full rounded-lg border border-[var(--brand-700)] p-3 text-sm font-medium text-[var(--brand-700)]"
              >
                Resend verification email
              </button>
            )}
          </form>

          <p className="mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[var(--brand-700)]">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;