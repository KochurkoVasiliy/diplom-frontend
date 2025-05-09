import ChartKit from '@gravity-ui/chartkit';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import block from 'bem-cn-lite';
import {initialChartData} from '../config/initialChartData';
import './MetricsCharts.scss';

const b = block('metrics-charts');

export const MetricsCharts = () => {
    // In a real app, chartData might come as props or from a store/hook
    const chartData1 = initialChartData; // Example
    const chartData2 = {
        ...initialChartData,
        libraryConfig: {...initialChartData.libraryConfig, title: {text: 'val_loss'}},
    };

    const chartData3 = {
        ...initialChartData,
        libraryConfig: {...initialChartData.libraryConfig, title: {text: 'metric'}},
    };

    const chartData4 = {
        ...initialChartData,
        libraryConfig: {...initialChartData.libraryConfig, title: {text: 'val_metric'}},
    };


    return (
        <div className={b()}>
            <div className={b('item')}>
                <ChartKit type="yagr" data={chartData1} />
            </div>
            <div className={b('item')}>
                <ChartKit type="yagr" data={chartData2} />
            </div>
            <div className={b('item')}>
                <ChartKit type="yagr" data={chartData3} />
            </div>
            <div className={b('item')}>
                <ChartKit type="yagr" data={chartData4} />
            </div>
        </div>
    );
};
