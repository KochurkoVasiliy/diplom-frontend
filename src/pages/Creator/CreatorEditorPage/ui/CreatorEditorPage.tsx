import {FloatingBottomBar, LeftFloatingBar} from '@/features';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
    EAnchorType,
    ECanChangeBlockGeometry,
    ESelectionStrategy,
    GraphBlock,
    GraphBlockAnchor,
    GraphCanvas,
    GraphState,
    HookGraphParams,
    TBlock,
    useGraph,
} from '@gravity-ui/graph';
import {Box, Button, Flex, Icon, Text} from '@gravity-ui/uikit';
import React, {useCallback} from 'react';
import {GraphProvider, useGraphContext} from '@/app/providers';
import block from 'bem-cn-lite';
import './CreatorEditorPage.scss';
import {RightFloatingBar} from '@/features/CreatorEditor/ui/RightFloatingBar/RightFloatingBar';
import {
    createActionBlock,
    createActionBlock1,
} from '@/pages/Creator/CreatorEditorPage/ui/generateLayout';
import {Layers3Diagonal} from '@gravity-ui/icons';
const b = block('creator-editor');

export const CreatorEditorPage = () => {
    const {graph, start} = useGraphContext();
    return (
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
    );
};

const renderBlockFn = (graph, block: TBlock) => {

    return (
        <GraphBlock
            graph={graph}
            block={block}
            containerClassName={'GraphBlock'}
            className={'GraphBlock__container'}
        >
            <Flex className={'GraphBlock__wrapper'}>
                <Flex className={'block-content__name'}>
                    <Text variant={'subheader-1'}>{block.name}</Text>
                    <Icon data={Layers3Diagonal} />
                </Flex>
                <Box>
                    <Text variant={'caption-1'} color={'secondary'}>Id: {block.id.toString()}</Text>
                </Box>
            </Flex>
        </GraphBlock>
    );
};
