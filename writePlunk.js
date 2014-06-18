
var fs = require('fs');
var path = require('path');

/**
 * Write information about plunk into .plunk file.
 *
 * At this time I write only name and id, NOT list of files,
 * because plunk may be updated online, independantly.
 * @param dir string The directory to write into
 * @param plunk object Plunk data
 * @param callback function Calls callback(null, plunk)
 */
function writePlunk(dir, plunk, callback) {
  fs.writeFileSync(path.join(dir, ".plunk"), JSON.stringify({
    name: path.basename(fs.realpath(dir)),
    id: plunk.id
  }));

  callback(null, plunk);
}

module.exports = writePlunk;