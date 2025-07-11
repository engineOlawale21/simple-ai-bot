// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import openai from '@/utils/openai'; // Adjust path if you didn't create lib/openai.ts

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // Ensure messages is an array of objects with role and content
    if (!Array.isArray(messages) || messages.some(msg => !msg.role || !msg.content)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // Or "gpt-4o", "gpt-4", etc.
      messages: messages,
    });
    
    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    
    return NextResponse.json({ reply });
   //  console.log(reply);

  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    return NextResponse.json({ error: "Failed to get a response from the AI." }, { status: 500 });
  }
}