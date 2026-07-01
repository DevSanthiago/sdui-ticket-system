import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import { STORAGE_KEYS } from '../../constants/storage/storageKeys';
import { parseDepartmentIds } from '../../helpers/notificationScope';
import { Alert } from '../../services/alerts/alertService';
import type { Plant, ApiErrorResponse } from '../../types';

interface KioskLoginResponse {
    token: string;
    plantId: number;
    plantName: string;
    displayName: string;
}

interface KioskDepartmentOption {
    id: number;
    name: string;
}

export const useKioskAuth = (isDarkMode: boolean) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [plants, setPlants] = useState<Plant[]>([]);
    const [deviceKey, setDeviceKey] = useState(searchParams.get('key') ?? '');
    const [selectedPlant, setSelectedPlant] = useState(searchParams.get('plant') ?? '');
    const [displayName, setDisplayName] = useState(searchParams.get('name') ?? '');
    const [availableDepartments, setAvailableDepartments] = useState<KioskDepartmentOption[]>([]);
    const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<number[]>(
        parseDepartmentIds(searchParams.get('departments'))
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPlants, setIsLoadingPlants] = useState(true);
    const [showDeviceKey, setShowDeviceKey] = useState(false);

    const authenticate = useCallback(async (key: string, plantId: string, name: string, departmentsCsv: string) => {
        setIsLoading(true);
        try {
            const { data } = await api.post<KioskLoginResponse>(API_ENDPOINTS.AUTH.KIOSK, {
                deviceKey: key,
                plantId: Number(plantId),
                displayName: name || undefined,
            });

            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
            localStorage.setItem(STORAGE_KEYS.ACTIVE_PLANT, String(data.plantId));
            localStorage.setItem(STORAGE_KEYS.KIOSK, 'true');
            localStorage.setItem(STORAGE_KEYS.KIOSK_DEPARTMENTS, parseDepartmentIds(departmentsCsv).join(','));
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
                id: 0,
                name: data.displayName,
                email: '',
                registration: 0,
                department: '',
                roles: [{ name: 'kiosk-display', description: 'Kiosk Display' }],
                canManageTickets: false,
            }));

            navigate('/tickets/board', { replace: true });
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            Alert.error('Falha no Kiosk', err.response?.data?.message || 'Não foi possível autenticar o dispositivo.', isDarkMode);
        } finally {
            setIsLoading(false);
        }
    }, [navigate, isDarkMode]);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const { data } = await api.get<Plant[]>(API_ENDPOINTS.PLANTS.GET_ALL);
                if (!active) return;
                setPlants(data);
                setSelectedPlant(prev => prev || (data.length > 0 ? String(data[0].id) : ''));
            } catch (error) {
                console.error('Erro ao carregar as filiais disponíveis (kiosk).', error);
            } finally {
                if (active) setIsLoadingPlants(false);
            }
        })();
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!selectedPlant) {
            setAvailableDepartments([]);
            return;
        }
        let active = true;
        (async () => {
            try {
                const { data } = await api.get<KioskDepartmentOption[]>(
                    `${API_ENDPOINTS.DEPARTMENTS.PUBLIC}?plantId=${encodeURIComponent(selectedPlant)}`
                );
                if (!active) return;
                const options = data ?? [];
                setAvailableDepartments(options);
                setSelectedDepartmentIds(prev => prev.filter(id => options.some(d => d.id === id)));
            } catch (error) {
                if (active) {
                    console.error('Erro ao carregar os departamentos da planta (kiosk).', error);
                    setAvailableDepartments([]);
                }
            }
        })();
        return () => { active = false; };
    }, [selectedPlant]);

    useEffect(() => {
        const key = searchParams.get('key');
        const plant = searchParams.get('plant');
        if (key && plant) {
            authenticate(key, plant, searchParams.get('name') ?? '', searchParams.get('departments') ?? '');
        }
    }, [searchParams, authenticate]);

    const onSelectDepartments = (values: string[]) => {
        setSelectedDepartmentIds(values.map(Number).filter(id => Number.isInteger(id) && id > 0));
    };

    const handleSubmit = () => {
        if (!deviceKey.trim() || !selectedPlant) {
            Alert.error('Campos obrigatórios', 'Informe a chave do dispositivo e a planta.', isDarkMode);
            return;
        }
        authenticate(deviceKey, selectedPlant, displayName, selectedDepartmentIds.join(','));
    };

    return {
        plants,
        deviceKey, setDeviceKey,
        showDeviceKey, setShowDeviceKey,
        selectedPlant, setSelectedPlant,
        displayName, setDisplayName,
        availableDepartments, selectedDepartmentIds, onSelectDepartments,
        isLoading, isLoadingPlants,
        handleSubmit,
    };
};
