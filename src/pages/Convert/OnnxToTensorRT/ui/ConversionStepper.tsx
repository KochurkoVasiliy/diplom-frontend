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
import {Gear} from '@gravity-ui/icons';

const b = block('convert-stepper');

type FormState = {
    file: File | null;
    outName: string;
    precision: string;
    optLevel: number;
    cudaGraph: boolean;
};

type ConversionResult = {
    status: 'success' | 'error';
    message: string;
    output?: string;
    logs?: {
        args?: string[];
        returncode?: number;
        stdout?: string;
        stderr?: string;
    };
};

const precisions = ['fp32', 'fp16', 'bf16', 'int8', 'fp8', 'best'].map((v) => ({
    value: v,
    content: v,
}));

const BACKEND_URL = 'http://localhost:8000';

export const ConversionStepper = () => {
    const [step, setStep] = React.useState(0);
    const [form, setForm] = React.useState<FormState>({
        file: null,
        outName: '',
        precision: 'fp32',
        optLevel: 0,
        cudaGraph: false,
    });

    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState<string | null>(null);
    // const [uploadSuccess, setUploadSuccess] = React.useState<string | null>(null);

    const [conversionResult, setConversionResult] = React.useState<ConversionResult | null>(null);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const update = React.useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((f) => ({...f, [key]: value}));
        setUploadError(null);
        setConversionResult(null);
    }, []);

    React.useEffect(() => {
        if (form.file && form.outName === '') {
            const baseFileName = form.file.name.replace(/\.onnx$/i, '');
            const suggestedOutName = `${baseFileName}_tensorrt.trt`;
            update('outName', suggestedOutName);
        }
    }, [form.file, form.outName, update]);

    React.useEffect(() => {
        setUploadError(null);
        setConversionResult(null);
        setIsUploading(false);
    }, [step]);

    const onChooseClick = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        update('file', f);
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
        setConversionResult(null);

        const formData = new FormData();
        // Append the file
        formData.append('file', form.file);
        // Append other form fields
        formData.append('out_name', form.outName);
        formData.append('precision', form.precision);
        formData.append('opt_level', form.optLevel.toString());
        formData.append('cuda_graph', form.cudaGraph.toString());

        try {
            const response = await fetch(`${BACKEND_URL}/convert/`, {
                method: 'POST',
                body: formData,
            });

            const result: ConversionResult = await response.json();
            setConversionResult(result);

            if (!response.ok || result.status === 'error') {
                setUploadError(result.message || `Ошибка конвертации. Статус: ${response.status}`);
            } else {
                console.log('Backend response:', result);
            }
        } catch (error: any) {
            console.error('Upload failed:', error);
            setUploadError(`Ошибка сети или обработки ответа: ${error.message}`);
            setConversionResult(null);
        } finally {
            setIsUploading(false);
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
                            Проверка параметров и запуск
                        </Text>
                        <Divider />
                        <Card view="filled" type="container" className={b('review-card')}>
                            <Flex direction="column" gap="2">
                                <Text variant="body-2">
                                    Выбран файл:{' '}
                                    <Text color="complementary">
                                        {form.file?.name || 'Не выбран'}
                                    </Text>
                                </Text>
                                <Text variant="body-2">
                                    Имя выходного файла:{' '}
                                    <Text color="complementary">
                                        {form.outName || 'Не указано'}
                                    </Text>
                                </Text>
                                <Text variant="body-2">
                                    Точность: <Text color="complementary">{form.precision}</Text>
                                </Text>
                                <Text variant="body-2">
                                    Уровень оптимизации:{' '}
                                    <Text color="complementary">{form.optLevel}</Text>
                                </Text>
                                <Text variant="body-2">
                                    CudaGraph:{' '}
                                    <Text color="complementary">
                                        {form.cudaGraph ? 'Включен' : 'Выключен'}
                                    </Text>
                                </Text>
                            </Flex>
                        </Card>

                        {isUploading && (
                            <Flex direction="row" gap="2" alignItems="center">
                                <Icon data={Gear} size={20} className={b('spinner')} />{' '}
                                <Text>Загрузка и обработка...</Text>
                            </Flex>
                        )}
                        {uploadError && <Text color="danger">{uploadError}</Text>}

                        {conversionResult && !isUploading && (
                            <Flex direction="column" gap="2">
                                <Text variant="header-2" as="h3">
                                    Результат:
                                </Text>
                                <Card view="filled" type="container">
                                    <Flex direction="column" gap="1">
                                        <Text variant="body-2">
                                            Статус:{' '}
                                            <Text
                                                color={
                                                    conversionResult.status === 'success'
                                                        ? 'positive'
                                                        : 'danger'
                                                }
                                            >
                                                {conversionResult.status}
                                            </Text>
                                        </Text>
                                        <Text variant="body-2">
                                            Сообщение: {conversionResult.message}
                                        </Text>
                                        {conversionResult.output && (
                                            <Text variant="body-2">
                                                Выходной файл: {conversionResult.output}
                                            </Text>
                                        )}
                                    </Flex>
                                </Card>

                                {(conversionResult.logs?.stdout ||
                                    conversionResult.logs?.stderr ||
                                    conversionResult.logs?.args) && (
                                    <Flex direction="column" gap="1">
                                        <Text variant="header-2" as="h3">
                                            Логи:
                                        </Text>
                                        <pre className={b('console-output')}>
                                            {conversionResult.logs?.args && (
                                                <Text variant={'code-1'} className={b('log-line')}>
                                                    {`$ ${conversionResult.logs.args.join(' ')}\n`}
                                                </Text>
                                            )}
                                            {conversionResult.logs?.stdout && (
                                                <Text variant={'code-1'} className={b('log-line')}>
                                                    {conversionResult.logs.stdout}
                                                </Text>
                                            )}
                                            {conversionResult.logs?.stderr && (
                                                <Text
                                                    variant={'code-1'}
                                                    className={b('log-line')}
                                                    color="danger"
                                                >
                                                    {' '}
                                                    {conversionResult.logs.stderr}
                                                </Text>
                                            )}
                                            {conversionResult.logs?.returncode !== undefined && (
                                                <Text variant={'code-1'} className={b('log-line')}>
                                                    {`Return Code: ${conversionResult.logs.returncode}\n`}
                                                </Text>
                                            )}
                                        </pre>
                                    </Flex>
                                )}
                            </Flex>
                        )}

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
                                onClick={handleStartConversion}
                                disabled={
                                    !form.file || form.outName.trim().length === 0 || isUploading
                                }
                            >
                                {isUploading ? 'Обработка...' : 'Старт конвертации'}
                            </Button>
                        </Flex>
                    </Flex>
                )}
            </div>
        </div>
    );
};
