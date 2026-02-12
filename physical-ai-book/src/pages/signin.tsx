import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../components/AuthContext';
import { useHistory } from '@docusaurus/router';
import './auth.css';

export default function Signin() {
    const { login } = useAuth();
    const history = useHistory();
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Verify mock login
        const mockProfile = {
            name: 'Returning User',
            email: email,
            softwareExp: 'intermediate',
            hardwareExp: 'arduino',
            education: 'undergrad',
            goals: 'Refresher'
        };
        login(mockProfile);
        history.push('/');
    };

    return (
        <Layout title="Signin" description="Login to Physical AI Course">
            <div className="auth-container">
                <h1>Welcome Back</h1>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input required type="password" />
                    </div>
                    <button type="submit" className="auth-btn">Sign In</button>
                </form>
            </div>
        </Layout>
    );
}
