import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address) {
      throw new Error("Email required");
    }

    const timestamps = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await sql`INSERT INTO whitelist (address, Created_at) VALUES (${address}, ${timestamps});`;
    return NextResponse.json({ address }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}