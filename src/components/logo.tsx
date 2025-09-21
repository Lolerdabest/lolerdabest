import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <Shield className={cn("w-12 h-12 text-primary", className)} style={{ filter: 'drop-shadow(0 0 5px hsl(var(--primary)))' }}/>
  );
}
