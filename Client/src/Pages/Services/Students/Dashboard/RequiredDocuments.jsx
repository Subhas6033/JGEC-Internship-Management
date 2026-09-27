import { ArrowRight, Check, CircleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../../Components/index";
import { requiredDocuments } from "./dashboard.data";

const RequiredDocuments = () => {
  return (
    <Card className="border-border bg-cream-soft p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-ink-muted">Document status</p>

          <h2 className="mt-1 text-lg font-semibold text-ink">
            Required documents
          </h2>
        </div>

        <Link
          to="/students/documents"
          className="focus-ring inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          View
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {requiredDocuments.map((document) => {
          const completed = document.status === "completed";

          return (
            <div
              key={document.id}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                {completed ? (
                  <Check size={16} className="shrink-0 text-brand-700" />
                ) : (
                  <CircleAlert size={16} className="shrink-0 text-ink" />
                )}

                <span className="truncate text-sm text-ink">
                  {document.name}
                </span>
              </div>

              <span className="shrink-0 text-xs font-medium text-ink-muted">
                {completed ? "Complete" : "Pending"}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RequiredDocuments;
