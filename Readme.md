A tiny utility to post current directory contents to http://plnkr.co/edit

## Anonymous Usage

0. Add `bin` project folder to your path
1. Go the the dir you want to plunk.
2. Run `plunk`

Or `plunk --dir path/to/dir --desc "A string describing the plunk" --tags "comma,separated,tags" --glob "pattern"`.
Specify default parameters in `defaults.json`.

To run on Windows, use `plunk.bat` instead of `plunk`.

## Authorized usage

To submit plunks under your user and to update them, you need to be authorized.

For that:

1. Sign in to http://plnkr.co with Github (button in the right-upper corner of <http://plnkr.co/>)
2. In browser developer console run: `document.cookie.match(/plnk_session=(\w+)/)[1]` to obtain the session id.
3. Create `~/.plunk_config.json` with the content `{ "auth": { "id": "..." } }`, where `...` means the output of step 2.

This will save an authorized session which the utility will use.

An example of `~/.plunk_config.json`:
```
{
  "auth": { "id": "56224aba860eabcdef869189" }
}
```

## Exclusions

- Ignores files starting with a dot `'.'`

## Gotchas

- Saves current plunk metadata in the file `.plunk`, uses it to update the plunk properly.
- A once-created plunk is bound to its directory name. When you copy it into a new directory (or rename), `plunk` will create a brand-new plunk.
I found this behavior helpful, because when I clone an existing directory into a new example, it makes me sure I will not overwrite an existing plunk.
- The `--tags` flag only works when creating a new plunk, not updating an existing one.
- The `--glob` flag allows to specify a pattern for files to be uploaded to plunk (for example, `--glob **/*(!(*.png|*.jpg))` would ignore png and jpg images). For more detail, see https://github.com/isaacs/node-glob.
- You should create .plunk_config.json in your home-dir, for details see https://www.npmjs.com/package/home-dir
- Default application settings can be found in `defaults.json`. You can override them in your .plunk_config.json.
