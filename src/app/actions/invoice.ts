"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function createAction(formData: FormData) {
  const { userId } = await auth();
  const value = Math.floor(parseFloat(String(formData.get("value")))) * 100;
  const description = String(formData.get("description"));

  if (!userId) return;

  const results = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      status: "open",
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${results[0].id}`);
}
