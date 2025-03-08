import React from 'react';
import {Flex, NumberInput, Switch, Text, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {useRightFloatingBar} from '../../../../lib/useRightFloatingBar';
import './PropertyInput.scss';
const b = block('property-input');

type PropertyInputProps = {
    blockId: string;
    propertyKey: string;
    value: any;
};

export const PropertyInput = ({blockId, propertyKey, value: initialValue}: PropertyInputProps) => {
    const {handleUpdate} = useRightFloatingBar();
    const inputType = typeof initialValue;

    // Локальное состояние для значения
    const [localValue, setLocalValue] = React.useState(initialValue);

    // Синхронизация локального значения с глобальным
    React.useEffect(() => {
        setLocalValue(initialValue);
    }, [initialValue]);

    // Обработчик изменения значения
    const handleValueChange = (newValue: any) => {
        setLocalValue(newValue); // Обновляем локальное состояние
        console.log(propertyKey);
        handleUpdate(propertyKey, newValue, blockId); // Обновляем глобальное состояние
    };

    if (inputType === 'object') {
        return (
            <Flex className={b('group')}>
                <Text className={b('group__label')} variant="subheader-1">
                    {propertyKey}
                </Text>
                {Object.entries(initialValue).map(([nestedKey, nestedValue]) => (
                    <PropertyInput
                        key={nestedKey}
                        blockId={blockId}
                        propertyKey={`${propertyKey}.${nestedKey}`}
                        value={nestedValue}
                    />
                ))}
            </Flex>
        );
    }

    return (
        <Flex className={b()}>
            <Text className={b('label')} variant="body-1">
                {propertyKey}
            </Text>
            {inputType === 'string' && (
                <TextInput
                    className={b('input')}
                    disabled={propertyKey === 'layer_type'}
                    value={localValue}
                    onUpdate={handleValueChange}
                />
            )}
            {inputType === 'number' && (
                <NumberInput
                    className={b('input')}
                    value={localValue}
                    onUpdate={handleValueChange}
                    allowDecimal
                />
            )}
            {inputType === 'boolean' && (
                <Switch className={b('input')} checked={localValue} onUpdate={handleValueChange} />
            )}
        </Flex>
    );
};
