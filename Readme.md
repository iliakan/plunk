A small utility to post current directory contents to http://plnkr.co/edit

Before usage, please:
- Log in (sign up if needed) to http://github.com, and then
- Log in to http://plnkr.co using github

This will establish a session which the utility will use to create and update plunks under your github username.

Usage (while in target directory):
```
plunk 
```

Usage (with explicit directory)
```
plunk path/to/dir
```

At first run it will ask github credentials and then store the plunker authentication in `~/.plunk_config.json`. 
It does not store login/password. Remove the file if you ever want to relogin.

Exclusions:
- Ignores files starting with a dot `'.'`
- Doesn't allow subdirectories
- Doesn't allow files with MIME other than `text/*` or `*/json` or `*/javascript` (.html .js .css are fine)

Gotchas:

- Saves current plunk metadata in the file `.plunk`, uses it to update the plunk properly
- A once-created plunk is bound to current directory name. When you copy it into a new directory (or rename), `plunk` will create a brand-new plunk. 
I found this behavior helpful, because when I clone an existing directory into a new example, 
it makes me sure I will not overwrite an existing plunk. 

