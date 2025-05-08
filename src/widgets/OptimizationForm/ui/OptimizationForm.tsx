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
        isSubmitting,
        handleInputChange,
        handleFileChange,
        handleSubmit,
        formStructure,
    } = useOptimizationForm({onSubmitSuccess, sseConnect});

    const FileInputButton = () => {
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
                {/* Hidden input */}
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

    return (
        <Flex direction={'column'} className={b()}>
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
                            {/* Add file input here or below a specific group */}
                        </Flex>
                    </Box>
                </React.Fragment>
            ))}

            {/* Add File Input Button and Submit Button outside groups but still in form area */}
            <Box spacing={{p: 3}}>
                <Flex direction={'column'} gap={'4'}>
                    <FileInputButton /> {/* File input */}
                    <Button
                        size={'xl'}
                        view="action"
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        disabled={!selectedFile || isSubmitting} // Disable if no file or submitting
                    >
                        Запустить оптимизацию
                    </Button>
                </Flex>
            </Box>

            {/* Debug output - keep for development */}
            <Box spacing={{p: 3}} className={b('debug-output')}>
                <Text variant="code-2" as="pre">
                    {JSON.stringify(
                        {
                            formValues: formValues,
                            selectedFile: selectedFile ? selectedFile.name : null,
                        },
                        null,
                        2,
                    )}
                </Text>
            </Box>
        </Flex>
    );
};
