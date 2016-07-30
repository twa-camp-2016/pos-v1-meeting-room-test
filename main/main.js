'use strict';

function getFormatedTags(tags) {
  return tags.map((tag)=> {
    let found = tag.includes('-');
    if (found) {
      let [barcode,count] = tag.split('-');
      return {barcode, count: parseFloat(count)}
    } else {
      return {barcode: tag, count: 1}
    }
  })
}

function getBarcode(barcode, array) {
  for (let arr of array) {
    if (arr.barcode === barcode) {
      return arr;
    }
  }
  return null;
}
function getCountTags(formatedTags) {
  let result = [];
  for(let formatedTag of formatedTags) {
    let found = getBarcode(formatedTag.barcode, result);
    if (found === null) {
      result.push(formatedTag);
    } else {
      found.count += formatedTag.count;
    }
  }
  return result;
}

module.exports = {
  getFormatedTags: getFormatedTags,
  getCountTags: getCountTags
}
