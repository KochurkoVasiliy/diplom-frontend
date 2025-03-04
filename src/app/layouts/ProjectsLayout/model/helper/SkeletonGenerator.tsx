import {Loader} from '@gravity-ui/uikit';
import {useLocation} from 'react-router';

export const SkeletonGenerator = () => {
    const location = useLocation();

    switch (location.pathname) {
        default:
            return <Loader size="l" />;
    }
};
