function walkSync(parentDir, dir, filelist) {
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);

  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(parentDir, dir + '/' + file, filelist);
    }
    else {
      var dirName = dir.split(parentDir)[1];
      dirName ? filelist.push(dirName + '/' + file) : filelist.push(file);
    }
  });
  return filelist;
};

module.exports = walkSync;
