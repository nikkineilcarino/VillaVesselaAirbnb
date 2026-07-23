import { cn } from "@/lib/utils";

export function SampaguitaDivider({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-40 text-accent", className)}
      fill="none"
      viewBox="0 0 160 20"
    >
      <path d="M5 10h57m36 0h57" stroke="currentColor" strokeWidth="1" />
      <path
        d="M80 9.7c-5.7-5.2-9.7-4.8-10.3-1.4-.4 2.4 2.2 4.1 6.6 3.3-3.1 3.8-1.5 6.8 1.1 6.2 2.3-.5 3.2-3 2.7-6.4 2.6 3.6 5.8 3.4 6.5.9.7-2.4-1.3-4.3-5.1-4.1 3.2-2.7 2.2-5.6-.4-5.8-2.5-.2-3.4 2.3-1.1 7.3Z"
        fill="currentColor"
        opacity="0.92"
      />
      <circle cx="80" cy="10" fill="#fbfaf5" r="1.45" />
    </svg>
  );
}
