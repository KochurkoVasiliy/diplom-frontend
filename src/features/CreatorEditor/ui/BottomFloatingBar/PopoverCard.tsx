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
    },
    Conv2d: {
        meta: {
            description: '2D convolution layer',
            layer_type: 'Conv2d',
            in_channels: 3,
            out_channels: 64,
            kernel_size: [3, 3],
            stride: [1, 1],
            padding: [1, 1],
            dilation: [1, 1],
            groups: 1,
            bias: true,
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    BatchNorm: {
        meta: {
            description: 'Batch normalization layer',
            layer_type: 'BatchNorm',
            num_features: 64, // Количество каналов
            eps: '0.00001', // Добавлено
            momentum: '0.1', // Добавлено
            affine: true, // Добавлено
            track_running_stats: true, // Добавлено
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    LayerNorm: {
        meta: {
            description: 'Layer normalization layer',
            layer_type: 'LayerNorm',
            normalized_shape: [64], // Форма для нормализации
            eps: '0.00001', // Добавлено
            elementwise_affine: true, // Добавлено
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    LSTM: {
        meta: {
            description: 'Long Short-Term Memory layer',
            layer_type: 'LSTM',
            input_size: 128, // Размер входных данных
            hidden_size: 256, // Размер скрытого состояния
            num_layers: 2, // Количество слоев LSTM
            bias: true, // Добавлено
            batch_first: true, // Добавлено
            dropout: '0.0', // Добавлено
            bidirectional: false, // Добавлено
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    MaxPool2d: {
        meta: {
            description: '2D max pooling layer',
            layer_type: 'MaxPool2d',
            kernel_size: [2, 2], // Размер ядра
            stride: [2, 2], // Шаг
            padding: [0, 0], // Добавлено
            dilation: [1, 1], // Добавлено
            ceil_mode: false, // Добавлено
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    AvgPool2d: {
        meta: {
            description: '2D average pooling layer',
            layer_type: 'AvgPool2d',
            kernel_size: [2, 2], // Размер ядра
            stride: [2, 2], // Шаг
            padding: [0, 0], // Добавлено
            ceil_mode: false, // Добавлено
            count_include_pad: true, // Добавлено
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    AdaptiveMaxPool2d: {
        meta: {
            description: '2D adaptive max pooling layer',
            layer_type: 'AdaptiveMaxPool2d',
            output_size: [1, 1], // Желаемый размер выхода
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
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
            x: graph.cameraService.getCameraState().x,
            y: graph.cameraService.getCameraState().y,
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
