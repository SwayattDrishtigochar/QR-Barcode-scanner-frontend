import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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
  getScanBatches: async () => {
    try {
      const response = await api.get('/scans');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  }
};

export default api;