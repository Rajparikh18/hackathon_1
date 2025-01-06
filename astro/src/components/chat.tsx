import React,{useState} from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import './chat.css';
import axios from 'axios';

// Define interfaces for our types
interface ChatMessage {
    type: 'user' | 'bot';
    content: string;
}

interface ApiResponse {
    response: string;
}

function Chat(){
    const [message, setMessage] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setMessage(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (!message.trim()) return;

        // Add user message to chat history
        setChatHistory(prev => [...prev, { type: 'user', content: message }]);
        setIsLoading(true);

        try {
            const response = await axios.post<ApiResponse>('/api/chat', { message });
            console.log("Response",response);
            setChatHistory(prev => [...prev, { type: 'bot', content: response.data.response }]);
        } catch (error) {
            console.error('Error:', error);
            setChatHistory(prev => [...prev, { type: 'bot', content: 'Sorry, I encountered an error. Please try again.' }]);
        }

        setIsLoading(false);
        setMessage('');
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
                    <div key={index} className={`message ${chat.type}-message`}>
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
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    className="chat-input"
                />
                <button type="submit" className="send-button" disabled={!message.trim() || isLoading}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}

export default Chat;