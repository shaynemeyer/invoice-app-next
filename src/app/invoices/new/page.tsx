"use client";

import Form from "next/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { SyntheticEvent, useState } from "react";
import { createAction } from "@/app/actions/invoice";
import SubmitButton from "@/components/SubmitButton";

function NewInvoicePage() {
  const [actionState, setActionState] = useState("ready");

  async function handleOnSubmit(event: SyntheticEvent) {
    if (actionState === "pending") {
      event.preventDefault();
      return;
    }
    setActionState("pending");
  }
  return (
    <main className="flex flex-col justify-center max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Create Invoice</h1>
      </div>
      <Form
        action={createAction}
        onSubmit={handleOnSubmit}
        className="grid gap-4 max-w-xs"
      >
        <div>
          <Label className="block font-semibold text-sm mb-2" htmlFor="name">
            Billing Name
          </Label>
          <Input id="name" name="name" type="text" />
        </div>
        <div>
          <Label className="block font-semibold text-sm mb-2" htmlFor="email">
            Billing Email
          </Label>
          <Input type="email" id="email" name="email" />
        </div>
        <div>
          <Label className="block font-semibold text-sm mb-2" htmlFor="value">
            Value
          </Label>
          <Input type="text" id="value" name="value" />
        </div>
        <div>
          <Label
            className="block font-semibold text-sm mb-2"
            htmlFor="description"
          >
            Description
          </Label>
          <Textarea id="description" name="description" />
        </div>
        <SubmitButton />
      </Form>
    </main>
  );
}

export default NewInvoicePage;
