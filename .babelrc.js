module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                shippedProposals: true,
                modules: false,
                include: [],
            },
        ],
        '@babel/preset-react',
        '@emotion/babel-preset-css-prop',
        '@babel/preset-typescript',
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
};
