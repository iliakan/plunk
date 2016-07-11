
const fs = require('fs');
const path = require('path');

/**
 * Write information about plunk into .plunk file.
 *
 * At this time I write only name and id, NOT list of files,
 * because plunk may be updated online, independantly.
 * @param dir string The directory to write into
 * @param plunk object Plunk data
 * @param callback function Calls callback(null, plunk)
 */
module.exports = function writePlunk(dir, plunk) {

  let metaFilePath = path.join(dir, ".plunk");
  dir = fs.realpathSync(dir);

  //console.log(plunk);
  fs.writeFileSync(metaFilePath, JSON.stringify({
    name: path.basename(dir),
    id: plunk.id
  }));

};
