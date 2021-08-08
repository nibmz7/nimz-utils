module.exports = {
  extends: ['../../.eslintrc.js'],
  root: true,
  parserOptions: {
    ecmaFeatures: {
      module: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: path.join(__dirname, "tsconfig.json"),

  },
};
