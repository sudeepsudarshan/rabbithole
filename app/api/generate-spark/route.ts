import Anthropic from '@anthropic-ai/sdk';
import { TEMPLATES } from '@/lib/templates';
import { GenerateSparkResponse } from '@/types/api';



export async function POST(req: Request) {
  let templateId: string;
  let topic: string;

  try {
    const body = await req.json();
    templateId = body.templateId;
    topic = body.topic;
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (!templateId || !topic?.trim()) {
    return new Response('Missing templateId or topic', { status: 400 });
  }

  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    return new Response('Template not found', { status: 404 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('API key not configured', { status: 500 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Generate a Spark card for the ${template.name} template about: ${topic}. Return ONLY valid JSON with keys: title (8–14 word hook), question (8–15 word user question), answer (40–60 words, jaw-dropping fact + twist), hookLine (20–35 word share-worthy one-liner). No preamble, no markdown fences.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    return new Response('Unexpected response type', { status: 500 });
  }

  try {
    const parsed = JSON.parse(content.text) as GenerateSparkResponse;
    return Response.json(parsed);
  } catch {
    return new Response('Failed to parse AI response', { status: 500 });
  }
}
