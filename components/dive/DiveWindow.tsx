'use client';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, ChevronDown } from 'lucide-react';
import { Episode, Chapter } from '@/types/episode';
import { cn } from '@/lib/utils';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

interface DiveWindowProps {
  episode?: Episode;
  chapter?: Chapter;
  templateId: string;
  defaultOpen?: boolean;
}

export default function DiveWindow({ episode, chapter, templateId, defaultOpen = false }: DiveWindowProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showEarlier, setShowEarlier] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const MAX_VISIBLE = 20;
  const visibleMessages = showEarlier ? messages : messages.slice(-MAX_VISIBLE);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    if (isStreaming) return;

    const userMessage: Message = { role: 'user', content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsStreaming(true);

    const assistantMessage: Message = { role: 'assistant', content: '', streaming: true };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      const response = await fetch('/api/dive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          episodeSlug: episode?.slug || '',
          chapterNumber: chapter?.number || 0,
          chapterTitle: chapter?.title || '',
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: fullText, streaming: true };
          return updated;
        });
      }

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: fullText, streaming: false };
        return updated;
      });
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Something went wrong — check your connection.',
          streaming: false,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="border-t border-border bg-ink">
      {/* Toggle header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <MessageCircle className="w-4 h-4 text-gold" />
          <span className="font-serif italic text-sm text-paper group-hover:text-gold transition-colors">
            Dive deeper with AI
          </span>
          {chapter && (
            <span className="font-mono text-[0.65rem] text-paper-faint">
              — {chapter.title}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-paper-faint" />
        </motion.div>
      </button>

      {/* Chat area */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-6 pt-4 pb-6 space-y-4">
              {/* Messages */}
              <div
                ref={scrollContainerRef}
                className="space-y-3 max-h-80 overflow-y-auto pr-1"
              >
                {messages.length > MAX_VISIBLE && !showEarlier && (
                  <button
                    onClick={() => setShowEarlier(true)}
                    className="text-xs text-paper-faint hover:text-paper text-center w-full py-2 font-sans"
                  >
                    Show earlier conversation
                  </button>
                )}

                {visibleMessages.length === 0 && (
                  <p className="text-xs text-paper-faint text-center py-4 font-serif italic">
                    Ask anything about this chapter...
                  </p>
                )}

                {visibleMessages.map((message, i) => (
                  <ChatMessage
                    key={i}
                    role={message.role}
                    content={message.content}
                    isStreaming={message.streaming}
                  />
                ))}

                {/* Typing indicator */}
                {isStreaming && messages[messages.length - 1]?.content === '' && (
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-ink-100 border border-border rounded-lg rounded-tl-sm w-fit">
                    <span className="w-1.5 h-1.5 bg-paper-faint rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-paper-faint rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-1.5 h-1.5 bg-paper-faint rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <ChatInput
                onSend={handleSend}
                disabled={isStreaming}
                placeholder={chapter ? `Ask about "${chapter.title}"...` : 'Ask anything...'}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
