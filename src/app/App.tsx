import {Suspense} from 'react';

import {Outlet} from 'react-router';

import './styles/App.scss';

export const App = () => {
    return (
        <Suspense>
            <Outlet />
        </Suspense>
    );
};
