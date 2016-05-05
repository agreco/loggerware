#loggerware

>An express middleware for application access and error logs

#Getting started

Add the package to your project:

```bash
$ npm install git+https://github.com/agreco/loggerware.git
```

Include it in your app:

```javascript
var express = require('express'),
    logger = require('loggerware');

app = express();

// Apply the middleware to your application, ready for logging access and errors for all requests
app.use(logger);
```

### Info

The middleware listens to every request, logging to STDOUT and STDERR for access and error logging respectively. It does
not manipulate any request or response.
