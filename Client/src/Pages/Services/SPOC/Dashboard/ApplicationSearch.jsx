import { Search } from "lucide-react";

const ApplicationSearch = ({ value, onChange }) => (
  <div className="mb-6 rounded-xl border border-border bg-surface p-4 shadow-[--shadow-card]">
    <div className="relative">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search organisation, student, roll number or department..."
        aria-label="Search internship applications"
        className="w-full rounded-xl border border-border bg-cream-soft py-3 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
      />
    </div>
  </div>
);

export default ApplicationSearch;
