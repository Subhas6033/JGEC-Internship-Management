import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Building2, Plus, RefreshCw } from "lucide-react";
import { Card, Button, Dialog } from "../../../../Components/index";
import {
  fadeIn,
  heroContainer,
  heroItem,
  sectionAnimation,
} from "../../../../Animations/animations";
import { Reveal, Item } from "./MotionBlocks";
import CompanyStats from "./CompanyStats";
import CompanyToolbar from "./CompanyToolbar";
import CompanyTable from "./CompaniesTable";
import CompanyForm from "./CompanyForm";
import CompanyDetails from "./CompanyDetails";
import Pagination from "./Pagination";
import DeleteOrganisationDialog from "./DeleteOrganisationDialog";
import {
  DEFAULT_PAGE_SIZE,
  extractOrganisationsPage,
  getErrorMessage,
  parseSort,
  useDebouncedValue,
} from "./organisations.utils";
import {
  useOrganisations,
  useCreateOrganisation,
  useUpdateOrganisation,
  useDeleteOrganisation,
} from "../../../../Services/Queries/organisation.queries";

const DIALOG = {
  add: {
    title: "Add organisation",
    description: "Enter the organisation details to register it in the portal.",
  },
  edit: {
    title: "Edit organisation",
    description: "Update the organisation details.",
  },
  view: {
    title: "Organisation details",
    description: "Registered organisation information.",
  },
};

const Bone = ({ className = "" }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-md bg-brand-100 motion-reduce:animate-none ${className}`}
  />
);

const ListSkeleton = () => (
  <div role="status" className="space-y-4">
    <span className="sr-only">Loading organisations…</span>
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Bone className="size-10 shrink-0 rounded-lg!" />
        <div className="flex-1 space-y-2">
          <Bone className="h-3 w-1/3" />
          <Bone className="h-3 w-1/4" />
        </div>
        <Bone className="hidden h-3 w-32 sm:block" />
      </div>
    ))}
  </div>
);

const Companies = () => {
  /* ------------------------------ Query state ----------------------------- */
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("createdAt:desc");

  // Wait for the user to stop typing before calling the API.
  const debouncedSearch = useDebouncedValue(search, 400);

  const queryParams = useMemo(() => {
    const { sortBy, order } = parseSort(sort);
    return {
      page,
      limit,
      sortBy,
      order,
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      ...(location && { location }),
    };
  }, [page, limit, debouncedSearch, location, sort]);

  const {
    data: response,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    isPlaceholderData,
  } = useOrganisations(queryParams);

  const { organisations, pagination, stats, locations } = useMemo(
    () => extractOrganisationsPage(response),
    [response],
  );

  // The server clamps out-of-range pages (e.g. after deleting the last row of the last page).
  useEffect(() => {
    if (pagination.page && pagination.page !== page && !isPlaceholderData)
      setPage(pagination.page);
  }, [pagination.page, page, isPlaceholderData]);

  /* ------------------------------ Mutations ------------------------------- */
  const createMutation = useCreateOrganisation();
  const updateMutation = useUpdateOrganisation();
  const deleteMutation = useDeleteOrganisation();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const [dialogType, setDialogType] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [saveError, setSaveError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  /* ------------------------------- Handlers ------------------------------- */
  // Any filter change goes back to page 1.
  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };
  const handleLocationChange = (value) => {
    setLocation(value);
    setPage(1);
  };
  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };
  const handleLimitChange = (value) => {
    setLimit(value);
    setPage(1);
  };
  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setPage(1);
  };

  const openDialog = (type, company = null) => {
    setSaveError("");
    setSelectedCompany(company);
    setDialogType(type);
  };

  const closeDialog = () => {
    if (isSaving) return;
    setDialogType(null);
    setSelectedCompany(null);
    setSaveError("");
  };

  const handleSave = async (values) => {
    setSaveError("");

    try {
      if (dialogType === "edit" && selectedCompany) {
        await updateMutation.mutateAsync({
          id: selectedCompany._id,
          ...values,
        });
      } else {
        await createMutation.mutateAsync(values);
        // New records show up on page 1 when sorted by newest.
        if (sort === "createdAt:desc") setPage(1);
      }
      setDialogType(null);
      setSelectedCompany(null);
    } catch (err) {
      setSaveError(getErrorMessage(err, "Could not save the organisation."));
    }
  };

  const openDelete = (company) => {
    setDeleteError("");
    setDeleteTarget(company);
  };

  const closeDelete = () => {
    if (deleteMutation.isPending) return;
    setDeleteTarget(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError("");

    try {
      await deleteMutation.mutateAsync(deleteTarget._id);
      // Deleted the only row on this page → step back one page.
      if (organisations.length === 1 && page > 1) setPage((p) => p - 1);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(
        getErrorMessage(err, "Could not delete the organisation."),
      );
    }
  };

  const hasFilters = Boolean(search || location);

  /* -------------------------------- Render -------------------------------- */
  return (
    <div className="min-h-full min-w-0 bg-cream p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <Reveal
          variants={heroContainer}
          className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
          <Item variants={heroItem} className="flex items-start gap-3">
            <div className="rounded-xl bg-brand-50 p-3 text-brand-700">
              <Building2 size={25} aria-hidden="true" />
            </div>

            <div>
              <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                Organisations
              </h1>
              <p className="mt-1 text-sm text-ink-muted">
                Manage the organisations registered with JGEC.
              </p>
            </div>
          </Item>

          <Item variants={heroItem}>
            <Button onClick={() => openDialog("add")}>
              <Plus size={18} aria-hidden="true" />
              Add organisation
            </Button>
          </Item>
        </Reveal>

        <CompanyStats stats={stats} loading={isPending} />

        <Reveal variants={sectionAnimation}>
          <Card>
            <Card.Header>
              <div className="flex flex-col gap-1">
                <Card.Title>Registered organisations</Card.Title>
                <Card.Description>
                  View, search and manage organisations registered with JGEC.
                </Card.Description>
              </div>
            </Card.Header>

            <Card.Content className="space-y-5">
              {isPending ? (
                <ListSkeleton />
              ) : isError && organisations.length === 0 ? (
                <div role="alert" className="py-10 text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <AlertTriangle size={22} aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-ink">
                    Unable to load organisations
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {getErrorMessage(error)}
                  </p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => refetch()}
                    disabled={isFetching}
                  >
                    <RefreshCw
                      size={15}
                      className={isFetching ? "animate-spin" : ""}
                      aria-hidden="true"
                    />
                    {isFetching ? "Retrying…" : "Try again"}
                  </Button>
                </div>
              ) : (
                <>
                  <CompanyToolbar
                    search={search}
                    onSearchChange={handleSearchChange}
                    location={location}
                    onLocationChange={handleLocationChange}
                    locationOptions={locations}
                    sort={sort}
                    onSortChange={handleSortChange}
                    onClear={clearFilters}
                  />

                  {/* Fades in on every page change; dims while the next page loads. */}
                  <Reveal
                    key={`${page}-${limit}`}
                    variants={fadeIn}
                    aria-busy={isFetching}
                    className={`transition-opacity duration-200 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}
                  >
                    <CompanyTable
                      companies={organisations}
                      onView={(c) => openDialog("view", c)}
                      onEdit={(c) => openDialog("edit", c)}
                      onDelete={openDelete}
                    />
                  </Reveal>

                  {pagination.total === 0 && hasFilters && (
                    <p className="text-center text-sm text-ink-muted">
                      No organisations match your filters.
                    </p>
                  )}

                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    limit={pagination.limit}
                    onPageChange={setPage}
                    onLimitChange={handleLimitChange}
                    disabled={isPlaceholderData}
                  />
                </>
              )}
            </Card.Content>
          </Card>
        </Reveal>
      </div>

      <Dialog
        open={Boolean(dialogType)}
        onClose={closeDialog}
        title={DIALOG[dialogType]?.title}
        description={DIALOG[dialogType]?.description}
        size={dialogType === "view" ? "lg" : "xl"}
      >
        {dialogType === "view" ? (
          <CompanyDetails company={selectedCompany} />
        ) : (
          <CompanyForm
            key={selectedCompany?._id || "new-organisation"}
            initialData={selectedCompany}
            onSubmit={handleSave}
            onCancel={closeDialog}
            isSubmitting={isSaving}
            serverError={saveError}
          />
        )}
      </Dialog>

      <DeleteOrganisationDialog
        organisation={deleteTarget}
        onConfirm={handleDelete}
        onCancel={closeDelete}
        isDeleting={deleteMutation.isPending}
        error={deleteError}
      />
    </div>
  );
};

export default Companies;
