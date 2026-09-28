import {
  Building2,
  CalendarDays,
  Download,
  FileCheck2,
  MapPin,
  UsersRound,
} from "lucide-react";
import { Button, Card } from "../index";

const NocCard = ({ noc, onView, onDownload }) => {
  const {
    referenceNumber,
    company,
    location,
    generatedDate,
    students = [],
    department,
  } = noc;

  return (
    <Card
      className="
        flex h-full w-full min-w-0 flex-col
        overflow-hidden
        border-border
        bg-surface
        shadow-(--shadow-card)
        transition-shadow duration-200
        hover:shadow-(--shadow-card-hover)
      "
    >
      <Card.Content
        className="
          flex h-full min-w-0 flex-col
          p-4
          sm:p-5
        "
      >
        {/* Header */}
        <div
          className="
            mt-3 flex min-w-0
            items-start justify-between
            gap-3
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="
                flex size-10 shrink-0
                items-center justify-center
                rounded-lg
                bg-brand-100
                text-brand-700
                sm:size-11
              "
            >
              <Building2 size={19} strokeWidth={2} />
            </span>

            <div className="min-w-0 p-5">
              <h3
                className="
                  truncate
                  text-sm font-bold
                  text-ink
                  sm:text-base
                "
                title={company}
              >
                {company}
              </h3>

              <div
                className="
                  mt-1 flex min-w-0
                  items-center gap-1.5
                  text-xs text-ink-muted
                "
              >
                <MapPin size={13} className="shrink-0" />

                <span className="truncate">{location}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <span
            className="
              flex shrink-0 items-center gap-1.5
              rounded-full
              border border-brand-200
              bg-brand-50
              px-2.5 py-1
              text-[10px] font-semibold
              text-brand-700
              sm:text-xs
            "
          >
            <FileCheck2 size={13} />
            Generated
          </span>
        </div>

        {/* Reference Number */}
        <div
          className="
            mt-5
            rounded-lg
            border border-brand-200
            bg-brand-50
            p-3.5
          "
        >
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.06em]
              text-brand-700
              sm:text-[11px]
            "
          >
            NOC Reference Number
          </p>

          <p
            className="
              mt-1
              break-all
              text-xs
              font-semibold
              leading-5
              text-brand-900
              sm:text-sm
            "
          >
            {referenceNumber}
          </p>
        </div>

        {/* Information */}
        <div
          className="
            mt-4
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
          "
        >
          <div
            className="
              min-w-0
              rounded-lg
              bg-cream
              p-3
            "
          >
            <div
              className="
                flex items-center gap-2
                text-xs
                text-ink-muted
              "
            >
              <UsersRound size={14} className="shrink-0" />

              <span>Selected Students</span>
            </div>

            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-ink
              "
            >
              {students.length} {students.length === 1 ? "Student" : "Students"}
            </p>
          </div>

          <div
            className="
              min-w-0
              rounded-lg
              bg-cream
              p-3
            "
          >
            <div
              className="
                flex items-center gap-2
                text-xs
                text-ink-muted
              "
            >
              <CalendarDays size={14} className="shrink-0" />

              <span>Generated Date</span>
            </div>

            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-ink
              "
            >
              {generatedDate}
            </p>
          </div>
        </div>

        {/* Department */}
        {department && (
          <div
            className="
              mt-3
              rounded-lg
              border border-border
              bg-cream-soft
              px-3 py-2.5
            "
          >
            <p className="text-xs text-ink-muted">Department</p>

            <p className="mt-0.5 text-sm font-medium text-ink">{department}</p>
          </div>
        )}

        {/* Students */}
        <div className="mt-4 min-w-0">
          <p className="text-xs font-semibold text-ink">Students</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {students.map((student) => (
              <span
                key={student.id}
                className="
                  max-w-full
                  rounded-md
                  border border-border
                  bg-cream
                  px-2.5 py-1.5
                  text-xs
                  text-ink-muted
                "
                title={`${student.name} · ${student.rollNo}`}
              >
                <span className="font-medium text-ink">{student.name}</span>

                <span className="mx-1">·</span>

                <span>{student.rollNo}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div
          className="
            mt-auto
            flex flex-col gap-2
            pt-5
            sm:flex-row
            sm:justify-end
          "
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onView?.(noc)}
            className="
              w-full
              border-border
              bg-transparent
              text-ink
              hover:bg-cream
              sm:w-auto
            "
          >
            View NOC
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => onDownload?.(noc)}
            className="
              w-full
              bg-brand-700
              text-white
              hover:bg-brand-800
              sm:w-auto
            "
          >
            <Download size={15} className="mr-2" />
            Download
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default NocCard;
