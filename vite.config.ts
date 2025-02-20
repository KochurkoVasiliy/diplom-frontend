import path from 'path';

import {defineConfig, loadEnv} from 'vite';

import type {VitePaths} from './config';
import {type ViteMode, viteConfig} from './config/vite';

const getPaths = (): VitePaths => {
    return {
        entry: path.resolve(process.cwd(), 'src', 'main.tsx'),
        output: path.resolve(__dirname, 'build'),
        src: path.resolve(__dirname, 'src'),
        public: path.resolve(__dirname, 'public'),
        root: path.resolve(__dirname),
        initTheme: null,
        env: path.resolve(__dirname),
        locales: path.resolve(__dirname, 'public', 'locales'),
        buildLocales: path.resolve(__dirname, 'build', 'locales'),
        httpsKey: path.resolve(__dirname, 'cert', 'server.key'),
        httpsCert: path.resolve(__dirname, 'cert', 'server.crt'),
    };
};

const getEnv = (mode: string, envPath: string): Record<string, string> =>
    loadEnv(mode, envPath, ['VITE_', 'API_', 'LANDING_']);

export default defineConfig(async ({mode}) => {
    const paths = getPaths();
    const env = getEnv(mode, paths.env);
    const port = parseInt(env.VITE_PORT || '5174', 10);
    const isDev = mode === 'development';

    return await viteConfig({
        port: port,
        paths: paths,
        mode: mode as ViteMode,
        isDev: isDev,
        envs: env,
    });
});
