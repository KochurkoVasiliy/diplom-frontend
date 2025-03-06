import {BlockState, ESelectionStrategy, TBlock, TBlockId} from '@gravity-ui/graph';
import React from 'react';
import {ArrowToggle, Button, Flex, Icon, Text} from '@gravity-ui/uikit';
import './TreeNode.scss';
import block from 'bem-cn-lite';
import {SelectionEvent} from '@gravity-ui/graph/build/graphEvents';
import {useGraphContext} from '@/app/providers';
import {CircleFill} from '@gravity-ui/icons';

const b = block('tree-node');
export const TreeNode = ({
    block,
    onSelect,
}: {
    block: BlockState<TBlock>;
    onSelect: (id: string, selected: boolean) => void;
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const hasChildren = block.$anchorStates.value.length > 0;
    const [isSelected, setIsSelected] = React.useState(false);
    const {graph} = useGraphContext();
    React.useEffect(() => {
        const handleSelectionChange = (event: SelectionEvent<TBlockId>) => {
            setIsSelected(false);
            event.detail.list.forEach((item) => {
                if (block.id === item) {
                    setIsSelected(true);
                }
            });
        };

        graph.on('blocks-selection-change', handleSelectionChange);
        return () => {
            graph.off('blocks-selection-change', handleSelectionChange);
        };
    }, [graph]);

    const selectBlock = () => {
        graph.api.selectBlocks([block.id], true, ESelectionStrategy.REPLACE);
    };

    return (
        <div className={b({selected: isSelected})}>
            <Flex className={b('header')} onClick={() => console.log('1')}>
                <Button disabled={!hasChildren} size={'xs'} view={'flat'} onClick={() => setIsOpen(!isOpen)}>
                    <ArrowToggle direction={isOpen ? 'bottom' : 'right'} />
                </Button>
                <Text onClick={selectBlock} variant={'body-1'}>{block.$state.value.name}</Text>
            </Flex>
            {hasChildren && isOpen && (
                <div className={b('node-children')}>
                    {block.$anchorStates.value.map((anchor) => (
                        <Flex key={anchor.id} className={b('node-children_content')}>
                            <Icon data={CircleFill} size={6}/>
                            <Text variant={'body-1'}>{anchor.id}</Text>
                        </Flex>
                    ))}
                </div>
            )}
        </div>
    );
};
