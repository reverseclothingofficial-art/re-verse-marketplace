import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookiestore = await cookies();
  const myCookie = cookiestore.get("userRevTok")?.value || null;
  return NextResponse.json({ myCookie });
}
