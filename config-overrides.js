const webpack = require('webpack');

module.exports = function override(config, env) {
    // Override the webpack configuration
    config.output.hashFunction = 'md5';
    return config;
};