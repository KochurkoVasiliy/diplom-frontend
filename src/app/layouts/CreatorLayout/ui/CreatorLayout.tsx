import {Button, DropdownMenu, DropdownMenuItem, Flex, Icon} from '@gravity-ui/uikit';
import {Suspense} from 'react';
import {FolderArrowLeft, House, Play, Plus} from '@gravity-ui/icons';
import {Outlet} from 'react-router';
import block from 'bem-cn-lite';
import './CreatorLayout.scss';

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

export const CreatorLayout = () => {
    return (
        <Suspense>
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
        </Suspense>
    );
};
