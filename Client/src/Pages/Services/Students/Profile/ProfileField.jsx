const ProfileField = ({ label, value, icon: Icon }) => {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {Icon && <Icon size={14} />}

        <span>{label}</span>
      </div>

      <p className="mt-2 wrap-break-word text-sm font-medium text-foreground">
        {value || "Not available"}
      </p>
    </div>
  );
};

export default ProfileField;
