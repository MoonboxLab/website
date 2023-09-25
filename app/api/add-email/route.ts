import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      throw new Error("Email required");
    }

    const timestamps = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await sql`INSERT INTO emails (Email, Created_at) VALUES (${email}, ${timestamps});`;
    return NextResponse.json({ email }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}