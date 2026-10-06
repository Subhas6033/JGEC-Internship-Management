import { Download } from "lucide-react";
import { Button } from "../../../../Components";
import { downloadTpoApplicationsExcel } from "./tpoApplication.export";

const TpoApplicationExportButton = ({
  applications = [],
  year = "all",
  semester = "all",
  status = "all",
  search = "",
}) => {
  const handleDownload = () => {
    try {
      downloadTpoApplicationsExcel({
        applications,
        year,
        semester,
        status,
        search,
      });
    } catch (error) {
      console.error("Failed to export TPO applications:", error);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleDownload}
      disabled={applications.length === 0}
    >
      <Download className="h-4 w-4" />
      Export Excel
    </Button>
  );
};

export default TpoApplicationExportButton;
