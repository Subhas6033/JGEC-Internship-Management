import { AlertTriangle } from "lucide-react";
import { Button, Dialog } from "../../../../Components/index";

const DeleteOrganisationDialog = ({
  organisation,
  onConfirm,
  onCancel,
  isDeleting,
  error,
}) => (
  <Dialog
    open={Boolean(organisation)}
    onClose={isDeleting ? () => {} : onCancel}
    title="Delete organisation"
    description="This action cannot be undone."
    size="lg"
  >
    <div className="space-y-5">
      <div className="flex gap-3 rounded-xl bg-red-50 p-4">
        <AlertTriangle
          size={20}
          className="mt-0.5 shrink-0 text-red-600"
          aria-hidden="true"
        />
        <p className="text-sm text-red-800">
          You are about to permanently delete{" "}
          <span className="font-semibold">
            {organisation?.organisationName}
          </span>
          . Organisations that still have student applications or NOCs cannot be
          deleted.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse justify-end gap-3 border-t border-border pt-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Deleting…" : "Delete organisation"}
        </button>
      </div>
    </div>
  </Dialog>
);

export default DeleteOrganisationDialog;
