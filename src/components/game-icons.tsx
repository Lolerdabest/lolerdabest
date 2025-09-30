
import { cn } from "@/lib/utils";

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "32",
  height: "32",
  viewBox: "0 0 32 32",
  fill: "none",
};

export function RouletteIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={cn("text-current", className)}>
      <path
        d="M26 16C26 21.5228 21.5228 26 16 26C10.4772 26 6 21.5228 6 16C6 10.4772 10.4772 6 16 6C21.5228 6 26 10.4772 26 16Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M16 6V3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M26 16H29"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M16 26V29"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M6 16H3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M22.0996 9.90039L24.2217 7.77832"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M22.0996 22.0996L24.2217 24.2217"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M9.90039 22.0996L7.77832 24.2217"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M9.90039 9.90039L7.77832 7.77832"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CoinflipIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={cn("text-current", className)}>
      <path
        d="M13 23C18.5228 23 23 18.5228 23 13C23 7.47715 18.5228 3 13 3C7.47715 3 3 7.47715 3 13C3 18.5228 7.47715 23 13 23Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 29C24.5228 29 29 24.5228 29 19C29 13.4772 24.5228 9 19 9C13.4772 9 9 13.4772 9 19C9 24.5228 13.4772 29 19 29Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MinesIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={cn("text-current", className)}>
      <path
        d="M26.25 15.5C26.25 17.5201 25.5915 19.4565 24.4442 20.941C23.2969 22.4255 21.7404 23.3576 20 23.59V23.59C16.3636 24.1295 13.6364 24.1295 12 23.59V23.59C10.2596 23.3576 8.70309 22.4255 7.55585 20.941C6.40861 19.4565 5.75 17.5201 5.75 15.5V11.25L7.5625 8.5625C9.4375 6.625 12.3125 5.75 16 5.75C19.6875 5.75 22.5625 6.625 24.4375 8.5625L26.25 11.25V15.5Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 26V23.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TowersIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={cn("text-current", className)}>
      <path
        d="M16 4L23 9.5V20.5L16 26L9 20.5V9.5L16 4Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9.5L16 13.5L23 9.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 26V13.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
