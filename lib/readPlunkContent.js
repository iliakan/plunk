'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');

module.exports = function(cwd) {

  const files = glob.sync('**', {cwd});

  let plunk = {};
  const plunkFilePath = path.join(cwd, '.plunk');

  if (fs.existsSync(plunkFilePath)) {
    const existingPlunk = JSON.parse(fs.readFileSync(plunkFilePath));

    // cwd name change = new plunk
    const plunkDirName = path.basename(fs.realpathSync(cwd));
    if (existingPlunk.name == plunkDirName) {
      plunk = existingPlunk;
    }
  }

  const filesForPlunk = {};

  files.forEach(function(file) {


    if (!fs.statSync(path.join(cwd, file)).isFile()) {
      return;
    }

    filesForPlunk[file] = {
      filename: file,
      content: fs.readFileSync(path.join(cwd, file), 'utf-8')
    };
  });

  return {
    plunk: plunk,
    files: filesForPlunk
  };
};
