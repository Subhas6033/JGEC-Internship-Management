import { CalendarClock, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "../../../../Components";

import DeadlineCard from "./DeadlineCard";
import { applicationGroups } from "../Applications/application.data.js";

const InternshipDeadlines = () => {
  const [groups, setGroups] = useState(applicationGroups);

  const handleEdit = (group) => {
    console.log("Edit deadline:", group);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-350">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-700 text-white">
                <CalendarClock size={18} />
              </span>

              <p className="eyebrow">Department TPO</p>
            </div>

            <h1 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
              Internship Deadlines
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-ink-muted">
              Set and manage application deadlines for internship opportunities.
            </p>
          </div>

          <Button type="button" variant="primary" size="md">
            <Plus size={16} />
            Set Deadline
          </Button>
        </section>

        <div className="mt-6 space-y-4">
          {groups.map((group) => (
            <DeadlineCard key={group.id} group={group} onEdit={handleEdit} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InternshipDeadlines;
