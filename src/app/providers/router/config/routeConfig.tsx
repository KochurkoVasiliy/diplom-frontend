import {createBrowserRouter} from 'react-router';

import {App} from '@/app/App';
import {LandingLayout} from '@/app/layouts';
import {Error404Page} from '@/pages/Error404Page';
import {ROUTES} from '@/shared/config/router/routes';

/**
 * Конфигурация роутера
 *
 * @type {import('react-router').Router}
 */
export const router = createBrowserRouter([
    {
        path: ROUTES.appRoute,
        element: <App />,
        children: [
            {
                element: <LandingLayout />,
                children: [
                    {
                        index: true,
                        element: <div>Hello</div>,
                    },
                    {
                        path: '*',
                        element: <Error404Page />,
                    },
                ],
            },
        ],
    },
]);
