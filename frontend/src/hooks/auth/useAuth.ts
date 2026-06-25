import { useEffect, useState } from 'react';
import type { User } from '../../types';
import { api } from '../../services/api/api';
import { STORAGE_KEYS } from '../../constants/storage/storageKeys';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (!token || !storedUser) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {

        const response = await api.get('/Auth/validate');

        if (response.status === 200) {
          setIsAuthenticated(true);

          const parsedUser: User = JSON.parse(storedUser);
          const canManageTickets = response.data?.canManageTickets ?? parsedUser.canManageTickets;
          const mergedUser: User = { ...parsedUser, canManageTickets };

          setUser(mergedUser);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mergedUser));
        }
      } catch (error) {
        console.error('Erro ao validar token:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  return { isAuthenticated, user, isLoading };
};