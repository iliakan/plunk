A tiny utility to post current directory contents to http://plnkr.co/edit

Before use:

1. Log in to http://plnkr.co
2. In browser developer console run: `document.cookie.match(/plnk_session=(\w+)/)[1]`
3. Create `~/.plunk_config.json` with the content `{ "auth": { "id": "..." } }`, where `...` means the output of step 2.

This will establish a session which the utility will use to create and update plunks under your username.

An example of `.plunk_config.json`:
```
{
"auth": { "id": "56224aba860eabcdef869189" }
}
```

Usage
```
plunk --dir path/to/dir --des "A string describing the plunk" --tags "comma,separated,tags"
```
This will upload all files in `path/to/dir` recursively, with the given description and tags.
> Note: if you do not specify `--dir`, it will use the current working directory.

Exclusions:
- Ignores files starting with a dot `'.'`
- Doesn't allow files with MIME other than `text/*` or `*/json` or `*/javascript` (.html .js .css are fine)

Gotchas:

- Saves current plunk metadata in the file `.plunk`, uses it to update the plunk properly
- A once-created plunk is bound to current directory name. When you copy it into a new directory (or rename), `plunk` will create a brand-new plunk.
I found this behavior helpful, because when I clone an existing directory into a new example,
it makes me sure I will not overwrite an existing plunk.
- The `--tags` flag only works when creating a new plunk, not updating an existing one
