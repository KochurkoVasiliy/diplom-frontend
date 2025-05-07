// eslint-disable-next-line @typescript-eslint/no-redeclare
import {Flex, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {ConversionStepper} from './ConversionStepper';
import './ConvertPage.scss';

const b = block('convert-page');
export const OnnxToTensorRT = () => (
    <Flex direction="column" alignItems="center" className={b()} style={{padding: 24}}>
        <Text variant={'header-1'} className={b('title')}>
            ONNX → TensorRT Converter
        </Text>
        <ConversionStepper />
    </Flex>
);
