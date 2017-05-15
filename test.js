'use strict';

require('co-mocha');
require('should');

const fs = require('fs-extra');
const path = require('path');
const updateDir = require('./lib/updateDir');

// anonymous test

describe("API (Anonymous)", function() {
  it("creates a plunk", function*() {
    let dir = fs.mkdtempSync('plunk-');

    let nestedPath = path.join('nested', 'dir', 'file.txt');
    let files = {
        'my.js': 'let a = 5;',
        'something': 'some thing',
        [nestedPath]: 'txt'
    };

    for(let filePath in files) {
      fs.ensureDirSync(path.dirname(path.join(`${dir}`,`${filePath}`)));
      fs.writeFileSync(path.join(`${dir}`,`${filePath}`), files[filePath]);
    }

    let plunkContent = yield* updateDir({
      dir
    });

    plunkContent.plunk.id.should.exist;

    fs.removeSync(dir);
  });

  it("uses glob to ignore images properly", function*() {
    let dir = fs.mkdtempSync('plunk-');
    let glob = "**/*(!(*.png|*.jpg))";

    let nestedPath = path.join('nedsted', 'dir', 'file.jpg');
    let files = {
      'toIgnore.png': 'some image',
      [nestedPath]: 'some image',
      'something': 'something else'
    };

    for(let filePath in files) {
      fs.ensureDirSync(path.dirname(path.join(`${dir}`,`${filePath}`)));
      fs.writeFileSync(path.join(`${dir}`,`${filePath}`), files[filePath]);
    }

    let plunkContent = yield* updateDir({
      dir,
      glob
    });

    Object.keys(plunkContent.plunk.files).should.eql(['something']);

    fs.removeSync(dir);
  });

});
