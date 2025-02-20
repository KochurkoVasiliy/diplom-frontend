import {configDefaults, defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: [],
        coverage: {
            exclude: [...configDefaults.exclude, '**/build/**', '**/public/**'],
        },
        include: ['<rootDir>/src/**/*(*.)@(spec|test).[tj]s?(x)'],
        root: '<rootDir>/',
    },
});
