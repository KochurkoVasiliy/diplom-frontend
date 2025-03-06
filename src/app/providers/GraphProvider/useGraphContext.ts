import {useContext} from 'react';
import {GraphContext, GraphContextType} from './context';

export const useGraphContext = (): GraphContextType => {
    const context = useContext(GraphContext);
    if (!context) {
        throw new Error('useGraphContext должен использоваться внутри GraphProvider');
    }
    return context;
};
