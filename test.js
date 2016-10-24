'use strict';

require('co-mocha');
require('should');

const fs = require('fs-extra');
const path = require('path');
const updateDir = require('./lib/updateDir');

// anonymous test

describe("API (Anonymous)", function() {

  it("creates a plunk", function*() {

    let dir = fs.mkdtempSync('/tmp/plunk-');

    let files = {
        'my.js': 'let a = 5;',
        'something': 'some thing',
        'nested/dir/file.txt': 'txt'
    };

    for(let filePath in files) {
      fs.ensureDirSync(path.dirname(`${dir}/${filePath}`));
      fs.writeFileSync(`${dir}/${filePath}`, files[filePath]);
    }

    let plunkContent = yield* updateDir({
      dir
    });

    plunkContent.plunk.id.should.exist;

    fs.removeSync(dir);
  });

});
