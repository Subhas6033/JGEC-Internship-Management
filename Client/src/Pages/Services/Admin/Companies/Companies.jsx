import React, { useMemo, useState } from "react";
import { Building2, Plus, RefreshCw } from "lucide-react";
import { Card, Button, Dialog } from "../../../../Components/index";
import CompanyStats from "./CompanyStats";
import CompanyToolbar from "./CompanyToolbar";
import CompanyTable from "./CompaniesTable";
import CompanyForm from "./CompanyForm";
import CompanyDetails from "./CompanyDetails";
import { initialCompanies } from "./companies.data";

const Companies = () => {
  const [companies, setCompanies] = useState(initialCompanies);

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [status, setStatus] = useState("all");

  const [dialogType, setDialogType] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        company.name.toLowerCase().includes(searchValue) ||
        company.shortName.toLowerCase().includes(searchValue) ||
        company.email.toLowerCase().includes(searchValue);

      const matchesIndustry = !industry || company.industry === industry;

      const matchesStatus = status === "all" || company.status === status;

      return matchesSearch && matchesIndustry && matchesStatus;
    });
  }, [companies, search, industry, status]);

  const closeDialog = () => {
    setDialogType(null);
    setSelectedCompany(null);
  };

  const openAddDialog = () => {
    setSelectedCompany(null);
    setDialogType("add");
  };

  const openEditDialog = (company) => {
    setSelectedCompany(company);
    setDialogType("edit");
  };

  const openViewDialog = (company) => {
    setSelectedCompany(company);
    setDialogType("view");
  };

  const handleSaveCompany = (formData) => {
    if (dialogType === "edit" && selectedCompany) {
      setCompanies((prev) =>
        prev.map((company) =>
          company._id === selectedCompany._id
            ? { ...company, ...formData }
            : company,
        ),
      );
    } else {
      const newCompany = {
        ...formData,
        _id: crypto.randomUUID(),
        status: "Pending",
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setCompanies((prev) => [newCompany, ...prev]);
    }

    closeDialog();
  };

  const handleToggleStatus = (company) => {
    const nextStatus = company.status === "Active" ? "Inactive" : "Active";

    setCompanies((prev) =>
      prev.map((item) =>
        item._id === company._id ? { ...item, status: nextStatus } : item,
      ),
    );
  };

  const dialogTitle = {
    add: "Add New Organisation",
    edit: "Edit Organisation",
    view: "Organisation Details",
  };

  const dialogDescription = {
    add: "Enter the organisation information to register it in the portal.",
    edit: "Update the organisation information.",
    view: "View registered organisation information.",
  };

  return (
    <div className="min-h-screen min-w-0 space-y-6 bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
            <Building2 size={25} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Organisations Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage placement{" "}
              <span className="text-red-600 font-semibold">Organisations</span> and their
              registration status.
            </p>
          </div>
        </div>

        <Button onClick={openAddDialog}>
          <Plus size={18} />
          Add organisations
        </Button>
      </div>

      {/* Statistics */}
      <CompanyStats companies={companies} />

      {/* Main Content */}
      <Card>
        <Card.Header>
          <div className="flex flex-col gap-1">
            <Card.Title>Registered Organisations</Card.Title>

            <Card.Description>
              View, search and manage organisations registered with JGEC.
            </Card.Description>
          </div>
        </Card.Header>

        <Card.Content className="space-y-5">
          {/* Search and Filters */}
          <CompanyToolbar
            search={search}
            setSearch={setSearch}
            industry={industry}
            setIndustry={setIndustry}
            status={status}
            setStatus={setStatus}
            onAddCompany={openAddDialog}
          />

          {/* Results Information */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredCompanies.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {companies.length}
              </span>{" "}
              organisations
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setIndustry("");
                setStatus("all");
              }}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-blue-600"
            >
              <RefreshCw size={14} />
              Reset filters
            </button>
          </div>

          {/* Table */}
          <CompanyTable
            companies={filteredCompanies}
            onView={openViewDialog}
            onEdit={openEditDialog}
            onToggleStatus={handleToggleStatus}
          />
        </Card.Content>
      </Card>

      {/* Add / Edit / View Dialog */}
      <Dialog
        open={Boolean(dialogType)}
        onClose={closeDialog}
        title={dialogTitle[dialogType]}
        description={dialogDescription[dialogType]}
        size={dialogType === "view" ? "lg" : "xl"}
      >
        {dialogType === "view" ? (
          <CompanyDetails company={selectedCompany} />
        ) : (
          <CompanyForm
            key={selectedCompany?._id || "new-organisation"}
            initialData={selectedCompany}
            onSubmit={handleSaveCompany}
            onCancel={closeDialog}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Companies;
