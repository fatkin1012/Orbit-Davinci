const prefixSelector = require('postcss-prefix-selector');

module.exports = {
  plugins: [
    prefixSelector({
      prefix: '#plugin-davinci',
      transform(prefix, selector, prefixedSelector) {
        if (selector.startsWith('@')) {
          return selector;
        }

        return prefixedSelector;
      },
    }),
  ],
};
