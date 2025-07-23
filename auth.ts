import { supabase } from './supabase';
import type { User, AuthError, Session } from '@supabase/supabase-js';

const AUTH_KEY = 'usm_cv_bank_auth';

interface AuthState {
    session: Session | null;
    userName: string | null;
    userId: string | null;
    role: 'user' | 'admin' | null;
}

const getAuthState = (): AuthState => {
    try {
        const state = localStorage.getItem(AUTH_KEY);
        return state ? JSON.parse(state) : { session: null, userName: null, userId: null, role: null };
    } catch {
        return { session: null, userName: null, userId: null, role: null };
    }
};

const setAuthState = (state: AuthState) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
};

// Obtener perfil del usuario desde la base de datos
const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', userId)
        .single();
    
    if (error) {
        console.error('Error al obtener perfil del usuario:', error);
        return null;
    }
    
    return data;
};

// Login con email y contraseña
export const login = async (email: string, password: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Error al iniciar sesión:', error.message);
            return false;
        }

        if (data.user && data.session) {
            // Obtener el perfil del usuario
            const profile = await getUserProfile(data.user.id);
            
            if (!profile) {
                console.error('No se pudo obtener el perfil del usuario');
                return false;
            }

            const authState: AuthState = {
                session: data.session,
                userName: profile.name,
                userId: data.user.id,
                role: profile.role as 'user' | 'admin',
            };

            setAuthState(authState);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return false;
    }
};

// Registro con email y contraseña
export const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (!name || !email || !password) return false;

    try {
        // Registrar usuario en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                }
            }
        });

        if (error) {
            console.error('Error al registrar usuario:', error.message);
            return false;
        }

        if (data.user && data.session) {
            // El trigger handle_new_user se encarga de crear el perfil automáticamente
            // Esperamos un momento para que se complete
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Obtener el perfil creado
            const profile = await getUserProfile(data.user.id);
            
            if (!profile) {
                console.error('No se pudo crear el perfil del usuario');
                return false;
            }

            const authState: AuthState = {
                session: data.session,
                userName: profile.name,
                userId: data.user.id,
                role: profile.role as 'user' | 'admin',
            };

            setAuthState(authState);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return false;
    }
};

// Verificar sesión actual
export const checkSession = async (): Promise<boolean> => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Error al verificar sesión:', error);
            return false;
        }

        if (session && session.user) {
            const profile = await getUserProfile(session.user.id);
            
            if (profile) {
                const authState: AuthState = {
                    session,
                    userName: profile.name,
                    userId: session.user.id,
                    role: profile.role as 'user' | 'admin',
                };

                setAuthState(authState);
                return true;
            }
        }

        // No hay sesión válida, limpiar estado
        localStorage.removeItem(AUTH_KEY);
        return false;
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        // En caso de error, aún permitir continuar sin sesión
        return false;
    }
};

// Listener para cambios en el estado de autenticación
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            const profile = await getUserProfile(session.user.id);
            if (profile) {
                const authState: AuthState = {
                    session,
                    userName: profile.name,
                    userId: session.user.id,
                    role: profile.role as 'user' | 'admin',
                };
                setAuthState(authState);
            }
        } else if (event === 'SIGNED_OUT') {
            localStorage.removeItem(AUTH_KEY);
        }
        
        callback(event, session);
    });
};

// Cerrar sesión
export const logout = async () => {
    try {
        await supabase.auth.signOut();
        localStorage.removeItem(AUTH_KEY);
        window.location.hash = '/login';
        window.location.reload();
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
};

// Obtener usuario actual de Supabase
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        return null;
    }
};

// Verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
    const state = getAuthState();
    return state.session !== null && state.userId !== null;
};

// Obtener nombre del usuario
export const getUserName = (): string => {
    const state = getAuthState();
    return state.userName || 'Usuario';
};

// Obtener ID del usuario actual
export const getCurrentUserId = (): string | null => {
    const state = getAuthState();
    return state.userId;
};

// Verificar si el usuario es administrador
export const isAdmin = (): boolean => {
    const state = getAuthState();
    return state.role === 'admin';
};

// Cambiar contraseña
export const changePassword = async (newPassword: string): Promise<boolean> => {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            console.error('Error al cambiar contraseña:', error.message);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        return false;
    }
};

// Recuperar contraseña
export const resetPassword = async (email: string): Promise<boolean> => {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            console.error('Error al recuperar contraseña:', error.message);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error al recuperar contraseña:', error);
        return false;
    }
};

// Inicializar autenticación
export const initAuth = async () => {
    try {
        return await checkSession();
    } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        // Permitir que la app continue sin autenticación inicializada
        return false;
    }
};