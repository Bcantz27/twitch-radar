'use strict';

var winston = require('winston');
var env = process.env.NODE_ENV || "development";
var config = require('../config/' + env + '.js');

/*
    Default Levels
    error: 0, 
    warn: 1, 
    info: 2, 
    verbose: 3, 
    debug: 4, 
    silly: 5 
*/
const logger = winston.createLogger({
    level: config.logging.level, // - Write to all logs with level `info` and below
    exitOnError: false,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`+(info.splat!==undefined?`${info.splat}`:" "))
    ), 
    transports: [
      new winston.transports.File({ filename: 'logs.log', timestamp: true, level: 'warn', format: winston.format.prettyPrint() }),
      new winston.transports.Console({})
    ]
});

class Logger {
    constructor()
    {
        this.log('info','Starting Logging Service');
    }

    log(level, message, data = {})
    {
        logger.log(level, message, data);
    }
};

class Singleton {
    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new Logger();
        }
    }

    getInstance() {
        return Singleton.instance;
    }
};

module.exports = Singleton;