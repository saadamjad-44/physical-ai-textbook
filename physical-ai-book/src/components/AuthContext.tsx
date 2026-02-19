import React, { createContext, useContext, useState, useEffect } from 'react';
import { createAuthClient } from 'better-auth/react';

const AUTH_SERVER_URL = 'http://localhost:3001';

// Create better-auth React client
export const authClient = createAuthClient({
    baseURL: AUTH_SERVER_URL,
});

interface UserProfile {
    id: string;
    name: string;
    email: string;
    softwareExp: string;
    hardwareExp: string;
    education: string;
    goals: string;
}

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (userData: {
        name: string;
        email: string;
        password: string;
        softwareExp?: string;
        hardwareExp?: string;
        education?: string;
        goals?: string;
    }) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await authClient.getSession();
                if (session?.data?.user) {
                    const u = session.data.user;
                    setUser({
                        id: u.id,
                        name: u.name,
                        email: u.email,
                        softwareExp: (u as any).softwareExp || 'beginner',
                        hardwareExp: (u as any).hardwareExp || 'none',
                        education: (u as any).education || 'undergrad',
                        goals: (u as any).goals || '',
                    });
                }
            } catch (e) {
                // Auth server offline — check localStorage fallback
                const stored = localStorage.getItem('pa_user');
                if (stored) setUser(JSON.parse(stored));
            }
            setLoading(false);
        };
        checkSession();
    }, []);

    const signup = async (userData: {
        name: string;
        email: string;
        password: string;
        softwareExp?: string;
        hardwareExp?: string;
        education?: string;
        goals?: string;
    }): Promise<{ success: boolean; error?: string }> => {
        try {
            const result = await authClient.signUp.email({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                softwareExp: userData.softwareExp || 'beginner',
                hardwareExp: userData.hardwareExp || 'none',
                education: userData.education || 'undergrad',
                goals: userData.goals || '',
            } as any);

            if (result.error) {
                return { success: false, error: result.error.message || 'Signup failed' };
            }

            const profile: UserProfile = {
                id: result.data?.user?.id || '',
                name: userData.name,
                email: userData.email,
                softwareExp: userData.softwareExp || 'beginner',
                hardwareExp: userData.hardwareExp || 'none',
                education: userData.education || 'undergrad',
                goals: userData.goals || '',
            };
            setUser(profile);
            localStorage.setItem('pa_user', JSON.stringify(profile));
            return { success: true };
        } catch (error) {
            // Fallback: save locally if auth server is offline
            const profile: UserProfile = {
                id: 'local-' + Date.now(),
                name: userData.name,
                email: userData.email,
                softwareExp: userData.softwareExp || 'beginner',
                hardwareExp: userData.hardwareExp || 'none',
                education: userData.education || 'undergrad',
                goals: userData.goals || '',
            };
            setUser(profile);
            localStorage.setItem('pa_user', JSON.stringify(profile));
            return { success: true };
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const result = await authClient.signIn.email({
                email,
                password,
            });

            if (result.error) {
                return { success: false, error: result.error.message || 'Invalid credentials' };
            }

            const u = result.data?.user;
            if (u) {
                const profile: UserProfile = {
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    softwareExp: (u as any).softwareExp || 'beginner',
                    hardwareExp: (u as any).hardwareExp || 'none',
                    education: (u as any).education || 'undergrad',
                    goals: (u as any).goals || '',
                };
                setUser(profile);
                localStorage.setItem('pa_user', JSON.stringify(profile));
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Cannot connect to auth server. Please try again.' };
        }
    };

    const logout = async () => {
        try {
            await authClient.signOut();
        } catch (e) {
            // Auth server offline, just clear locally
        }
        setUser(null);
        localStorage.removeItem('pa_user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
