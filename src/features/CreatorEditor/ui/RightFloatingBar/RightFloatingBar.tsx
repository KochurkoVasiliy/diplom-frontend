import {Button, Flex, Icon, NumberInput, Popup, Text} from '@gravity-ui/uikit';
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
    if(!isOpen){
        return null;
    }
    return (
        <Flex className={b()} gap={1}>
            <Flex direction={'column'} >
                <Text className={b('header')}>Свойства слоя: {graph.rootStore.blocksList.$selectedBlocks.value[0].asTBlock().name}</Text>
                <Flex className={b('property-wrapper')}>
                    <Text variant={'caption-2'}>in_channels:</Text>
                    <NumberInput size={'s'}/>
                </Flex>
            </Flex>
        </Flex>
    );
};
