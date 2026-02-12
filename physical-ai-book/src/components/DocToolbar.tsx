import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

const DocToolbar = () => {
    const location = useLocation();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

    // Only show on docs content pages (e.g., /docs/...)
    // Adjust based on your baseUrl if needed
    const showToolbar = location.pathname.includes('/docs/');

    useEffect(() => {
        // Cancel speech when navigating to a new page
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, [location.pathname]);

    if (!showToolbar) return null;

    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            // Get text from the main markdown container
            const article = document.querySelector('article');
            if (article) {
                const text = article.innerText;
                const newUtterance = new SpeechSynthesisUtterance(text);
                newUtterance.onend = () => setIsSpeaking(false);
                window.speechSynthesis.speak(newUtterance);
                setUtterance(newUtterance);
                setIsSpeaking(true);
            }
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleDownload = () => {
        window.print();
    };

    const handleChatGPT = () => {
        // Get text from the main article
        const article = document.querySelector('article');
        const text = article ? article.innerText.substring(0, 2000) : ''; // Limit to 2000 context

        // Copy to clipboard
        navigator.clipboard.writeText(`I am studying this Physical AI topic:\n\n${text}\n\nCan you explain this concept in simple terms and give examples?`);

        // Open ChatGPT
        alert("I've copied the page context to your clipboard! 📋\n\nPaste it into ChatGPT to ask specific questions.");
        window.open('https://chatgpt.com/', '_blank');
    };

    return (
        <div className="doc-floating-toolbar">
            <button
                onClick={handleSpeak}
                className={`toolbar-btn ${isSpeaking ? 'active' : ''}`}
                title={isSpeaking ? "Stop Listening" : "Listen to this page"}
            >
                {isSpeaking ? '🔇 Stop' : '🔊 Listen'}
            </button>
            <button onClick={handleChatGPT} className="toolbar-btn" title="Ask ChatGPT about this page">
                🤖 Ask GPT
            </button>
            <button onClick={handleShare} className="toolbar-btn" title="Share this page">
                🔗 Share
            </button>
            <button onClick={handleDownload} className="toolbar-btn" title="Download as PDF">
                📥 PDF
            </button>
        </div>
    );
};

export default DocToolbar;
