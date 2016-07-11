'use strict';

const PlunkApi = require('./api');
const readPlunkContent = require('./readPlunkContent');
const writePlunk = require('./writePlunk');
const _ = require('lodash');
const log = require('./log')(module);
const PlunkError = require('./plunkError');

module.exports = function*({auth, dir, description, tags}) {

  const plunkContent = readPlunkContent(dir);

  if (!plunkContent) {
    throw new PlunkError("No files in " + dir);
  }

  const api = new PlunkApi({
    auth
  });

  if (plunkContent.plunk.id) {
    let plunk = yield* api.getPlunk(plunkContent.plunk.id);
    plunkContent.plunk = plunk || {};
  }

  if (plunkContent.plunk.id && auth) { // update only for authorized users

    const form = {
      description: description || '',
      tags:        {},
      files:       _.cloneDeep(plunkContent.files)
    };

    // explicitly fileName:null for all removed files
    for (const file in plunkContent.plunk.files) {
      if (!form.files[file]) {
        form.files[file] = null;
      }
    }

    plunkContent.plunk = yield* api.updatePlunk(plunkContent.plunk.id, form);

  } else {
    const form = {
      description: description || '',
      tags:        tags || [],
      files:       _.cloneDeep(plunkContent.files),
      private:     true
    };

    plunkContent.plunk = yield* api.createPlunk(form);

  }

  log.debug(dir, plunkContent);

  writePlunk(dir, plunkContent.plunk);

  return plunkContent;
};




