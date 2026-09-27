const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium " +
  "cursor-pointer transition-colors duration-150 outline-none " +
  "focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",

  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500",

  outline:
    "border border-gray-300 bg-transparent text-gray-900 " +
    "hover:bg-gray-100 focus-visible:ring-gray-500",

  ghost:
    "bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500",

  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

const cn = (...classes) => classes.filter(Boolean).join(" ");

const Button = ({
  children,
  className,
  size = "md",
  variant = "primary",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
