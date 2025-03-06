import {EAnchorType, TBlock} from '@gravity-ui/graph';

export const GravityActionBlockIS = 'block-action';
export type TGravityActionBlock = TBlock<{description: string}> & {is: typeof GravityActionBlockIS};
function getActionBlockId(num: number): string {
    return `action_${num}`;
}

export function createActionBlock(x: number, y: number, index: number): TGravityActionBlock {
    const blockId = getActionBlockId(index);

    return {
        is: GravityActionBlockIS,
        id: blockId,
        x,
        y,
        width: 63 * 2,
        height: 63 * 2,
        selected: false,
        name: `Layer #${index}`,
        meta: {
            description: 'Description',
        },
    };
}

export function createActionBlock1(x: number, y: number, index: number) {
    const blockId = getActionBlockId(index);

    return {
        is: 'aaa',
        id: blockId,
        x,
        y,
        width: 63 * 2,
        height: 63 * 2,
        selected: false,
        name: `Layer #${index}`,
        meta: {
            description: 'Layer',
            in_channels: 1,
            out_channels: 1,
        },
    };
}
