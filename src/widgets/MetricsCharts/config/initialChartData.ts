import type {YagrWidgetData} from '@gravity-ui/chartkit/yagr';

export const initialChartData: YagrWidgetData = {
    data: {
        timeline: [], // Начинаем с пустого timeline
        graphs: [], // Графики будут добавляться динамически
    },
    libraryConfig: {
        chart: {series: {type: 'line'}},
        title: {text: ''}, // Заголовок будет устанавливаться родительским компонентом
        tooltip: {show: true},
    },
};
