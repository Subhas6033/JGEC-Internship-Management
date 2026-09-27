const ProfileSection = ({ title, description, children }) => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
};

export default ProfileSection;
