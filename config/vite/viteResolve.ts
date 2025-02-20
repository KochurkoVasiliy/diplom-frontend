export const viteResolve = async () => {
    return {
        alias: {
            '@': `${process.cwd()}/src`,
            '~app': `${process.cwd()}/src/app`,
        },
    };
};
