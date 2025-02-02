import React from "react";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Invoice from "./invoice";

async function InvoicePage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  const { id } = await params;
  if (!userId) return;

  const invoiceId = parseInt(id);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  if (!result) {
    notFound();
  }

  return <Invoice invoice={result} />;
}

export default InvoicePage;
