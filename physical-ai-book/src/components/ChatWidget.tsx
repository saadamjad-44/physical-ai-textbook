import React, { useState } from 'react';
import './ChatWidget.css';

const BACKEND_URL = 'http://localhost:8000';

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) throw new Error('Backend not available');

            const data = await response.json();
            setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
        } catch (error) {
            // Fallback: demo mode when backend is not running (e.g. on GitHub Pages)
            const demoResponses: Record<string, string> = {
                'ros': 'ROS 2 (Robot Operating System 2) is the middleware for robot control. It uses a publish-subscribe architecture with Topics, Services, and Actions for communication between nodes.',
                'gazebo': 'Gazebo is a 3D dynamic simulator used to test robots in virtual environments. It supports physics engines like ODE and Bullet, and uses URDF/SDF formats for robot models.',
                'isaac': 'NVIDIA Isaac is a platform for AI-powered robotics. It includes Isaac Sim for photorealistic simulation and Isaac ROS for hardware-accelerated perception.',
                'vla': 'Vision-Language-Action (VLA) models combine visual perception, language understanding, and physical action. They enable robots to follow natural language instructions.',
                'hardware': 'You need an NVIDIA RTX 4070 Ti GPU (12GB VRAM), Intel i7 13th Gen CPU, and 64GB RAM. For edge deployment, use an NVIDIA Jetson Orin with Intel RealSense cameras.',
            };

            const lowerMsg = userMessage.toLowerCase();
            let demoReply = '🤖 I\'m running in demo mode (backend server is offline). Start the backend with `uvicorn main:app --reload` in the backend folder for full AI responses.\n\n';

            const matchedKey = Object.keys(demoResponses).find(key => lowerMsg.includes(key));
            if (matchedKey) {
                demoReply += `📚 **From the textbook:** ${demoResponses[matchedKey]}`;
            } else {
                demoReply += 'Try asking about: ROS 2, Gazebo, NVIDIA Isaac, VLA models, or Hardware requirements!';
            }

            setMessages(prev => [...prev, { sender: 'bot', text: demoReply }]);
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
                        <button onClick={toggleChat}>✕</button>
                    </div>
                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="message bot">
                                👋 Welcome! Ask me anything about Physical AI & Robotics. Try: "What is ROS 2?"
                            </div>
                        )}
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
