'use strict';
let tags = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
];
let _ = require('lodash');
function getFormattedTags(tags) {
  return _.chain(tags).map(x=> {
    if (_.includes(x, '-')) {
      let [barcode, count] = _.split(x, '-');
      return {
        barcode,
        count: parseFloat(count)
      }
    } else {
      return {
        barcode: x,
        count: 1
      }
    }
  }).value();
}


getFormattedTags(tags)

module.exports = {
  getFormattedTags: getFormattedTags
}
