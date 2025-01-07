import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}
const MarkdownFormatter = ( {content}:any ) => {
  const processFormatting = (text:any) => {
    // Process bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Remove excess newlines (more than 2)
    text = text.replace(/\n{3,}/g, '\n\n');
    // Format bullet points with controlled spacing
    text = text.replace(/^\s*-\s+/gm, '• ');
    return text;
  };

  const formatText = (text:any) => {
    const lines = text.split('\n');
    const processedLines = lines.map((line:any, index:any) => {
      const processedLine = processFormatting(line);
      if (line.trim().startsWith('-')) {
        return (
          <div key={index} className="bullet-point">
            <div dangerouslySetInnerHTML={{ __html: processedLine }} />
          </div>
        );
      }
      return (
        <div key={index} className="text-line text-white">
          <div dangerouslySetInnerHTML={{ __html: processedLine }} />
        </div>
      );
    });

    return processedLines;
  };

  return (
    <div className="markdown-content text-white">
      {formatText(content)}
    </div>
  );
};
export default function SocialMediaAnalystAI() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', { message });
      const botMessage: Message = {
        id: uuidv4(),
        type: 'bot',
        content: response.data.response,
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 shadow-md p-4 flex items-center">
        <MessageCircle size={24} className="text-blue-400 mr-2" />
        <h1 className="text-xl font-semibold">Social Media Analyst AI</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">Welcome to Social Media Analyst AI! 👋</h2>
              <p className="text-gray-400">Ask me anything about your social media data!</p>
            </CardContent>
          </Card>
        )}
        {chatHistory.map((chat) => (
          <div key={chat.id} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Card className={`max-w-[80%] ${chat.type === 'user' ? 'bg-blue-600' : 'bg-gray-800'} border-gray-700`}>
              <CardContent className="p-3">
                <MarkdownFormatter content={chat.content} className="text-sm text-white" />
                <p className="text-xs mt-1 opacity-70 text-white">
                  {chat.timestamp.toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] w-64 bg-gray-800 border-gray-700">
              <CardContent className="p-3">
                <Skeleton className="w-full h-4 mb-2 bg-gray-700" />
                <Skeleton className="w-3/4 h-4 mb-2 bg-gray-700" />
                <Skeleton className="w-1/2 h-4 bg-gray-700" />
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="bg-gray-800 p-4 shadow-md">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Ask about your social media data..."
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Button type="submit" disabled={!message.trim() || isLoading} className="bg-blue-600 hover:bg-blue-700">
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
}

