import { cn } from "@/lib/utils";

export type SectionHeadingProps = {
  align?: "center" | "left";
  className?: string;
  description?: string;
  eyebrow: string;
  id?: string;
  inverted?: boolean;
  title: string;
};

export function SectionHeading({
  align = "left",
  className,
  description,
  eyebrow,
  id,
  inverted = false,
  title,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", className)}>
      <p
        className={cn(
          "text-sm font-bold tracking-[0.18em] uppercase",
          inverted ? "text-white/90" : "text-secondary",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl",
          inverted ? "text-white" : "text-foreground",
        )}
        id={id}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-7 sm:text-lg",
            align === "center" && "mx-auto",
            inverted ? "text-white/75" : "text-foreground/70",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
