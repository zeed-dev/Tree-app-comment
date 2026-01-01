import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface StartingNumber {
  id: number;
  userId: number;
  value: number;
  createdAt: string;
  username?: string;
}

export interface Operation {
  id: number;
  parentId: number;
  parentType: 'starting_number' | 'operation';
  userId: number;
  operationType: '+' | '-' | '*' | '/';
  rightOperand: number;
  createdAt: string;
  result?: number;
  username?: string;
}

export const authAPI = {
  register: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { username, password });
    return response.data;
  },
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { username, password });
    return response.data;
  },
};

export const calculationAPI = {
  getAllStartingNumbers: async (): Promise<StartingNumber[]> => {
    const response = await api.get<StartingNumber[]>('/calculations/starting-numbers');
    return response.data;
  },
  getOperationsByParent: async (
    parentType: 'starting_number' | 'operation',
    parentId: number
  ): Promise<Operation[]> => {
    const response = await api.get<Operation[]>(
      `/calculations/operations/${parentType}/${parentId}`
    );
    return response.data;
  },
  createStartingNumber: async (value: number): Promise<StartingNumber> => {
    const response = await api.post<StartingNumber>('/calculations/starting-numbers', { value });
    return response.data;
  },
  createOperation: async (
    parentId: number,
    parentType: 'starting_number' | 'operation',
    operationType: '+' | '-' | '*' | '/',
    rightOperand: number
  ): Promise<Operation> => {
    const response = await api.post<Operation>('/calculations/operations', {
      parentId,
      parentType,
      operationType,
      rightOperand,
    });
    return response.data;
  },
};

export default api;

