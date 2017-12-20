jsonic-ometajs
==============

A JSON parser that also accepts C-style comments.

Use
----

```javascript
var jsonic = require('jsonic-ometajs');
var val = jsonic.parse('/* Comment */{ "Hello": "World" }\n// Hi');
```
