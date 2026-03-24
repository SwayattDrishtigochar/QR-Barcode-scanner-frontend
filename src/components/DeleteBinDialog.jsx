import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

function DeleteBinDialog({ open, scanLabel, isDeleting, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={isDeleting ? undefined : onCancel}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirm delete bin"
        className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Delete Scanned Bin
            </h3>
            <p className="text-sm text-slate-600">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          You are deleting:{" "}
          <span className="font-semibold text-slate-900">{scanLabel}</span>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBinDialog;
