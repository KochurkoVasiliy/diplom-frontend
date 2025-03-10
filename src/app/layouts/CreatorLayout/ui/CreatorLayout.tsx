import {Button, DropdownMenu, DropdownMenuItem, Flex, Icon} from '@gravity-ui/uikit';
import {Suspense} from 'react';
import {FolderArrowLeft, House, Play, Plus} from '@gravity-ui/icons';
import {Outlet} from 'react-router';
import block from 'bem-cn-lite';
import './CreatorLayout.scss';
import {GraphProvider} from '@/app/providers';
import {ECanChangeBlockGeometry, HookGraphParams, useGraph} from '@gravity-ui/graph';
import axios from 'axios';

const b = block('creator-layout');

const dropdownMenuItems: DropdownMenuItem[] = [
    {
        action: () => console.log('Rename'),
        text: 'На главную',
        iconStart: <Icon data={House} />,
    },
    {
        action: () => console.log('Rename'),
        text: 'К проектам',
        iconStart: <Icon data={FolderArrowLeft} />,
    },
];

const config: HookGraphParams = {
    layers: undefined,
    settings: {
        useBezierConnections: true,
        canCreateNewConnections: true,
        //useBlocksAnchors: true,
        canChangeBlockGeometry: ECanChangeBlockGeometry.ONLY_SELECTED,
        blockComponents: {},
        showConnectionArrows: true,
        showConnectionLabels: true,
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

export const CreatorLayout = () => {
    const {graph, start} = useGraph(config);
    const handleStartButton = async () => {
        try {
            const blocks = graph.rootStore.blocksList.$blocks.value;
            const connections = graph.rootStore.connectionsList.$connections.value;
            console.log(blocks);
            const payload = {
                name: 'NNLayers',
                blocks: blocks.map((block) => ({
                    id: block.id,
                    description: block.$state.value.is,
                    meta: block.$state.value.meta,
                })),
                connections: connections.map((connection) => ({
                    id: connection.id,
                    sourceId: connection.$state.value.sourceBlockId,
                    targetId: connection.$state.value.targetBlockId,
                })),
            };
            const response = await axios.post('http://localhost:8000/generate_code', payload);

            console.log('Данные успешно отправлены:', response.data);
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };
    return (
        <Suspense>
            <GraphProvider graph={graph} start={start}>
                <Flex direction={'column'} className={b()}>
                    <Flex className={b('menu')}>
                        <Flex>
                            <DropdownMenu size={'xl'} items={dropdownMenuItems} />
                            <Button
                                title={'Вернуться на страницу проектов'}
                                view={'flat'}
                                size={'xl'}
                                pin={'brick-brick'}
                            >
                                <Icon size={18} data={Plus} />
                            </Button>
                        </Flex>
                        <Button view={'outlined-success'} onClick={handleStartButton}>
                            <Icon data={Play} />
                            Запустить
                        </Button>
                    </Flex>
                    <Outlet />
                </Flex>
            </GraphProvider>
        </Suspense>
    );
};
