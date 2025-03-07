import React from 'react';
import {Flex, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {useRightFloatingBar} from '../../lib/useRightFloatingBar';
import {BlockProperties} from './components/BlockProperties/BlockProperties';

import './RightFloatingBar.scss';

const b = block('right-floating-bar');

export const RightFloatingBar = () => {
    const {isOpen, selectedBlock} = useRightFloatingBar();

    if (!isOpen || !selectedBlock?.length) return null;

    return (
        <Flex className={b()} gap={1}>
            <Flex direction="column" className={b('container')}>
                {selectedBlock.map((block) => (
                    <BlockProperties key={block.id.toString()} block={block} />
                ))}
            </Flex>
        </Flex>
    );
};
