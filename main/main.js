'use strict';

function getFormatedTags(tags) {
  return tags.map((tag)=> {
    let found = tag.includes('-');
    if (found) {
      let [barcode,count] = tag.split('-');
      return {barcode, count: parseFloat(count)}
    } else {
      return {barcode:tag,count:1}
    }
  })
}

module.exports = {
  getFormatedTags:getFormatedTags
}
