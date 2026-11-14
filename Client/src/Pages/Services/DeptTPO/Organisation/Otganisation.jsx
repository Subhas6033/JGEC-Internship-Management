import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Pencil, Plus, Search } from "lucide-react";
import {
  Button,
  Dialog,
  Input,
  Table,
  Toast,
} from "../../../../Components/index";
import OrganisationForm from "./OrganisationForm";
import OrganisationCard from "./OrganisationCard";
import Pagination from "./OrganisationPagination";
import { getMailLink } from "./organisationMail";
import {
  useOrganisations,
  useCreateOrganisation,
  useUpdateOrganisation,
} from "../../../../Services/Queries/organisation.queries";
import {
  pageAnimation,
  staggerContainer,
  fadeUp,
  toastAnimation,
  useAnimationVariants,
} from "../../../../Animations/animations";

const PAGE_SIZE = 10;

const buildColumns = (onEdit) => [
  {
    key: "organisationName",
    header: "Organisation",
    render: (row) => (
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
          <Building2 className="h-4 w-4" />
        </span>
        <span className="font-medium text-gray-900">
          {row.organisationName}
        </span>
      </div>
    ),
  },
  { key: "organisationLocation", header: "Location" },
  {
    key: "organisationMail",
    header: "Email",
    render: (row) =>
      row.organisationMail ? (
        <a {...getMailLink(row)} className="text-blue-600 hover:underline">
          {row.organisationMail}
        </a>
      ) : (
        "—"
      ),
  },
  {
    key: "organisationSite",
    header: "Website",
    render: (row) =>
      row.organisationSite ? (
        <a
          href={row.organisationSite}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline"
        >
          {row.organisationSite.replace(/^https?:\/\//, "")}
        </a>
      ) : (
        "—"
      ),
  },
  {
    key: "actions",
    header: "",
    align: "right",
    width: "6rem",
    render: (row) => (
      <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
    ),
  },
];

const Organisations = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const { data, isLoading, isError, error } = useOrganisations();
  const createMutation = useCreateOrganisation();
  const updateMutation = useUpdateOrganisation();
  const saving = createMutation.isPending || updateMutation.isPending;

  // apiClient returns the axios response, so the payload is data.data
  const organisations = useMemo(() => {
    const body = data?.data;
    if (Array.isArray(body)) return body;
    return body?.data ?? body?.organisations ?? [];
  }, [data]);

  const pageVariants = useAnimationVariants(pageAnimation);
  const listVariants = useAnimationVariants(staggerContainer);
  const toastVariants = useAnimationVariants(toastAnimation);
  const fadeVariants = useAnimationVariants(fadeUp);

  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (isError) {
      setToast({
        variant: "error",
        title: "Couldn't load organisations",
        message: error?.message || "Something went wrong.",
      });
    }
  }, [isError, error]);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = useCallback((organisation) => {
    setEditing(organisation);
    setDialogOpen(true);
  }, []);

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setEditing(null);
  };

  const columns = useMemo(() => buildColumns(openEdit), [openEdit]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return organisations;
    return organisations.filter((o) =>
      [o.organisationName, o.organisationLocation, o.organisationMail]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q)),
    );
  }, [organisations, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paged = useMemo(
    () =>
      filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (values) => {
    const isEdit = Boolean(editing);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: editing._id, ...values });
      } else {
        await createMutation.mutateAsync(values);
        setPage(1);
      }
      setDialogOpen(false);
      setEditing(null);
      setToast({
        variant: "success",
        title: isEdit ? "Organisation updated" : "Organisation added",
        message: isEdit
          ? `Changes to ${values.organisationName} were saved.`
          : `${values.organisationName} is now in your list.`,
      });
    } catch (err) {
      setToast({
        variant: "error",
        title: isEdit
          ? "Couldn't update organisation"
          : "Couldn't add organisation",
        message: err?.response?.data?.message || err.message,
      });
    }
  };

  const emptyTitle = query
    ? "No matching organisations"
    : "No organisations yet";
  const emptyDescription = query
    ? "Try a different name, location or email."
    : "Add your first organisation to start placement drives.";

  return (
    <motion.section
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full min-w-0 max-w-7xl px-4 py-6 sm:px-6 lg:py-10"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Organisations
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {isLoading
              ? "Loading organisations..."
              : `${organisations.length} registered for placements.`}
          </p>
        </div>

        <Button size="lg" onClick={openAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add organisation
        </Button>
      </div>

      {/* Search */}
      <div className="mt-6 max-w-md">
        <Input
          aria-label="Search organisations"
          placeholder="Search by name, location or email"
          value={query}
          onChange={handleSearch}
          startIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Desktop table */}
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        className="mt-6 hidden md:block"
      >
        <Table
          columns={columns}
          data={paged}
          loading={isLoading}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
        />
      </motion.div>

      {/* Mobile cards */}
      <div className="mt-6 md:hidden">
        {!isLoading && filtered.length === 0 ? (
          <Table
            columns={columns}
            data={[]}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        ) : (
          <motion.div
            key={`${query}-${currentPage}`}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {paged.map((org) => (
              <OrganisationCard
                key={org._id}
                organisation={org}
                onEdit={openEdit}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && (
        <Pagination
          page={currentPage}
          pageSize={PAGE_SIZE}
          totalItems={filtered.length}
          onPageChange={handlePageChange}
        />
      )}

      {/* Add / edit dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        title={editing ? "Edit organisation" : "Add organisation"}
        description={
          editing
            ? "Update the details of this organisation."
            : "Enter the details of the company visiting for placements."
        }
        size="lg"
      >
        <OrganisationForm
          initialValues={editing}
          onSubmit={handleSubmit}
          onCancel={closeDialog}
          submitting={saving}
        />
      </Dialog>

      {/* Toast */}
      <div className="pointer-events-none fixed inset-x-4 top-4 z-200 flex justify-end">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.title}
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-sm"
            >
              <Toast {...toast} onClose={closeToast} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default Organisations;
