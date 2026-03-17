import api from './api';

const API_PATH = 'crops';

// Fetch all crops with optional search/filter params
const getCrops = async (params = {}) => {
  try {
      // Build query string
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_PATH}?${queryString}` : API_PATH;
      
      const response = await api.get(url);
      return response.data;
  } catch (error) {
      console.error("Error fetching crops:", error.response?.data || error.message);
      throw error;
  }
};

// Fetch a single crop by ID
const getCropById = async (id) => {
    try {
        const response = await api.get(`${API_PATH}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching crop with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Compare two crops
const compareCrops = async (crop1Id, crop2Id) => {
    try {
        const response = await api.get(`${API_PATH}/compare`, {
            params: { crop1Id, crop2Id }
        });
        return response.data;
    } catch (error) {
        console.error("Error comparing crops:", error.response?.data || error.message);
        throw error;
    }
};

const getCropGuideByName = async (cropName) => {
    try {
        const response = await api.get(`crop-guide/${cropName}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching crop guide for ${cropName}:`, error.response?.data || error.message);
        throw error;
    }
};

const cropService = {
  getCrops,
  getCropById,
  compareCrops,
  getCropGuideByName
};

export default cropService;
