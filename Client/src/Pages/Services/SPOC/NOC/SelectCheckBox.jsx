import { useEffect, useRef } from "react";

const SelectCheckbox = ({
  checked,
  indeterminate = false,
  disabled = false,
  onChange,
  label,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      className="size-4 cursor-pointer rounded border-gray-300 accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
};

export default SelectCheckbox;
