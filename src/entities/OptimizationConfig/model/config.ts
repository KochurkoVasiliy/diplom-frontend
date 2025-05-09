import type {FormGroupConfig} from './types';

export const formStructureConfig: FormGroupConfig[] = [
    {
        id: 'optimizationParams',
        title: 'Параметры обучения',
        fields: [
            {
                id: 'experimentName',
                label: 'Название обучения:',
                type: 'text',
                placeholder: 'Введите название',
            },
            {
                id: 'learningRate',
                label: 'Скорость обучения:',
                type: 'text',
                placeholder: '0.01',
            },
            {id: 'modelCheckPoint', label: 'Чекпоинт модели:', type: 'switch'},
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
                    {value: 'softmax', content: 'Softmax'},
                    {value: 'crossentropy', content: 'CrossEntropy'},
                ],
            },
            {
                id: 'metric', // Note: Duplicate ID - FSD won't fix this, you should.
                label: 'Метрика:',
                type: 'select',
                placeholder: 'Выберите метрику',
                options: [
                    {value: 'accuracy', content: 'Accuracy'},
                    {value: 'f1score', content: 'F1score'},
                    {value: 'rocauc', content: 'RocAuc'},
                ],
            },
            {
                id: 'epochs',
                label: 'Количество эпох:',
                type: 'number',
                step: 1,
                placeholder: '10',
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
