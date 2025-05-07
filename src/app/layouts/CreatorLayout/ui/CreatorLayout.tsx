import {
    Button,
    DropdownMenu,
    DropdownMenuItem,
    Flex,
    Icon,
    ToastProps,
    ToasterComponent,
    useToaster,
} from '@gravity-ui/uikit';
import React, {Suspense} from 'react';
import {CircleExclamationFill, FolderArrowLeft, House, Play, Plus} from '@gravity-ui/icons';
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
    const {add} = useToaster();
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
            add({
                actions: [],
                autoHiding: undefined,
                className: '',
                content: undefined,
                isClosable: false,
                name: '',
                onClose(): void {},
                renderIcon(toastProps: ToastProps): React.ReactNode {
                    return undefined;
                },
                theme: undefined,

                title: 'response.status.toString(),',
            });
            console.log('Данные успешно отправлены:', response.data);
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
            let errorTitle = 'Ошибка';
            let errorMessage = 'Произошла неизвестная ошибка';

            // Проверяем, что error является объектом и имеет свойство value
            if (typeof error === 'object' && error !== null && 'value' in error) {
                const errorValue = (error as {value: unknown}).value;

                // Проверяем, что value является объектом и имеет свойства title и message
                if (typeof errorValue === 'object' && errorValue !== null) {
                    if ('title' in errorValue && typeof errorValue.title === 'string') {
                        errorTitle = errorValue.title;
                    }
                    if ('message' in errorValue && typeof errorValue.message === 'string') {
                        errorMessage = errorValue.message;
                    }
                }
            }

            // Добавляем уведомление об ошибке
            add({
                name: 'error-notification', // Уникальное имя для уведомления
                title: errorTitle,
                content: errorMessage,
                theme: 'danger', // Используем тему "danger" для ошибок
                isClosable: true, // Позволяем пользователю закрыть уведомление
                autoHiding: 5000, // Автоматически скрываем уведомление через 5 секунд
                renderIcon: (toastProps: ToastProps) => (
                    <Icon data={CircleExclamationFill} size={16} /> // Иконка для уведомления
                ),
                actions: [
                    {
                        label: 'Понятно',
                        onClick: () => {},
                    },
                ],
            });
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
                <ToasterComponent className="optional additional classes" />
            </GraphProvider>
        </Suspense>
    );
};
