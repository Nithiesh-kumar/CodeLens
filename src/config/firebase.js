import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Added GoogleAuthProvider here
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDdxgsxAbHUV8ODyYMoC-Iun58Guw04bUQ",
  authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "codelens-a547a.firebaseapp.com",
  projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID || "codelens-a547a",
  storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "codelens-a547a.firebasestorage.app",
  messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "341049700574",
  appId: import.meta.env.REACT_APP_FIREBASE_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID || "1:341049700574:web:4201bf17fce3959bff124f"
};

// Check if user forced mock auth via URL query parameter or localStorage
let forceMockAuth = false;
if (typeof window !== "undefined") {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("mock") || searchParams.has("mockauth")) {
    localStorage.setItem("codelens_use_mock_auth", "true");
    // Clean up URL parameter to keep it clean
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
  forceMockAuth = localStorage.getItem("codelens_use_mock_auth") === "true";
}

const hasValidKeys =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "" &&
  !firebaseConfig.apiKey.includes("YOUR_");

let app = null;
let auth = null;
let db = null;
let googleProvider = null; // Created a placeholder for the provider
let isMock = forceMockAuth;

if (hasValidKeys && !forceMockAuth) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    auth.settings.appVerificationDisabledForTesting = false;
    db = getFirestore(app);

    // Enable Firebase App Check to prevent API abuse
    const siteKey = import.meta.env.REACT_APP_RECAPTCHA_SITE_KEY || "";
    if (siteKey) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true
      });
    }

    // Set up the Google provider and force account selection popup
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

  } catch (error) {
    console.warn("Failed to initialize live Firebase Auth. Falling back to local mock auth:", error);
    isMock = true;
  }
} else {
  if (forceMockAuth) {
    console.warn("Mock auth mode forced via user settings/query parameter.");
  } else {
    console.warn("No valid Firebase environment variables found. Initializing with local mock auth layer.");
  }
  isMock = true;
}

// Added app and googleProvider to the export list below
export { app, auth, db, isMock, googleProvider };

/**
 * PRODUCTION SECURITY CHECKLIST FOR DEVELOPERS:
 * 
 * 1. API Key Restrictions:
 *    Go to Google Cloud Console -> Credentials
 *    - Restrict the Firebase API key to only these APIs:
 *      * Identity Toolkit API
 *      * Token Service API
 *      * Firebase Installations API
 *    - Add HTTP referrer restrictions:
 *      * your-domain.com/*
 *      * localhost:3000/* (remove before final production)
 * 
 * 2. Firebase Authentication Settings:
 *    In the Firebase Console -> Authentication -> Settings:
 *    - Email enumeration protection: ON (Enabled by default in new projects)
 *    - SMS multi-factor auth: available but optional
 */