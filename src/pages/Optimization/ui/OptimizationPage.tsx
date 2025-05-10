import {Divider, Flex} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {ResultsDisplay} from '@/widgets/ResultsDisplay';
import {OptimizationForm} from '@/widgets/OptimizationForm';
import {useOptimizationStream} from '@/shared/lib/useOptimizationStream';
import './OptimizationPage.scss';
import {useEffect} from 'react';

const b = block('optimization-page');

export const OptimizationPage = () => {
    const {
        consoleLogs,
        chartData, // Теперь это объект с данными графиков
        isStreaming,
        error: streamError,
        connect: startStream,
        disconnect: stopStream,
        clearStreamData,
        handleStreamMessage, // Получаем обработчик сообщений
        setError: setStreamError, // Получаем функцию установки ошибки
    } = useOptimizationStream();

    useEffect(() => {
        return () => {
            stopStream(); // Убедимся, что стрим остановлен при размонтировании компонента
        };
    }, [stopStream]);

    const handleFormSubmitSuccess = () => {
        console.log('Form submitted successfully. Preparing for SSE stream...');
        clearStreamData(); // Очищаем предыдущие данные перед новым запуском
        startStream(); // Сообщаем хуку useOptimizationStream, что стриминг ожидается
    };

    return (
        <Flex className={b()}>
            <div className={b('left-panel')}>
                <ResultsDisplay
                    consoleLogs={consoleLogs}
                    chartData={chartData} // Передаем объект, содержащий все данные графиков
                    isStreaming={isStreaming}
                    streamError={streamError}
                />
            </div>
            <Divider orientation={'vertical'} />
            <div className={b('right-panel')}>
                <OptimizationForm
                    onSubmitSuccess={handleFormSubmitSuccess}
                    // Передаем обработчики из useOptimizationStream в OptimizationForm
                    onSseMessage={handleStreamMessage}
                    onSseError={(err) => setStreamError(err.message)}
                    onSseOpen={startStream} // Переименован для ясности
                    onSseClose={stopStream} // Добавляем обработчик закрытия стрима
                />
            </div>
        </Flex>
    );
};
