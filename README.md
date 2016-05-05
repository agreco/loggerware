#loggerware

>An express middleware for application access and error logs

#Getting started

Add the package to your project:

```bash
$ npm install loggerware
```

Include it in your app:

```javascript
var express = require('express'),
    logger = require('loggerware')({ name: 'my-logger' });

app = express();

// Apply the middleware to your application, ready for logging access and errors for all requests
// Register middleware
app.use(logger.register('access', {
    file: '/var/tmp/your-access.log'
}));

more code here...

app.use(logger.register('error', {
    file: '/var/tmp/your-error.log'
}));
```

### Info

The middleware listens to every request, logging to STDOUT and STDERR for access and error logging respectively. It does
not manipulate any request or response.
