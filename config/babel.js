module.exports = {
  presets: [
    '@vue/app',
    ["@babel/preset-env", {
      "targets": {
        "ie": 8
      },
      "useBuiltIns": "usage"
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-modules-commonjs', {
      allowTopLevelThis: true,
    }],
    '@babel/plugin-proposal-optional-chaining',
    "transform-remove-strict-mode"
  ],
};
