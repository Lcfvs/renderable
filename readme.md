# renderable
A tiny file cache module, based on buffers, under the MIT licence

## Install
`npm install renderable`

## Usage
```JS
var renderable;

renderable = require('renderable');
```

### renderable.register(paths)
```JS
// registers a single file, if needed
renderable.register([__filename])
    .then(function() {
        console.log('registered');
    });

// registers all files matching a glob mask, if needed
// please refer to https://www.npmjs.com/package/glob
renderable.register([__filename])
    .then(function() {
        console.log('registered');
    });
```

### renderable.render(parser, paths)
```JS
var parser;

parser = function(buffer, filename) {
    return {
        render: function() {
            return buffer.toString();
        }
    };
};

// registers a single file, if needed
// registers a renderer, based on filename & parser, if needed
// renders
renderable.render(parser, paths)
    .then(function(rendered) {
        console.log(rendered);
    });
```

## Example

https://github.com/Lcfvs/renderable-html#renderable-html