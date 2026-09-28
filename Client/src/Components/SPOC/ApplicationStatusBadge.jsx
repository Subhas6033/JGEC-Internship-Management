const styles = {
  pending: {
    label: "Pending Review",
    className:
      "border-[var(--color-warning)]/20 bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
  },

  approved: {
    label: "Approved",
    className:
      "border-brand-200 bg-brand-50 text-brand-700",
  },

  noc: {
    label: "NOC Generated",
    className:
      "border-info/20 bg-info/10 text-info",
  },
};

const ApplicationStatusBadge = ({ status }) => {
  const current = styles[status] ?? styles.pending;

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1",
        "text-[11px] font-semibold",
        current.className,
      ].join(" ")}
    >
      {current.label}
    </span>
  );
};

export default ApplicationStatusBadge;