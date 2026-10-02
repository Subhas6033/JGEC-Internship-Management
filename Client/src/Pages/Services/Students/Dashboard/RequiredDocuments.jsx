import { ArrowRight, Check, CircleAlert } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "../../../../Components/index";

const RequiredDocuments = ({ documents = [] }) => {
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
          <ArrowRight size={15} strokeWidth={1.9} />
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {documents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-white/50 px-4 py-6 text-center">
            <CircleAlert
              size={20}
              className="mx-auto text-ink-muted"
              strokeWidth={1.8}
            />

            <p className="mt-2 text-sm font-medium text-ink">
              No required documents
            </p>

            <p className="mt-1 text-xs leading-5 text-ink-muted">
              Required documents will appear here when they are available.
            </p>
          </div>
        ) : (
          documents.map((document) => {
            const completed = document.status === "completed";

            return (
              <div
                key={document.id || document._id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {completed ? (
                    <Check
                      size={16}
                      className="shrink-0 text-brand-700"
                      strokeWidth={2}
                    />
                  ) : (
                    <CircleAlert
                      size={16}
                      className="shrink-0 text-ink"
                      strokeWidth={1.8}
                    />
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
          })
        )}
      </div>
    </Card>
  );
};

export default RequiredDocuments;
