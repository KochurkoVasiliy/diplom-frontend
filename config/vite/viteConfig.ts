import type {UserConfig} from 'vite';

import type {ViteOptions} from './types/types';
import {viteBuild} from './viteBuild';
import {viteOptimizeDeps} from './viteOptimizeDeps';
import {vitePlugins} from './vitePlugins';
import {viteResolve} from './viteResolve';
import {viteServer} from './viteServer';

/**
 * Конфигурация vite
 *
 * @param {ViteOptions} options - Параметры vite
 * @returns {UserConfig} Конфигурация vite
 */
export const viteConfig = async (options: ViteOptions): Promise<UserConfig> => {
    const {isDev, mode, paths, envs} = options;
    return {
        mode: mode,
        root: paths.root,
        publicDir: paths.public,
        build: await viteBuild(options),
        server: isDev ? await viteServer(options) : undefined,
        optimizeDeps: await viteOptimizeDeps(),
        resolve: await viteResolve(),
        plugins: await vitePlugins(),
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode),
            'process.env.PORT': JSON.stringify(process.env.PORT || options.port),
            'process.env.API_URL': JSON.stringify(envs.API_BASE_URL),
        },
    };
};
