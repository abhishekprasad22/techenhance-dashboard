import axios from 'axios';
import { LoanApplicant } from '../types/loan';

const API_URL = 'http://localhost:3001/api';

export const recommendationService = {
  async getRecommendations(): Promise<LoanApplicant[]> {
    try {
      const response = await axios.get(`${API_URL}/recommendations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }
};