import { useEffect } from 'react';
import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { baseURL } from '../../services/api/api';
import { STORAGE_KEYS } from '../../constants/storage/storageKeys';
import { notifyChecklistChanged } from './usePendingChecklist';

const hubUrl = `${baseURL.replace(/\/api\/?$/, '')}/hubs/checklists`;

export const useChecklistRealtime = (enabled = true) => {
    useEffect(() => {
        if (!enabled) return;
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (!token) return;

        const connection = new HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ?? '',
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Warning)
            .build();

        connection.on('ChecklistChanged', () => {
            notifyChecklistChanged();
        });

        let cancelled = false;

        connection.start()
            .then(() => {
                if (cancelled) connection.stop().catch(() => { });
            })
            .catch((error) => {
                if (!cancelled) {
                    console.error('Falha ao conectar ao hub de checklists', error);
                }
            });

        return () => {
            cancelled = true;
            connection.off('ChecklistChanged');
            if (connection.state === HubConnectionState.Connected) {
                connection.stop().catch(() => { });
            }
        };
    }, [enabled]);
};
