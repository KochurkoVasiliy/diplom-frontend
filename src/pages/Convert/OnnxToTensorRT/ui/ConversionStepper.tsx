import {
    Button,
    Card,
    Checkbox,
    Divider,
    Flex,
    Icon,
    Label,
    Select,
    Slider,
    Stepper,
    // eslint-disable-next-line @typescript-eslint/no-redeclare
    Text,
    TextInput,
} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';
import {Gear} from '@gravity-ui/icons'; // Example icon for processing

const b = block('convert-stepper');

type FormState = {
    file: File | null;
    outName: string;
    precision: string;
    optLevel: number;
    cudaGraph: boolean;
};

const precisions = ['fp32', 'fp16', 'bf16', 'int8', 'fp8', 'best'].map((v) => ({
    value: v,
    content: v,
}));

// Define the backend endpoint URL (adjust if your backend is on a different URL/port)
const BACKEND_URL = 'http://localhost:8000'; // Replace with your FastAPI server address

export const ConversionStepper = () => {
    const [step, setStep] = React.useState(0);
    const [form, setForm] = React.useState<FormState>({
        file: null,
        outName: '',
        precision: 'fp32',
        optLevel: 0,
        cudaGraph: false,
    });

    // State for upload status
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = React.useState<string | null>(null);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const update = React.useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((f) => ({...f, [key]: value}));
        // Reset status messages when form changes
        setUploadError(null);
        setUploadSuccess(null);
    }, []);

    // Effect for automatic filling of output file name
    React.useEffect(() => {
        if (form.file && form.outName === '') {
            const baseFileName = form.file.name.replace(/\.onnx$/i, '');
            const suggestedOutName = `${baseFileName}_tensorrt.trt`;
            update('outName', suggestedOutName);
        }
    }, [form.file, form.outName, update]);

    // Effect to clear state messages when step changes
    React.useEffect(() => {
        setUploadError(null);
        setUploadSuccess(null);
        setIsUploading(false); // Also reset uploading status
    }, [step]);

    const onChooseClick = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        update('file', f);
        // If file is cleared, also clear outName if it looks like it was auto-generated
        if (!f && form.outName !== '') {
            if (form.outName.endsWith('_tensorrt.trt')) {
                update('outName', '');
            }
        }
    };

    const next = () => setStep((s) => Math.min(s + 1, 2));
    const prev = () => setStep((s) => Math.max(s - 1, 0));

    const handleStartConversion = async () => {
        if (!form.file) {
            setUploadError('Выберите ONNX-файл для конвертации.');
            return;
        }

        setIsUploading(true);
        setUploadError(null);
        setUploadSuccess(null);

        const formData = new FormData();
        // Append the file
        formData.append('file', form.file);
        // Append other form fields
        formData.append('out_name', form.outName);
        formData.append('precision', form.precision);
        formData.append('opt_level', form.optLevel.toString()); // FormData values are typically strings
        formData.append('cuda_graph', form.cudaGraph.toString()); // Convert boolean to string

        try {
            const response = await fetch(`${BACKEND_URL}/convert/`, {
                // Use the backend endpoint
                method: 'POST',
                body: formData, // fetch automatically sets Content-Type: multipart/form-data
            });

            if (!response.ok) {
                // Handle HTTP errors (e.g., 400, 500)
                const errorData = await response.json(); // Assuming backend sends JSON errors
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json(); // Assuming backend sends a success JSON message
            setUploadSuccess(result.message || 'Конвертация успешно запущена.');
            // Optionally, process the result if the backend returns useful info
            console.log('Backend response:', result);
        } catch (error: any) {
            // Catching any error from fetch or response processing
            console.error('Upload failed:', error);
            setUploadError(`Ошибка конвертации: ${error.message}`);
        } finally {
            setIsUploading(false); // Always stop loading state
        }
    };

    return (
        <div className={b()}>
            <Stepper value={step} size={'l'} className={b('steps')}>
                <Stepper.Item title="Загрузка модели ONNX">Загрузка</Stepper.Item>
                <Stepper.Item title="Настройка параметров конвертации">
                    Настройка параметров
                </Stepper.Item>
                <Stepper.Item title="Просмотр и запуск конвертации">Конвертация</Stepper.Item>
            </Stepper>

            <div className={b('content')}>
                {step === 0 && (
                    <Flex direction="column" gap="4" className={b('step-content')}>
                        <Card className={b('upload-card')}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".onnx"
                                onChange={onFileChange}
                                style={{display: 'none'}}
                            />
                            <Text variant={'body-2'} className={b('upload-text')}>
                                Для конвертации ONNX в TensorRT выберите файл формата .onnx
                            </Text>
                            <Button
                                view="outlined"
                                size="l"
                                onClick={onChooseClick}
                                className={b('upload-button')}
                            >
                                {form.file ? `Файл: ${form.file.name}` : 'Выбрать ONNX‑файл'}
                            </Button>
                        </Card>
                        <Button
                            view="action"
                            size="xl"
                            disabled={!form.file}
                            onClick={next}
                            width="max"
                        >
                            Далее
                        </Button>
                        {/* Display status messages at the end of step 0 if needed, though maybe better at step 2 */}
                        {/* {uploadError && <Text color="danger">{uploadError}</Text>}
                         {uploadSuccess && <Text color="success">{uploadSuccess}</Text>} */}
                    </Flex>
                )}

                {step === 1 && (
                    <Flex direction="column" gap="5" className={b('step-content')}>
                        <Text variant={'header-1'} as="h2">
                            Параметры конвертации
                        </Text>
                        <Divider />
                        <Flex direction={'column'} className={b('field-group')} gap="1">
                            <Label size={'m'}>Имя выходного файла (.trt):</Label>
                            <TextInput
                                id="outName-input"
                                placeholder={
                                    form.file
                                        ? form.file.name.replace(/\.onnx$/i, '_tensorrt.trt')
                                        : 'output_model.trt'
                                }
                                value={form.outName}
                                view={'normal'}
                                size={'l'}
                                onUpdate={(v) => update('outName', v)}
                            />
                        </Flex>
                        <Flex direction={'column'} className={b('field-group')} gap="1">
                            <Label size={'m'}>Точность (Precision):</Label>
                            <Select
                                id="precision-select"
                                options={precisions}
                                value={[form.precision]}
                                size={'l'}
                                onUpdate={(v: string[]) => {
                                    update('precision', v[0]);
                                }}
                            />
                        </Flex>
                        <Flex direction={'column'} className={b('field-group')} gap="1">
                            <Label size={'m'}>Уровень оптимизации (0-5): {form.optLevel}</Label>
                            <Slider
                                min={0}
                                max={5}
                                step={1}
                                value={form.optLevel}
                                onUpdate={(v) => update('optLevel', v)}
                            />
                        </Flex>
                        <Flex alignItems={'center'} gap={'2'} className={b('field-group')}>
                            <Checkbox
                                id="cudaGraph-checkbox"
                                size={'l'}
                                checked={form.cudaGraph}
                                onUpdate={(v) => update('cudaGraph', v)}
                            />
                            <Label size={'xs'}>Включить CudaGraph</Label>
                        </Flex>
                        <Divider />
                        <Flex gap="3" direction={'column'} className={b('action-buttons')}>
                            <Button
                                view="action"
                                size="l"
                                disabled={form.outName.trim().length === 0}
                                onClick={next}
                                width="max"
                            >
                                Далее
                            </Button>
                            <Button view="normal" size="l" onClick={prev} width="max">
                                Назад
                            </Button>
                        </Flex>
                    </Flex>
                )}

                {step === 2 && (
                    <Flex direction="column" gap="4" className={b('step-content')}>
                        <Text variant={'header-1'} as="h2">
                            Проверка параметров
                        </Text>
                        <Divider />
                        <Card view="filled" type="container" className={b('review-card')}>
                            <pre className={b('review-json')}>
                                {/* Display form data, showing file name instead of File object */}
                                {JSON.stringify(
                                    {
                                        inputFile: form.file?.name || 'Не выбран',
                                        outputName: form.outName,
                                        precision: form.precision,
                                        optimizationLevel: form.optLevel,
                                        cudaGraphEnabled: form.cudaGraph,
                                    },
                                    null,
                                    2,
                                )}
                            </pre>
                        </Card>

                        {/* Display upload status messages */}
                        {isUploading && (
                            <Flex direction="row" gap="2" alignItems="center">
                                <Icon data={Gear} size={20} className={b('spinner')} />{' '}
                                {/* Add a spinner/icon for loading */}
                                <Text>Загрузка и обработка...</Text>
                            </Flex>
                        )}
                        {uploadError && <Text color="danger">{uploadError}</Text>}
                        {uploadSuccess && <Text color="positive">{uploadSuccess}</Text>}

                        <Flex
                            gap="3"
                            direction={'row'}
                            className={b('action-buttons')}
                            justifyContent="end"
                        >
                            <Button view="normal" size="l" onClick={prev}>
                                Назад
                            </Button>
                            <Button
                                view="action"
                                size="l"
                                onClick={handleStartConversion} // Call the submission handler
                                disabled={
                                    !form.file || form.outName.trim().length === 0 || isUploading
                                } // Disable if no file, no output name, or already uploading
                            >
                                {isUploading ? 'Обработка...' : 'Старт конвертации'}{' '}
                                {/* Button text changes during upload */}
                            </Button>
                        </Flex>
                    </Flex>
                )}
            </div>
        </div>
    );
};
