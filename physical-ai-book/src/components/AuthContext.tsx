import React, { createContext, useContext, useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:8000';

interface UserProfile {
    name: string;
    email: string;
    softwareExp: string;
    hardwareExp: string;
    education: string;
    goals: string;
}

interface AuthContextType {
    user: UserProfile | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (userData: UserProfile & { password: string }) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('pa_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const signup = async (userData: UserProfile & { password: string }): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const error = await response.json();
                return { success: false, error: error.detail || 'Signup failed' };
            }

            const data = await response.json();
            const profile: UserProfile = data.user;
            setUser(profile);
            localStorage.setItem('pa_user', JSON.stringify(profile));
            return { success: true };
        } catch (error) {
            // Fallback: save locally if backend is offline
            const profile: UserProfile = {
                name: userData.name,
                email: userData.email,
                softwareExp: userData.softwareExp,
                hardwareExp: userData.hardwareExp,
                education: userData.education,
                goals: userData.goals,
            };
            setUser(profile);
            localStorage.setItem('pa_user', JSON.stringify(profile));
            return { success: true };
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                return { success: false, error: error.detail || 'Invalid credentials' };
            }

            const data = await response.json();
            const profile: UserProfile = data.user;
            setUser(profile);
            localStorage.setItem('pa_user', JSON.stringify(profile));
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Cannot connect to server. Please try again.' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pa_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
