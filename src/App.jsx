import { useState, useEffect } from "react";
import QRInput from "./components/QRScanner";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { Select, SelectItem } from "./components/Select";
import { scanService } from "./services/api";
import { Trash2, Package, CheckCircle, AlertCircle, Save } from "lucide-react";
import { isAuthenticated, promptForCredentials } from "./utils/auth";
import AuthModal from "./AuthModal";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [scannedQRs, setScannedQRs] = useState([]);
  const [binSize, setBinSize] = useState("small");
  const [isCustom, setIsCustom] = useState(false);
  const [customBinValue, setCustomBinValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [binSizes, setBinSizes] = useState([]);
  const [stats, setStats] = useState({
    stats: [],
    totalQRCodes: 0,
    totalBinSizes: 0,
  });
  // Check authentication on mount
  useEffect(() => {
    if (isAuthenticated()) {
      setIsAuth(true);
    }
  }, []);

  useEffect(() => {
    if (isAuth) {
      loadStats();
      loadBinSizes();
    }
  }, [isAuth]);

  const loadStats = async () => {
    try {
      const statsData = await scanService.getScanStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadBinSizes = async () => {
    try {
      const binSizesData = await scanService.getDistinctBinSizes();
      setBinSizes(binSizesData.binSizes || []);
    } catch (error) {
      console.error("Failed to load bin sizes:", error);
    }
  };

  const handleQRInput = (qrArray) => {
    setMessage({
      type: "success",
      text: `Added ${qrArray.length} Bin${qrArray.length > 1 ? "s" : ""}`,
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

  const handleSubmit = async () => {
    if (scannedQRs.length === 0) {
      setMessage({
        type: "error",
        text: "Please add at least one QR code",
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (!binSize.trim()) {
      setMessage({
        type: "error",
        text: "Please enter a bin size",
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      await scanService.submitScanBatch(scannedQRs, binSize);

      setMessage({
        type: "success",
        text: `Successfully saved ${scannedQRs.length} QR code${scannedQRs.length > 1 ? "s" : ""} to ${binSize} bin`,
      });

      await loadStats();
      await loadBinSizes();

      setTimeout(() => {
        setScannedQRs([]);
        setBinSize("small");
        setIsCustom(false);
        setCustomBinValue("");
        setMessage(null);
        setShouldFocusInput(true);
      }, 1000);
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
    return binSize || "Bin";
  };
  // Show loading/auth screen if not authenticated
  if (!isAuth) {
    return (
      <>
        <AuthModal onSuccess={() => setIsAuth(true)} />
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <p className="text-slate-600">Waiting for authentication…</p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        {/* Stats Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm mb-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {stats.totalQRCodes || 0}
              </div>
              <div className="text-sm text-slate-600 mt-1">Total Bins</div>
            </div>
          </div>
          {stats.stats && stats.stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {stats.stats.map((stat, index) => (
                <div
                  key={stat.binSize}
                  className="bg-white rounded-lg border border-slate-200 p-3 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-xl font-bold text-blue-600">
                    {stat.count}
                  </div>
                  <div
                    className="text-xs text-slate-600 truncate"
                    title={stat.binSize}
                  >
                    {stat.binSize}
                  </div>
                </div>
              ))}
            </div>
          )}
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
                Bin Scanner
              </h1>
              <p className="text-blue-100 text-sm sm:text-base">
                Select bin size first, then scan it.
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
                <Select
                  value={isCustom ? "custom" : binSize}
                  onValueChange={handleBinSizeChange}
                >
                  {/* Standard bin sizes - always show these */}
                  <SelectItem value="small">Small Bin</SelectItem>
                  <SelectItem value="medium">Medium Bin</SelectItem>
                  <SelectItem value="large">Large Bin</SelectItem>

                  {/* Previously used custom bin values */}
                  {binSizes.length > 0 && (
                    <>
                      {binSizes
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
                  {/* Custom option */}
                  <SelectItem value="custom">Custom Size</SelectItem>
                </Select>

                {isCustom && (
                  <div className="animate-slide-up">
                    <Input
                      placeholder="Enter custom bin size..."
                      value={customBinValue}
                      onChange={handleCustomBinChange}
                      className="w-full"
                      autoFocus
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
                    <span className="text-xs font-semibold text-primary">
                      2
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                    Scan Bin of{" "}
                    {getBinSizeDisplay().charAt(0).toUpperCase() +
                      getBinSizeDisplay().slice(1)}{" "}
                    Size
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
                shouldFocus={shouldFocusInput}
                setShouldFocus={setShouldFocusInput}
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
                  Clear All Bins
                </Button>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting || scannedQRs.length === 0 || !binSize.trim()
                }
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
                    Bin{scannedQRs.length !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>

            {/* Helper Text */}
            {scannedQRs.length === 0 && (
              <p className="text-xs sm:text-sm text-center text-slate-500 pt-2">
                Select bin size above, then scan it.
              </p>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs sm:text-sm text-slate-600 mt-4 sm:mt-6 px-4">
          Step 1: Choose bin size • Step 2: Scan it • Step 3: Save batch
        </p>
      </div>
    </div>
  );
}

export default App;
