import {Divider, Flex} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import './OptimizationPage.scss';
const b = block('optimization');
export const OptimizationPage = () => {
    return (
        <Flex className={b()}>
            <div className={b('graphics')}>graphics</div>
            <Divider orientation={'vertical'} />
            <Flex className={b('properties')}>properties</Flex>
        </Flex>
    );
};
