import { NextResponse } from "next/server";

import {
  isCheckoutPayload,
  validateCheckoutPayload,
} from "@/lib/booking/validate-checkout-payload";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl, isStripeConfigured } from "@/lib/stripe/config";
import { getStripe } from "@/lib/stripe/server";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe не налаштовано. Додайте ключі в .env" },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isCheckoutPayload(body)) {
    return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
  }

  const validation = await validateCheckoutPayload(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const booking = validation.booking;
  const appUrl = getAppUrl();
  const stripe = getStripe();

  const timeLabel = booking.timeSlots.join(", ");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "uah",
            unit_amount: booking.totalPrice * 100,
            product_data: {
              name: `Бронювання: ${booking.courtName}`,
              description: `${booking.bookingDate} · ${timeLabel}`,
            },
          },
        },
      ],
      metadata: {
        user_id: user.id,
        court_id: booking.courtId,
        court_name: booking.courtName,
        booking_date: booking.bookingDate,
        time_slots: JSON.stringify(booking.timeSlots),
        total_price: String(booking.totalPrice),
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Не вдалося створити сесію оплати" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: "Помилка Stripe. Перевірте ключі та валюту UAH у акаунті." },
      { status: 500 }
    );
  }
}
