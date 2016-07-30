'use strict';
let _ = require('lodash');

function formatTags(tags) {
  return _.chain(tags)
    .map(tag => {
      let temp = [];
      if (tag.includes('-')) {
        temp = tag.split('-');
        return {
          barcode: temp[0],
          count: parseFloat(temp[1])
        }
      }

      return {
        barcode: tag,
        count: 1
      }
    })
    .value();
}

module.exports = {
  formatTags: formatTags
}
