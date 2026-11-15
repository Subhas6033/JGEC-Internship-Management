import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { Card, Button } from "../../../../Components/index";
import { Reveal, Item } from "./MotionBlocks";
import { staggerFast, fadeIn } from "../../../../Animations/animations";

const StatusBadge = ({ status }) => {
  const styles = {
    approved_by_spoc: "bg-amber-50 text-amber-700",
    noc_generated: "bg-green-50 text-green-700",
    generated: "bg-green-50 text-green-700",
    Pending: "bg-amber-50 text-amber-700",
    "Under Review": "bg-blue-50 text-blue-700",
  };

  const labels = {
    approved_by_spoc: "Awaiting NOC",
    noc_generated: "NOC Generated",
    generated: "Generated",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {labels[status] || status || "Unknown"}
    </span>
  );
};

const formatDate = (date) => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PendingNOCs = ({ data = [], onViewAll, onViewNOC }) => {
  const pendingNOCs = Array.isArray(data) ? data : [];

  return (
    <Card>
      <Card.Header className="flex flex-row items-center justify-between gap-3">
        <div>
          <Card.Title>Pending NOC Requests</Card.Title>
          <p className="mt-1 text-sm text-ink-muted">
            Requests requiring administrative attention
          </p>
        </div>

        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View all <ArrowUpRight size={15} aria-hidden="true" />
        </Button>
      </Card.Header>

      <Card.Content>
        {pendingNOCs.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm font-medium text-ink">
              No pending NOC requests
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              New requests will appear here.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-162.5 text-left">
              <thead>
                <tr className="border-b border-border text-xs text-ink-muted">
                  <th scope="col" className="pb-3 font-medium">
                    Student
                  </th>
                  <th scope="col" className="pb-3 font-medium">
                    Organisation
                  </th>
                  <th scope="col" className="pb-3 font-medium">
                    Submitted
                  </th>
                  <th scope="col" className="pb-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="pb-3 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Rows fade only: CSS transforms on <tr> are unreliable across browsers. */}
              <Reveal as="tbody" variants={staggerFast}>
                {pendingNOCs.map((noc) => (
                  <Item
                    as="tr"
                    variants={fadeIn}
                    key={noc._id}
                    className="border-b border-border/70 last:border-0"
                  >
                    <td className="py-4">
                      <p className="text-sm font-medium text-ink">
                        {noc.student || "Unknown student"}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {noc.studentId || "—"} · {noc.department || "—"}
                      </p>
                    </td>
                    <td className="py-4 text-sm text-ink">
                      {noc.organisation || "—"}
                    </td>
                    <td className="py-4 text-xs text-ink-muted">
                      {formatDate(noc.submittedAt)}
                    </td>
                    <td className="py-4">
                      <StatusBadge status={noc.status} />
                    </td>
                    <td className="py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onViewNOC?.(noc)}
                        aria-label={`View NOC request for ${noc.student || noc._id}`}
                        className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-cream-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                      >
                        <MoreHorizontal size={19} aria-hidden="true" />
                      </button>
                    </td>
                  </Item>
                ))}
              </Reveal>
            </table>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default PendingNOCs;
