const DepartmentStatus = ({ status }) => {
  const isActive = status === "Active";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 whitespace-nowrap
        rounded-full px-2.5 py-1 text-xs font-medium
        ${isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}
      `}
    >
      <span
        className={`size-1.5 rounded-full ${
          isActive ? "bg-green-600" : "bg-red-500"
        }`}
      />
      {status}
    </span>
  );
};

export default DepartmentStatus;
