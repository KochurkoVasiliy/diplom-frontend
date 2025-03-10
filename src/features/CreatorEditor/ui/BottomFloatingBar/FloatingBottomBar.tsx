import {Button, Flex, Icon, Popup, text} from '@gravity-ui/uikit';
import {Plus, TrashBin} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import './FloatingBottomBar.scss';
import React from 'react';
import {useGraphContext} from '@/app/providers';
import {SelectionEvent} from '@gravity-ui/graph/build/graphEvents';
import {TBlockId, TConnection} from '@gravity-ui/graph';
import {PopoverCard, popoverCardTypes} from './PopoverCard';
import {useKeyPress} from '@/shared/hooks';
const b = block('creator-bottom-bar');

const captionText = text({variant: 'caption-2'});
export const FloatingBottomBar = () => {
    const createButtonRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [selectedBlock, setSelectedBlock] = React.useState<TBlockId[]>([]);
    const [selectedConnections, setSelectedConnections] = React.useState<TConnection[]>([]);
    const {graph, deleteSelected} = useGraphContext();

    useKeyPress('Delete', deleteSelected);

    React.useEffect(() => {
        const handleSelectionBlockChange = (event: SelectionEvent<TBlockId>) => {
            setSelectedBlock(event.detail.list);
        };

        const handleSelectionConnectionsChange = (event: SelectionEvent<TConnection>) => {
            setSelectedConnections(event.detail.list);
        };

        graph.on('blocks-selection-change', handleSelectionBlockChange);
        graph.on('connection-selection-change', handleSelectionConnectionsChange);
        return () => {
            graph.off('blocks-selection-change', handleSelectionBlockChange);
            graph.off('connection-selection-change', handleSelectionConnectionsChange);
        };
    }, [graph]);

    return (
        <Flex className={b()} gap={1}>
            <Button
                ref={createButtonRef}
                onClick={() => setOpen((prevOpen) => !prevOpen)}
                className={b('button')}
                view={'flat'}
            >
                <Flex direction={'column'} gap={'1'} className={b('button-container')}>
                    <Icon data={Plus} height={'16px'} />
                    <span className={captionText}>Добавить слой</span>
                </Flex>
            </Button>
            <Popup
                className={b('popup')}
                anchorElement={createButtonRef.current}
                open={open}
                placement="top"
            >
                {popoverCardTypes.map((type) => (
                    <PopoverCard setOpen={setOpen} key={type} type={type} />
                ))}
            </Popup>
            <Button
                view={'flat'}
                disabled={selectedBlock?.length === 0 && selectedConnections?.length === 0}
                className={b('button')}
                onClick={() => deleteSelected()}
            >
                <Flex direction={'column'} gap={'1'} className={b('button-container')}>
                    <Icon data={TrashBin} height={'16px'} />
                    <span className={captionText}>Удалить</span>
                </Flex>
            </Button>
        </Flex>
    );
};
