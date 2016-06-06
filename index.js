'use strict';

var fs = require('fs'),
    morgan = require('morgan'),
    bunyan = require('bunyan'),
    stream = require('stream').PassThrough,
    bunyanMiddleware = require('express-bunyan-logger'),
    bsyslog = require('bunyan-syslog'),
    msyslog = require('modern-syslog'),
    log,
    loggers = {
        access: function (config) {
            var msyslogStrm = new msyslog.Stream('LOG_INFO', 'LOG_LOCAL1'),
                conf = { format: (config && config.format) || 'combined', opts: { stream: new stream() } };

            conf.opts.stream.pipe(process.stdout);
            if (config && config.file) {
                conf.opts.stream.pipe(fs.createWriteStream(config.file, { flags: 'a' }));
            }
            conf.opts.stream.pipe(msyslogStrm);
            return morgan(conf.format, conf.opts);
        },
        error: function (config) {
            var opts = {
                    name: config && config.name || 'myApp',
                    streams: [
                        {
                            level: 'error',
                            stream: process.stderr
                        }, {
                            level: 'error',
                            type: 'raw',
                            stream: bsyslog.createBunyanStream({
                                type: 'sys',
                                facility: bsyslog.local0,
                                host: '127.0.0.1',
                                port: 514
                            })
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
