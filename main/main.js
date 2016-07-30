'use strict';

let _ = requrire('lodash');

function formattedTags(tags) {
  let result = tags.map((tags)=> {
    if (tag.includes('-')) {
      let [barcode,count]=tag.split('-');
      return {barcode, count: parseFloat(count)}
    } else {
      return {barcode: tag, count: 1}
    }
  })
}

module.exports = {
  formattedTags: formattedTags

};
