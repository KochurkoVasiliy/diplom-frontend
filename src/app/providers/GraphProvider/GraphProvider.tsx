import React, {ReactNode} from 'react';
import {Graph} from '@gravity-ui/graph';
import {GraphContext} from './context';

type GraphProviderProps = {
    children: ReactNode;
    graph: Graph;
    start: () => void;
};

export const GraphProvider = ({children, graph, start}: GraphProviderProps) => {
    const subscribers = React.useRef<((blocks: any[]) => void)[]>([]);

    const subscribeToDelete = React.useCallback((callback: (blocks: any[]) => void) => {
        subscribers.current.push(callback);
    }, []);

    const unsubscribeFromDelete = React.useCallback((callback: (blocks: any[]) => void) => {
        subscribers.current = subscribers.current.filter((sub) => sub !== callback);
    }, []);

    const deleteSelected = React.useCallback(() => {
        const selectedBlocks = graph.rootStore.blocksList.$selectedBlocks.value;
        graph.api.deleteSelected();
        subscribers.current.forEach((cb) => cb(selectedBlocks));
    }, [graph]);

    const value = {
        graph,
        start,
        deleteSelected,
        subscribeToDelete,
        unsubscribeFromDelete,
    };

    return <GraphContext.Provider value={value}>{children}</GraphContext.Provider>;
};
