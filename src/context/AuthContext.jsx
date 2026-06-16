import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { auth, isMock } from "../config/firebase";
import MockGoogleAccountModal from "../components/auth/MockGoogleAccountModal";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "firebase/auth";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMockGoogleModal, setShowMockGoogleModal] = useState(false);
  const mockGooglePromiseRef = useRef(null);

  const handleSelectMockAccount = (account) => {
    const googleUser = {
      uid: "mock_google_" + Math.random().toString(36).substr(2, 9),
      email: account.email,
      displayName: account.displayName,
      photoURL: account.photoURL || null
    };

    setCurrentUser(googleUser);
    localStorage.setItem("codelens_current_user", JSON.stringify(googleUser));
    setShowMockGoogleModal(false);

    if (mockGooglePromiseRef.current) {
      mockGooglePromiseRef.current.resolve(googleUser);
      mockGooglePromiseRef.current = null;
    }
  };

  const handleCancelMockGoogle = () => {
    setShowMockGoogleModal(false);
    if (mockGooglePromiseRef.current) {
      mockGooglePromiseRef.current.reject(new Error("auth/popup-closed-by-user"));
      mockGooglePromiseRef.current = null;
    }
  };

  // Initialize Auth persistence/observer
  useEffect(() => {
    if (!isMock && auth) {
      // Check for redirect sign-in result
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            setCurrentUser(result.user);
          }
        })
        .catch((error) => {
          console.error("Error handling Google redirect sign-in:", error);
        });

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // In mock mode, we do NOT auto-login from storage on startup.
      // This ensures that clicking the application link/URL always starts at the login page.
      setCurrentUser(null);
      setLoading(false);
    }
  }, []);

  // 1. Email & Password Sign Up
  const signup = async (email, password, displayName) => {
    if (!isMock && auth) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      return userCredential.user;
    } else {
      // Mock signup logic
      const users = JSON.parse(localStorage.getItem("codelens_users") || "[]");
      if (users.some(u => u.email === email)) {
        throw new Error("auth/email-already-in-use");
      }
      const newUser = {
        uid: "mock_" + Math.random().toString(36).substr(2, 9),
        email,
        displayName,
        photoURL: null
      };
      users.push({ ...newUser, password });
      localStorage.setItem("codelens_users", JSON.stringify(users));
      
      // Auto login in mock
      setCurrentUser(newUser);
      sessionStorage.setItem("codelens_current_user", JSON.stringify(newUser));
      return newUser;
    }
  };

  // 2. Email & Password Login
  const login = async (email, password, rememberMe = false) => {
    if (!isMock && auth) {
      // Set persistence type in Firebase
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } else {
      // Mock login logic
      const users = JSON.parse(localStorage.getItem("codelens_users") || "[]");
      const matchedUser = users.find(u => u.email === email && u.password === password);
      
      if (!matchedUser) {
        throw new Error("auth/invalid-credential");
      }

      const activeUser = {
        uid: matchedUser.uid,
        email: matchedUser.email,
        displayName: matchedUser.displayName,
        photoURL: matchedUser.photoURL
      };

      setCurrentUser(activeUser);

      // Save to persistence store
      const store = rememberMe ? localStorage : sessionStorage;
      store.setItem("codelens_current_user", JSON.stringify(activeUser));
      return activeUser;
    }
  };

  // 3. Google OAuth Sign In
  const loginWithGoogle = async () => {
    if (!isMock && auth) {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // Detect if user is on mobile/tablet (to use redirect instead of popups)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

      if (isMobile) {
        // Popups are blocked by default on most mobile browsers. Use redirect instead.
        await signInWithRedirect(auth, provider);
      } else {
        const userCredential = await signInWithPopup(auth, provider);
        return userCredential.user;
      }
    } else {
      // Return a promise that will be resolved/rejected by the selection modal
      return new Promise((resolve, reject) => {
        mockGooglePromiseRef.current = { resolve, reject };
        setShowMockGoogleModal(true);
      });
    }
  };

  // 4. Log Out
  const logout = async () => {
    try {
      if (!isMock && auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      // Clear mock persistence
      localStorage.removeItem("codelens_current_user");
      sessionStorage.removeItem("codelens_current_user");
      setCurrentUser(null);
    }
  };

  // 5. Password Reset Link
  const resetPassword = async (email) => {
    if (!isMock && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      // Mock password reset validation
      const users = JSON.parse(localStorage.getItem("codelens_users") || "[]");
      if (!users.some(u => u.email === email) && email !== "demo.developer@gmail.com") {
        throw new Error("auth/user-not-found");
      }
      return true;
    }
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    isMock
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {showMockGoogleModal && (
        <MockGoogleAccountModal
          onSelect={handleSelectMockAccount}
          onClose={handleCancelMockGoogle}
        />
      )}
    </AuthContext.Provider>
  );
};
