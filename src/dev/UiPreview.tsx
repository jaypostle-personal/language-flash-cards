import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UiPreview() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-5 py-12">
      <Card className="w-full gap-0 overflow-visible">
        <CardHeader className="gap-2 border-b border-border/70 pb-5">
          <p className="text-xs font-bold tracking-[0.16em] text-coral-dark uppercase">
            Parola · UI preview
          </p>
          <CardTitle className="font-heading text-3xl">
            A little practice goes a long way
          </CardTitle>
          <CardDescription>
            Keyboard through the controls to check the visible focus treatment.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          <div className="grid gap-2">
            <label className="text-sm font-semibold" htmlFor="preview-answer">
              Your answer
            </label>
            <Input id="preview-answer" placeholder="Type an Italian word…" />
          </div>
          <div className="grid gap-2">
            <label
              className="text-sm font-semibold"
              htmlFor="preview-deck-size"
            >
              Words in this deck
            </label>
            <Select defaultValue="10">
              <SelectTrigger id="preview-deck-size">
                <SelectValue placeholder="Choose a deck size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 words · a quick start</SelectItem>
                <SelectItem value="20">20 words · keep going</SelectItem>
                <SelectItem value="50">50 words · immerse yourself</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Session progress</span>
              <span className="text-muted-foreground">4 of 10 mastered</span>
            </div>
            <Progress value={40} aria-label="Session progress" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>Start practicing</Button>
            <Button variant="outline">Secondary action</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
