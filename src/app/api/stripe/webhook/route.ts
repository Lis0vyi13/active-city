import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;

  if (!metadata?.user_id || !metadata.court_id || !metadata.booking_date) {
    console.error("Webhook: missing metadata", session.id);
    return;
  }

  if (!isSupabaseAdminConfigured()) {
    console.error("Webhook: Supabase service role is not configured");
    return;
  }

  let timeSlots: string[] = [];

  try {
    timeSlots = JSON.parse(metadata.time_slots ?? "[]") as string[];
  } catch {
    console.error("Webhook: invalid time_slots JSON", session.id);
    return;
  }

  const totalPrice = Number(metadata.total_price);

  if (!timeSlots.length || !Number.isFinite(totalPrice) || totalPrice <= 0) {
    console.error("Webhook: invalid booking payload", session.id);
    return;
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle();

  if (existing) {
    return;
  }

  const { error } = await supabase.from("bookings").insert({
    user_id: metadata.user_id,
    court_id: metadata.court_id,
    court_name: metadata.court_name ?? "Майданчик",
    booking_date: metadata.booking_date,
    time_slots: timeSlots,
    total_price: totalPrice,
    status: "paid",
    stripe_checkout_session_id: session.id,
  });

  if (error) {
    console.error("Webhook: failed to save booking", error.message);
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret is not configured" },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  return NextResponse.json({ received: true });
}
