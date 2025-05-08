import type { YagrWidgetData } from '@gravity-ui/chartkit/yagr';

export const initialChartData: YagrWidgetData = {
    data: {
        timeline: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        graphs: [
            // {
            //     id: '0',
            //     name: 'Serie 1',
            //     color: '#c25969',
            //     data: [25, 52, 89, 72, 39, 49, 82, 59, 36, 5],
            // },
        ],
    },
    libraryConfig: {
        chart: {series: {type: 'line'}},
        title: {text: 'Loss (Потери)'},
        tooltip: {show: true},
    },
};
