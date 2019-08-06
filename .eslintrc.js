module.exports = {
    extends: require.resolve('reskript/config/eslint'),
    rules: {
        'global-require': 'off',
        'import/no-dynamic-require': 'off',
        'import/unambiguous': 'off',
        'import/no-commonjs': 'off',
    },
};
