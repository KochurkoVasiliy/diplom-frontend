import {useCallback, useEffect, useState} from 'react';

export const useConsoleLog = () => {
    const [logData, setLogData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchConsoleData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
            const serverResponse = [
                `[${new Date().toLocaleTimeString()}] Server connected.`,
                `[${new Date().toLocaleTimeString()}] Waiting for optimization task...`,
                // ... more logs
            ];
            setLogData((prevData) => (prevData ? prevData + '\n' : '') + serverResponse.join('\n'));
        } catch (e: any) {
            setError('Ошибка загрузки данных: ' + (e.message || 'Неизвестная ошибка'));
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConsoleData();
    }, [fetchConsoleData]);

    const clearLogs = useCallback(() => {
        setLogData('');
    }, []);

    return {logData, isLoading, error, fetchConsoleData, clearLogs};
};
