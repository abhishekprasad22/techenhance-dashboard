import axios from 'axios';
import { Dataset } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const dataService = {
  async getDatasets(): Promise<Dataset[]> {
    const response = await api.get('/datasets');
    return response.data;
  },

  async getDataset(id: string): Promise<Dataset> {
    const response = await api.get(`/datasets/${id}`);
    return response.data;
  },

  async createDataset(dataset: Omit<Dataset, 'id' | 'createdAt'>): Promise<Dataset> {
    const response = await api.post('/datasets', dataset);
    return response.data;
  },

  async updateDataset(id: string, dataset: Partial<Dataset>): Promise<Dataset> {
    const response = await api.put(`/datasets/${id}`, dataset);
    return response.data;
  },

  async deleteDataset(id: string): Promise<void> {
    await api.delete(`/datasets/${id}`);
  },

  async uploadCSV(file: File): Promise<Dataset> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async generateData(type: string, options: { count?: number; name?: string } = {}): Promise<Dataset> {
    const response = await api.post(`/generate/${type}`, options);
    return response.data;
  },

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/health');
    return response.data;
  },
};