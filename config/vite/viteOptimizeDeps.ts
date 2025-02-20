import type {DepOptimizationOptions} from 'vite';

export const viteOptimizeDeps = async (): Promise<DepOptimizationOptions> => {
    return {
        //workaround for the problem https://github.com/vitejs/vite/issues/7719
        extensions: ['.css'],
        esbuildOptions: {
            plugins: [
                (await import('esbuild-sass-plugin')).sassPlugin({
                    type: 'style',
                }),
            ],
        },
    };
};
