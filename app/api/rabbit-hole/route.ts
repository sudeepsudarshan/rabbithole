import Anthropic from '@anthropic-ai/sdk';
import { TEMPLATES } from '@/lib/templates';
import { HOST_RULES } from '@/lib/personas';

// Simple in-memory rate limiter (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 15) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(
      "You've hit the limit for now — try again in a minute.",
      { status: 429 }
    );
  }

  let templateId: string;
  let question: string;
  let sparkTitle: string | undefined;
  let sparkAnswer: string | undefined;
  let history: { role: 'user' | 'assistant'; content: string }[] = [];

  try {
    const body = await req.json();
    templateId = body.templateId;
    question = body.question;
    sparkTitle = body.sparkTitle;
    sparkAnswer = body.sparkAnswer;
    history = body.history ?? [];
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (!templateId || !question?.trim()) {
    return new Response('Missing templateId or question', { status: 400 });
  }

  if (question.length > 500) {
    return new Response('Question exceeds 500 character limit', { status: 400 });
  }

  if (history.length > 20) {
    return new Response('Conversation history too long', { status: 400 });
  }

  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    return new Response('Template not found', { status: 404 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('API key not configured', { status: 500 });
  }

  const sparkContext = sparkTitle && sparkAnswer
    ? `\n\nThe user is exploring this specific spark:\nTITLE: "${sparkTitle}"\nCORE INSIGHT: "${sparkAnswer}"\n\nAnswer questions specifically about this topic. 100-160 words per response.`
    : '';

  const systemPrompt = HOST_RULES + '\n\n' + template.systemPrompt + sparkContext;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    ...history,
    { role: 'user', content: question },
  ];

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    system: systemPrompt,
    messages,
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
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
