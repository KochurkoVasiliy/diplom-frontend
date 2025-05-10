import {Tab, TabList, TabPanel, TabProvider} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {ConsoleOutput} from '@/features/ConsoleOutput';
import {MetricsCharts} from '@/widgets/MetricsCharts';
import {useResultsDisplayTabs} from '../model/useResultsDisplayTabs';
import './ResultsDisplay.scss';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';

const b = block('results-display');
interface ResultsDisplayProps {
    consoleLogs: string; // Логи из SSE
    // Теперь chartData это объект, где ключи - названия графиков, а значения - YagrWidgetData
    chartData?: {
        loss: YagrWidgetData;
        val_loss: YagrWidgetData;
        metric: YagrWidgetData;
        val_metric: YagrWidgetData;
    };
    isStreaming?: boolean; // Статус стриминга SSE
    streamError?: string | null; // Ошибка SSE
}
export const ResultsDisplay = ({
    consoleLogs,
    chartData, // Деструктурируем chartData
    isStreaming,
    streamError,
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
                    <MetricsCharts chartData={chartData} /> {/* Передаем chartData сюда */}
                </TabPanel>
                <TabPanel
                    value="consoleTab"
                    className={b('tab-panel', {active: activeTab === 'consoleTab'})}
                >
                    <ConsoleOutput
                        logData={consoleLogs}
                        isLoading={isStreaming} // Предполагаем, что стриминг = загрузка логов
                        error={streamError}
                    />
                </TabPanel>
            </TabProvider>
        </div>
    );
};
