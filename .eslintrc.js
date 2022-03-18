module.exports = {
    extends: [
        'airbnb-base',
    ],
    env: {
        node: true,
        jest: true,
    },
    rules: {
        strict: 1,
        indent: ['error', 4, { SwitchCase: 1 }],

        'import/extensions': ['off', 'never'],
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
};
