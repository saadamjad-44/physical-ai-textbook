import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../components/AuthContext';
import { useHistory } from '@docusaurus/router';
import './auth.css';

export default function Signup() {
    const { signup } = useAuth();
    const history = useHistory();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        softwareExp: 'beginner',
        hardwareExp: 'none',
        education: 'undergrad',
        goals: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signup(formData);
        setLoading(false);

        if (result.success) {
            history.push('/');
        } else {
            setError(result.error || 'Signup failed');
        }
    };

    return (
        <Layout title="Signup" description="Create an account for Physical AI Course">
            <div className="auth-container">
                <h1>Create Account</h1>
                <p>Tell us about yourself to personalize your learning experience.</p>

                {error && (
                    <div className="alert alert--danger" style={{ marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input required type="text" name="name" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input required type="email" name="email" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input required type="password" name="password" minLength={6} onChange={handleChange} />
                    </div>

                    <h3>Background Information</h3>

                    <div className="form-group">
                        <label>Software Experience</label>
                        <select name="softwareExp" onChange={handleChange} defaultValue="beginner">
                            <option value="beginner">Beginner (No coding experience)</option>
                            <option value="intermediate">Intermediate (Some Python/JS)</option>
                            <option value="advanced">Advanced (Professional developer)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Hardware Experience</label>
                        <select name="hardwareExp" onChange={handleChange} defaultValue="none">
                            <option value="none">No hardware experience</option>
                            <option value="arduino">Arduino/Raspberry Pi</option>
                            <option value="robotics">Robotics (ROS/Gazebo)</option>
                            <option value="advanced">Advanced (NVIDIA Isaac/Jetson)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Education Level</label>
                        <select name="education" onChange={handleChange} defaultValue="undergrad">
                            <option value="highschool">High School</option>
                            <option value="undergrad">Undergraduate</option>
                            <option value="graduate">Graduate (MS/PhD)</option>
                            <option value="professional">Working Professional</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Learning Goals</label>
                        <textarea name="goals" placeholder="What do you want to build?" onChange={handleChange}></textarea>
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    Already have an account? <a href="/signin">Sign In</a>
                </p>
            </div>
        </Layout>
    );
}
