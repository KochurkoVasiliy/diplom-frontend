import {useGraphContext} from '@/app/providers';
import React from 'react';
import type {BlockState, TBlock} from '@gravity-ui/graph';
import {Flex} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import './TreeView.scss';
import {TreeNode} from './TreeNode';
const b = block('tree-view');

export const TreeView = () => {
    const {graph, subscribeToDelete, unsubscribeFromDelete} = useGraphContext();
    const [graphBlocks, setGraphBlocks] = React.useState<BlockState<TBlock>[]>(
        graph.rootStore.blocksList.$blocks.value,
    );

    // Подписка на изменения списка блоков
    React.useEffect(() => {
        const updateBlocks = () => {
            setGraphBlocks([...graph.rootStore.blocksList.$blocks.value]);
        };

        const unsubscribe = graph.rootStore.blocksList.$blocks.subscribe(updateBlocks);
        return () => unsubscribe();
    }, [graph]);

    // Обработка удаления блоков
    React.useEffect(() => {
        const handleDelete = (deletedBlocks: BlockState<TBlock>[]) => {
            setGraphBlocks((prev) =>
                prev.filter((block) => !deletedBlocks.some((deleted) => deleted.id === block.id)),
            );
        };

        subscribeToDelete(handleDelete);
        return () => unsubscribeFromDelete(handleDelete);
    }, [subscribeToDelete, unsubscribeFromDelete]);

    // Обработчик выбора блока
    const handleSelect = (blockId: string, selected: boolean) => {
        const block = graphBlocks.find((b) => b.id === blockId);
        block?.setSelection(selected);
    };

    return (
        <Flex className={b()}>
            {graphBlocks.map((block) => (
                <TreeNode key={block.id.toString()} block={block} onSelect={handleSelect} />
            ))}
        </Flex>
    );
};
