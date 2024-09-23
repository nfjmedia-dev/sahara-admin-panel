// src/services/api.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

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
    create: async (endpoint: string, data: any) => {
        console.log("endpoint",endpoint)
        console.log("data",data)
        console.log("API_URL",`${endpoint}`)
        const response = await axios.post(`${endpoint}`, data);
        console.log(response)
        return response.data;
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
