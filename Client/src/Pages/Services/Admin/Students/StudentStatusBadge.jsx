const statusStyles = {
  Active: "bg-brand-50 text-brand-700",
  Inactive: "bg-gray-100 text-gray-600",
  Graduated: "bg-blue-50 text-blue-700",
};

const StudentStatusBadge = ({ status }) => {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-[11px] font-semibold",
        statusStyles[status] || "bg-gray-100 text-gray-600",
      ].join(" ")}
    >
      {status}
    </span>
  );
};

export default StudentStatusBadge;
