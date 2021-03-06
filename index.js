'use strict';

var fs = require('fs'),
    morgan = require('morgan'),
    bunyan = require('bunyan'),
    stream = require('stream').PassThrough,
    bunyanMiddleware = require('express-bunyan-logger'),
    log,
    loggers = {
        access: function (config) {
            var conf = { format: (config && config.format) || 'combined', opts: { stream: new stream() } };

            conf.opts.stream.pipe(process.stdout);
            if (config && config.file) {
                conf.opts.stream.pipe(fs.createWriteStream(config.file, { flags: 'a' }));
            }
            return morgan(conf.format, conf.opts);
        },
        error: function (config) {
            var opts = {
                    name: config && config.name || 'myApp',
                    streams: [
                        {
                            level: 'error',
                            stream: process.stderr
                        }
                    ]
                };
            if (config && config.file) {
                opts.streams.push({ 'level': 'error', 'path': config.file });
            }
            return bunyanMiddleware.errorLogger(opts);
        }
    };

module.exports = function (config) {
    if (!(log instanceof bunyan)) {
        log = bunyan.createLogger(config);
        log.register = function register (logType, opts) { return loggers[logType](opts); };
        log.create = function create (config) { return bunyan.createLogger(config); };
    }
    return log;
};
