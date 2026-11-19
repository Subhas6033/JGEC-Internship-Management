const DashboardHeader = ({ onNavigate }) => {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          SPOC Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor student applications and placement activities.
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
