import { useEffect, useMemo, useState } from "react";
import { Download, Eye } from "lucide-react";
import { Button, Table } from "../../../../Components/index";
import { formatDate } from "./noc.utils";
import NocSection from "./NOCSection";
import { identityColumns } from "./NOCColumns";
import NocPagination from "./NocPagination";

const PAGE_SIZE = 10;

const GeneratedNocsSection = ({
  nocs,
  loading,
  activeAction,
  onView,
  onDownload,
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

  const columns = useMemo(
    () => [
      {
        key: "referenceNumber",
        header: "Reference No.",
        cellClassName: "whitespace-nowrap font-semibold text-ink",
      },
      ...identityColumns,
      {
        key: "generatedAt",
        header: "Generated On",
        cellClassName: "whitespace-nowrap",
        render: (noc) => formatDate(noc.generatedAt),
      },
      {
        key: "actions",
        header: "Actions",
        align: "right",
        render: (noc) => {
          const isActive = activeAction?.id === noc.id;
          const isViewing = isActive && activeAction.type === "view";
          const isDownloading = isActive && activeAction.type === "download";

          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(noc)}
                disabled={isActive}
              >
                <Eye size={15} aria-hidden="true" />
                {isViewing ? "Opening…" : "View"}
              </Button>

              <Button
                size="sm"
                onClick={() => onDownload(noc)}
                disabled={isActive}
              >
                <Download size={15} aria-hidden="true" />
                {isDownloading ? "Downloading…" : "Download"}
              </Button>
            </div>
          );
        },
      },
    ],
    [activeAction, onView, onDownload],
  );

  return (
    <NocSection
      title="Generated NOCs"
      description="Organisation-wise generated NOC records."
      meta={`${nocs.length} ${nocs.length === 1 ? "NOC" : "NOCs"}`}
    >
      <Table
        columns={columns}
        data={pageNocs}
        loading={loading}
        getRowKey={(noc) => noc.id}
        className="rounded-xl border-border bg-surface shadow-none"
        tableClassName="[&_thead]:bg-brand-50/60 [&_tbody_tr:hover]:bg-brand-50/30"
        emptyTitle="No NOCs generated"
        emptyDescription="NOCs will appear here once they are generated for approved applications."
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

export default GeneratedNocsSection;
