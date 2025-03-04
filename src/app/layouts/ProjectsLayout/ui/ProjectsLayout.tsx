import {ErrorBoundary} from '@/shared';
import {Loader} from '@gravity-ui/uikit';
import {Suspense} from 'react';
import {Outlet} from 'react-router';

export const ProjectsLayout = () => {
    return (
        <Suspense>
            <ErrorBoundary fallback={<Loader size="l" />}>
                <Suspense>
                    <Outlet />
                </Suspense>
            </ErrorBoundary>
        </Suspense>
    );
};
