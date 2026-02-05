// File: app/api/set-cookie/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url); // Get query parameters
  const token = searchParams.get("token"); // Extract the "token" parameter

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Cookie set successfully!" });

  // Set the cookie
  response.cookies.set("userRevTok", token, {
    path: "/", // Cookie available site-wide
    maxAge: 1296000, // 15 days in seconds
    httpOnly: false, // Can be accessed via JavaScript
  });

  return response;
}
