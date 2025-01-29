import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col justify-center h-full text-center max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold">Invoicipedia</h1>
      <p>
        <Button asChild>
          <a href="/dashboard">Sign in</a>
        </Button>
      </p>
    </main>
  );
}
