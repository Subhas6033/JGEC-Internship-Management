const StaffStatus = ({ status }) => {
  const styles = {
    Active: "bg-green-50 text-green-700 border-green-200",
    Inactive: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        styles[status] || styles.Inactive
      }`}
    >
      {status}
    </span>
  );
};

export default StaffStatus;
