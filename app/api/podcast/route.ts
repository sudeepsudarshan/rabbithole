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

  const prompt = `You are writing a podcast transcript. The energy is Vsauce meets Radiolab — two people who genuinely cannot stop thinking about this thing, losing their minds together on mic.

Topic category: ${templateLabel}
Episode title: ${title}
Core insight: "${answer}"
What triggered this: "${question}"

The two hosts:
- JAY: The one who just learned this and is still processing it. Asks "but wait, that means...?" questions. Gets genuinely unsettled. Occasionally makes a dark joke when the implications get too big.
- MAYA: Has been thinking about this for years. Drops the really uncomfortable follow-up facts. Does the thing where she goes quiet for a second before saying something devastating. Knows exactly where your brain is going to break next.

Rules for the transcript:
- Jay opens with something that sounds almost too mundane, then immediately pulls the rug out
- Minimum 10 turns, maximum 12. Strict alternation: Jay, Maya, Jay, Maya... (Jay always starts and ends)
- Each turn is 60-100 words. No turn ends on a period — end on a comma, a dash, or an unanswered question
- Turn 5 or 6: one host says something that makes the other go completely quiet before responding
- The final Jay turn should end with a question so good that the listener will be thinking about it tomorrow
- Never use the words "fascinating", "interesting", "indeed", or "certainly"
- No lecture voice. This is a conversation between two people who are slightly scared of what they know

Return ONLY valid JSON: { "turns": [{ "host": "Jay", "text": "..." }, { "host": "Maya", "text": "..." }, ...] }
No preamble, no markdown fences, no commentary outside the JSON.`;

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
