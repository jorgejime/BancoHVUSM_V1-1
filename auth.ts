import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import * as db from './database';

const AUTH_KEY = 'usm_cv_bank_auth';

interface AuthState {
    token: string | null;
    userName: string | null;
    userId: string | null;
    role: 'user' | 'admin' | null;
}

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
}

const getAuthState = (): AuthState => {
    try {
        const state = localStorage.getItem(AUTH_KEY);
        return state ? JSON.parse(state) : { token: null, userName: null, userId: null, role: null };
    } catch {
        return { token: null, userName: null, userId: null, role: null };
    }
};

const setAuthState = (state: AuthState) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
};

// Función para crear o obtener perfil de usuario en Firestore
const createOrGetUserProfile = async (user: FirebaseUser): Promise<UserProfile> => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
    } else {
        // Crear nuevo perfil de usuario
        const newUserProfile: UserProfile = {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Usuario',
            email: user.email || '',
            role: user.email === 'admin@usm.edu.co' ? 'admin' : 'user',
            createdAt: new Date().toISOString()
        };
        
        await setDoc(userDocRef, newUserProfile);
        return newUserProfile;
    }
};

// Login con Google
export const loginWithGoogle = async (): Promise<boolean> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Crear o obtener perfil del usuario
        const userProfile = await createOrGetUserProfile(user);
        
        const authState: AuthState = {
            token: await user.getIdToken(),
            userName: userProfile.name,
            userId: userProfile.id,
            role: userProfile.role,
        };
        
        setAuthState(authState);
        return true;
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
        return false;
    }
};

// Login con email y contraseña
export const login = async (email: string, pass: string): Promise<boolean> => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        const user = result.user;
        
        // Crear o obtener perfil del usuario
        const userProfile = await createOrGetUserProfile(user);
        
        const authState: AuthState = {
            token: await user.getIdToken(),
            userName: userProfile.name,
            userId: userProfile.id,
            role: userProfile.role,
        };
        
        setAuthState(authState);
        return true;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return false;
    }
};

// Registro con email y contraseña
export const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    if (!name || !email || !pass) return false;

    try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        const user = result.user;
        
        // Crear perfil del usuario
        const userProfile: UserProfile = {
            id: user.uid,
            name: name,
            email: email,
            role: email === 'admin@usm.edu.co' ? 'admin' : 'user',
            createdAt: new Date().toISOString()
        };
        
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, userProfile);
        
        const authState: AuthState = {
            token: await user.getIdToken(),
            userName: userProfile.name,
            userId: userProfile.id,
            role: userProfile.role,
        };
        
        setAuthState(authState);
        return true;
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return false;
    }
};

// Listener para cambios en el estado de autenticación
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// Cerrar sesión
export const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem(AUTH_KEY);
        window.location.hash = '/login';
        window.location.reload();
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
};

// Obtener usuario actual de Firebase
export const getCurrentUser = (): FirebaseUser | null => {
    return auth.currentUser;
};

export const isAuthenticated = (): boolean => {
    return getAuthState().token !== null;
};

export const getUserName = (): string => {
    return getAuthState().userName || 'Usuario';
};

export const getCurrentUserId = (): string | null => {
    return getAuthState().userId;
};

export const isAdmin = (): boolean => {
    return getAuthState().role === 'admin';
};