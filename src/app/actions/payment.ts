import { db } from "@/db";
import { eq } from "drizzle-orm";
import { Invoices } from "@/db/schema";
import Stripe from "stripe";

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

export async function createPayment(formData: FormData) {
  const id = Number.parseInt(formData.get("id") as string);

  const [result] = await db
    .select({
      status: Invoices.status,
      value: Invoices.value,
    })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);
}
