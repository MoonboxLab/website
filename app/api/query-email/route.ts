import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  try {
    // const result =
    //   await sql`select id, email, to_char(created_at,'yyyy-MM-dd HH24:MI:SS') from emails;`;
    // return NextResponse.json({ result }, { status: 200 });

    return NextResponse.json({ }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}