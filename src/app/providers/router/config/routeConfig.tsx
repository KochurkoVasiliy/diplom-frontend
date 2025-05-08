import {createBrowserRouter} from 'react-router';

import {App} from '@/app/App';
import {ConvertLayout, CreatorLayout, LandingLayout, ProjectsLayout} from '@/app/layouts';
import {CreatorEditorPage} from '@/pages/Creator';
import {Error404Page} from '@/pages/Error404Page';
import {ROUTES} from '@/shared/config/router/routes';
import {OnnxToTensorRT} from '@/pages/Convert';
import ConvertMainPage from '@/pages/Convert/ConvertMainPage/ui/ConvertMainPage';
import {OptimizationPage} from '@/pages/Optimization';

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
            {
                path: ROUTES.projectsRoute,
                element: <ProjectsLayout />,
                children: [
                    {
                        index: true,
                        element: <div>Creator</div>,
                    },
                ],
            },
            {
                path: ROUTES.creatorRoute,
                element: <ProjectsLayout />,
                children: [
                    {
                        index: true,
                        element: <div>Creator</div>,
                    },
                    {
                        path: ROUTES.creatorEditorRoute,
                        element: <CreatorLayout />,
                        children: [
                            {
                                index: true,
                                element: <CreatorEditorPage />,
                            },
                        ],
                    },
                ],
            },
            {
                path: ROUTES.convertationRoute,
                element: <ConvertLayout />,
                children: [
                    {
                        index: true,
                        element: <ConvertMainPage />,
                    },
                    {
                        path: ROUTES.onnxToTrtConverterRoute,
                        element: <OnnxToTensorRT />,
                    },
                ],
            },
            {
                // Базовый путь для всех роутов оптимизации
                path: '/optimization', // Можно оставить '/' если роуты полные, но лучше сгруппировать
                // element: <OptimizationLayout />, // Если для оптимизации нужен отдельный Layout
                element: <OptimizationPage />,
            },
        ],
    },
]);
