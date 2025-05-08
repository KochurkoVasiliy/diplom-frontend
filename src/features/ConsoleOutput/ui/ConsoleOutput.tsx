// eslint-disable-next-line @typescript-eslint/no-redeclare
import {Box, Button, Flex, Text} from '@gravity-ui/uikit';
// Removed the useConsoleLog import, will get data via props
// import {useConsoleLog} from '../model/useConsoleLog'; // REMOVE THIS IMPORT
import React, {useEffect, useRef} from 'react'; // Added useEffect and useRef

interface ConsoleOutputProps {
    logData: string; // Receive logs as a prop
    isLoading?: boolean; // Loading state from parent (SSE)
    error?: string | null; // Error state from parent (SSE)
    // clearLogs: () => void; // Function to clear logs from parent (optional, parent might control clear)
    // fetchConsoleData?: () => void; // Removed, fetching is now via SSE
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
    logData,
    isLoading,
    error,
    // clearLogs, // Accept clearLogs from parent
    // fetchConsoleData // No longer needed
}) => {
    // Simple internal state for clearing the display
    const [internalLogData, setInternalLogData] = React.useState(logData);
    const consoleEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling

    // Update internal state when external prop changes
    useEffect(() => {
        setInternalLogData(logData);
    }, [logData]);

    // Auto-scroll to the bottom when logs update
    useEffect(() => {
        if (consoleEndRef.current) {
            consoleEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [internalLogData]);

    const handleClearLogs = () => {
        setInternalLogData(''); // Clear internal state
        // If parent needs to know about clear, add a callback prop
        // onClear?.();
    };

    return (
        <Box spacing={{p: 3}}>
            <Flex gap={2} style={{marginBottom: '16px'}}>
                {/* Removed Update button as streaming is automatic */}
                {/* <Button view="action" onClick={fetchConsoleData} loading={isLoading}>
                    Обновить логи
                </Button> */}
                <Text variant="body-2" style={{marginRight: 'auto'}}>
                    Логи выполнения:
                </Text>{' '}
                {/* Added label */}
                <Button
                    view="normal"
                    onClick={handleClearLogs}
                    disabled={!internalLogData} // Disable if no internal log data
                >
                    Очистить
                </Button>
            </Flex>
            {isLoading && !internalLogData && <Text>Загрузка логов...</Text>}
            {error && <Text color="danger">{error}</Text>}
            {internalLogData ? (
                <pre
                    style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word', // Changed from break-all to break-word
                        color: '#1d3c1d',
                        borderRadius: '4px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        padding: '10px',
                        background: '#f0f0f0',
                        border: '1px solid #e0e0e0', // Added border
                    }}
                >
                    {internalLogData}
                    <div ref={consoleEndRef} /> {/* Element to scroll to */}
                </pre>
            ) : (
                !isLoading && !error && <Text>Нет данных для отображения.</Text>
            )}
        </Box>
    );
};
