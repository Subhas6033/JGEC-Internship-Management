import { FileText } from "lucide-react";
import { DetailsCard } from "./DetailComponents";

export default function ApplicationDescription({ description }) {
  return (
    <DetailsCard
      icon={<FileText size={20} />}
      title="Application Description"
      description="The student's submitted internship details."
    >
      <div className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
        {description || "No application description provided."}
      </div>
    </DetailsCard>
  );
}
