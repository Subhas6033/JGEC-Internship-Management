const cn = (...classes) => classes.filter(Boolean).join(" ");

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "box-border w-full min-w-0 max-w-full",
        "overflow-hidden",
        "rounded-xl border border-gray-200",
        "bg-white text-gray-950",
        "shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col",
        "space-y-1.5",
        "p-4 sm:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3
      className={cn(
        "min-w-0 max-w-full",
        "wrap-break-word",
        "text-base font-semibold",
        "leading-tight tracking-tight",
        "sm:text-lg sm:leading-none",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className, ...props }) => {
  return (
    <p
      className={cn(
        "min-w-0 max-w-full",
        "wrap-break-word",
        "text-xs leading-5",
        "text-gray-500",
        "sm:text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "min-w-0 max-w-full",
        "p-4 pt-0",
        "sm:p-6 sm:pt-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full",
        "flex-wrap items-center",
        "gap-2",
        "p-4 pt-0",
        "sm:p-6 sm:pt-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
