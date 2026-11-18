import { Eye, Pencil, Trash2, Building2, ExternalLink } from "lucide-react";
import { Table } from "../../../../Components/index";
import { formatDate, getHostname, toAbsoluteUrl } from "./organisations.utils";

const iconButton =
  "rounded-md p-2 text-ink-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700";

const CompanyTable = ({ companies, onView, onEdit, onDelete }) => {
  const columns = [
    {
      key: "organisation",
      header: "Organisation",
      width: "300px",
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Building2 size={20} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">
              {c.organisationName}
            </p>
            {c.organisationSite && (
              <a
                href={toAbsoluteUrl(c.organisationSite)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-1 text-xs text-brand-700 hover:underline"
              >
                <span className="truncate">
                  {getHostname(c.organisationSite)}
                </span>
                <ExternalLink
                  size={11}
                  aria-hidden="true"
                  className="shrink-0"
                />
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "organisationLocation",
      header: "Location",
      render: (c) => (
        <span className="text-ink">{c.organisationLocation || "—"}</span>
      ),
    },
    {
      key: "organisationMail",
      header: "Contact",
      render: (c) =>
        c.organisationMail ? (
          <a
            href={`mailto:${c.organisationMail}`}
            className="block max-w-56 truncate text-ink-muted hover:text-brand-700"
          >
            {c.organisationMail}
          </a>
        ) : (
          "—"
        ),
    },
    {
      key: "createdAt",
      header: "Registered",
      render: (c) => (
        <span className="whitespace-nowrap text-ink-muted">
          {formatDate(c.createdAt)}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (c) => (
        <span className="whitespace-nowrap text-ink-muted">
          {formatDate(c.updatedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onView(c)}
            aria-label={`View ${c.organisationName}`}
            title="View"
            className={`${iconButton} hover:bg-cream-soft hover:text-ink hover:cursor-pointer`}
          >
            <Eye size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(c)}
            aria-label={`Edit ${c.organisationName}`}
            title="Edit"
            className={`${iconButton} hover:bg-cream-soft hover:text-ink hover:cursor-pointer`}
          >
            <Pencil size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(c)}
            aria-label={`Delete ${c.organisationName}`}
            title="Delete"
            className={`${iconButton} hover:bg-red-50 hover:text-red-600 hover:cursor-pointer`}
          >
            <Trash2 size={17} aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={companies}
      getRowKey={(c) => c._id}
      emptyTitle="No organisations found"
      emptyDescription="Try changing your search or filters, or add a new organisation."
    />
  );
};

export default CompanyTable;
