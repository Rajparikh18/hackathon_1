import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import './chat.css';
import axios from 'axios';

function Chat({ apiRoute }) {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const sendMessage = async () => {
        console.log("hello");
        const trimmedMessage = message.trim();
        
        if (!trimmedMessage || !apiRoute) {
            return;
        }

        try {
            setChatHistory(prev => [...prev, { type: 'user', content: trimmedMessage }]);
            setIsLoading(true);

            const response = await axios.post(apiRoute, 
                { message: trimmedMessage },
                { 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data && response.data.response) {
                setChatHistory(prev => [...prev, { type: 'bot', content: response.data.response }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setChatHistory(prev => [...prev, { 
                type: 'bot', 
                content: 'Sorry, I encountered an error. Please try again.' 
            }]);
        } finally {
            setIsLoading(false);
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <MessageCircle size={24} />
                <h1>AI Assistant</h1>
            </div>

            <div className="chat-messages">
                {chatHistory.length === 0 && (
                    <div className="welcome-message">
                        <h2>Welcome to AI Analytics Assistant! 👋</h2>
                        <p>How can I help you today?</p>
                    </div>
                )}
                
                {chatHistory.map((chat, index) => (
                    <div key={`${index}-${chat.type}`} className={`message ${chat.type}-message`}>
                        <div className="message-content">
                            {chat.content}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="message bot-message">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                <input
                    type="text"
                    value={message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    className="chat-input"
                />
                <button 
                    onClick={sendMessage}
                    className="send-button"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}

export default Chat;