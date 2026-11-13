import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NotFoundScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f1ea] px-4">
      <Card className="max-w-md border-0 bg-[#fffaf3] text-center shadow-[0_20px_60px_rgba(68,35,10,0.12)]">
        <CardHeader>
          <CardTitle as="h1" tabIndex={-1} className="text-3xl font-semibold">
            Page not found
          </CardTitle>
          <CardDescription>
            That route doesn’t exist yet. Head back to the home deck screen.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button type="button" onClick={() => window.location.assign("/")}>
            Back home
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
