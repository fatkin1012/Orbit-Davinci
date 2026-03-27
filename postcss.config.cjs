const prefixSelector = require('postcss-prefix-selector');

module.exports = {
  plugins: [
    prefixSelector({
      prefix: '#plugin-1\\.0\\.0',
      transform(prefix, selector, prefixedSelector) {
        if (selector.startsWith('@')) {
          return selector;
        }

        return prefixedSelector;
      },
    }),
  ],
};
