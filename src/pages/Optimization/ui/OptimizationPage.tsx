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
        chartData,
        isStreaming,
        error: streamError,
        connect: startStream,
        disconnect: stopStream,
        clearStreamData,
        handleStreamMessage,
        setError: setStreamError,
    } = useOptimizationStream();

    useEffect(() => {
        return () => {
            stopStream();
        };
    }, [stopStream]);

    const handleFormSubmitSuccess = () => {
        console.log('Form submitted successfully. Preparing for SSE stream...');
        startStream();
    };

    const handleFormBeforeSubmit = () => {
        console.log('Clearing previous stream data before new submission...');
        clearStreamData();
    };

    return (
        <Flex className={b()}>
            <div className={b('left-panel')}>
                <ResultsDisplay
                    consoleLogs={consoleLogs}
                    chartData={chartData}
                    isStreaming={isStreaming}
                    streamError={streamError}
                />
            </div>
            <Divider orientation={'vertical'} />
            <div className={b('right-panel')}>
                <OptimizationForm
                    onSubmitSuccess={handleFormSubmitSuccess}
                    onBeforeSubmit={handleFormBeforeSubmit}
                    onSseMessage={handleStreamMessage}
                    onSseError={(err) => setStreamError(err.message)}
                    onSseOpen={startStream}
                    onSseClose={stopStream}
                />
            </div>
        </Flex>
    );
};
