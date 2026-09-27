import { FileText } from "lucide-react";

import DocumentListItem from "./DocumentListItem";

const DocumentList = ({ documents, onPreview }) => {
  if (!documents?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileText size={22} className="text-muted-foreground" />
        </div>

        <h3 className="font-medium text-foreground">No documents available</h3>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Your uploaded documents will appear here once they are submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <DocumentListItem
          key={document.id}
          document={document}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
};

export default DocumentList;
