/**
 * Firebase Auth + Firestore user profiles.
 * - Email/password register & login
 * - Google sign-in
 * - Profile docs in collection `users/{uid}`
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../lib/firebase';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || 'admin@thecodevibe.io')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function mapFirebaseError(err) {
  const code = err?.code || '';
  const map = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email. Please register.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/popup-blocked': 'Popup blocked. Allow popups for this site and try again.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/operation-not-allowed': 'This sign-in method is disabled in Firebase Console.',
  };
  return map[code] || err?.message || 'Authentication failed.';
}

function resolveRole(email, requestedRole = 'member') {
  const lower = (email || '').toLowerCase();
  if (ADMIN_EMAILS.includes(lower)) return 'admin';
  if (requestedRole === 'admin' && ADMIN_EMAILS.includes(lower)) return 'admin';
  return 'member';
}

/**
 * Build app user object from Firebase user + optional Firestore profile.
 */
export function toAppUser(firebaseUser, profile = {}) {
  if (!firebaseUser) return null;
  const email = firebaseUser.email || profile.email || '';
  const role = profile.role || resolveRole(email);
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email,
    name:
      profile.name ||
      firebaseUser.displayName ||
      (email ? email.split('@')[0] : 'Builder'),
    role,
    avatar: profile.avatar || firebaseUser.photoURL || '',
    whatsapp: profile.whatsapp || '',
    provider: profile.provider || (firebaseUser.providerData?.[0]?.providerId || 'password'),
    isVerified: true,
  };
}

/**
 * Ensure Firestore users/{uid} exists; create or merge on login/signup.
 */
export async function upsertUserProfile(firebaseUser, extra = {}) {
  if (!db || !firebaseUser) return null;
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);
  const email = firebaseUser.email || '';
  const role = resolveRole(email, extra.role);

  if (!snap.exists()) {
    const data = {
      uid: firebaseUser.uid,
      email,
      name:
        extra.name ||
        firebaseUser.displayName ||
        (email ? email.split('@')[0] : 'Builder'),
      role,
      avatar: firebaseUser.photoURL || '',
      whatsapp: extra.whatsapp || '',
      provider: extra.provider || firebaseUser.providerData?.[0]?.providerId || 'password',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(ref, data);
    return data;
  }

  const existing = snap.data() || {};
  const patch = {
    email,
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (extra.name) patch.name = extra.name;
  if (extra.whatsapp !== undefined) patch.whatsapp = extra.whatsapp;
  if (firebaseUser.photoURL && !existing.avatar) patch.avatar = firebaseUser.photoURL;
  // Keep existing role unless admin list promotes them
  if (role === 'admin' && existing.role !== 'admin') patch.role = 'admin';

  await updateDoc(ref, patch);
  return { ...existing, ...patch, role: patch.role || existing.role || role };
}

export async function fetchUserProfile(uid) {
  if (!db || !uid) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function firebaseRegister(name, email, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase is not configured. Add VITE_FIREBASE_* keys in frontend/.env');
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (name?.trim()) {
      await updateProfile(cred.user, { displayName: name.trim() });
    }
    const profile = await upsertUserProfile(cred.user, {
      name: name.trim(),
      provider: 'password',
    });
    const token = await cred.user.getIdToken();
    return {
      status: 'success',
      user: toAppUser(cred.user, profile),
      token,
    };
  } catch (err) {
    throw new Error(mapFirebaseError(err));
  }
}

export async function firebaseLogin(email, password, role = 'member') {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase is not configured. Add VITE_FIREBASE_* keys in frontend/.env');
  }
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const profile = await upsertUserProfile(cred.user, { role, provider: 'password' });
    const appUser = toAppUser(cred.user, profile);

    // If UI requested admin but account is not admin, reject
    if (role === 'admin' && appUser.role !== 'admin') {
      await signOut(auth);
      throw new Error('Access denied: this account does not have admin privileges.');
    }

    const token = await cred.user.getIdToken();
    return { status: 'success', user: appUser, token };
  } catch (err) {
    if (err.message?.startsWith('Access denied')) throw err;
    throw new Error(mapFirebaseError(err));
  }
}

export async function firebaseGoogleSignIn() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error('Firebase is not configured. Add VITE_FIREBASE_* keys in frontend/.env');
  }
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const profile = await upsertUserProfile(cred.user, { provider: 'google.com' });
    const token = await cred.user.getIdToken();
    return {
      status: 'success',
      user: toAppUser(cred.user, profile),
      token,
    };
  } catch (err) {
    throw new Error(mapFirebaseError(err));
  }
}

export async function firebaseLogout() {
  if (auth) {
    try {
      await signOut(auth);
    } catch {
      /* ignore */
    }
  }
}

export async function firebaseUpdateProfile({ name, whatsapp }) {
  if (!isFirebaseConfigured || !auth?.currentUser || !db) {
    return { status: 'success', user: { name, whatsapp } };
  }
  const user = auth.currentUser;
  if (name?.trim()) {
    await updateProfile(user, { displayName: name.trim() });
  }
  const ref = doc(db, 'users', user.uid);
  await updateDoc(ref, {
    ...(name?.trim() ? { name: name.trim() } : {}),
    ...(whatsapp !== undefined ? { whatsapp: whatsapp || '' } : {}),
    updatedAt: serverTimestamp(),
  });
  const profile = await fetchUserProfile(user.uid);
  return {
    status: 'success',
    user: toAppUser(user, profile),
  };
}

/**
 * Subscribe to Firebase auth state. Returns unsubscribe.
 */
export function subscribeAuth(callback) {
  if (!isFirebaseConfigured || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      callback(null);
      return;
    }
    try {
      const profile = await fetchUserProfile(fbUser.uid);
      const token = await fbUser.getIdToken();
      callback({ user: toAppUser(fbUser, profile || {}), token });
    } catch {
      callback({ user: toAppUser(fbUser, {}), token: null });
    }
  });
}

export { isFirebaseConfigured };
