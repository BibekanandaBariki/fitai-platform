import { streamText } from 'ai';
import { claudeSonnet } from '@/lib/ai/anthropic';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `You are FitAI, an elite personal trainer, nutritionist, and health coach. 
    Your goal is to help the user achieve their fitness goals. 
    Keep responses concise, highly motivating, and scientifically accurate. 
    Format with clean markdown and emojis.`;

    const result = await streamText({
      model: claudeSonnet,
      system: systemPrompt,
      messages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("FitAI Coach Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
