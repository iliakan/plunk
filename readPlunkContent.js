var fs = require('fs');
var path = require('path');
var mime = require('mime');

function readPlunkContent(dir) {

  files = fs.readdirSync(dir);

  var hadErrors = false;
  files = files.filter(function(file) {
    if (file[0] == ".") return false;

    var filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      hadErrors = true;
      console.error("Directory not allowed: " + file);
      return false;
    }

    var type = mime.lookup(file).split('/');
    if (type[0] != 'text' && type[1] != 'json') {
      hadErrors = true;
      console.error("Bad file extension: " + file);
    }

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


  if (hadErrors) {
    return false;
  }

  var filesForPlunk = {};
  files.forEach(function(file) {
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