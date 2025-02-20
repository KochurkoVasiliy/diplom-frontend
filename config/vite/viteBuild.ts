import type {BuildEnvironmentOptions} from 'vite';

import type {ViteOptions} from './types/types';

/**
 * Конфигурация сборки Vite
 *
 * @param {ViteOptions} options - Параметры конфигурации
 * @returns {Promise<BuildEnvironmentOptions>} Конфигурация сборки
 */
export const viteBuild = async (options: ViteOptions): Promise<BuildEnvironmentOptions> => {
    return {
        outDir: options.paths.output,
        assetsDir: 'assets',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: '[name].[hash].js',
                chunkFileNames: '[name].[hash].js',
                assetFileNames: 'assets/[hash][extname]',
            },
        },
    };
};
