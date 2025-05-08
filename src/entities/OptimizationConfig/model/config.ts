import type {FormGroupConfig} from './types';

export const formStructureConfig: FormGroupConfig[] = [
    {
        id: 'optimizationParams',
        title: 'Параметры оптимизации',
        fields: [
            {
                id: 'experimentName',
                label: 'Название эксперимента:',
                type: 'text',
                placeholder: 'Введите название',
            },
            {
                id: 'learningRate',
                label: 'Скорость обучения:',
                type: 'number',
                step: 0.001,
                placeholder: '0.01',
            },
            {id: 'useEarlyStopping', label: 'Ранняя остановка:', type: 'switch'},
        ],
    },
    {
        id: 'modelArchitecture',
        title: 'Архитектура модели',
        fields: [
            {
                id: 'optimizer',
                label: 'Оптимизатор:',
                type: 'select',
                placeholder: 'Выберите оптимизатор',
                options: [
                    {value: 'adam', content: 'Adam'},
                    {value: 'sgd', content: 'SGD'},
                    {value: 'rmsprop', content: 'RMSprop'},
                ],
            },
            {
                id: 'activationFunction', // Note: Duplicate ID - FSD won't fix this, you should.
                label: 'Функция активации:',
                type: 'select',
                placeholder: 'Выберите функцию',
                options: [
                    {value: 'relu', content: 'ReLU'},
                    {value: 'sigmoid', content: 'Sigmoid'},
                    {value: 'tanh', content: 'Tanh'},
                ],
            },
            {
                id: 'layersCount',
                label: 'Количество слоев:',
                type: 'number',
                step: 1,
                placeholder: '3',
            },
        ],
    },
];

export const getInitialFormValues = (): Record<string, any> => {
    const initialValues: Record<string, any> = {};
    formStructureConfig.forEach((group) => {
        group.fields.forEach((field) => {
            if (field.type === 'switch') {
                initialValues[field.id] = false;
            } else if (field.type === 'number') {
                initialValues[field.id] = undefined; // Or a default number like 0
            } else {
                initialValues[field.id] = '';
            }
        });
    });
    return initialValues;
};
