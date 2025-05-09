import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import {Box, Button, Divider, Flex, Text} from '@gravity-ui/uikit';
import {DynamicFormField} from '@/features/DynamicFormField';
import {useOptimizationForm} from '../model/useOptimizationForm';
import block from 'bem-cn-lite';
import './OptimizationForm.scss';

const b = block('optimization-form');

interface OptimizationFormProps {
    onSubmitSuccess?: () => void;
    sseConnect?: () => void;
}

export const OptimizationForm: React.FC<OptimizationFormProps> = ({
    onSubmitSuccess,
    sseConnect,
}) => {
    const {
        formValues,
        selectedFile,
        selectedDatasetFile,
        isSubmitting,
        handleInputChange,
        handleFileChange,
        handleDatasetFileChange,
        handleSubmit,
        formStructure,
    } = useOptimizationForm({onSubmitSuccess, sseConnect});

    const ScriptFileInputButton = () => {
        const fileInputRef = React.useRef<HTMLInputElement>(null);

        const handleClick = () => {
            fileInputRef.current?.click();
        };

        const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0] || null;
            handleFileChange(file);
        };

        return (
            <Flex direction="column" gap="2">
                <Text variant={'body-2'}>Python Скрипт:</Text>
                <Button onClick={handleClick} size={'xl'}>
                    {selectedFile ? selectedFile.name : 'Выберите файл .py'}
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    style={{display: 'none'}}
                    accept=".py"
                />
            </Flex>
        );
    };

    const DatasetFileInputButton = () => {
        const datasetFileInputRef = React.useRef<HTMLInputElement>(null);

        const handleClick = () => {
            datasetFileInputRef.current?.click();
        };

        const onDatasetFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0] || null;
            handleDatasetFileChange(file);
        };

        return (
            <Flex direction="column" gap="2">
                <Text variant={'body-2'}>Датасет (ZIP архив):</Text>
                <Button onClick={handleClick} size={'xl'}>
                    {selectedDatasetFile ? selectedDatasetFile.name : 'Выберите файл .zip'}
                </Button>
                <input
                    type="file"
                    ref={datasetFileInputRef}
                    onChange={onDatasetFileChange}
                    style={{display: 'none'}}
                    accept=".zip,.application/zip,.application/x-zip-compressed"
                />
            </Flex>
        );
    };

    return (
        <Flex direction={'column'} className={b()}>
            <Box style={{height: '85%', overflowY: 'auto'}}>
                {formStructure.map((group) => (
                    <React.Fragment key={group.id}>
                        <Box spacing={{p: 3}}>
                            <Text variant={'subheader-2'}>{group.title}</Text>
                        </Box>
                        <Divider />
                        <Box spacing={{p: 3}}>
                            <Flex direction={'column'} gap={'4'}>
                                {group.fields.map((field) => (
                                    <DynamicFormField
                                        key={field.id}
                                        field={field}
                                        value={formValues[field.id]}
                                        onUpdate={(val) => handleInputChange(field.id, val)}
                                    />
                                ))}
                            </Flex>
                        </Box>
                    </React.Fragment>
                ))}
            </Box>
            <Divider />
            <Box spacing={{p: 3}}>
                <Flex direction={'column'} gap={'4'}>
                    <ScriptFileInputButton />
                    <DatasetFileInputButton />
                    <Button
                        size={'xl'}
                        view="action"
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        disabled={!selectedFile || !selectedDatasetFile || isSubmitting}
                    >
                        Запустить оптимизацию
                    </Button>
                </Flex>
            </Box>
            <Box spacing={{p: 3}} style={{minHeight: '15%'}} className={b('debug-output')}>
                <Text variant="code-2" as="pre">
                    {JSON.stringify(
                        {
                            formValues: formValues,
                            selectedScriptFile: selectedFile ? selectedFile.name : null,
                            selectedDatasetFile: selectedDatasetFile
                                ? selectedDatasetFile.name
                                : null,
                        },
                        null,
                        2,
                    )}
                </Text>
            </Box>
        </Flex>
    );
};
