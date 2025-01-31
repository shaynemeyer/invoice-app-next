import React from "react";

import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Container from "@/components/Container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { updateStatusAction } from "@/app/actions/invoice";
import { ChevronDown } from "lucide-react";

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

  return (
    <main className="w-full h-full">
      <Container>
        <div className="flex justify-between mb-8">
          <h1 className="flex items-center gap-4 text-3xl font-bold">
            Invoice #{invoiceId}{" "}
            <Badge
              className={cn(
                "rounded-full capitalize",
                result.status === "open" && "bg-blue-500",
                result.status === "paid" && "bg-green-500",
                result.status === "void" && "bg-zinc-700",
                result.status === "uncollectible" && "bg-red-600"
              )}
            >
              {result.status}
            </Badge>
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Change Status
                <ChevronDown className="w-4 h-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {AVAILABLE_STATUSES.map((status) => (
                <DropdownMenuItem key={status.id}>
                  <form action={updateStatusAction}>
                    <input type="hidden" name="id" value={invoiceId} />
                    <input type="hidden" name="status" value={status.id} />
                    <button>{status.label}</button>
                  </form>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-3xl mb-3"> ${(result.value / 100).toFixed(2)}</p>
        <p className="text-lg mb-8">{result.description}</p>

        <h2 className="font-bold text-lg mb-4">Billing Details</h2>

        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{invoiceId}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(result.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            <span></span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Email
            </strong>
            <span></span>
          </li>
        </ul>
      </Container>
    </main>
  );
}

export default InvoicePage;
