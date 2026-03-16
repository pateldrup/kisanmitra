import axios from 'axios';

const API_URL = '/api/crops';

// Fetch all crops with optional search/filter params
const getCrops = async (params = {}) => {
  try {
      // Build query string
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_URL}?${queryString}` : API_URL;
      
      const response = await axios.get(url);
      return response.data;
  } catch (error) {
      console.error("Error fetching crops:", error.response?.data || error.message);
      throw error;
  }
};

// Fetch a single crop by ID
const getCropById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching crop with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Compare two crops
const compareCrops = async (crop1Id, crop2Id) => {
    try {
        const response = await axios.get(`${API_URL}/compare`, {
            params: { crop1Id, crop2Id }
        });
        return response.data;
    } catch (error) {
        console.error("Error comparing crops:", error.response?.data || error.message);
        throw error;
    }
};

const cropService = {
  getCrops,
  getCropById,
  compareCrops
};

export default cropService;
