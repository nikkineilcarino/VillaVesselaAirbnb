import type {
  RecentInquiry,
  RecentLinkActivity,
  RecentPageActivity,
} from "@/types/dashboard";

function readableLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function EmptyTableState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-muted/45 px-5 py-8 text-center">
      <p className="text-sm leading-6 text-foreground/65">{message}</p>
    </div>
  );
}

type TableShellProps = {
  children: React.ReactNode;
  description: string;
  title: string;
};

function TableShell({ children, description, title }: TableShellProps) {
  return (
    <article className="rounded-card border border-border bg-surface p-5 shadow-soft sm:p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-foreground/60">{description}</p>
      <div className="mt-4">{children}</div>
    </article>
  );
}

export function DashboardActivityTables({
  inquiries,
  links,
  pages,
  showInquiries,
}: {
  inquiries: RecentInquiry[];
  links: RecentLinkActivity[];
  pages: RecentPageActivity[];
  showInquiries: boolean;
}) {
  return (
    <section aria-labelledby="recent-activity-heading" className="mt-9">
      <p className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
        Latest records
      </p>
      <h2 className="mt-2 text-2xl font-semibold" id="recent-activity-heading">
        Recent activity
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/60">
        Each table is limited to the 15 newest records in the selected period. Times use Asia/Manila.
      </p>

      <div className="mt-4 grid gap-5">
        <TableShell
          description="Anonymous route activity; full event and visitor IDs are intentionally hidden."
          title="Recent page activity"
        >
          {pages.length === 0 ? (
            <EmptyTableState message="No page activity was recorded in this period." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[58rem] border-collapse text-left text-sm">
                <caption className="sr-only">Fifteen most recent page-view records</caption>
                <thead>
                  <tr>
                    {["Date and time", "Visitor", "Page", "Device", "Browser", "Referrer"].map((header) => (
                      <th className="border-b border-border px-3 py-3 font-semibold" key={header} scope="col">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pages.map((row, index) => (
                    <tr key={`${row.occurredAt}-${row.visitorLabel}-${index}`}>
                      <td className="border-b border-border/65 px-3 py-3 whitespace-nowrap">{row.occurredAt}</td>
                      <td className="border-b border-border/65 px-3 py-3 font-mono text-xs">{row.visitorLabel}</td>
                      <td className="border-b border-border/65 px-3 py-3 font-medium">{row.path}</td>
                      <td className="border-b border-border/65 px-3 py-3">{readableLabel(row.device)}</td>
                      <td className="border-b border-border/65 px-3 py-3">{readableLabel(row.browser)}</td>
                      <td className="border-b border-border/65 px-3 py-3">{row.referrer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TableShell>

        <TableShell
          description="Approved destination types only; destination URLs and full identifiers are not displayed."
          title="Recent link clicks"
        >
          {links.length === 0 ? (
            <EmptyTableState message="No external-link clicks were recorded in this period." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
                <caption className="sr-only">Fifteen most recent external-link click records</caption>
                <thead>
                  <tr>
                    {["Date and time", "Visitor", "Link type", "Source page"].map((header) => (
                      <th className="border-b border-border px-3 py-3 font-semibold" key={header} scope="col">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {links.map((row, index) => (
                    <tr key={`${row.occurredAt}-${row.visitorLabel}-${index}`}>
                      <td className="border-b border-border/65 px-3 py-3 whitespace-nowrap">{row.occurredAt}</td>
                      <td className="border-b border-border/65 px-3 py-3 font-mono text-xs">{row.visitorLabel}</td>
                      <td className="border-b border-border/65 px-3 py-3">{readableLabel(row.linkType)}</td>
                      <td className="border-b border-border/65 px-3 py-3 font-medium">{row.sourcePage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TableShell>

        {showInquiries ? (
          <TableShell
            description="Contact method is summarized without exposing an email address or phone number in this overview."
            title="Recent inquiries"
          >
            {inquiries.length === 0 ? (
              <EmptyTableState message="No inquiries were received in this period." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
                  <caption className="sr-only">Fifteen most recent inquiry records</caption>
                  <thead>
                    <tr>
                      {["Date", "Guest name", "Contact method", "Preferred dates", "Guests", "Status"].map((header) => (
                        <th className="border-b border-border px-3 py-3 font-semibold" key={header} scope="col">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((row, index) => (
                      <tr key={`${row.occurredAt}-${row.name}-${index}`}>
                        <td className="border-b border-border/65 px-3 py-3 whitespace-nowrap">{row.occurredAt}</td>
                        <td className="border-b border-border/65 px-3 py-3 font-medium">{row.name}</td>
                        <td className="border-b border-border/65 px-3 py-3">{row.contactMethod}</td>
                        <td className="border-b border-border/65 px-3 py-3 whitespace-nowrap">{row.preferredDates}</td>
                        <td className="border-b border-border/65 px-3 py-3">{row.guestCount ?? "Not provided"}</td>
                        <td className="border-b border-border/65 px-3 py-3">
                          <span className="inline-flex rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold">
                            {readableLabel(row.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TableShell>
        ) : null}
      </div>
    </section>
  );
}
