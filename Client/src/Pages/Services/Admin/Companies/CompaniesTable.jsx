import React from "react";
import { Eye, Pencil, Power, Building2, ExternalLink } from "lucide-react";
import {Table} from "../../../../Components/index";
import CompanyStatusBadge from "./CompanyStatusBadge";

const CompanyTable = ({ companies, onView, onEdit, onToggleStatus }) => {
  const columns = [
    {
      key: "company",
      header: "Company",
      width: "260px",
      render: (company) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Building2 size={20} />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-gray-900">{company.name}</p>
            <p className="text-xs text-gray-500">{company.shortName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "industry",
      header: "Industry",
      render: (company) => (
        <span className="text-gray-700">{company.industry}</span>
      ),
    },
    {
      key: "location",
      header: "Location",
    },
    {
      key: "email",
      header: "Contact",
      render: (company) => (
        <span className="block max-w-47.5 truncate text-gray-600">
          {company.email}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (company) => <CompanyStatusBadge status={company.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (company) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onView(company)}
            title="View company"
            className="rounded-md p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <Eye size={17} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(company)}
            title="Edit company"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus(company)}
            title={
              company.status === "Active"
                ? "Deactivate company"
                : "Activate company"
            }
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <Power size={17} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={companies}
      getRowKey={(company) => company._id}
      emptyTitle="No companies found"
      emptyDescription="Try changing your filters or add a new company."
    />
  );
};

export default CompanyTable;
