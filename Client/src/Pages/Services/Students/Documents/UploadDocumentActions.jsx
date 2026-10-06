import { RefreshCw, Upload } from "lucide-react";
import { Button } from "../../../../Components";

const UploadDocumentActions = ({
  signatureUploaded,
  resumeUploaded,
  onSignatureChange,
  onResumeChange,
  signatureLoading = false,
  resumeLoading = false,
}) => {
  return (
    <>
      {/* Signature */}
      <input
        id="student-signature-upload"
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={onSignatureChange}
        disabled={signatureLoading}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={signatureLoading}
        onClick={() =>
          document.getElementById("student-signature-upload")?.click()
        }
      >
        {signatureUploaded ? <RefreshCw size={15} /> : <Upload size={15} />}

        {signatureLoading
          ? "Uploading..."
          : signatureUploaded
            ? "Update Signature"
            : "Upload Signature"}
      </Button>

      {/* Resume */}
      <input
        id="student-resume-upload"
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={onResumeChange}
        disabled={resumeLoading}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={resumeLoading}
        onClick={() =>
          document.getElementById("student-resume-upload")?.click()
        }
      >
        {resumeUploaded ? <RefreshCw size={15} /> : <Upload size={15} />}

        {resumeLoading
          ? "Uploading..."
          : resumeUploaded
            ? "Update Resume"
            : "Upload Resume"}
      </Button>
    </>
  );
};

export default UploadDocumentActions;
