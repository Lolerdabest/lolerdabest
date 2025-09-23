import { cn } from "@/lib/utils";
import { Dice5 } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <Dice5 className={cn("w-12 h-12 text-primary", className)} />
  );
}
