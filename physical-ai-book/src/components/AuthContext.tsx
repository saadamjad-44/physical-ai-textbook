import React, { createContext, useContext, useState, useEffect } from 'react';

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
    login: (userData: UserProfile) => void;
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

    const login = (userData: UserProfile) => {
        setUser(userData);
        localStorage.setItem('pa_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pa_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
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
