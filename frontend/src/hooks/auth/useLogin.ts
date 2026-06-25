import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import { STORAGE_KEYS } from '../../constants/storage/storageKeys';
import { Alert } from '../../services/alerts/alertService';
import { useColorModeValue } from '../theme/useColorModeValue';
import type { ApiErrorResponse, LoginResponse, Plant } from '../../types';

export const useLogin = () => {
    const navigate = useNavigate();
    const isDarkMode = useColorModeValue(false, true);

    const isDarkModeRef = useRef(isDarkMode);
    useEffect(() => { isDarkModeRef.current = isDarkMode; }, [isDarkMode]);

    const [registration, setRegistration] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [plants, setPlants] = useState<Plant[]>([]);
    const [selectedPlant, setSelectedPlant] = useState('');
    const [isLoadingPlants, setIsLoadingPlants] = useState(true);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const { data } = await api.get<Plant[]>(API_ENDPOINTS.PLANTS.GET_ALL);
                if (!active) return;
                setPlants(data);

                const savedPlant = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLANT);
                if (savedPlant && data.some((p) => p.id.toString() === savedPlant)) {
                    setSelectedPlant(savedPlant);
                } else if (data.length > 0) {
                    setSelectedPlant(data[0].id.toString());
                }
            } catch (error) {
                console.error('Erro ao carregar as filiais disponíveis.', error);
                Alert.error('Erro de Conexão', 'Não foi possível carregar a lista de filiais.', isDarkModeRef.current);
            } finally {
                if (active) setIsLoadingPlants(false);
            }
        })();
        return () => { active = false; };
    }, []);

    const handleLogin = async () => {
        if (!registration || !password) {
            Alert.error('Campos obrigatórios', 'Por favor, preencha a matrícula e senha.', isDarkMode);
            return;
        }
        if (!selectedPlant) {
            Alert.error('Unidade não selecionada', 'Por favor, selecione uma filial.', isDarkMode);
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
                registration: parseInt(registration),
                password,
                plantId: parseInt(selectedPlant),
            });

            localStorage.removeItem(STORAGE_KEYS.KIOSK);
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
            localStorage.setItem(STORAGE_KEYS.ACTIVE_PLANT, selectedPlant);

            navigate('/');
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            const errorMsg = err.response?.data?.message || err.message || 'Erro ao conectar com o servidor.';
            Alert.error('Falha no Login', errorMsg, isDarkMode);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        registration, setRegistration,
        password, setPassword,
        showPassword, setShowPassword,
        isLoading,
        plants, selectedPlant, setSelectedPlant, isLoadingPlants,
        handleLogin,
    };
};
