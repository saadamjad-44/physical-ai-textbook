import React, { useState } from 'react';

export default function TranslateButton() {
    const [isUrdu, setIsUrdu] = useState(false);

    const handleTranslate = () => {
        // In a real app, this would call an API with the page content
        setIsUrdu(!isUrdu);

        // Hack to simulate translation for the demo
        const contentDiv = document.querySelector('.markdown');
        if (contentDiv) {
            if (!isUrdu) {
                // Simple mock translation for demo purposes
                // Ideally we would swap the actual MDX content or use a context provider for language
                alert("Urdu Translation Activated! (Simulation: In a real app, page content would be replaced via API response)");
            } else {
                alert("Switched back to English.");
            }
        }
    };

    return (
        <button
            onClick={handleTranslate}
            className="button button--secondary button--lg"
            style={{ marginBottom: '2rem', marginLeft: '1rem' }}
        >
            {isUrdu ? '🇬🇧 Read in English' : '🇵🇰 اردو میں پڑھیں'}
        </button>
    );
}
