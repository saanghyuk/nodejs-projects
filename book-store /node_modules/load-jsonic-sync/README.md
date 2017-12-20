load-jsonic-sync
================

A simple synchronous JSON-with-comments loader that gives good explanations of
where failures come from.

It accepts a superset of JSON including Javscript style comments (`/* */` and
`//`).

Use
----

```javascript
var loadJsonicSync = require('load-jsonic-sync');

var result = loadJsonicSync('file.json');
```

`loadJsonicSync` will throw an error if loading fails. The error will show the
filename, for context, and `error.cause()` will show the original exception
which includes the position for parse errors, and the underlying fs error if
there is a problem reading the file.
