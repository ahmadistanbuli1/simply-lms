import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Error: Missing CLERK_WEBHOOK_SECRET");
    return new Response("Server Configuration Error", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    // Svix signature verification
    // If the request is fake, we immediately move to the catch section.
    wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return new Response("Error: Verification failed", { status: 400 });
  }

  //If the request is 100% reliable, we convert the raw text into a JSON object.
  const evt = JSON.parse(body) as WebhookEvent;

  // Having reached this point, the type will no longer be undefined.
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    const email = email_addresses[0]?.email_address;

    const name = [first_name, last_name].filter(Boolean).join(" ");

    if (!email) {
      return new Response("Error: No email provided", { status: 400 });
    }

    try {
      // Save user
      const newUser = await prisma.user.upsert({
        where: { clerkId: id },
        update: { email, name: name || "مستخدم جديد" },
        create: { clerkId: id, email, name: name || "مستخدم جديد" },
      });

      console.log(`Success: User ${newUser.id} created in database.`);
      return NextResponse.json(
        { message: "User created successfully" },
        { status: 201 },
      );
    } catch (error) {
      console.error("Database insertion error:", error);
      return new Response("Error: Could not save to database", { status: 500 });
    }
  }

  // Returns a response to other events (such as login session.created) that we do not need to save.
  return new Response("Webhook received but ignored", { status: 200 });
}
