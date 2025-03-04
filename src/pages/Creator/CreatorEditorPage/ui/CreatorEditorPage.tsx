import {FloatingBottomBar, LeftFloatingBar} from '@/widgets';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
    EAnchorType,
    ECanChangeBlockGeometry,
    GraphBlock,
    GraphCanvas,
    GraphState,
    type TGraphConfig,
    useGraph,
} from '@gravity-ui/graph';
import {Flex} from '@gravity-ui/uikit';
import React from 'react';
const config: TGraphConfig = {
    configurationName: 'sample',
    cameraScale: 0.9,
    connections: [],
    settings: {
        useBezierConnections: true,
        canCreateNewConnections: true,
        canChangeBlockGeometry: ECanChangeBlockGeometry.ALL,
    },
};

export const CreatorEditorPage = () => {
    const {graph, setEntities, start} = useGraph(config);

    React.useEffect(() => {
        setEntities({
            blocks: [
                {
                    is: 'block',
                    id: 'action_1',
                    x: -100,
                    y: 200,
                    width: 126,
                    height: 126,
                    selected: false,
                    name: 'conv2d_1',
                    anchors: [
                        {
                            id: 'anchor-right-1',
                            blockId: 'action_1',
                            type: EAnchorType.OUT,
                            index: 0,
                        },
                        {
                            id: 'anchor-right-2',
                            blockId: 'action_1',
                            type: EAnchorType.IN,
                            index: 1,
                        },
                    ],
                },
                {
                    id: 'action_2',
                    is: 'block-action',
                    x: 253,
                    y: 176,
                    width: 126,
                    height: 126,
                    selected: false,
                    name: 'conv2d_1',
                    anchors: [],
                },
            ],
            connections: [],
        });
    });

    const renderBlockFn = (graph, block) => {
        return (
            <GraphBlock graph={graph} block={block}>
                {block.id}
            </GraphBlock>
        );
    };
    return (
        <Flex width={'100vw'} height={'100%'} style={{position: 'relative'}}>
            <LeftFloatingBar />
            <FloatingBottomBar />
            <GraphCanvas
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
