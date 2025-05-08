import {useCallback, useState} from 'react';
import {formStructureConfig, getInitialFormValues} from '@/entities/OptimizationConfig';

interface UseOptimizationFormProps {
    onSubmitSuccess?: () => void;
    sseConnect?: () => void;
}

export const useOptimizationForm = ({
    onSubmitSuccess,
    sseConnect,
}: UseOptimizationFormProps = {}) => {
    const [formValues, setFormValues] = useState<Record<string, any>>(getInitialFormValues());
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = useCallback((id: string, value: any) => {
        setFormValues((prev) => ({...prev, [id]: value}));
    }, []);

    const handleFileChange = useCallback((file: File | null) => {
        setSelectedFile(file);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!selectedFile) {
            alert('Пожалуйста, выберите .py файл.');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('scriptFile', selectedFile);

        Object.keys(formValues).forEach((key) => {
            const value = formValues[key];

            if (
                value !== undefined &&
                value !== null &&
                (typeof value !== 'string' || value !== '')
            ) {
                formData.append(key, value);
            } else if (typeof value === 'boolean') {
                formData.append(key, String(value));
            }
        });

        // TODO: Замени на свой endpoint
        const submitEndpoint = 'http://localhost:8000/start-optimization';

        try {
            const response = await fetch(submitEndpoint, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Submission error:', response.status, errorText);
                throw new Error(`Server responded with status ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('Submission successful:', result);

            onSubmitSuccess?.();

            sseConnect?.();
        } catch (error: any) {
            console.error('Failed to submit form:', error);
            alert('Ошибка при отправке формы: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    }, [formValues, selectedFile, onSubmitSuccess, sseConnect]);

    return {
        formValues,
        selectedFile,
        isSubmitting,
        handleInputChange,
        handleFileChange,
        handleSubmit,
        formStructure: formStructureConfig,
    };
};
