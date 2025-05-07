import {Suspense} from 'react';
import {Outlet} from 'react-router';
import {Flex} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

const b = block('convert-layout');

export const ConvertLayout = () => {
    return (
        <Flex className={b()} direction="column">
            <Flex justifyContent={'center'} className={b('header')}>
                <h1 className={b('title')}>Конвертация моделей</h1>
            </Flex>
            <Suspense>
                <Outlet />
            </Suspense>
        </Flex>
    );
};

export default ConvertLayout;
