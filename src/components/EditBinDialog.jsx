import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select, SelectItem } from "./Select";

function EditBinDialog({
  open,
  scanLabel,
  initialBinSize,
  binSizeOptions = [],
  isSaving,
  onCancel,
  onConfirm,
}) {
  const [binSize, setBinSize] = useState(initialBinSize || "");
  const [isCustom, setIsCustom] = useState(false);
  const [customBinValue, setCustomBinValue] = useState("");

  useEffect(() => {
    if (open) {
      const normalizedInitialBin = initialBinSize || "";
      const isInitialCustom =
        normalizedInitialBin &&
        !["small", "medium", "large"].includes(
          normalizedInitialBin.toLowerCase(),
        );

      setBinSize(normalizedInitialBin);
      setIsCustom(Boolean(isInitialCustom));
      setCustomBinValue(isInitialCustom ? normalizedInitialBin : "");
    }
  }, [open, initialBinSize]);

  if (!open) return null;

  const handleSubmit = () => {
    onConfirm(binSize);
  };

  const handleBinSizeChange = (value) => {
    if (value === "custom") {
      setIsCustom(true);
      setBinSize("");
      setCustomBinValue("");
    } else {
      setBinSize(value);
      setIsCustom(false);
      setCustomBinValue("");
    }
  };

  const handleCustomBinChange = (e) => {
    const value = e.target.value;
    setCustomBinValue(value);
    setBinSize(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={isSaving ? undefined : onCancel}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit bin size"
        className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Edit Bin Size
            </h3>
            <p className="text-sm text-slate-600">
              Update the bin size for this scanned bin.
            </p>
          </div>
        </div>

        <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          Scanned bin:{" "}
          <span className="font-semibold text-slate-900">{scanLabel}</span>
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Select Bin Size
          </label>
          <Select
            value={isCustom ? "custom" : binSize}
            onValueChange={handleBinSizeChange}
            disabled={isSaving}
          >
            <SelectItem value="small">Small Bin</SelectItem>
            <SelectItem value="medium">Medium Bin</SelectItem>
            <SelectItem value="large">Large Bin</SelectItem>

            {binSizeOptions.length > 0 && (
              <>
                {binSizeOptions
                  .filter(
                    (value) =>
                      !["small", "large", "medium"].includes(
                        value.toLowerCase(),
                      ),
                  )
                  .map((customValue, index) => (
                    <SelectItem
                      key={`custom-${index}`}
                      value={customValue}
                      className="font-bold capitalize"
                    >
                      {customValue}
                    </SelectItem>
                  ))}
              </>
            )}

            <SelectItem value="custom">📦Custom Size</SelectItem>
          </Select>

          {isCustom && (
            <div className="mt-3 animate-slide-up">
              <Input
                placeholder="Enter custom bin size..."
                value={customBinValue}
                onChange={handleCustomBinChange}
                className="w-full"
                disabled={isSaving}
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditBinDialog;
