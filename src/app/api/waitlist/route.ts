import { NextRequest, NextResponse } from "next/server";
import { addToWaitlist } from "@/lib/db/queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, domain, website } = body;

    // Honeypot detection - if hidden 'website' field is populated, silently reject
    if (website && typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const result = await addToWaitlist(email.trim().toLowerCase(), domain);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to save waitlist entry." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
