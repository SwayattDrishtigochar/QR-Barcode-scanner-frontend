import { useState } from "react";
import QRInput from "./components/QRScanner";
import { Button } from "./components/Button";
import { Select, SelectItem } from "./components/Select";
import { Input } from "./components/Input";
import { scanService } from "./services/api";
import { Trash2, Package, CheckCircle, AlertCircle, Save } from "lucide-react";

function App() {
  const [scannedQRs, setScannedQRs] = useState([]);
  const [binSize, setBinSize] = useState("small");
  const [customBinValue, setCustomBinValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Handle QR input - always receives array
  const handleQRInput = (qrArray) => {
    // Show success feedback
    setMessage({
      type: "success",
      text: `Added ${qrArray.length} QR code${qrArray.length > 1 ? "s" : ""}`,
    });

    setTimeout(() => setMessage(null), 3000);
  };

  // Clear all scanned QRs
  const clearScannedQRs = () => {
    setScannedQRs([]);
    setMessage({
      type: "success",
      text: "Cleared all QR codes",
    });
    setTimeout(() => setMessage(null), 2000);
  };

  // Submit scan batch to backend
  const handleSubmit = async () => {
    if (scannedQRs.length === 0) {
      setMessage({
        type: "error",
        text: "Please add at least one QR code",
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (binSize === "custom" && !customBinValue.trim()) {
      setMessage({
        type: "error",
        text: "Please enter a custom bin value",
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await scanService.submitScanBatch(
        scannedQRs,
        binSize,
        binSize === "custom" ? customBinValue : null,
      );

      setMessage({
        type: "success",
        text: `Successfully saved ${scannedQRs.length} QR code${scannedQRs.length > 1 ? "s" : ""} with ${binSize} bin`,
      });

      // Reset form after short delay
      setTimeout(() => {
        setScannedQRs([]);
        setBinSize("small");
        setCustomBinValue("");
        setMessage(null);
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to save scan batch",
      });
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full mb-3">
                <Package className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                QR Scanner
              </h1>
              <p className="text-blue-100 text-sm sm:text-base">
                Scan and allocate QR codes to bins
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Message Display */}
            {message && (
              <div
                className={`p-3 sm:p-4 rounded-lg flex items-start sm:items-center gap-2 animate-in slide-in-from-top-2 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                )}
                <span className="text-sm sm:text-base flex-1">
                  {message.text}
                </span>
              </div>
            )}

            {/* QR Input Section */}
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  QR Codes
                </h2>
                {scannedQRs.length > 0 && (
                  <span className="text-xs sm:text-sm font-medium text-slate-500 bg-slate-100 px-2 sm:px-3 py-1 rounded-full">
                    {scannedQRs.length} code{scannedQRs.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <QRInput
                onScan={handleQRInput}
                scannedQRs={scannedQRs}
                setScannedQRs={setScannedQRs}
              />
            </div>

            {/* Clear Button */}
            {scannedQRs.length > 0 && (
              <div className="pt-2">
                <Button
                  onClick={clearScannedQRs}
                  variant="outline"
                  className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All QR Codes
                </Button>
              </div>
            )}

            {/* Divider */}
            {scannedQRs.length > 0 && (
              <div className="border-t border-slate-200"></div>
            )}

            {/* Bin Size Selection */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4">
                Bin Size
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <Select value={binSize} onValueChange={setBinSize}>
                  <SelectItem value="small">Small Bin</SelectItem>
                  <SelectItem value="medium">Medium Bin</SelectItem>
                  <SelectItem value="large">Large Bin</SelectItem>
                  <SelectItem value="custom">Custom Size</SelectItem>
                </Select>

                {binSize === "custom" && (
                  <div className="animate-in slide-in-from-top-2">
                    <Input
                      placeholder="Enter custom bin size (e.g., Extra Large, XS)"
                      value={customBinValue}
                      onChange={(e) => setCustomBinValue(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || scannedQRs.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:text-slate-500 shadow-md hover:shadow-lg transition-all duration-200"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save {scannedQRs.length > 0 ? `${scannedQRs.length} ` : ""}
                    QR Code{scannedQRs.length !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>

            {/* Helper Text */}
            {scannedQRs.length === 0 && (
              <p className="text-xs sm:text-sm text-center text-slate-500 pt-2">
                Add QR codes above to get started
              </p>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs sm:text-sm text-slate-600 mt-4 sm:mt-6 px-4">
          Enter QR codes manually or scan them to assign storage bins
        </p>
      </div>
    </div>
  );
}

export default App;
