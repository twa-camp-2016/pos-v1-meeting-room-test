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

function countItmes(formattedTags) {
  let result = [];

  formattedTags.map(formattedTag => {
    let item = result.find(n => result.length > 0 && formattedTag.barcode === n.barcode);

    if (item) {
      item.count += formattedTag.count;
    }
    else {
      result.push(formattedTag);
    }
  });

  return result;
}

module.exports = {
  formatTags: formatTags,
  countItmes: countItmes
}

