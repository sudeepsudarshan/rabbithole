import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  let title: string;
  let question: string;
  let answer: string;
  let templateLabel: string;

  try {
    const body = await req.json();
    title = body.title;
    question = body.question;
    answer = body.answer;
    templateLabel = body.templateLabel;
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (!title || !answer) {
    return new Response('Missing required fields', { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('API key not configured', { status: 500 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are writing a fun, engaging, educational podcast transcript.

Topic category: ${templateLabel}
Episode title: ${title}
Core fact: "${answer}"
User's question: "${question}"

Generate a 10-turn podcast conversation between two hosts:
- Ray: curious, enthusiastic, asks great follow-up questions, occasionally makes witty remarks
- Sage: deeply knowledgeable, gives jaw-dropping explanations, weaves in surprising twists and unexpected connections

Rules:
- Start with Ray giving a gripping hook that makes the listener lean in
- Each turn should be 60-110 words
- Build in a "wait, what?!" moment around turn 5-6
- End with a mind-bending takeaway that changes how you see the world
- Keep it conversational, never lecture-y
- Alternate strictly: Ray, Sage, Ray, Sage... (Ray starts, Ray ends)
- Be entertaining AND accurate

Return ONLY valid JSON: { "turns": [{ "host": "Ray", "text": "..." }, { "host": "Sage", "text": "..." }, ...] }
No preamble, no markdown fences, no commentary.`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    return new Response('Unexpected response type', { status: 500 });
  }

  try {
    const parsed = JSON.parse(content.text);
    return Response.json(parsed);
  } catch {
    // Try to extract JSON from the response
    const match = content.text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        return Response.json(parsed);
      } catch {
        // fall through
      }
    }
    return new Response('Failed to parse AI response', { status: 500 });
  }
}
