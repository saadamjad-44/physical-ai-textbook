import React, { useState } from 'react';
import './ChatWidget.css';

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages([...messages, { sender: 'user', text: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();
            setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Error interacting with AI.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
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
                        <button onClick={toggleChat}>X</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div className="message bot">Thinking...</div>}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Ask me anything..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
