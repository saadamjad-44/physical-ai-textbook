import React from 'react';
import ChatWidget from '../components/ChatWidget';
import DocToolbar from '../components/DocToolbar';
import { AuthProvider } from '../components/AuthContext';
import '../components/DocToolbar.css';

// Default implementation, that you can customize
export default function Root({ children }) {
    return (
        <AuthProvider>
            {children}
            <DocToolbar />
            <ChatWidget />
        </AuthProvider>
    );
}
