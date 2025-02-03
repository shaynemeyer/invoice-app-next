"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { Customers, Invoices, Status } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm/sql";
import { revalidatePath } from "next/cache";

export async function createAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) return;

  const value = Math.floor(parseFloat(String(formData.get("value")))) * 100;
  const description = String(formData.get("description"));
  const name = String(formData.get("name"));
  const email = String(formData.get("email"));

  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
    })
    .returning({
      id: Customers.id,
    });

  const results = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      customerId: customer.id,
      status: "open",
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) return;

  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;

  await db
    .update(Invoices)
    .set({ status })
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

  revalidatePath(`/invoices/${id}`, "page");
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) return;

  const id = formData.get("id") as string;

  await db
    .delete(Invoices)
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

  redirect("/dashboard");
}
