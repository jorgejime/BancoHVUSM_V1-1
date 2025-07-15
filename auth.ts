import * as db from './database';

const AUTH_KEY = 'usm_cv_bank_auth';

interface AuthState {
    token: string | null;
    userName: string | null;
    userId: string | null;
    role: 'user' | 'admin' | null;
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

export const login = async (email: string, pass: string): Promise<boolean> => {
    // In a real app, this would be an API call.
    // Check for special admin user
    if (email.toLowerCase() === 'admin@usm.edu.co' && pass === 'admin123') {
        const adminUser = await db.findUserByEmail(email);
        const authState: AuthState = {
            token: 'mock-admin-token',
            userName: 'Administrador',
            userId: adminUser!.id,
            role: 'admin',
        };
        setAuthState(authState);
        return true;
    }

    // Check for regular user
    const user = await db.findUserByEmail(email);
    if (user) { // In a real app, we'd also check the password
        const authState: AuthState = {
            token: `mock-user-token-for-${user.id}`,
            userName: user.name,
            userId: user.id,
            role: 'user',
        };
        setAuthState(authState);
        return true;
    }

    return false;
};

export const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    if (!name || !email || !pass) return false;

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
        // Maybe set an error state here for the UI to pick up
        console.error("User with this email already exists.");
        return false;
    }
    
    const newUser = await db.createUser(name, email);
    
    // Automatically log in after registration
    const authState: AuthState = {
        token: `mock-user-token-for-${newUser.id}`,
        userName: newUser.name,
        userId: newUser.id,
        role: 'user',
    };
    setAuthState(authState);
    return true;
};

export const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    // Note: We are NOT clearing the entire database on logout anymore,
    // as it's now a shared resource for all users.
    window.location.hash = '/login';
    window.location.reload();
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
