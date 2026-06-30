import axios from 'axios';
import { STORAGE_KEYS } from '../../constants/storage/storageKeys';

export const baseURL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5029/api';

export const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const activePlantId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLANT);

    const url = (config.url ?? '').toLowerCase();
    const isCredentialEndpoint = url.includes('/auth/login') || url.includes('/auth/kiosk');

    if (token && !isCredentialEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (activePlantId) {
      config.headers['X-Plant-Id'] = activePlantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);