import {Divider, Flex} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
// Import updated components and the new SSE hook
import {ResultsDisplay} from '@/widgets/ResultsDisplay';
import {OptimizationForm} from '@/widgets/OptimizationForm';
import {useOptimizationStream} from '@/shared/lib/useOptimizationStream';
import './OptimizationPage.scss';
import {useEffect} from 'react';

const b = block('optimization-page');

// TODO: Define your SSE endpoint URL
const SSE_ENDPOINT = '/api/optimization-stream';

export const OptimizationPage = () => {
    const {
        logs: consoleLogs,
        chartData,
        isStreaming,
        error: streamError,
        connect: startStream,
        disconnect: stopStream,
        clearStreamData,
    } = useOptimizationStream(SSE_ENDPOINT);

    useEffect(() => {
        return () => {
            stopStream();
        };
    }, [stopStream]);

    const handleFormSubmitSuccess = () => {
        console.log('Form submitted successfully. Starting SSE stream...');
        clearStreamData();
        startStream();
    };

    // const handleStopOptimization = () => {
    //     // TODO
    //     stopStream(); // Stop the SSE stream
    // };

    return (
        <Flex className={b()}>
            <div className={b('left-panel')}>
                <ResultsDisplay
                    consoleLogs={consoleLogs}
                    chartData={chartData}
                    isStreaming={isStreaming}
                    streamError={streamError}
                    // Pass down a way to clear logs if needed
                    // clearConsoleLogs={clearStreamData}
                />
            </div>
            <Divider orientation={'vertical'} />
            <div className={b('right-panel')}>
                <OptimizationForm
                    onSubmitSuccess={handleFormSubmitSuccess}
                    sseConnect={startStream}
                />
            </div>
        </Flex>
    );
};
