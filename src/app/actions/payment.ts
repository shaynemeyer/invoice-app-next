"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { Invoices } from "@/db/schema";
import Stripe from "stripe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

export async function createPayment(formData: FormData) {
  const headersList = headers();
  const origin = (await headersList).get("origin");

  const id = Number.parseInt(formData.get("id") as string);

  const [result] = await db
    .select({
      status: Invoices.status,
      value: Invoices.value,
    })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product: "prod_RiyEmSrErVjcVn",
          unit_amount: result.value,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) {
    throw new Error("Invalid session");
  }

  redirect(session.url);
}
