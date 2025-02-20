import {readFileSync} from 'fs';

import type {ServerOptions} from 'vite';

import type {ViteOptions} from './types/types';

export const viteServer = async (options: ViteOptions): Promise<ServerOptions> => {
    const isHttps = options.mode === 'development';
    return {
        port: options.port,
        open: true,

        https: isHttps
            ? {
                  cert: readFileSync(options.paths.httpsCert),
                  key: readFileSync(options.paths.httpsKey),
              }
            : undefined,
    };
};
