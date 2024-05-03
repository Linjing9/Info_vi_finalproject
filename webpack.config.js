const path = require('path');

module.exports = {
  // Other webpack configuration options
  module: {
    rules: [
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
    ],
  },
};