import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  let title: string, question: string, answer: string, templateLabel: string, hookLine: string;

  try {
    const body = await req.json();
    title = body.title;
    question = body.question;
    answer = body.answer;
    templateLabel = body.templateLabel;
    hookLine = body.hookLine;
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

  const prompt = `Write a 450–550 word deep-dive article about this topic. No headers, no bullet points — just 3–4 flowing paragraphs of sharp, curious prose in the style of Vsauce or Radiolab: surprising, precise, occasionally unsettling, always building toward an insight that reframes how the reader sees things.

Topic category: ${templateLabel}
Hook: "${title}"
Core insight: "${answer}"
The gut-punch line: "${hookLine}"
What triggered this question: "${question}"

Rules:
- Open with a scene, a number, or a statement that doesn't explain itself yet — make the reader lean in
- Each paragraph should end with a sentence that makes the next one feel necessary
- Use concrete specifics over abstractions. Dates, names, measurements, comparisons
- The final paragraph should land the bigger implication — what this reveals about us, reality, or existence itself
- Write in second person occasionally ("you've probably never thought about...") to pull the reader in
- Never summarize or conclude with a lesson. End on a question, or an image that lingers

Return only the article text — no title, no byline, no formatting.`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    return new Response('Unexpected response type', { status: 500 });
  }

  return Response.json({ article: content.text.trim() });
}
