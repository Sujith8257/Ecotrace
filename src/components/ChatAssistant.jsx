import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Leaf, Sparkles, MessageCircle } from 'lucide-react';
import { chatWithTrace } from '../services/aiService';

export default function ChatAssistant({ isOpen, onClose, footprintData }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Trace, your climate coach. I see your monthly footprint is estimated at **" + footprintData?.total + " kg CO2e**. What would you like to know about reducing your emissions?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Create a simplified message array for the API (no UI-specific fields if any)
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const responseText = await chatWithTrace(apiMessages, footprintData);
      
      setMessages([...newMessages, { role: 'assistant', content: responseText }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { role: 'assistant', content: "I'm having trouble connecting to my servers right now. Please try again in a moment!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-border flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="h-16 bg-brand-green flex items-center justify-between px-4 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Trace AI</h3>
                <p className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">Climate Coach</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-brand-green text-white rounded-br-sm' 
                    : 'bg-white border border-border shadow-sm text-foreground rounded-bl-sm'
                }`}>
                  {msg.role === 'assistant' && idx === 0 && (
                    <Sparkles size={14} className="text-brand-green inline mr-2 -mt-0.5" />
                  )}
                  {/* Basic markdown parsing for bold text */}
                  <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-border shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-brand-green/60 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-green/60 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-green/60 rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium ml-1">Trace is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-border shrink-0">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your footprint..."
                className="flex-1 h-10 px-4 text-sm bg-secondary border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-brand-green hover:bg-brand-green/90 text-white flex items-center justify-center disabled:opacity-50 disabled:hover:bg-brand-green transition-colors"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
