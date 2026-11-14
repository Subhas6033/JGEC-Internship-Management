import { CheckCircle2, XCircle } from "lucide-react";

const StudentStatus = ({ status }) => {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {isActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}

      {status}
    </span>
  );
};

export default StudentStatus;
