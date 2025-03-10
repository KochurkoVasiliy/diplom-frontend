import {Card, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import './PopoverCard.scss';
import {useGraphContext} from '@/app/providers';
import {v4 as uuidv4} from 'uuid';
const b = block('popup-card');

export const popoverCardTypes = [
    'Linear',
    'Conv2d',
    'BatchNorm2d',
    'LayerNorm',
    'LSTM',
    'MaxPool2d',
    'AvgPool2d',
    'AdaptiveMaxPool2d',
    'ReLU',
    'Sigmoid',
    'Tanh',
    'Dropout',
    'Softmax',
    'Conv1d',
    'Conv3d',
    'BatchNorm1d',
    'BatchNorm3d',
    'Embedding',
    'GRU',
    'RNN',
    'TransformerEncoder',
    'TransformerDecoder',
    'MultiheadAttention',
    'LeakyReLU',
    'Upsample',
    'Flatten',
    'PixelShuffle',
    'Dropout2d',
    'InstanceNorm2d',
    'ReflectionPad2d',
    'AdaptiveAvgPool2d',
    'ELU',
    'Unflatten',
    'Add',
    'Sub',
    'Mul',
    'Mean'

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
    BatchNorm2d: {
        meta: {
            description: 'Batch normalization layer',
            layer_type: 'BatchNorm2d',
            num_features: 64, // Количество каналов
            eps: 0.00001, // Добавлено
            momentum: 0.1, // Добавлено
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
            eps: 0.00001, // Добавлено
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
            dropout: 0.0, // Добавлено
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
    ReLU: {
        meta: {
            description: 'Rectified Linear Unit activation',
            layer_type: 'ReLU',
            inplace: false
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    Sigmoid: {
        meta: {
            description: 'Sigmoid activation function',
            layer_type: 'Sigmoid'
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    Tanh: {
        meta: {
            description: 'Hyperbolic Tangent activation',
            layer_type: 'Tanh'
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    Dropout: {
        meta: {
            description: 'Randomly zeroes input elements',
            layer_type: 'Dropout',
            p: 0.5,
            inplace: false
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    Softmax: {
        meta: {
            description: 'Softmax activation',
            layer_type: 'Softmax',
            dim: 1
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    Conv1d: {
        meta: {
            description: '1D convolution for sequential data',
            layer_type: 'Conv1d',
            in_channels: 3,
            out_channels: 64,
            kernel_size: [3],
            stride: [1],
            padding: [1],
            dilation: [1],
            groups: 1,
            bias: true
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    Conv3d: {
        meta: {
            description: '3D convolution for volumetric data',
            layer_type: 'Conv3d',
            in_channels: 3,
            out_channels: 64,
            kernel_size: [3, 3, 3],
            stride: [1, 1, 1],
            padding: [1, 1, 1],
            dilation: [1, 1, 1],
            groups: 1,
            bias: true
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    BatchNorm1d: {
        meta: {
            description: 'Batch norm for 1D/sequential data',
            layer_type: 'BatchNorm1d',
            num_features: 64,
            eps: 1e-5,
            momentum: 0.1,
            affine: true,
            track_running_stats: true
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    BatchNorm3d: {
        meta: {
            description: 'Batch norm for 3D/volumetric data',
            layer_type: 'BatchNorm3d',
            num_features: 64,
            eps: 1e-5,
            momentum: 0.1,
            affine: true,
            track_running_stats: true
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    Embedding: {
        meta: {
            description: 'Learned embeddings for categorical data',
            layer_type: 'Embedding',
            num_embeddings: 1000,
            embedding_dim: 128,
            padding_idx: 0,
            max_norm: 0.0
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    GRU: {
        meta: {
            description: 'Gated Recurrent Unit layer',
            layer_type: 'GRU',
            input_size: 128,
            hidden_size: 256,
            num_layers: 2,
            bias: true,
            batch_first: true,
            dropout: 0.2,
            bidirectional: false
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    RNN: {
        meta: {
            description: 'Vanilla Recurrent Neural Network',
            layer_type: 'RNN',
            input_size: 128,
            hidden_size: 256,
            num_layers: 1,
            nonlinearity: 'tanh',
            bias: true,
            batch_first: true,
            dropout: 0.0
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    TransformerEncoder: {
        meta: {
            description: 'Stack of Transformer encoder layers',
            layer_type: 'TransformerEncoder',
            num_layers: 6,                 // Количество слоев
            d_model: 512,                  // Размер эмбеддингов
            nhead: 8,                      // Количество голов внимания
            dim_feedforward: 2048,         // Размер FFN слоя
            dropout: 0.1,                  // Общий дропаут
            activation: 'gelu',            // Активация FFN
            layer_norm_eps: 1e-5,          // Эпсилон для LayerNorm
            batch_first: true,             // Формат данных
            norm_first: false              // Стандартный порядок операций
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    TransformerDecoder: {
        meta: {
            description: 'Stack of Transformer decoder layers',
            layer_type: 'TransformerDecoder',
            num_layers: 6,
            d_model: 512,
            nhead: 8,
            dim_feedforward: 2048,
            dropout: 0.1,
            activation: 'gelu',
            layer_norm_eps: 1e-5,
            batch_first: true,
            norm_first: false
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    MultiheadAttention: {
        meta: {
            description: 'Multi-head self-attention',
            layer_type: 'MultiheadAttention',
            embed_dim: 512,
            num_heads: 8,
            dropout: 0.1,
            bias: true,
            add_bias_kv: false
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    LeakyReLU: {
        meta: {
            description: 'Leaky Rectified Linear Unit',
            layer_type: 'LeakyReLU',
            negative_slope: 0.01,
            inplace: false
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    Upsample: {
        meta: {
            description: 'Upsamples input data',
            layer_type: 'Upsample',
            scale_factor: 2,
            mode: 'nearest' // 'nearest' | 'linear' | 'bilinear' | 'bicubic' | 'trilinear'
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    Flatten: {
        meta: {
            description: 'Flattens input to 1D',
            layer_type: 'Flatten',
            start_dim: 1,
            end_dim: -1
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    PixelShuffle: {
        meta: {
            description: 'Rearranges elements in spatial blocks',
            layer_type: 'PixelShuffle',
            upscale_factor: 2
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    Dropout2d: {
        meta: {
            description: 'Spatial dropout for 2D data',
            layer_type: 'Dropout2d',
            p: 0.5,
            inplace: false
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    InstanceNorm2d: {
        meta: {
            description: 'Instance normalization for 2D data',
            layer_type: 'InstanceNorm2d',
            num_features: 64,
            eps: 1e-5,
            momentum: 0.1,
            affine: false,
            track_running_stats: false
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    ReflectionPad2d: {
        meta: {
            description: 'Reflection padding for 2D data',
            layer_type: 'ReflectionPad2d',
            padding: [1, 1, 1, 1] // [left, right, top, bottom]
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    AdaptiveAvgPool2d: {
        meta: {
            description: 'Adaptive average pooling for 2D',
            layer_type: 'AdaptiveAvgPool2d',
            output_size: [1, 1]
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    ELU: {
        meta: {
            description: 'Exponential Linear Unit activation',
            layer_type: 'ELU',
            alpha: 1.0,
            inplace: false
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    Unflatten: {
        meta: {
            description: 'Unflattens tensor to target shape',
            layer_type: 'Unflatten',
            dim: 1,
            unflattened_size: [32, 32] // Пример для изображений 32x32
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
    Add: {
        meta: {
            description: 'Element-wise addition',
            layer_type: 'Add',
            alpha: 1.0,     // Коэффициент для второго тензора (y = x1 + alpha * x2)
            inplace: false
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    Sub: {
        meta: {
            description: 'Element-wise subtraction',
            layer_type: 'Sub',
            alpha: 1.0,     // y = x1 - alpha * x2
            inplace: false
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    Mul: {
        meta: {
            description: 'Element-wise multiplication',
            layer_type: 'Mul',
            scale: 1.0,     // Дополнительный масштабирующий коэффициент (y = scale * x1 * x2)
            inplace: false
        },
        size: {width: 60 * 3, height: 60 * 2},
    },

    Mean: {
        meta: {
            description: 'Mean value across dimensions',
            layer_type: 'Mean',
            dim: [-1],      // По каким измерениям усреднять
            keepdim: false  // Сохранять ли размерность
        },
        size: {width: 60 * 3, height: 60 * 2},
    },
};

export const PopoverCard = ({type, setOpen}: PopoverCardType) => {
    const {graph} = useGraphContext();

    const layerNames = {
        Linear: 'Linear',
        Conv2d: 'Conv2D',
        BatchNorm2d: '2D Batch Norm',
        LayerNorm: 'Layer Normalization',
        LSTM: 'LSTM',
        MaxPool2d: 'Max Pooling 2D',
        AvgPool2d: 'Average Pooling 2D',
        AdaptiveMaxPool2d: 'Adaptive Max Pooling 2D',
        ReLU: 'ReLU Activation',
        Sigmoid: 'Sigmoid Activation',
        Tanh: 'Tanh Activation',
        Dropout: 'Dropout Layer',
        Softmax: 'Softmax Layer',
        Conv1d: '1D Convolution',
        Conv3d: '3D Convolution',
        BatchNorm1d: '1D Batch Norm',
        BatchNorm3d: '3D Batch Norm',
        Embedding: 'Embedding Layer',
        GRU: 'GRU Layer',
        RNN: 'RNN Layer',
        TransformerEncoder: 'Transformer Encoder Stack',
        TransformerDecoder: 'Transformer Decoder Stack',
        MultiheadAttention: 'Multihead Attention',
        LeakyReLU: 'Leaky ReLU',
        Upsample: 'Upsampling Layer',
        Flatten: 'Flatten Layer',
        PixelShuffle: 'Pixel Shuffle',
        Dropout2d: '2D Dropout',
        InstanceNorm2d: 'Instance Normalization',
        ReflectionPad2d: 'Reflection Padding 2D',
        AdaptiveAvgPool2d: 'Adaptive Avg Pool 2D',
        ELU: 'ELU Activation',
        Unflatten: 'Unflatten Layer',
        Add: 'Addition',
        Sub: 'Subtraction',
        Mul: 'Multiplication',
        Mean: 'Mean Value'
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
