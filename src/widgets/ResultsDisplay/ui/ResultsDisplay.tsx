import {Tab, TabList, TabPanel, TabProvider} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {ConsoleOutput} from '@/features/ConsoleOutput';
import {MetricsCharts} from '@/widgets/MetricsCharts'; // Assuming you created this
import {useResultsDisplayTabs} from '../model/useResultsDisplayTabs';
import './ResultsDisplay.scss';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';

const b = block('results-display');
interface ResultsDisplayProps {
    consoleLogs: string; // Logs from SSE
    chartData?: YagrWidgetData | null; // Chart data from SSE
    isStreaming?: boolean; // SSE streaming status
    streamError?: string | null; // SSE error
    // clearConsoleLogs: () => void; // Optional: pass clear function down
}
export const ResultsDisplay = ({
    consoleLogs,
    chartData,
    isStreaming,
    streamError,
    // clearConsoleLogs
}: ResultsDisplayProps) => {
    const {activeTab, handleTabUpdate} = useResultsDisplayTabs('chartsTab');

    return (
        <div className={b()}>
            <TabProvider value={activeTab} onUpdate={handleTabUpdate}>
                <TabList size="l" className={b('tab-list')}>
                    <Tab value="chartsTab">Графики</Tab>
                    <Tab value="consoleTab">Консоль</Tab>
                </TabList>
                <TabPanel
                    value="chartsTab"
                    className={b('tab-panel', {active: activeTab === 'chartsTab'})}
                >
                    <MetricsCharts />
                </TabPanel>
                <TabPanel
                    value="consoleTab"
                    className={b('tab-panel', {active: activeTab === 'consoleTab'})}
                >
                    {/* Pass console logs, status, and error to ConsoleOutput */}
                    <ConsoleOutput
                        logData={consoleLogs}
                        isLoading={isStreaming} // Assuming streaming = loading logs
                        error={streamError}
                        // clearLogs={clearConsoleLogs} // Pass clear function
                    />
                </TabPanel>
            </TabProvider>
        </div>
    );
};
