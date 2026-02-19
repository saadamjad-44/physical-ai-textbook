import React, { useState } from 'react';

const BACKEND_URL = 'http://localhost:8000';

export default function TranslateButton() {
    const [isUrdu, setIsUrdu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [originalContent, setOriginalContent] = useState('');

    const handleTranslate = async () => {
        const contentDiv = document.querySelector('article .markdown');
        if (!contentDiv) return;

        if (isUrdu) {
            // Switch back to English — restore from cache
            if (originalContent) {
                contentDiv.innerHTML = originalContent;
            }
            setIsUrdu(false);
            return;
        }

        // Save original content before translating
        setOriginalContent(contentDiv.innerHTML);
        setLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: contentDiv.innerText.substring(0, 4000),
                    target_language: 'Urdu'
                }),
            });

            if (!response.ok) throw new Error('Backend not available');

            const data = await response.json();
            // Replace content with translated text
            contentDiv.innerHTML = `<div dir="rtl" style="font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif; font-size: 1.1em; line-height: 2;">${data.content.replace(/\n/g, '<br/>')}</div>`;
            setIsUrdu(true);
        } catch (error) {
            // Fallback demo if backend is offline
            contentDiv.innerHTML = `
                <div class="alert alert--warning" style="margin-bottom: 1rem;">
                    <strong>⚠️ Translation requires the backend server.</strong><br/>
                    Start it with: <code>cd backend && uvicorn main:app --reload</code>
                </div>
                ${contentDiv.innerHTML}
            `;
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleTranslate}
            className="button button--secondary button--lg"
            style={{ marginBottom: '2rem', marginLeft: '1rem' }}
            disabled={loading}
        >
            {loading ? '⏳ Translating...' : isUrdu ? '🇬🇧 Read in English' : '🇵🇰 اردو میں پڑھیں'}
        </button>
    );
}
