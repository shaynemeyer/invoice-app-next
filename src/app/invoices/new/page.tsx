import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

function NewInvoicePage() {
  return (
    <main className="flex flex-col justify-center max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Create Invoice</h1>
      </div>
      <form className="grid gap-4 max-w-xs">
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
          <Label className="block font-semibold text-sm mb-2" htmlFor="id">
            Value
          </Label>
          <Input type="text" id="id" name="id" />
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
        <Button className="w-full font-semibold">Submit</Button>
      </form>
    </main>
  );
}

export default NewInvoicePage;
