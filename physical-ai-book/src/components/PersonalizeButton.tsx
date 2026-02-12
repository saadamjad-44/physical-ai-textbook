import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useHistory } from '@docusaurus/router';

export default function PersonalizeButton() {
    const { user } = useAuth();
    const history = useHistory();
    const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

    const handlePersonalize = () => {
        if (!user) {
            if (confirm('You need to be logged in to personalize content. Go to login?')) {
                history.push('/signin');
            }
            return;
        }

        setStatus('loading');
        // Simulate API call
        setTimeout(() => {
            setStatus('done');
        }, 1500);
    };

    if (status === 'done') {
        return (
            <div className="alert alert--success" style={{ marginBottom: '1rem' }}>
                <strong>✨ Personalized for {user.name} ({user.softwareExp})</strong>
                <p>Content adapted to your experience level.</p>
            </div>
        );
    }

    return (
        <button
            onClick={handlePersonalize}
            className="button button--primary button--lg"
            style={{ marginBottom: '2rem' }}
            disabled={status === 'loading'}
        >
            {status === 'loading' ? 'Personalizing...' : '✨ Personalize for Me'}
        </button>
    );
}
