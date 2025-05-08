import {useCallback, useState} from 'react';

export const useResultsDisplayTabs = (defaultTab = 'chartsTab') => {
    const [activeTab, setActiveTab] = useState<string>(defaultTab);

    const handleTabUpdate = useCallback((tabValue: string | undefined) => {
        if (tabValue) {
            setActiveTab(tabValue);
        }
    }, []);

    return {activeTab, handleTabUpdate};
};
