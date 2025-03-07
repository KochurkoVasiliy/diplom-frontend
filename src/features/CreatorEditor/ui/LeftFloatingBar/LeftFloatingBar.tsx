import {Box, Button, Flex, Text} from '@gravity-ui/uikit';
import React from 'react';
import block from 'bem-cn-lite';
import './LeftFloatingBar.scss';
import {useGraphContext} from '@/app/providers';
import {SelectionEvent} from '@gravity-ui/graph/build/graphEvents';
import {TBlockId} from '@gravity-ui/graph';
import type {BlockState} from '@gravity-ui/graph';
import {TreeView} from '@/widgets/TreeView/ui/TreeView';

const b = block('left-floating-bar');

export const LeftFloatingBar = () => {
    const {graph, subscribeToDelete, unsubscribeFromDelete, deleteSelected} = useGraphContext();

    React.useEffect(() => {
        const handleSelectionChange = (event: SelectionEvent<TBlockId>) => {
        };

        graph.on('blocks-selection-change', handleSelectionChange);
        return () => {
            graph.off('blocks-selection-change', handleSelectionChange);
        };
    }, [graph]);

    React.useEffect(() => {
        const handleDelete = (deletedBlocks: BlockState[]) => {
            console.log('Удалены блоки:', deletedBlocks[0].id);
        };

        subscribeToDelete(handleDelete);
        return () => unsubscribeFromDelete(handleDelete);
    }, [subscribeToDelete, unsubscribeFromDelete]);

    return (
        <Flex className={b()}>
            <Flex direction={'column'} className={b('tree-container')}>
                <Text className={b('tree-container_header')} avariant={'body-1'}>Список слоев</Text>
                <TreeView />
            </Flex>
        </Flex>
    );
};
