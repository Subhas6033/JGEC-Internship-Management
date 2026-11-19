import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FilePlus2, LoaderCircle } from "lucide-react";
import { Button, Table } from "../../../../Components/index";
import { transitions } from "../../../../Animations/animations";
import { formatDate } from "./noc.utils";
import NocSection from "./NOCSection";
import SelectCheckbox from "./SelectCheckBox";
import { identityColumns } from "./NOCColumns";
import NocPagination from "./NocPagination";

const PAGE_SIZE = 10;

const PendingNocsSection = ({
  nocs,
  loading,
  selectedIds,
  generatingIds,
  onToggle,
  onToggleAll,
  onClearSelection,
  onGenerate,
}) => {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(nocs.length / PAGE_SIZE));
  const pageNocs = useMemo(
    () => nocs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [nocs, page],
  );

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  const selectedNocs = useMemo(
    () => nocs.filter((noc) => selectedIds.has(noc.id)),
    [nocs, selectedIds],
  );

  const selectableCount = nocs.filter(
    (noc) => !generatingIds.has(noc.id),
  ).length;
  const allSelected =
    selectableCount > 0 && selectedNocs.length === selectableCount;
  const someSelected = selectedNocs.length > 0 && !allSelected;

  const columns = useMemo(
    () => [
      {
        key: "select",
        header: (
          <SelectCheckbox
            label="Select all pending NOCs"
            checked={allSelected}
            indeterminate={someSelected}
            disabled={selectableCount === 0}
            onChange={onToggleAll}
          />
        ),
        width: "3rem",
        render: (noc) => (
          <SelectCheckbox
            label={`Select ${noc.studentName}`}
            checked={selectedIds.has(noc.id)}
            disabled={generatingIds.has(noc.id)}
            onChange={() => onToggle(noc.id)}
          />
        ),
      },
      ...identityColumns,
      {
        key: "approvedAt",
        header: "Approved On",
        cellClassName: "whitespace-nowrap",
        render: (noc) => formatDate(noc.approvedAt),
      },
      {
        key: "actions",
        header: "Actions",
        align: "right",
        render: (noc) => {
          const isGenerating = generatingIds.has(noc.id);

          return (
            <Button
              size="sm"
              onClick={() => onGenerate([noc])}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <FilePlus2 size={15} aria-hidden="true" />
              )}
              {isGenerating ? "Generating" : "Generate NOC"}
            </Button>
          );
        },
      },
    ],
    [
      allSelected,
      someSelected,
      selectableCount,
      selectedIds,
      generatingIds,
      onToggle,
      onToggleAll,
      onGenerate,
    ],
  );

  return (
    <NocSection
      title="Pending NOC Generation"
      description="Approved applications that are waiting for a NOC."
      meta={`${nocs.length} pending`}
    >
      <AnimatePresence initial={false}>
        {selectedNocs.length > 0 && (
          <motion.div
            key="bulk-actions"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transitions.fast}
            className="overflow-hidden"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
              <p className="text-sm font-medium text-brand-900">
                {selectedNocs.length} selected
              </p>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onClearSelection}>
                  Clear
                </Button>
                <Button size="sm" onClick={() => onGenerate(selectedNocs)}>
                  <FilePlus2 size={15} aria-hidden="true" />
                  Generate selected
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Table
        columns={columns}
        data={pageNocs}
        loading={loading}
        getRowKey={(noc) => noc.id}
        className="rounded-xl border-border bg-surface shadow-none"
        tableClassName="[&_thead]:bg-brand-50/60 [&_tbody_tr:hover]:bg-brand-50/30"
        emptyTitle="No pending NOCs"
        emptyDescription="Approved applications awaiting NOC generation will appear here."
      />
      <NocPagination
        page={page}
        pageCount={pageCount}
        total={nocs.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </NocSection>
  );
};

export default PendingNocsSection;
