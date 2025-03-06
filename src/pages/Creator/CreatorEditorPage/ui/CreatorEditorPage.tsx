import {FloatingBottomBar, LeftFloatingBar} from '@/features';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
    EAnchorType,
    ECanChangeBlockGeometry,
    ESelectionStrategy,
    GraphBlock, GraphBlockAnchor,
    GraphCanvas,
    GraphState,
    HookGraphParams, TBlock,
    useGraph,
} from '@gravity-ui/graph';
import {Box, Button, Flex} from '@gravity-ui/uikit';
import React, {useCallback} from 'react';
import {GraphProvider} from '@/app/providers';
import block from 'bem-cn-lite';
import './CreatorEditorPage.scss';
import {RightFloatingBar} from '@/features/CreatorEditor/ui/RightFloatingBar/RightFloatingBar';
import {createActionBlock, createActionBlock1} from "@/pages/Creator/CreatorEditorPage/ui/generateLayout";
const b = block('creator-editor');

const config: HookGraphParams = {
    layers: undefined,
    settings: {
        useBezierConnections: true,
        canCreateNewConnections: true,
        canChangeBlockGeometry: ECanChangeBlockGeometry.ALL,
        blockComponents: {},
    },
    viewConfiguration: {
        constants: {
            system: {
                GRID_SIZE: 60,
            },
            block: {
                SNAPPING_GRID_SIZE: 60,
            },
        },
    },
};

export const CreatorEditorPage = () => {
    const {graph, setEntities, start} = useGraph(config);
    React.useEffect(() => {
        setEntities({
            blocks: [createActionBlock(-100, 200, 1), createActionBlock1(-150, 250, 2)],
            connections: [],
        });
        graph.api.selectBlocks(['layer_1'], true, ESelectionStrategy.APPEND);
    }, []);

    const addBlock = useCallback(() => {
        const newBlock = {
            id: `block_${Date.now()}`, // Уникальный ID для блока
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

    const x = () => {
        graph.api.deleteSelected();
    };
    return (
        <GraphProvider graph={graph}>
            <Flex className={b()} width={'100%'} height={'100%'} style={{position: 'relative'}}>
                <LeftFloatingBar />
                <FloatingBottomBar />
                <RightFloatingBar />
                <GraphCanvas
                    className={b('graph-canvas')}
                    graph={graph}
                    renderBlock={renderBlockFn}
                    onStateChanged={({state}) => {
                        if (state === GraphState.ATTACHED) {
                            start();
                            graph.zoomTo('center', {padding: 300});
                        }
                    }}
                />
            </Flex>
        </GraphProvider>
    );
};

const renderBlockFn = (graph, block: TBlock) => {
    if(block.is === 'block-action') {
        return (
            <GraphBlock graph={graph} block={block}>
                <Flex style={{padding: 24}}>{block.meta?.description}</Flex>
                {block.anchors.map((anchor) => {
                    return (
                        <GraphBlockAnchor
                            className="block-anchor"
                            key={anchor.id}
                            position="absolute"
                            graph={graph}
                            anchor={anchor}
                        />
                    );
                })}
            </GraphBlock>
        )
    }

    return (
        <GraphBlock graph={graph} block={block}>
            <Flex style={{padding: 24}}>{block.meta.description}</Flex>
        </GraphBlock>
    );
};
