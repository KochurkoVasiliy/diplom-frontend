import {Suspense} from 'react';
import {Outlet} from 'react-router';

export const CreatorLayout = () => {
    return (
        <Suspense>
            <Outlet />
        </Suspense>
    );
};
