import {Button, DropdownMenu, DropdownMenuItem, Flex, Icon} from '@gravity-ui/uikit';
import {Suspense} from 'react';
import {FolderArrowLeft, House, Play, Plus} from '@gravity-ui/icons';
import {Outlet} from 'react-router';
import block from 'bem-cn-lite';
import './CreatorLayout.scss';
import {GraphProvider} from '@/app/providers';
import {ECanChangeBlockGeometry, HookGraphParams, useGraph} from '@gravity-ui/graph';

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
    const {graph, setEntities, start} = useGraph(config);
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
                        <Button view={'outlined-success'}>
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
