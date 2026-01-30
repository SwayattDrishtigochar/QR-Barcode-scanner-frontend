import { useState, useEffect } from "react";
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
  const [stats, setStats] = useState({
    totalQRs: 0,
    smallQRs: 0,
    mediumQRs: 0,
    largeQRs: 0,
    customQRs: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await scanService.getScanStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleQRInput = (qrArray) => {
    setMessage({
      type: "success",
      text: `Added ${qrArray.length} QR code${qrArray.length > 1 ? "s" : ""}`,
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const clearScannedQRs = () => {
    setScannedQRs([]);
    setMessage({
      type: "success",
      text: "Cleared all QR codes",
    });
    setTimeout(() => setMessage(null), 2000);
  };

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
      await scanService.submitScanBatch(
        scannedQRs,
        binSize,
        binSize === "custom" ? customBinValue : null,
      );

      setMessage({
        type: "success",
        text: `Successfully saved ${scannedQRs.length} QR code${scannedQRs.length > 1 ? "s" : ""} with ${binSize} bin`,
      });

      await loadStats();

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

  const getBinSizeDisplay = () => {
    if (binSize === 'custom') {
      return customBinValue || 'Custom';
    }
    return binSize.charAt(0).toUpperCase() + binSize.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-primary">{stats.totalQRs}</div>
            <div className="text-xs text-slate-600">Total QRs</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-green-600">{stats.smallQRs}</div>
            <div className="text-xs text-slate-600">Small</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-blue-600">{stats.mediumQRs}</div>
            <div className="text-xs text-slate-600">Medium</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-purple-600">{stats.largeQRs}</div>
            <div className="text-xs text-slate-600">Large</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-orange-600">{stats.customQRs}</div>
            <div className="text-xs text-slate-600">Custom</div>
          </div>
        </div>

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
                Select bin size first, then scan QR codes
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Message Display */}
            {message && (
              <div
                className={`p-3 sm:p-4 rounded-lg flex items-start sm:items-center gap-2 animate-slide-up ${
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

            {/* Step 1: Bin Size Selection */}
            <div>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">1</span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Select Bin Size
                </h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <Select value={binSize} onValueChange={setBinSize}>
                  <SelectItem value="small">Small Bin</SelectItem>
                  <SelectItem value="medium">Medium Bin</SelectItem>
                  <SelectItem value="large">Large Bin</SelectItem>
                  <SelectItem value="custom">Custom Size</SelectItem>
                </Select>

                {binSize === "custom" && (
                  <div className="animate-slide-up">
                    <Input
                      placeholder="Enter custom bin size..."
                      value={customBinValue}
                      onChange={(e) => setCustomBinValue(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200"></div>

            {/* Step 2: QR Input Section */}
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">2</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                    Scan QR Codes for {getBinSizeDisplay()} Bin
                  </h2>
                </div>
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
                binSize={getBinSizeDisplay()}
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

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || scannedQRs.length === 0 || (binSize === 'custom' && !customBinValue.trim())}
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
                Select bin size above, then scan QR codes
              </p>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs sm:text-sm text-slate-600 mt-4 sm:mt-6 px-4">
          Step 1: Choose bin size • Step 2: Scan QR codes • Step 3: Save batch
        </p>
      </div>
    </div>
  );
}

export default App;
