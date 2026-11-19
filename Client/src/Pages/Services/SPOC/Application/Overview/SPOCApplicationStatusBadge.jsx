const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const SPOCApplicationStatusBadge = ({ status }) => {
  return (
    <span
      className={`
        inline-flex whitespace-nowrap rounded-full
        px-2.5 py-1 text-xs font-medium capitalize
        ${statusStyles[status] || "bg-cream text-ink"}
      `}
    >
      {status?.replaceAll("_", " ") || "Unknown"}
    </span>
  );
};

export default SPOCApplicationStatusBadge;
