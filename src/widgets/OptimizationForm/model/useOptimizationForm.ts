import {useCallback, useState} from 'react';
import {formStructureConfig, getInitialFormValues} from '@/entities/OptimizationConfig';

interface UseOptimizationFormProps {
    onSubmitSuccess?: () => void;
    // Изменен тип на `any` для передачи распарсенных данных
    onSseMessage?: (data: any) => void;
    onSseError?: (error: Error) => void;
    onSseOpen?: () => void;
    onSseClose?: () => void;
}

export const useOptimizationForm = ({
    onSubmitSuccess,
    onSseMessage,
    onSseError,
    onSseOpen,
    onSseClose,
}: UseOptimizationFormProps = {}) => {
    const [formValues, setFormValues] = useState<Record<string, any>>(getInitialFormValues());
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedDatasetFile, setSelectedDatasetFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const handleInputChange = useCallback((id: string, value: any) => {
        setFormValues((prev) => ({...prev, [id]: value}));
    }, []);

    const handleFileChange = useCallback((file: File | null) => {
        setSelectedFile(file);
    }, []);

    const handleDatasetFileChange = useCallback((file: File | null) => {
        setSelectedDatasetFile(file);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!selectedFile) {
            alert('Пожалуйста, выберите .py файл скрипта.');
            return;
        }
        if (!selectedDatasetFile) {
            alert('Пожалуйста, выберите .zip файл с датасетом.');
            return;
        }

        setIsSubmitting(true);
        const controller = new AbortController();
        setAbortController(controller);

        const formData = new FormData();
        formData.append('scriptFile', selectedFile);
        formData.append('datasetFile', selectedDatasetFile);

        Object.keys(formValues).forEach((key) => {
            const value = formValues[key];
            if (
                value !== undefined &&
                value !== null &&
                (typeof value !== 'string' || value.trim() !== '')
            ) {
                if (typeof value === 'boolean') {
                    formData.append(key, String(value));
                } else {
                    formData.append(key, value);
                }
            } else if (typeof value === 'boolean') {
                formData.append(key, String(value));
            }
        });

        const submitEndpoint = 'http://localhost:8000/start-optimization';

        try {
            const response = await fetch(submitEndpoint, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Ошибка отправки (до стриминга):', response.status, errorText);
                const err = new Error(
                    `Сервер ответил ошибкой ${response.status} перед началом стриминга: ${errorText || response.statusText}`,
                );
                onSseError?.(err);
                throw err;
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('text/event-stream')) {
                const responseText = await response.text();
                console.warn('Ответ сервера не является text/event-stream:', responseText);
                const err = new Error(
                    'Ответ сервера не является ожидаемым потоком SSE. Получено: ' + contentType,
                );
                onSseError?.(err);
                throw err;
            }

            onSseOpen?.(); // Сообщаем, что стриминг начался

            const reader = response.body?.getReader();
            if (!reader) {
                const err = new Error('Не удалось получить reader для тела ответа.');
                onSseError?.(err);
                throw err;
            }

            const decoder = new TextDecoder();
            let buffer = '';

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const {done, value} = await reader.read();
                if (done) {
                    onSseClose?.(); // Сообщаем, что стриминг завершился
                    break;
                }

                buffer += decoder.decode(value, {stream: true});
                const messages = buffer.split('\n\n'); // SSE сообщения разделяются двумя символами новой строки
                for (let i = 0; i < messages.length - 1; i++) {
                    // Обрабатываем все, кроме последнего (потенциально неполного) сообщения
                    const message = messages[i];
                    if (message.startsWith('data: ')) {
                        try {
                            const jsonString = message.substring('data: '.length);
                            const parsedData = JSON.parse(jsonString);
                            onSseMessage?.(parsedData); // Вызываем колбэк с распарсенными данными
                        } catch (parseError) {
                            console.error('Ошибка парсинга SSE сообщения:', parseError, message);
                            onSseError?.(new Error('Ошибка парсинга SSE сообщения.'));
                        }
                    }
                }
                buffer = messages[messages.length - 1]; // Оставляем неполную часть буфера
            }

            onSubmitSuccess?.();
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Запрос был прерван');
                onSseError?.(new Error('Запрос был прерван клиентом.'));
                onSseClose?.(); // В случае отмены, также сообщаем о закрытии
            } else {
                console.error('Не удалось отправить форму или обработать SSE:', error);
                alert('Ошибка при отправке формы или получении данных: ' + error.message);
                onSseError?.(error as Error);
            }
        } finally {
            setIsSubmitting(false);
            setAbortController(null);
        }
    }, [
        formValues,
        selectedFile,
        selectedDatasetFile,
        onSubmitSuccess,
        onSseMessage,
        onSseError,
        onSseOpen,
        onSseClose,
    ]);

    const cancelOptimization = useCallback(() => {
        if (abortController) {
            abortController.abort();
            console.log('Попытка отмены запроса...');
        }
    }, [abortController]);

    return {
        formValues,
        selectedFile,
        selectedDatasetFile,
        isSubmitting,
        handleInputChange,
        handleFileChange,
        handleDatasetFileChange,
        handleSubmit,
        cancelOptimization,
        formStructure: formStructureConfig,
    };
};
