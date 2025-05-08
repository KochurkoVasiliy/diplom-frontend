import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import {Flex, NumberInput, Select, Switch, Text, TextInput} from '@gravity-ui/uikit';
import type {FormFieldConfig} from '@/entities/OptimizationConfig'; // Assuming barrel export

interface DynamicFormFieldProps {
    field: FormFieldConfig;
    value: any;
    onUpdate: (value: any) => void;
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({field, value, onUpdate}) => {
    const commonProps = {
        // key: field.id, // Key should be applied by the parent component looping
        gap: '2',
        justifyContent: 'space-between',
        direction: field.type === 'switch' ? 'row' : 'column',
        alignItems: field.type === 'switch' ? 'center' : undefined,
        style: {marginBottom: '16px'},
    } as const;

    return (
        <Flex {...commonProps}>
            <Text variant={'body-2'}>{field.label}</Text>
            {field.type === 'text' && (
                <TextInput
                    size={'xl'}
                    value={value || ''}
                    onUpdate={onUpdate}
                    placeholder={field.placeholder}
                />
            )}
            {field.type === 'number' && (
                <NumberInput
                    size={'xl'}
                    step={(field as any).step || 0.1} // Cast if TS complains about step
                    value={value}
                    onUpdate={onUpdate}
                    placeholder={field.placeholder}
                />
            )}
            {field.type === 'switch' && (
                <Switch size={'m'} checked={value || false} onUpdate={onUpdate} />
            )}
            {field.type === 'select' && (
                <Select
                    size={'xl'}
                    placeholder={field.placeholder || 'Выберите значение'}
                    options={(field as any).options} // Cast if TS complains
                    value={value ? [value] : []}
                    onUpdate={(val) => onUpdate(val[0])}
                />
            )}
        </Flex>
    );
};
