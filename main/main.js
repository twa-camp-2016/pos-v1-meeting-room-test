'use strict';
let _ = require('lodash');
// let a = _.sum([4, 2, 8, 6]);
// console.log(a);

//#1
function formatTags(tags) {
  return tags.map((tag) => {
    if (tag.includes('-')) {
      let [barcode,count] = tag.split('-');
      return {barcode, count: parseInt(count)};
    } else {
      return {barcode: tag, count: 1};
    }
  });
}


module.exports = {
  formatTags
};
