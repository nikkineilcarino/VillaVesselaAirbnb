import { Award, CalendarDays, Car, Footprints, MessageCircle, Star } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { trustIndicators } from "@/data/site";

const icons = [Star, MessageCircle, Award, CalendarDays, Footprints, Car] as const;

export function TrustIndicators() {
  return (
    <section aria-labelledby="trust-heading" className="border-b border-border bg-surface">
      <h2 className="sr-only" id="trust-heading">
        Villa Vessela trust indicators
      </h2>
      <Container className="grid grid-cols-2 gap-px py-4 sm:grid-cols-3 lg:grid-cols-6" size="wide">
        {trustIndicators.map((item, index) => {
          const Icon = icons[index];

          return (
            <div
              className="flex min-h-24 items-center gap-3 border-border px-3 py-4 sm:px-5 lg:border-r lg:last:border-r-0"
              key={item.label}
            >
              {Icon ? (
                <Icon aria-hidden="true" className="shrink-0 text-secondary" size={22} strokeWidth={1.7} />
              ) : null}
              <div>
                <p className="font-semibold text-foreground">{item.value}</p>
                <p className="mt-0.5 text-xs leading-5 text-foreground/75">{item.label}</p>
              </div>
            </div>
          );
        })}
      </Container>
      <p className="border-t border-border bg-background px-5 py-3 text-center text-xs leading-5 text-foreground/75">
        Rating and review information is based on the property&apos;s Airbnb listing.
        Airbnb does not endorse or manage this independent website.
      </p>
    </section>
  );
}
