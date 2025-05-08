import {useCallback, useRef, useState} from 'react';
import type {YagrWidgetData} from '@gravity-ui/chartkit/yagr';

// Define types for expected SSE events
export interface LogEvent {
    type: 'log';
    message: string;
}

export interface ChartUpdateEvent {
    type: 'chartUpdate';
    data: YagrWidgetData; // Or a partial update type depending on backend
}

export type SSEEvent = LogEvent | ChartUpdateEvent;

export const useOptimizationStream = (sseEndpoint: string) => {
    const [logs, setLogs] = useState<string>('');
    const [chartData, setChartData] = useState<YagrWidgetData | null>(null); // State for chart data
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    const connect = useCallback(() => {
        if (!sseEndpoint) {
            console.warn('SSE endpoint is not provided.');
            return;
        }
        if (eventSourceRef.current) {
            console.warn('SSE connection already exists.');
            return;
        }

        setIsStreaming(true);
        setError(null);
        setLogs(''); // Clear logs on new connection
        setChartData(null); // Clear chart data on new connection

        const es = new EventSource(sseEndpoint);
        eventSourceRef.current = es;

        es.onopen = () => {
            console.log('SSE connection opened.');
            setIsStreaming(true); // Ensure state is true
            setError(null);
        };

        es.onmessage = (event) => {
            try {
                const data: SSEEvent = JSON.parse(event.data);
                console.log('SSE message received:', data);

                if (data.type === 'log') {
                    setLogs((prevLogs) => (prevLogs ? prevLogs + '\n' : '') + data.message);
                } else if (data.type === 'chartUpdate') {
                    // Backend sends the full data structure for simplicity in this example
                    // In a real app, you might send partial updates and merge them
                    setChartData(data.data);
                } else {
                    console.warn('Unknown SSE event type:', data);
                }
            } catch (parseError: any) {
                console.error('Failed to parse SSE data:', parseError, 'Data:', event.data);
                setError('Failed to process SSE data.');
            }
        };

        es.onerror = (err) => {
            console.error('SSE Error:', err);
            setError('SSE connection error. See console for details.');
            setIsStreaming(false);
            es.close();
            eventSourceRef.current = null;
        };

        // Optional: Add a listener for a custom 'end' event from the server
        // es.addEventListener('end', () => {
        //     console.log('SSE stream ended by server.');
        //     setIsStreaming(false);
        //     es.close();
        //     eventSourceRef.current = null;
        // });
    }, [sseEndpoint]);

    const disconnect = useCallback(() => {
        if (eventSourceRef.current) {
            console.log('Closing SSE connection.');
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            setIsStreaming(false);
        }
    }, []);

    const clearStreamData = useCallback(() => {
        setLogs('');
        setChartData(null);
    }, []);

    // Auto-connect on component mount if desired, or call connect manually
    // useEffect(() => {
    //      connect();
    //      return () => disconnect();
    // }, [connect, disconnect]); // Dependency on connect/disconnect ensures reconnect if endpoint changes (unlikely)

    return {
        logs,
        chartData,
        isStreaming,
        error,
        connect, // Function to start the stream
        disconnect, // Function to stop the stream
        clearStreamData, // Function to clear displayed data without stopping stream
    };
};
