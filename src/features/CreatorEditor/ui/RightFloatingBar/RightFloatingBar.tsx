import {Button, Checkbox, Flex, Icon, NumberInput, Popup, Text, TextInput} from '@gravity-ui/uikit';
import {Plus, TrashBin} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import './RightFloatingBar.scss';
import React, {useCallback} from 'react';
import {useGraphContext} from '@/app/providers';
import {SelectionEvent} from '@gravity-ui/graph/build/graphEvents';
import {TBlock, TBlockId, TConnection, TConnectionId} from '@gravity-ui/graph';
const b = block('property-bar');
export const RightFloatingBar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const {graph, deleteSelected} = useGraphContext();
    const [selectedBlock, setSelectedBlock] = React.useState<TBlock[] | null>(null);
    const [selectedConnections, setSelectedConnections] = React.useState<TConnection[] | null>(
        null,
    );

    React.useEffect(() => {
        const handleSelectionBlockChange = (event: SelectionEvent<TBlockId>) => {
            if (event.detail.list.length !== 0) {
                const blocks: TBlock[] = [];
                event.detail.list.forEach((item) => {
                    blocks.push(graph.api.getBlockById(item));
                });
                setSelectedBlock(blocks);
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        graph.on('blocks-selection-change', handleSelectionBlockChange);
        return () => {
            graph.off('blocks-selection-change', handleSelectionBlockChange);
        };
    }, [graph]);

    const handleUpdate = (key: string, value: any, blockId: TBlockId) => {
        // Получаем текущий блок
        const currentBlock = graph.api.getBlockById(blockId);

        // Создаем новый meta, сохраняя все существующие свойства
        const updatedMeta = {
            ...currentBlock.meta, // Копируем все существующие свойства
            [key]: value, // Обновляем или добавляем новое свойство
        };

        // Обновляем граф
        graph.api.updateBlock({
            id: blockId,
            meta: updatedMeta, // Передаем обновлённый meta
        });

        // Обновляем состояние selectedBlock после обновления графа
        setSelectedBlock((prevBlocks) => {
            if (!prevBlocks) return prevBlocks;

            return prevBlocks.map((block) => {
                if (block.id === blockId) {
                    const newBlock = {
                        ...block, // Копируем все свойства блока
                        meta: {
                            ...block.meta, // Копируем все существующие свойства meta
                            [key]: value, // Обновляем или добавляем новое свойство
                        },
                    };
                    console.log(newBlock);
                    return newBlock;
                }
            });
        });
    };

    if (!isOpen && selectedBlock?.length !== 0) return null;
    return (
        <Flex className={b()} gap={1}>
            <Flex direction={'column'}>
                {selectedBlock?.map((block) => (
                    <Flex direction={'column'} key={block.id}>
                        <Text className={b('header')}>Свойства слоя: {block.name}</Text>
                        <Flex style={{paddingTop: '12px'}} direction={'column'} gap={'2'}>
                            {/* eslint-disable-next-line array-callback-return,consistent-return */}
                            {Object.entries(block.meta || {}).map(([key, value]) => {
                                const inputType = typeof value;
                                if (inputType === 'string' && value) {
                                    return (
                                        <Flex
                                            justifyContent={'space-between'}
                                            alignItems={'center'}
                                            gap={'2'}
                                        >
                                            <Text variant={'subheader-1'}>{key}</Text>
                                            <TextInput
                                                key={key}
                                                size={'m'}
                                                value={value.toString()}
                                                style={{width: 'fit-content', maxWidth: '124px'}}
                                                onUpdate={(val) => handleUpdate(key, val, block.id)}
                                            />
                                        </Flex>
                                    );
                                }
                                if (inputType === 'number') {
                                    return (
                                        <Flex
                                            justifyContent={'space-between'}
                                            alignItems={'center'}
                                            gap={'2'}
                                        >
                                            <Text variant={'subheader-1'}>{key}</Text>
                                            <NumberInput
                                                key={key}
                                                value={value}
                                                style={{width: 'fit-content', maxWidth: '124px'}}
                                                onUpdate={(val) => handleUpdate(key, val, block.id)}
                                            />
                                        </Flex>
                                    );
                                }
                                if (inputType === 'object') {
                                    return (
                                        <Flex direction="column" gap={1}>
                                            <Text variant={'subheader-1'}>{key}</Text>
                                            {Object.entries(value).map(
                                                ([nestedKey, nestedValue]) => {
                                                    const nestedInputType = typeof nestedValue;

                                                    return (
                                                        <Flex
                                                            key={nestedKey}
                                                            justifyContent={'space-between'}
                                                            alignItems={'center'}
                                                            gap={'2'}
                                                        >
                                                            <Text>⨽ {nestedKey}</Text>
                                                            {nestedInputType === 'string' && (
                                                                <TextInput
                                                                    value={nestedValue}
                                                                    style={{
                                                                        width: 'fit-content',
                                                                        maxWidth: '124px',
                                                                    }}
                                                                    onUpdate={(val) => {
                                                                        // Обновляем только вложенное свойство
                                                                        const updatedValue = {
                                                                            ...value, // Копируем все свойства объекта
                                                                            [nestedKey]: val, // Обновляем текущее свойство
                                                                        };
                                                                        handleUpdate(
                                                                            key,
                                                                            updatedValue,
                                                                            block.id,
                                                                        );
                                                                    }}
                                                                />
                                                            )}
                                                            {nestedInputType === 'number' && (
                                                                <NumberInput
                                                                    value={nestedValue}
                                                                    style={{
                                                                        width: 'fit-content',
                                                                        maxWidth: '124px',
                                                                    }}
                                                                    onUpdate={(val) => {
                                                                        // Обновляем только вложенное свойство
                                                                        const updatedValue = {
                                                                            ...value, // Копируем все свойства объекта
                                                                            [nestedKey]: val, // Обновляем текущее свойство
                                                                        };
                                                                        handleUpdate(
                                                                            key,
                                                                            updatedValue,
                                                                            block.id,
                                                                        );
                                                                    }}
                                                                />
                                                            )}
                                                            {/* Добавьте другие типы ввода по необходимости */}
                                                        </Flex>
                                                    );
                                                },
                                            )}
                                        </Flex>
                                    );
                                }
                            })}
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
};
