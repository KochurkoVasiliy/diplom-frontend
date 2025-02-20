import {Suspense} from 'react';

import block from 'bem-cn-lite';
import {Outlet} from 'react-router';

import './LandingLayout.scss';
const b = block('landing-layout');

export const LandingLayout = () => {
    return (
        <div className={b('wrapper')}>
            <div className={b('container')}>
                ghbdt
                <Suspense>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    );
};
