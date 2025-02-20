import react from '@vitejs/plugin-react';
import type {PluginOption} from 'vite';
import svgr from 'vite-plugin-svgr';

export const vitePlugins = async (): Promise<PluginOption[]> => {
    return [react(), svgr()];
};
