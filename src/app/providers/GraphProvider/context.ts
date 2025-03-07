import {createContext} from 'react';
import {Graph} from '@gravity-ui/graph';

export type GraphContextType = {
    graph: Graph;
    start: () => void;
    deleteSelected: () => void;
    subscribeToDelete: (callback: (blocks: any[]) => void) => void;
    unsubscribeFromDelete: (callback: (blocks: any[]) => void) => void;
};
export const GraphContext = createContext<GraphContextType | null>(null);
