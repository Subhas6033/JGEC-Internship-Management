import { ClipboardCheck } from "lucide-react";
import { DetailsCard, DetailItem } from "./DetailComponents";

export default function ReviewDetails({ review }) {
  return (
    <DetailsCard
      icon={<ClipboardCheck size={20} />}
      title="Review Details"
      description="Review information recorded for this application."
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <DetailItem label="TPO" value={review.tpoName} />
        <DetailItem label="SPOC" value={review.spocName} />
        <DetailItem label="Last Updated" value={review.updatedAt} />
        <DetailItem label="Review Remarks" value={review.remarks} />
      </div>
    </DetailsCard>
  );
}
