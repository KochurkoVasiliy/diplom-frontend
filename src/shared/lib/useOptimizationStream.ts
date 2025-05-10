import {useCallback, useState} from 'react';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
import {initialChartData} from '@/widgets/MetricsCharts/config/initialChartData';

// Определяем типы для входящих данных обновления графика
interface ChartUpdateData {
    epoch: number;
    loss?: number;
    val_loss?: number;
    metric?: number;
    val_metric?: number;
    // Добавьте другие метрики, если необходимо
}

// Определяем типы для общих сообщений из SSE
interface StreamMessage {
    type: 'log' | 'chartUpdate' | 'status'; // Возможные типы сообщений
    data: string | ChartUpdateData; // Данные могут быть строкой для логов или ChartUpdateData для графиков
}

export const useOptimizationStream = () => {
    const [consoleLogs, setConsoleLogs] = useState<string>('');
    // Состояние для данных графиков, инициализируем структурой для нескольких графиков
    const [chartData, setChartData] = useState<{
        loss: YagrWidgetData;
        val_loss: YagrWidgetData;
        metric: YagrWidgetData;
        val_metric: YagrWidgetData;
    }>(() => ({
        loss: {
            ...initialChartData,
            libraryConfig: {...initialChartData.libraryConfig, title: {text: 'loss'}},
        },
        val_loss: {
            ...initialChartData,
            libraryConfig: {...initialChartData.libraryConfig, title: {text: 'val_loss'}},
        },
        metric: {
            ...initialChartData,
            libraryConfig: {...initialChartData.libraryConfig, title: {text: 'metric'}},
        },
        val_metric: {
            ...initialChartData,
            libraryConfig: {...initialChartData.libraryConfig, title: {text: 'val_metric'}},
        },
    }));
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStreamMessage = useCallback((message: StreamMessage) => {
        if (message.type === 'log' && typeof message.data === 'string') {
            setConsoleLogs((prev) => prev + message.data + '\n');
        } else if (message.type === 'chartUpdate' && typeof message.data === 'object') {
            const update: ChartUpdateData = message.data;
            const epoch = update.epoch;

            setChartData((prevChartData) => {
                const newChartData = {...prevChartData};

                // Обновляем данные каждого графика
                if (update.loss !== undefined) {
                    // Гарантируем, что graphs[0] существует и имеет данные
                    const currentLossGraphs = newChartData.loss.data?.graphs || [];
                    if (currentLossGraphs.length === 0) {
                        currentLossGraphs.push({
                            id: 'loss-series',
                            name: 'Loss',
                            color: '#c25969',
                            data: [],
                        });
                    }
                    newChartData.loss = {
                        ...newChartData.loss,
                        data: {
                            timeline: [...(newChartData.loss.data?.timeline || []), epoch],
                            graphs: [
                                {
                                    ...currentLossGraphs[0],
                                    data: [
                                        ...((currentLossGraphs[0].data as number[]) || []),
                                        update.loss,
                                    ],
                                },
                            ],
                        },
                    };
                }
                if (update.val_loss !== undefined) {
                    const currentValLossGraphs = newChartData.val_loss.data?.graphs || [];
                    if (currentValLossGraphs.length === 0) {
                        currentValLossGraphs.push({
                            id: 'val_loss-series',
                            name: 'Validation Loss',
                            color: '#5969c2',
                            data: [],
                        });
                    }
                    newChartData.val_loss = {
                        ...newChartData.val_loss,
                        data: {
                            timeline: [...(newChartData.val_loss.data?.timeline || []), epoch],
                            graphs: [
                                {
                                    ...currentValLossGraphs[0],
                                    data: [
                                        ...((currentValLossGraphs[0].data as number[]) || []),
                                        update.val_loss,
                                    ],
                                },
                            ],
                        },
                    };
                }
                if (update.metric !== undefined) {
                    const currentMetricGraphs = newChartData.metric.data?.graphs || [];
                    if (currentMetricGraphs.length === 0) {
                        currentMetricGraphs.push({
                            id: 'metric-series',
                            name: 'Metric',
                            color: '#59c269',
                            data: [],
                        });
                    }
                    newChartData.metric = {
                        ...newChartData.metric,
                        data: {
                            timeline: [...(newChartData.metric.data?.timeline || []), epoch],
                            graphs: [
                                {
                                    ...currentMetricGraphs[0],
                                    data: [
                                        ...((currentMetricGraphs[0].data as number[]) || []),
                                        update.metric,
                                    ],
                                },
                            ],
                        },
                    };
                }
                if (update.val_metric !== undefined) {
                    const currentValMetricGraphs = newChartData.val_metric.data?.graphs || [];
                    if (currentValMetricGraphs.length === 0) {
                        currentValMetricGraphs.push({
                            id: 'val_metric-series',
                            name: 'Validation Metric',
                            color: '#c2a159',
                            data: [],
                        });
                    }
                    newChartData.val_metric = {
                        ...newChartData.val_metric,
                        data: {
                            timeline: [...(newChartData.val_metric.data?.timeline || []), epoch],
                            graphs: [
                                {
                                    ...currentValMetricGraphs[0],
                                    data: [
                                        ...((currentValMetricGraphs[0].data as number[]) || []),
                                        update.val_metric,
                                    ],
                                },
                            ],
                        },
                    };
                }

                return newChartData;
            });
        }
    }, []);

    // Эти функции будут вызываться OptimizationForm для управления состоянием стриминга
    const startStream = useCallback(() => {
        setIsStreaming(true);
        setError(null);
    }, []);

    const stopStream = useCallback(() => {
        setIsStreaming(false);
    }, []);

    const clearStreamData = useCallback(() => {
        setConsoleLogs('');
        // Сбрасываем данные графиков в исходное состояние
        setChartData({
            loss: {
                ...initialChartData,
                libraryConfig: {...initialChartData.libraryConfig, title: {text: 'loss'}},
            },
            val_loss: {
                ...initialChartData,
                libraryConfig: {...initialChartData.libraryConfig, title: {text: 'val_loss'}},
            },
            metric: {
                ...initialChartData,
                libraryConfig: {...initialChartData.libraryConfig, title: {text: 'metric'}},
            },
            val_metric: {
                ...initialChartData,
                libraryConfig: {...initialChartData.libraryConfig, title: {text: 'val_metric'}},
            },
        });
    }, []);

    return {
        consoleLogs,
        chartData, // Теперь это объект с YagrWidgetData для каждого графика
        isStreaming,
        error,
        connect: startStream, // Переименовываем для ясности в OptimizationPage
        disconnect: stopStream, // Переименовываем для ясности
        clearStreamData,
        handleStreamMessage, // Открываем для использования в useOptimizationForm
        setError, // Открываем для использования в useOptimizationForm для передачи ошибок SSE
    };
};
