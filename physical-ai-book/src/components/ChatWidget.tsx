import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';
import { useAuth } from './AuthContext';

const BACKEND_URL = 'http://localhost:8000';

const ChatWidget: React.FC = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const [showSelectionBtn, setShowSelectionBtn] = useState(false);
    const [selectionPos, setSelectionPos] = useState({ x: 0, y: 0 });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Listen for text selection on the page
    useEffect(() => {
        const handleMouseUp = () => {
            const selection = window.getSelection();
            const text = selection?.toString().trim();
            if (text && text.length > 5) {
                setSelectedText(text);
                // Position the floating button near the selection
                const range = selection?.getRangeAt(0);
                const rect = range?.getBoundingClientRect();
                if (rect) {
                    setSelectionPos({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 45
                    });
                }
                setShowSelectionBtn(true);
            } else {
                // Delay hiding to allow button click
                setTimeout(() => setShowSelectionBtn(false), 200);
            }
        };

        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, []);

    const toggleChat = () => setIsOpen(!isOpen);

    const askAboutSelection = () => {
        setIsOpen(true);
        setInput(`Explain this: "${selectedText.substring(0, 200)}"`);
        setShowSelectionBtn(false);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        const contextText = selectedText || null;
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setSelectedText('');
        setLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    user_id: user?.email || 'anonymous',
                    selected_text: contextText
                }),
            });

            if (!response.ok) throw new Error('Backend not available');

            const data = await response.json();
            setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
        } catch (error) {
            // Fallback: demo mode when backend is not running
            const demoResponses: Record<string, string> = {
                'ros': 'ROS 2 (Robot Operating System 2) is the middleware for robot control. It uses a publish-subscribe architecture with Topics, Services, and Actions.',
                'gazebo': 'Gazebo is a 3D dynamic simulator used to test robots in virtual environments with physics engines like ODE and Bullet.',
                'isaac': 'NVIDIA Isaac is a platform for AI-powered robotics with Isaac Sim for photorealistic simulation.',
                'vla': 'Vision-Language-Action (VLA) models combine visual perception, language understanding, and physical action.',
                'hardware': 'You need an NVIDIA RTX 4070 Ti GPU, Intel i7 13th Gen CPU, and 64GB RAM. For edge: NVIDIA Jetson Orin.',
            };

            const lowerMsg = userMessage.toLowerCase();
            let demoReply = '🤖 Demo mode (backend offline). Start backend: `uvicorn main:app --reload`\n\n';

            if (contextText) {
                demoReply = `📌 Based on your selected text:\n"${contextText.substring(0, 100)}..."\n\n`;
                demoReply += '🤖 Backend is offline. Start it for AI-powered answers about selected text!';
            } else {
                const matchedKey = Object.keys(demoResponses).find(key => lowerMsg.includes(key));
                if (matchedKey) {
                    demoReply += `📚 ${demoResponses[matchedKey]}`;
                } else {
                    demoReply += 'Try asking about: ROS 2, Gazebo, NVIDIA Isaac, VLA models, or Hardware!';
                }
            }

            setMessages(prev => [...prev, { sender: 'bot', text: demoReply }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating "Ask about this" button near text selection */}
            {showSelectionBtn && (
                <button
                    className="selection-ask-btn"
                    style={{
                        position: 'fixed',
                        left: `${selectionPos.x}px`,
                        top: `${selectionPos.y}px`,
                        transform: 'translateX(-50%)',
                        zIndex: 10000,
                    }}
                    onClick={askAboutSelection}
                >
                    📌 Ask about this
                </button>
            )}

            <div className="chat-widget-container">
                {!isOpen && (
                    <button className="chat-toggle-btn" onClick={toggleChat}>
                        🤖 Chat
                    </button>
                )}

                {isOpen && (
                    <div className="chat-window">
                        <div className="chat-header">
                            <h3>AI Assistant</h3>
                            <button onClick={toggleChat}>✕</button>
                        </div>
                        <div className="chat-messages">
                            {messages.length === 0 && (
                                <div className="message bot">
                                    👋 Welcome! Ask me anything about Physical AI & Robotics.
                                    <br /><br />
                                    💡 <strong>Tip:</strong> Select any text on the page and click "📌 Ask about this" to get AI explanations!
                                </div>
                            )}
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender}`}>
                                    {msg.text}
                                </div>
                            ))}
                            {loading && <div className="message bot loading">⏳ Thinking...</div>}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder={selectedText ? "Ask about selected text..." : "Ask me anything..."}
                            />
                            <button onClick={sendMessage} disabled={loading}>Send</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ChatWidget;
