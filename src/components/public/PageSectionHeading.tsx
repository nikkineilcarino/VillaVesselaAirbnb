import { cn } from "@/lib/utils";

export type PageSectionHeadingProps = {
  align?: "center" | "left";
  description?: string;
  eyebrow: string;
  id: string;
  title: string;
};

export function PageSectionHeading({
  align = "left",
  description,
  eyebrow,
  id,
  title,
}: PageSectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className="text-sm font-bold tracking-[0.18em] text-secondary uppercase">{eyebrow}</p>
      <h2
        className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
        id={id}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-7 text-foreground/75 sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
