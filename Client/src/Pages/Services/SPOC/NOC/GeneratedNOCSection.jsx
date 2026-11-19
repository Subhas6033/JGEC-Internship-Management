import { useMemo } from "react";
import { Download, Eye } from "lucide-react";
import { Button, Table } from "../../../../Components/index";
import { formatDate } from "./noc.utils";
import NocSection from "./NOCSection";
import { identityColumns } from "./NOCColumns";

const GeneratedNocsSection = ({
  nocs,
  loading,
  activeAction,
  onView,
  onDownload,
}) => {
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
      description="Company-wise generated NOC records."
      meta={`${nocs.length} ${nocs.length === 1 ? "NOC" : "NOCs"}`}
    >
      <Table
        columns={columns}
        data={nocs}
        loading={loading}
        getRowKey={(noc) => noc.id}
        emptyTitle="No NOCs generated"
        emptyDescription="NOCs will appear here once they are generated for approved applications."
      />
    </NocSection>
  );
};

export default GeneratedNocsSection;
