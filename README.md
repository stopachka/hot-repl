# hot-repl

Experiment, to make it possible to reload code in NodeJS

To play: 

```bash
# start node repl
node
# patch require 
var hot = require('./hotREPL');
hot.patchRequire();
# require a module
var f = require('./play');
# run it
f()
# ...now try editing play/index.js and play/innerModule.js
# reload the module
hot.reload('./play')
f()
# see that your changes made it :}
```