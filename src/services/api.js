import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanService = {
  // Submit scan batch to backend
  submitScanBatch: async (qrCodes, binSize, customBinValue = null) => {
    try {
      const response = await api.post('/scans', {
        qrCodes,
        binSize,
        customBinValue
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  // Get all scan batches
  getAllScans: async () => {
    try {
      const response = await api.get('/scans');
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  // Get scan statistics
  getScanStats: async () => {
    try {
      const response = await api.get('/scans/stats');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  }
};

export default api;