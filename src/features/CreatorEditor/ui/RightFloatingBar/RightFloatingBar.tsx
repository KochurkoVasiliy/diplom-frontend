import {Button, Checkbox, Flex, Icon, NumberInput, Popup, Text, TextInput} from '@gravity-ui/uikit';
import {Plus, TrashBin} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import './RightFloatingBar.scss';
import React, {useCallback} from 'react';
import {useGraphContext} from '@/app/providers';
import {SelectionEvent} from '@gravity-ui/graph/build/graphEvents';
import {TBlockId} from '@gravity-ui/graph';
const b = block('property-bar');
export const RightFloatingBar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedBlockId, setSelectedBlockId] = React.useState<TBlockId[] | null>(null);
    const {graph, deleteSelected} = useGraphContext();

    React.useEffect(() => {
        const handleSelectionChange = (event: SelectionEvent<TBlockId>) => {
            setSelectedBlockId(event.detail.list);
            if(event.detail.list.length !== 0){
                console.log(graph.rootStore.blocksList.$selectedBlocks.value[0].asTBlock());
                setIsOpen(true);
            }
            else {
                setIsOpen(false);
            }
        };

        graph.on('blocks-selection-change', handleSelectionChange);
        return () => {
            graph.off('blocks-selection-change', handleSelectionChange);
        };
    }, [graph]);

    const selectedBlock = graph.rootStore.blocksList.$selectedBlocks.value[0]?.asTBlock();
    const meta = selectedBlock?.meta || {};

    const handleMetaChange = (key: string, value: string | number | boolean) => {
        if (!selectedBlock) return;

        // Создаем обновленный meta объект
        const updatedMeta = {
            ...selectedBlock.meta,
            [key]: value
        };

        // Вызываем updateBlock с правильной сигнатурой
        graph.api.updateBlock({
            id: selectedBlock.id,
            meta: updatedMeta
        });
    };

    if (!isOpen || !selectedBlock) return null;
    return (
        <Flex className={b()} gap={1}>
            <Flex direction={'column'} >
                <Text className={b('header')}>Свойства слоя: {graph.rootStore.blocksList.$selectedBlocks.value[0].asTBlock().name}</Text>
                <Flex className={b('property-wrapper')}>
                    <Text variant={'caption-2'}>in_channels:</Text>
                    <NumberInput size={'s'}/>
                </Flex>
                {Object.entries(meta).map(([key, value]) => {
                    const inputType = typeof value;

                    return (
                        <Flex className={b('property-wrapper')} key={key}>
                            <Text variant={'caption-2'}>{key}:</Text>

                            {inputType === 'number' && (
                                <NumberInput
                                    size="s"
                                    value={value as number}
                                    onChange={(e) =>
                                        handleMetaChange(key, Number(e.target.value))
                                    }
                                />
                            )}

                            {inputType === 'string' && (
                                <TextInput
                                    size="s"
                                    value={value as string}
                                    onChange={(e) =>
                                        handleMetaChange(key, e.target.value)
                                    }
                                />
                            )}

                            {inputType === 'boolean' && (
                                <Checkbox
                                    checked={value as boolean}
                                    onChange={(e) =>
                                        handleMetaChange(key, e.target.checked)
                                    }
                                />
                            )}
                        </Flex>
                    );
                })}
            </Flex>
        </Flex>
    );
};
