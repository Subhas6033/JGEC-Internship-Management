import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { Card, Button } from "../../../../Components/index";
import { pendingNOCs } from "./dashboard.data";

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-700",
    "Under Review": "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

const PendingNOCs = () => {
  return (
    <Card>
      <Card.Header className="flex flex-row items-center justify-between gap-3">
        <div>
          <Card.Title>Pending NOC Requests</Card.Title>
          <p className="mt-1 text-sm text-ink-muted">
            Requests requiring administrative attention
          </p>
        </div>

        <Button variant="ghost" size="sm">
          View all <ArrowUpRight size={15} />
        </Button>
      </Card.Header>

      <Card.Content>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-162.5 text-left">
            <thead>
              <tr className="border-b border-border text-xs text-ink-muted">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Company</th>
                <th className="pb-3 font-medium">Submitted</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {pendingNOCs.map((noc) => (
                <tr
                  key={noc.id}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="py-4">
                    <p className="text-sm font-medium text-ink">
                      {noc.student}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {noc.id} · {noc.department}
                    </p>
                  </td>

                  <td className="py-4 text-sm text-ink">{noc.company}</td>

                  <td className="py-4 text-xs text-ink-muted">
                    {noc.submitted}
                  </td>

                  <td className="py-4">
                    <StatusBadge status={noc.status} />
                  </td>

                  <td className="py-4 text-right">
                    <button
                      type="button"
                      aria-label={`View ${noc.id}`}
                      className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-cream-soft hover:text-ink"
                    >
                      <MoreHorizontal size={19} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Content>
    </Card>
  );
};

export default PendingNOCs;
