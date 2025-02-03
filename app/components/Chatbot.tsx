'use client';

import { useState } from 'react';
import { FiMessageSquare, FiX, FiSend, FiUser } from 'react-icons/fi';
import Image from 'next/image';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: 'Hi! Welcome to Bloom. How can I assist you today?', 
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      text: input,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simple response logic
    const botResponses: { [key: string]: string } = {
      'hello': 'Hello! How can I help you today?',
      'hi': 'Hi there! What can I do for you?',
      'products': 'We offer a range of vegan and cruelty-free skincare products. Would you like to see our bestsellers?',
      'shipping': 'We offer free shipping on orders over £50! Standard delivery takes 2-4 working days.',
      'returns': 'We have a hassle-free 30-day return policy for all unused products.',
      'payment': 'We accept all major credit cards, PayPal, and Apple Pay.',
      'contact': 'You can reach our customer service team at support@bloom.com or call us at 0800-123-4567.',
    };

    // Simulate bot thinking
    setTimeout(() => {
      const lowercaseInput = input.toLowerCase();
      let responseText = '';

      // Check for keyword matches
      for (const [keyword, response] of Object.entries(botResponses)) {
        if (lowercaseInput.includes(keyword)) {
          responseText = response;
          break;
        }
      }

      // Default response if no keywords match
      if (!responseText) {
        responseText = "I'm not quite sure about that. Would you like to speak with our customer service team?";
      }

      const botMessage = {
        text: responseText,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-xl w-96 h-[500px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Image
                  src="/logo2.png"
                  alt="Bloom"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-medium">Bloom Support</h3>
                <p className="text-xs text-gray-300">Usually replies instantly</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-end gap-2 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center">
                    {message.isBot ? (
                      <Image
                        src="/logo2.png"
                        alt="Bloom"
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full rounded-full flex items-center justify-center">
                        <FiUser className="w-3 h-3 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.isBot 
                        ? 'bg-gray-100 rounded-bl-none' 
                        : 'bg-black text-white rounded-br-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-[10px] mt-1 opacity-50">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-full">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        >
          <FiMessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
} 