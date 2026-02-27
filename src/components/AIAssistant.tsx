import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { AI_CONTENT } from '../data/aiContent';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const AIAssistant = () => {
  const { themeMode } = useGame();
  const theme = getTheme(themeMode);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', text: '¡Hola! Soy tu asistente financiero. Pregúntame cualquier duda sobre el contenido del curso.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    // Optimistically add user message
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemInstruction = `
        Eres un asistente educativo experto en finanzas.
        Tu ÚNICA fuente de conocimiento es el siguiente texto.
        NO debes responder preguntas que no estén relacionadas con este texto.
        Si el usuario te pregunta sobre el clima, deportes, noticias recientes, o cualquier tema fuera de este contenido, DEBES responder: "Lo siento, no puedo responder a eso. Solo puedo ayudarte con el contenido del curso de finanzas."
        
        CONTENIDO DEL CURSO:
        ${AI_CONTENT}
        
        Responde de manera concisa, educativa y amable. Adapta tu tono para ser profesional pero accesible.
      `;

      // Filter out the welcome message and map to API format
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-latest",
        contents: [
          ...history,
          { role: 'user', parts: [{ text: currentInput }] }
        ],
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const text = response.text || "Lo siento, no pude generar una respuesta.";
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: "Lo siento, tuve un problema de conexión. Por favor intenta de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-xl flex items-center justify-center transition-colors
          ${
            isOpen
              ? 'bg-finomik-primary text-white'
              : themeMode === 'young'
                ? 'bg-finomik-gradient-strong text-white shadow-[0_10px_25px_rgba(11,48,100,0.3)]'
                : 'bg-finomik-primary text-white shadow-[0_10px_25px_rgba(11,48,100,0.25)]'
          }`}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 right-6 z-50 w-[95vw] md:w-[520px] h-[580px] max-h-[85vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-[color:var(--finomik-blue-6)] overflow-hidden"
          >
            {/* Header */}
            <div
              className={`p-4 border-b border-[color:var(--finomik-blue-6)] flex items-center gap-3 ${
                themeMode === 'young' ? 'bg-finomik-gradient-strong text-white' : 'bg-finomik-primary text-white'
              }`}
            >
              <div className="bg-white/15 p-2 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base">Asistente Finomik</h3>
                <p className="text-sm opacity-80">Pregúntame sobre el curso</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-finomik-blue-soft/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-base leading-relaxed shadow-sm
                      ${
                        msg.role === 'user'
                          ? 'bg-finomik-primary text-white rounded-br-none'
                          : 'bg-white text-[color:var(--finomik-blue-2)] border border-[color:var(--finomik-blue-6)] rounded-bl-none'
                      }`}
                  >
                    {msg.role === 'model' ? (
                      <div className="markdown-body">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-[color:var(--finomik-blue-6)] shadow-sm flex items-center gap-2">
                    <Loader2 size={20} className="animate-spin text-finomik-primary" />
                    <span className="text-sm text-[color:var(--finomik-blue-5)]">Pensando...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[color:var(--finomik-blue-6)] bg-white">
              <div className="flex items-center gap-2 bg-finomik-blue-soft/60 border-2 border-[color:var(--finomik-blue-6)] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-finomik-primary/15 focus-within:border-finomik-primary transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-base text-[color:var(--finomik-blue-2)] placeholder:text-[color:var(--finomik-blue-5)]"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-2.5 rounded-xl transition-colors ${
                    !input.trim() || isLoading
                      ? 'text-[color:var(--finomik-blue-6)]'
                      : 'text-finomik-primary hover:bg-finomik-blue-soft'
                  }`}
                >
                  <Send size={22} />
                </button>
              </div>
              <div className="text-xs text-center text-[color:var(--finomik-blue-5)] mt-2">
                La IA puede cometer errores. Verifica la información importante.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
