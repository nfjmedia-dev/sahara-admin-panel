// src/services/api.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const defaultHeaders = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'cache-control': 'no-cache, no-store',
    'content-type': 'application/x-www-form-urlencoded',
    'pragma': 'no-cache',
    'referrer-policy': 'strict-origin',
    'x-custom-name': 'Borgun hf.',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36'
  };
export const apiService = {
    
    get: async (endpoint: string) => {
        const response = await axios.get(`${API_URL}/${endpoint}`);
        return response.data;
    },
    // create: async (endpoint: string, data: any) => {
    //     console.log("endpoint",endpoint)
    //     console.log("data",data)
    //     console.log("API_URL",`${API_URL}/${endpoint}`)
    //     const response = await axios.post(`${API_URL}/${endpoint}`, data);
    //     console.log(response)
    //     return response.data;
    // },
    
    create: async (endpoint: string, data: any, customHeaders = {}) => {
        try {
          // Merge custom headers with default headers
          const headers = { ...defaultHeaders, ...customHeaders };
          const response = await axios.post(endpoint, data, { headers });
          console.log('Response:', response);
          return response.data;
        } catch (error) {
          console.error('Error creating data:', error);
          throw error;
        }
      },
    update: async (endpoint: string, data: any) => {
        const response = await axios.put(`${API_URL}/${endpoint}`, data);
        return response.data;
    },
    delete: async (endpoint: string) => {
        const response = await axios.delete(`${API_URL}/${endpoint}`);
        return response.data;
    }
};
