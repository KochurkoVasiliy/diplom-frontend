import {Button, Flex, Icon, Popup, text} from '@gravity-ui/uikit';
import {Plus, TrashBin} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import './FloatingBottomBar.scss';
import React, {useCallback} from 'react';
import {useGraphContext} from '@/app/providers';
import {SelectionEvent} from '@gravity-ui/graph/build/graphEvents';
import {TBlockId, TConnection} from '@gravity-ui/graph';
const b = block('creator-bottom-bar');

const captionText = text({variant: 'caption-2'});
export const FloatingBottomBar = () => {
    const createButtonRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [selectedBlockId, setSelectedBlockId] = React.useState<TBlockId[] | null>(null);
    const {graph, deleteSelected} = useGraphContext();
    const addBlock = useCallback(() => {
        const newBlock = {
            id: `block_${Date.now()}`,
            is: 'block-action', // Тип блока
            x: 0, // Позиция X
            y: 0, // Позиция Y
            width: 120, // Ширина блока
            height: 120, // Высота блока
            selected: false, // Выделен ли блок
            name: 'New Block', // Имя блока
            anchors: [], // Якоря блока
        };

        // Получаем текущие блоки и соединения
        graph.api.addBlock(newBlock);
    }, []);

    React.useEffect(() => {
        const handleSelectionChange = (event: SelectionEvent<TBlockId>) => {
            setSelectedBlockId(event.detail.list);
        };

        const handleSelectionChangeConnection = (event: SelectionEvent<TConnection>) => {

        };

        graph.on('blocks-selection-change', handleSelectionChange);
        graph.on('connection-selection-change', handleSelectionChangeConnection)
        console.log(graph.rootStore.blocksList.$selectedBlocks);
        return () => {
            graph.off('blocks-selection-change', handleSelectionChange);
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
            <Popup anchorElement={createButtonRef.current} open={open} placement="top">
                Content
            </Popup>
            <Button
                view={'flat'}
                disabled={selectedBlockId?.length == 0}
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
