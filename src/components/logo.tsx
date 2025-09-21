import { cn } from "@/lib/utils";
import { Gem } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <Gem className={cn("w-12 h-12 text-primary", className)} />
  );
}