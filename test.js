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

    let nestedPath = path.join('nested','dir', 'file.txt');
    let files = {
        'my.js': 'let a = 5;',
        'something': 'some thing',
        nestedPath: 'txt'
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

});
