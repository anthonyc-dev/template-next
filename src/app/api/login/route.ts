import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body || {};

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password required" },
      { status: 400 }
    );
  }

  // Demo-only: accept any credentials
  return NextResponse.json(
    { message: "ok", token: "demo-token" },
    { status: 200 }
  );
}
