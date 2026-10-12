import { Search } from "lucide-react";

const ApplicationSearch = ({ value, onChange }) => (
  <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="relative">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search organisation, student, roll number or department..."
        aria-label="Search internship applications"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  </div>
);

export default ApplicationSearch;
