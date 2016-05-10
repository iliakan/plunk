var fs = require('fs');
var path = require('path');
var mime = require('mime');
var walkSync = require('./utils/walkSync');

function readPlunkContent(dir) {
  console.log(dir)
  var parentDir = dir + '/';

  var files = walkSync(parentDir, dir, []);

  files = files.filter(function(file) {
    if (file[0] == ".") return false;

    return true;
  });

  var plunk = {};
  var plunkFilePath = path.join(dir, '.plunk');
  if (fs.existsSync(plunkFilePath)) {
    var existingPlunk = fs.readFileSync(plunkFilePath);
    existingPlunk = JSON.parse(existingPlunk);

    // dir name change = new plunk
    var plunkDirName = path.basename(fs.realpath(dir));
    if (existingPlunk.name == plunkDirName) {
      plunk = existingPlunk;
    }
  }


  var filesForPlunk = {};
  files.forEach(function(file) {

    var filePath = path.join(dir, file);

    var type = mime.lookup(file).split('/');
    if (type[0] != 'text' && type[1] != 'json' && type[1] != 'javascript' && type[1] != 'mp2t') {
      console.error("WARNING: skipped unknown file extension: " + file);
      return;
    }

    filesForPlunk[file] = {
      filename: file,
      content: fs.readFileSync(path.join(dir, file), 'utf-8')
    };
  });

  return {
    plunk: plunk,
    files: filesForPlunk
  };
}

module.exports = readPlunkContent;
