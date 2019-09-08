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
        'power-assert',
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
};
