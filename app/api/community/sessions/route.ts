import { NextResponse } from 'next/server';

interface SessionizeSession {
  title: string;
  link: string;
}

const SESSIONIZE_EMBED_URL = 'https://sessionize.com/api/speaker/sessions/qe8n7ez6dg/1x1x3fb393x';

export async function GET() {
  try {
    const res = await fetch(SESSIONIZE_EMBED_URL, {
      // Cache on the server for 1 hour to avoid hammering Sessionize
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error('Sessionize response not OK', res.status, res.statusText);
      return NextResponse.json({ sessions: [] }, { status: 200 });
    }

    const text = await res.text();

    // Extract session data from the document.write HTML content
    const regex = /<a href="([^"]+)"[^>]*class="sz-item__title"[^>]*>([^<]+)<\/a>/g;
    const sessions: SessionizeSession[] = [];

    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      sessions.push({
        link: match[1],
        title: match[2].replace(/&amp;/g, '&'),
      });
    }

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Failed to fetch sessions from Sessionize', error);
    return NextResponse.json({ sessions: [] }, { status: 200 });
  }
}
