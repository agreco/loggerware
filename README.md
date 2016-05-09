#loggerware

_An express middleware for application access and error logs_

**loggerware** listens to every request, logging to `STDOUT` and `STDERR` for access and error logging respectively. It does
not manipulate any request or response.

##Quick Start

Add the package to your project:

```bash
$ npm install loggerware
```

Require loggerware and register your access and error loggers, like the following*:

```javascript
var express = require('express'),
    loggerware = require('loggerware')({ name: 'your-logger' }),
    app = express();

app.use(loggerware.register('access', { // Register access loggerware
    file: '/var/tmp/your-access.log'
}));

app.use('/', require('./routes/index'));
app.use('/healthcheck', require('./routes/healthcheck'));
app.use('/oauth', require('./routes/oauth'));

app.use(loggerware.register('error', { // Register error loggerware
    file: '/var/tmp/your-error.log'
}));

app.use(function (err, req, res, next) { // Register error handler
    res.status(err.status || 500);
    if (req.xhr) res.json({ error: err.message });
    else res.render('internal-error');
});

app.listen(port, function () {
    loggerware.info('Server started on http://localhost:%s', port);
});
```
*Order matters here, for more information on middleware placement goto: [http://expressjs.com/en/guide/using-middleware.html](http://expressjs.com/en/guide/using-middleware.html)

##GUIDE

####Creating a logger
Requiring **loggerware** will return a method that creates a [bunyan](https://www.npmjs.com/package/bunyan) logger and exposes extra functionality for creating and registering loggers.

So, executing the following:

``` javascript
var loggerware = require('loggerware')({ name: 'your-logger' });
```

will give you:
- `loggerware.create` _create additional loggers for your application_
- `loggerware.register` _register access and error loggers for your application_

from here onwards, you have enough of an interface for registering and creating loggers for your application.

If there is a need to, you can create more that one logger by using the `loggerware.create` method:

```javascript
var loggerware = require('loggerware')({ 'name': 'your-logger'}),
    loggerA = loggerware.create({ name: 'your-logger-a' }),
    loggerB = loggerware.create({ name: 'your-logger-b' });;
```

The `loggerware.create` signature is `create([, configuration :: Object])`.

- The optional `configuration` parameter gets passed to the `bunyan.createLogger` method. See the [bunyan.createLogger](https://www.npmjs.com/package/bunyan#constructor-api) api for more details.

####Registering access and error loggers
Once you have instantiated a logger, you can register access and error loggers for your application by using the `loggerware.register` method.

The following registers two loggers to the default logger:

``` javascript
var loggerware = require('loggerware')({ name: 'your-logger' });

loggerware.register('access', {
    name: 'your-access',
    file: '/var/tmp/your-access.log'
});

loggerware.register('error');
```

In this example we:

1. created a logger called `your-logger`
2. registered an access logger called `your-access` that streams to `STDOUT` and to the file `/var/tmp/your-access.log`
3. registered an error logger streaming just to `STDERR`.

The `loggerware.register` signature is `register(type :: String, [, configuration :: Object])`.

The `type` parameter value can either be `access` or `error`.

The optional `configuration` object parameter can consist of `format` and `file` keys.

- The `format` key specifies the [morgan](https://www.npmjs.com/package/morgan) logger format, by default `combined` is used.
- The `file` key specifies the file to log to. If no `file` key is supplied, your logging will just be streamed to `STDOUT` and `STDERR`.

##License
[MIT](http://www.github.com/agreco/loggerware/LICENSE)
