import { FileCheck2, LockKeyhole } from "lucide-react";

const DocumentSection = ({
  title,
  description,
  children,
  readOnly = false,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 size={19} className="text-primary" />

            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        {readOnly && (
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <LockKeyhole size={13} />
            Read only
          </div>
        )}
      </div>

      {children}
    </section>
  );
};

export default DocumentSection;
