import Anthropic from '@anthropic-ai/sdk';
import { TEMPLATES } from '@/lib/templates';
import { getEpisodeBySlug } from '@/lib/episodes';



export async function POST(req: Request) {
  let templateId: string;
  let episodeSlug: string;
  let chapterNumber: number;
  let chapterTitle: string;
  let messages: Array<{ role: 'user' | 'assistant'; content: string }>;

  try {
    const body = await req.json();
    templateId = body.templateId;
    episodeSlug = body.episodeSlug;
    chapterNumber = body.chapterNumber;
    chapterTitle = body.chapterTitle;
    messages = body.messages;
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (!templateId || !messages?.length) {
    return new Response('Missing required fields', { status: 400 });
  }

  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    return new Response('Template not found', { status: 404 });
  }

  const episode = episodeSlug ? getEpisodeBySlug(episodeSlug) : null;

  const contextInjection = episode
    ? `\n\nYou are currently in Chapter ${chapterNumber}: "${chapterTitle}" of the episode "${episode.title}". Stay grounded in this chapter's content but follow the user wherever their curiosity leads.`
    : '';

  const systemPrompt = template.systemPrompt + contextInjection;

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('API key not configured', { status: 500 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.slice(-20),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch {
        controller.error(new Error('Stream error'));
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  });
}
