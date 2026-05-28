'use client';

import { useState } from 'react';
import { Template } from '@/types/template';
import { cn } from '@/lib/utils';
import { MessageCircle, ChevronDown } from 'lucide-react';
import ChatMessage from '@/components/dive/ChatMessage';
import ChatInput from '@/components/dive/ChatInput';
import Badge from '@/components/ui/Badge';
import BackLink from '@/components/nav/BackLink';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

interface DivePageClientProps {
  templates: Template[];
}

export default function DivePageClient({ templates }: DivePageClientProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

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
          templateId: selectedTemplate.id,
          episodeSlug: '',
          chapterNumber: 0,
          chapterTitle: '',
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
    <div className="flex flex-col h-[calc(100svh-56px-64px)] md:h-[calc(100svh-56px)] max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="py-5 border-b border-hairline">
        <BackLink fallback="/" fallbackLabel="Home" className="mb-3 text-xs" />
        <div className="flex items-center gap-3 mb-3">
          <MessageCircle className="w-4 h-4 text-accent-rust" />
          <h1 className="font-serif text-xl text-ink-primary">Freeform Dive</h1>
        </div>

        {/* Template selector */}
        <div className="relative">
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            className="flex items-center gap-2 text-sm font-sans text-ink-secondary hover:text-ink-primary transition-colors"
          >
            <Badge variant="accent" accentColor={selectedTemplate.accentColor}>
              {selectedTemplate.name}
            </Badge>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 transition-transform text-ink-muted',
                selectorOpen && 'rotate-180'
              )}
            />
          </button>

          {selectorOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-elevated border border-hairline rounded-xl z-50 overflow-hidden">
              <div className="p-2 max-h-80 overflow-y-auto space-y-1">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplate(t);
                      setSelectorOpen(false);
                      setMessages([]);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2.5 rounded-md text-xs font-sans transition-all',
                      t.id === selectedTemplate.id
                        ? 'bg-[var(--state-active)] text-ink-primary border border-hairline'
                        : 'text-ink-secondary hover:bg-[var(--state-hover)] hover:text-ink-primary'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-[0.6rem]"
                        style={{ color: t.accentColor }}
                      >
                        {t.id}
                      </span>
                      <span className="font-serif">{t.name}</span>
                    </div>
                    <p className="text-ink-muted mt-0.5 text-[0.65rem] line-clamp-1 pl-6">
                      {t.tagline}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ background: `${selectedTemplate.accentColor}15`, border: `1px solid ${selectedTemplate.accentColor}30` }}
            >
              <MessageCircle className="w-6 h-6" style={{ color: selectedTemplate.accentColor }} />
            </div>
            <h2 className="font-serif text-lg text-ink-primary mb-2">
              {selectedTemplate.name}
            </h2>
            <p className="text-ink-muted text-sm font-sans max-w-xs leading-relaxed mb-6">
              {selectedTemplate.tagline}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedTemplate.exampleTopics.slice(0, 3).map(topic => (
                <button
                  key={topic}
                  onClick={() => handleSend(topic)}
                  className="text-xs px-3 py-1.5 border border-hairline rounded-full text-ink-muted hover:text-ink-primary hover:border-ink-line transition-all font-sans"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, i) => (
              <ChatMessage
                key={i}
                role={message.role}
                content={message.content}
                isStreaming={message.streaming}
              />
            ))}
            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <div className="flex items-center gap-1.5 px-4 py-3 bg-ink-100 border border-border rounded-lg rounded-tl-sm w-fit">
                <span className="w-1.5 h-1.5 bg-paper-faint rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-paper-faint rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-1.5 h-1.5 bg-paper-faint rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="py-4 border-t border-border">
        <ChatInput
          onSend={handleSend}
          disabled={isStreaming}
          placeholder={selectedTemplate.inputPlaceholder}
        />
      </div>
    </div>
  );
}
