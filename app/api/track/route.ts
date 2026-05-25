

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // In production, this would log to Supabase analytics_events table
    // For MVP, we accept and acknowledge the event
    if (!body.event) {
      return new Response('Missing event type', { status: 400 });
    }

    return Response.json({ ok: true });
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }
}
