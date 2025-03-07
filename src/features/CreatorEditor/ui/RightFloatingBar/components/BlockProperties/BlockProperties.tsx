import React from 'react';
import {Flex, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {PropertyInput} from '../PropertyInput/PropertyInput';
import {TBlock} from '@gravity-ui/graph';
import './BlockProperties.scss';

const b = block('block-properties');

type BlockPropertiesProps = {
    block: TBlock;
};

export const BlockProperties = ({block}: BlockPropertiesProps) => {
    return (
        <Flex direction="column" className={b()}>
            <Text className={b('header')}>Свойства слоя: {block.name}</Text>
            <Flex className={b('content')} direction="column" gap={2}>
                {Object.entries(block.meta || {}).map(([key, value]) => (
                    <PropertyInput key={key} blockId={block.id.toString()} propertyKey={key} value={value} />
                ))}
            </Flex>
        </Flex>
    );
};
