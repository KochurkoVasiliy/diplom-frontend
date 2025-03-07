import {TBlock, TBlockId} from '@gravity-ui/graph';
import React from 'react';
import {useGraphContext} from '@/app/providers';
import {SelectionEvent} from '@gravity-ui/graph/build/graphEvents';

export const useRightFloatingBar = () => {
    const {graph} = useGraphContext();
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedBlock, setSelectedBlock] = React.useState<TBlock[] | null>(null);

    React.useEffect(() => {
        const handleSelectionBlockChange = (event: SelectionEvent<TBlockId>) => {
            if (event.detail.list.length !== 0) {
                const blocks: TBlock[] = [];
                event.detail.list.forEach((item) => {
                    blocks.push(graph.api.getBlockById(item));
                    console.log("text", blocks)
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
        const currentBlock = graph.api.getBlockById(blockId);
        console.log(key, value, blockId, currentBlock);
        // Функция для рекурсивного обновления вложенных свойств
        const updateNestedProperty = (obj: any, keys: string[], value: any) => {
            const [currentKey, ...restKeys] = keys;
            if (restKeys.length === 0) {
                obj[currentKey] = value;
            } else {
                if (!obj[currentKey]) {
                    obj[currentKey] = {};
                }
                updateNestedProperty(obj[currentKey], restKeys, value);
            }
        };

        // Разбиваем ключ на части
        const keys = key.split('.');

        // Создаем копию meta, чтобы не мутировать исходный объект
        const updatedMeta = { ...currentBlock.meta };

        // Обновляем вложенное свойство
        updateNestedProperty(updatedMeta, keys, value);

        // Обновляем блок в графе
        graph.api.updateBlock({
            id: blockId,
            meta: updatedMeta,
        });

        // Обновляем состояние selectedBlock
        setSelectedBlock((prevBlocks) => {
            if (!prevBlocks) return prevBlocks;

            return prevBlocks.map((block) => {
                if (block.id === blockId) {
                    return {
                        ...block,
                        meta: updatedMeta,
                    };
                }
                return block;
            });
        });
    };

    return {
        isOpen,
        selectedBlock,
        handleUpdate,
    };
};
