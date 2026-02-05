import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookiestore = cookies();

  // Delete the cookie by setting it with an expired date
  (await
        // Delete the cookie by setting it with an expired date
        cookiestore).set("userRevTok", "", { path: "/", expires: new Date(0) });
        (await
          // Delete the cookie by setting it with an expired date
          cookiestore).set("token", "", { path: "/", expires: new Date(0) });

  return NextResponse.json({ message: "Cookie deleted successfully!" });
}
