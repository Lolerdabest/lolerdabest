import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-8 h-8 text-accent", className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      <g className="group">
        <rect width="100" height="100" className="fill-current" />
        <rect x="25" y="25" width="50" height="50" className="fill-background" />
        <path d="M25,25 L37.5,37.5 M75,25 L62.5,37.5 M25,75 L37.5,62.5 M75,75 L62.5,62.5" strokeWidth="12.5" className="stroke-current transition-colors duration-300 group-hover:stroke-primary" />
      </g>
    </svg>
  );
}
