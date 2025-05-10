import ChartKit from '@gravity-ui/chartkit';
import block from 'bem-cn-lite';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
import {initialChartData} from '../config/initialChartData';
import './MetricsCharts.scss';

const b = block('metrics-charts');

interface MetricsChartsProps {
    chartData?: {
        loss: YagrWidgetData;
        val_loss: YagrWidgetData;
        metric: YagrWidgetData;
        val_metric: YagrWidgetData;
    };
}

export const MetricsCharts = ({chartData}: MetricsChartsProps) => {
    // Используем данные из пропсов или дефолтные, если пропсы еще не пришли
    const currentChartData = chartData || {
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
    };

    return (
        <div className={b()}>
            <div className={b('item')}>
                <ChartKit type="yagr" data={currentChartData.loss} />
            </div>
            <div className={b('item')}>
                <ChartKit type="yagr" data={currentChartData.val_loss} />
            </div>
            <div className={b('item')}>
                <ChartKit type="yagr" data={currentChartData.metric} />
            </div>
            <div className={b('item')}>
                <ChartKit type="yagr" data={currentChartData.val_metric} />
            </div>
        </div>
    );
};
