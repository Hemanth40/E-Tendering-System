const path = require('path');

module.exports = function override(config, env) {
  // Add custom webpack configuration here
  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: [
      path.resolve(__dirname, 'node_modules/web3'),
    ],
  });

  // Ignore source map warnings for web3
  config.ignoreWarnings = [
    {
      module: /node_modules\/web3/,
      message: /Failed to parse source map/,
    },
  ];

  return config;
};