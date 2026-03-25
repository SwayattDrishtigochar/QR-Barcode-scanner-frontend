import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL + "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const scanService = {
  // Submit scan batch to backend
  submitScanBatch: async (qrCodes, binSize) => {
    try {
      const response = await api.post("/scans", {
        qrCodes,
        binSize,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
  },

  // Get all scan batches
  getAllScans: async () => {
    try {
      const response = await api.get("/scans");
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
  },

  // Get scan statistics
  getScanStats: async () => {
    try {
      const response = await api.get("/scans/stats");
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
  },

  // Get distinct bin sizes
  getDistinctBinSizes: async () => {
    try {
      const response = await api.get("/scans/bin-sizes");
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
  },

  // Get latest 10 scan batches
  getRecentScans: async () => {
    try {
      const response = await api.get("/scans/recent");
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
  },

  // Delete RFID from a scan batch by batch id
  deleteScanById: async (id, rfid) => {
    try {
      const response = await api.delete(`/scans/${id}`, {
        data: { rfid },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
  },

  // Update bin size for one RFID entry
  updateScanBinSize: async (id, qrCode, binSize) => {
    try {
      const response = await api.put(`/scans/${id}`, {
        qrCode,
        binSize,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
  },
};

export default api;
