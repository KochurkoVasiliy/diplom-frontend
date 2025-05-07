// eslint-disable-next-line @typescript-eslint/no-redeclare
import {Divider, Flex, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import './OptimizationPage.scss';

import ChartKit, {settings} from '@gravity-ui/chartkit';
import {YagrPlugin} from '@gravity-ui/chartkit/yagr';
import type {YagrWidgetData} from '@gravity-ui/chartkit/yagr';

const b = block('optimization');
settings.set({plugins: [YagrPlugin]});

const data: YagrWidgetData = {
    data: {

        timeline: [
            1, 2, 3, 4, 5,
            6, 7, 8, 9, 10,
        ],
        graphs: [
            {
                id: '0',
                name: 'Serie 1',
                color: '#6c59c2',
                data: [25, 52, 89, 72, 39, 49, 82, 59, 36, 5],
            },
            {
                id: '1',
                name: 'Serie 2',
                color: '#6e8188',
                data: [37, 6, 51, 10, 65, 35, 72, 0, 94, 54],
            },
        ],
    },
    libraryConfig: {
        chart: {
            series: {
                type: 'line',
            },
        },
        title: {
            text: 'Loss (Потери)',
        },
    },
};

export const OptimizationPage = () => {
    return (
        <Flex className={b()}>
            <div className={b('graphics')}>
                <div className={b('graphics-item')}>
                    <ChartKit type="yagr" data={data} />
                </div>
                <div className={b('graphics-item')}><ChartKit type="yagr" data={data} /></div>
                <div className={b('graphics-item')}>Часть 3</div>
                <div className={b('graphics-item')}>Часть 4</div>
            </div>
            <Divider orientation={'vertical'} />
            <Flex direction={'column'} style={{overflowY: 'scroll'}} className={b('properties')}>
                <Text>Название группы</Text>
                <Divider />


                <Text>sdg</Text>
                <Divider />
                <Text>sdg</Text>
                <Divider />
            </Flex>
        </Flex>
    );
};
