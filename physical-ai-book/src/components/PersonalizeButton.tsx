import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useHistory } from '@docusaurus/router';

const BACKEND_URL = 'http://localhost:8000';

export default function PersonalizeButton() {
    const { user } = useAuth();
    const history = useHistory();
    const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
    const [originalContent, setOriginalContent] = useState('');

    const handlePersonalize = async () => {
        if (!user) {
            if (confirm('You need to be logged in to personalize content. Go to login?')) {
                history.push('/signin');
            }
            return;
        }

        const contentDiv = document.querySelector('article .markdown');
        if (!contentDiv) return;

        // Save original content
        if (!originalContent) {
            setOriginalContent(contentDiv.innerHTML);
        }

        setStatus('loading');

        try {
            const response = await fetch(`${BACKEND_URL}/personalize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: contentDiv.innerText.substring(0, 4000),
                    softwareExp: user.softwareExp,
                    hardwareExp: user.hardwareExp,
                    education: user.education,
                    goals: user.goals
                }),
            });

            if (!response.ok) throw new Error('Backend not available');

            const data = await response.json();
            contentDiv.innerHTML = `
                <div class="alert alert--success" style="margin-bottom: 1rem;">
                    <strong>✨ Personalized for ${user.name}</strong> (${user.softwareExp} level)
                    <br/>Content adapted to your experience level.
                </div>
                <div>${data.content.replace(/\n/g, '<br/>')}</div>
            `;
            setStatus('done');
        } catch (error) {
            // Fallback if backend is offline
            const contentEl = document.querySelector('article .markdown');
            if (contentEl) {
                contentEl.innerHTML = `
                    <div class="alert alert--warning" style="margin-bottom: 1rem;">
                        <strong>⚠️ Personalization requires the backend server.</strong><br/>
                        Start it with: <code>cd backend && uvicorn main:app --reload</code>
                    </div>
                    ${contentEl.innerHTML}
                `;
            }
            setStatus('idle');
        }
    };

    const handleReset = () => {
        const contentDiv = document.querySelector('article .markdown');
        if (contentDiv && originalContent) {
            contentDiv.innerHTML = originalContent;
        }
        setStatus('idle');
    };

    if (status === 'done') {
        return (
            <button
                onClick={handleReset}
                className="button button--outline button--primary button--lg"
                style={{ marginBottom: '2rem' }}
            >
                🔄 Reset to Original
            </button>
        );
    }

    return (
        <button
            onClick={handlePersonalize}
            className="button button--primary button--lg"
            style={{ marginBottom: '2rem' }}
            disabled={status === 'loading'}
        >
            {status === 'loading' ? '⏳ Personalizing...' : '✨ Personalize for Me'}
        </button>
    );
}
