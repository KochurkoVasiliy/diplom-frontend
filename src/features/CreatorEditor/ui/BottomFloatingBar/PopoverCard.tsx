import {Card, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import './PopoverCard.scss';
import {useGraphContext} from '@/app/providers';
import {v4 as uuidv4} from 'uuid';
const b = block('popup-card');

export const popoverCardTypes = [
    'Linear',
    'Conv2d',
    'BatchNorm',
    'LayerNorm',
    'LSTM',
    'MaxPool2d',
    'AvgPool2d',
    'AdaptiveMaxPool2d',
] as const;
export type PopoverCardType = {
    type: (typeof popoverCardTypes)[number];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type BlockConfig = {
    meta: {
        description: string;
        layer_type: (typeof popoverCardTypes)[number];
        [key: string]: any;
    };
    size: {
        width: number;
        height: number;
    };
    defaults: {
        position: {x: number; y: number};
    };
};

const blockConfigs: Record<(typeof popoverCardTypes)[number], BlockConfig> = {
    Linear: {
        meta: {
            description: 'Fully connected layer',
            layer_type: 'Linear',
            in_features: 512,
            out_features: 256,
        },
        size: {width: 60 * 3, height: 60 * 2},
        defaults: {
            position: {x: 0, y: 0},
        },
    },
    Conv2d: {
        meta: {
            description: '2D convolution layer',
            layer_type: 'Conv2d',
            in_channels: 3,
            out_channels: 64,
            kernel_size: [3, 3],
            stride: [1, 1],
        },
        size: {width: 60 * 3, height: 60 * 2},
        defaults: {
            position: {x: 0, y: 0},
        },
    },
    // Конфигурации для остальных типов...
};

export const PopoverCard = ({type, setOpen}: PopoverCardType) => {
    const {graph} = useGraphContext();

    const layerNames = {
        Linear: 'Linear',
        Conv2d: 'Conv2D',
        BatchNorm: 'Batch Normalization',
        LayerNorm: 'Layer Normalization',
        LSTM: 'LSTM',
        MaxPool2d: 'Max Pooling 2D',
        AvgPool2d: 'Average Pooling 2D',
        AdaptiveMaxPool2d: 'Adaptive Max Pooling 2D',
    };

    const handleClick = () => {
        const config = blockConfigs[type];

        console.log(graph.cameraService.getCameraState());

        graph.api.addBlock({
            id: uuidv4(), // Генерация уникального ID
            is: type,
            name: type,
            ...config.size,
            //x: config.defaults.position.x,
            x:
                graph.cameraService.getCameraState().x,
            y:
                graph.cameraService.getCameraState().y,
            meta: config.meta,
            anchors: [],
            selected: false,
        });
        setOpen(false);
    };

    return (
        <Card view={'outlined'} type={'action'} onClick={handleClick} className={b()}>
            <Text variant={'subheader-1'}>{layerNames[type]}</Text>
        </Card>
    );
};
