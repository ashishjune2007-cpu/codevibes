import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  isFirebaseConfigured,
  firebaseLogin,
  firebaseRegister,
  firebaseGoogleSignIn,
  firebaseLogout,
  firebaseUpdateProfile,
  subscribeAuth,
} from '../services/firebaseAuth';
import { apiLogin, apiRegister, apiUpdateProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [authCallback, setAuthCallback] = useState(null);
  const [authContextMessage, setAuthContextMessage] = useState('');
  const [targetEventTitle, setTargetEventTitle] = useState('');

  // Restore session from Firebase (or localStorage demo when Firebase off)
  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsub = subscribeAuth((session) => {
        if (session?.user) {
          setUser(session.user);
          setToken(session.token || null);
          localStorage.setItem('vibe_user', JSON.stringify(session.user));
          if (session.token) localStorage.setItem('vibe_token', session.token);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('vibe_user');
          localStorage.removeItem('vibe_token');
        }
        setAuthReady(true);
      });
      return unsub;
    }

    // Demo / offline restore
    try {
      const saved = localStorage.getItem('vibe_user');
      const savedToken = localStorage.getItem('vibe_token');
      if (saved) setUser(JSON.parse(saved));
      if (savedToken) setToken(savedToken);
    } catch {
      /* ignore */
    }
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('vibe_user', JSON.stringify(user));
    else localStorage.removeItem('vibe_user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('vibe_token', token);
    else localStorage.removeItem('vibe_token');
  }, [token]);

  const applySession = (res) => {
    if (!res?.user) throw new Error('Login failed: invalid response.');
    const verifiedUser = { ...res.user, isVerified: true };
    setUser(verifiedUser);
    setToken(res.token || `vibe_${Date.now()}`);
    return verifiedUser;
  };

  const login = async (email, password, role = 'member') => {
    // Admin credentials are managed by the backend environment, not Firebase.
    // Always send admin sign-in to the backend even when Firebase is enabled for members.
    if (role === 'admin') {
      return applySession(await apiLogin(email, password, 'admin'));
    }
    if (isFirebaseConfigured) {
      return applySession(await firebaseLogin(email, password, role));
    }
    // Local demo fallback when Firebase not configured
    return applySession(await apiLogin(email, password, role));
  };

  const register = async (name, email, password) => {
    if (isFirebaseConfigured) {
      return applySession(await firebaseRegister(name, email, password));
    }
    return applySession(await apiRegister(name, email, password));
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      throw new Error(
        'Google sign-in needs Firebase. Add your VITE_FIREBASE_* keys in frontend/.env and enable Google in Firebase Console → Authentication → Sign-in method.'
      );
    }
    return applySession(await firebaseGoogleSignIn());
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      await firebaseLogout();
    }
    setUser(null);
    setToken(null);
    setProfileModalOpen(false);
    localStorage.removeItem('vibe_user');
    localStorage.removeItem('vibe_token');
  };

  const updateProfile = async ({ name, whatsapp }) => {
    if (!user) throw new Error('Not authenticated.');

    if (isFirebaseConfigured) {
      const res = await firebaseUpdateProfile({ name, whatsapp });
      const updatedUser = {
        ...user,
        name: res.user?.name || name.trim(),
        whatsapp: res.user?.whatsapp !== undefined ? res.user.whatsapp : whatsapp || '',
      };
      setUser(updatedUser);
      return updatedUser;
    }

    const res = await apiUpdateProfile({
      email: user.email,
      name: name.trim(),
      whatsapp: whatsapp ? whatsapp.trim() : '',
    });
    const updatedUser = {
      ...user,
      name: (res.user && res.user.name) || name.trim(),
      whatsapp:
        res.user && res.user.whatsapp !== undefined
          ? res.user.whatsapp
          : whatsapp
            ? whatsapp.trim()
            : '',
    };
    setUser(updatedUser);
    return updatedUser;
  };

  const requireAuth = (callback, contextMessage = 'Please sign in to verify your identity before registering.', eventTitle = '') => {
    if (user) {
      if (typeof callback === 'function') callback(user);
      return true;
    }
    setAuthCallback(() => callback);
    setAuthContextMessage(contextMessage);
    setTargetEventTitle(eventTitle);
    setAuthModalOpen(true);
    return false;
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setAuthModalOpen(false);
    if (typeof authCallback === 'function') {
      authCallback(authenticatedUser);
      setAuthCallback(null);
    }
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthCallback(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authReady,
        isAuthenticated: Boolean(user),
        isFirebase: isFirebaseConfigured,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        requireAuth,
        authModalOpen,
        closeAuthModal,
        profileModalOpen,
        openProfileModal: () => setProfileModalOpen(true),
        closeProfileModal: () => setProfileModalOpen(false),
        handleAuthSuccess,
        authContextMessage,
        targetEventTitle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
