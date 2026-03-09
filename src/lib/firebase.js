import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, setLogLevel } from "firebase/firestore";
// import { getAnalytics, isSupported } from "firebase/analytics"; // Commented out to prevent loading errors

const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === "true";
const firestoreEnabled = import.meta.env.VITE_ENABLE_FIRESTORE === "true";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (analyticsEnabled && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  firebaseConfig.measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Prevent noisy Firestore retry logs in browser console during local dev.
setLogLevel("error");

let analytics = null;
if (analyticsEnabled && typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
    isSupported()
      .then((ok) => {
        if (ok) {
          analytics = getAnalytics(app);
        }
      })
      .catch(() => {
        analytics = null;
      });
  }).catch(() => {
    analytics = null;
  });
}

const auth = getAuth(app);
let db = null;
if (firestoreEnabled) {
  try {
    // Better compatibility on restrictive networks/ad-blockers during local dev.
    db = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
      useFetchStreams: false,
    });
  } catch {
    db = getFirestore(app);
  }
}

export { app, auth, db, analytics, firestoreEnabled };