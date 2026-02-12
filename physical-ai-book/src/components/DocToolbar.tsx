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
        const text = article ? article.innerText.substring(0, 1500) : ''; // Limit to 1500 chars for URL safety
        const fullText = article ? article.innerText.substring(0, 4000) : ''; // More allowed for clipboard

        const prompt = `I am studying this Physical AI topic:\n\n${text}\n\nCan you explain this concept in simple terms and give examples?`;

        // 1. Copy full text to clipboard (Reliable backup)
        navigator.clipboard.writeText(`I am studying this Physical AI topic:\n\n${fullText}\n\nCan you explain this concept in simple terms and give examples?`);

        // 2. Open ChatGPT with query param (Best effort auto-fill)
        // Note: ChatGPT may treat this as a search or a prompt depending on A/B tests
        const encodedPrompt = encodeURIComponent(prompt);
        window.open(`https://chatgpt.com/?q=${encodedPrompt}&hints=search`, '_blank');

        // Notify user about clipboard backup
        // alert("Opening ChatGPT... \n\nI've also copied the full page context to your clipboard in case the auto-fill doesn't work perfectly! 📋");
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
