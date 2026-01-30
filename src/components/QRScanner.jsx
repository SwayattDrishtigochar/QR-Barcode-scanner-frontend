import { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Plus, Trash2, X, QrCode } from "lucide-react";

const QRInput = ({
  onScan,
  scannedQRs,
  setScannedQRs,
  shouldFocus,
  setShouldFocus,
}) => {
  const [qrValue, setQrValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
      // Reset the focus trigger
      setTimeout(() => {
        if (typeof shouldFocus === "function") {
          shouldFocus(false);
        }
      }, 50);
    }
  }, [shouldFocus]);

  const addQRCode = () => {
    const trimmedValue = qrValue.trim();

    // Validation
    if (!trimmedValue) {
      setError("QR code cannot be empty");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (scannedQRs.includes(trimmedValue)) {
      setError("This QR code is already added");
      setTimeout(() => setError(""), 2000);
      return;
    }

    // Add QR code
    setScannedQRs((prev) => [...prev, trimmedValue]);
    onScan([trimmedValue]);
    setQrValue("");
    setError("");
  };

  const removeQRCode = (index) => {
    setScannedQRs((prev) => prev.filter((_, i) => i !== index));
  };

  const clearInput = () => {
    setQrValue("");
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addQRCode();
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              placeholder="Enter or scan QR code"
              value={qrValue}
              onChange={(e) => {
                setQrValue(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              // inputMode="none"
              autoFocus
              className={`pr-10 transition-all ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {qrValue && (
              <button
                onClick={clearInput}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                aria-label="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            onClick={addQRCode}
            disabled={!qrValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-200 disabled:text-slate-400 shadow-sm flex-shrink-0"
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs sm:text-sm text-red-600 animate-in slide-in-from-top-1 flex items-center gap-1">
            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
            {error}
          </p>
        )}

        {/* Helper Text */}
        {!error && scannedQRs.length === 0 && (
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
            <QrCode className="h-3.5 w-3.5" />
            Type a QR code value and press Enter or click Add
          </p>
        )}
      </div>

      {/* Scanned QR List */}
      {scannedQRs.length > 0 && (
        <div className="space-y-2">
          <div className="max-h-60 sm:max-h-80 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {scannedQRs.map((qr, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all animate-in slide-in-from-left-2"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="font-mono text-xs sm:text-sm text-slate-700 truncate flex-1">
                    {qr}
                  </span>
                </div>
                <Button
                  onClick={() => removeQRCode(index)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0 ml-2"
                  aria-label={`Remove ${qr}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {scannedQRs.length === 0 && !error && (
        <div className="text-center py-8 sm:py-12 px-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          <QrCode className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            No QR codes added yet
          </p>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Start by entering a QR code above
          </p>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default QRInput;
