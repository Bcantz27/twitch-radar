'use strict';

var neo4j = require('neo4j-driver');
var env = process.env.NODE_ENV || "development";
var config = require('../config/' + env + '.js');

var Logger = require('./logging-service.js');
var logger = new Logger().getInstance();

var driver = neo4j.driver(
    config.neo4jDb.connectionString,
    neo4j.auth.basic(config.neo4jDb.username, config.neo4jDb.password)
);

class GraphDatabaseHandler {
    constructor()
    {
        logger.log('info','Initialized Graph Database Handler Service');
    }

    query(query, params = {})
    {
        logger.log('debug', 'Running Graph DB Query: ' + JSON.stringify(query, null, 2));
        return new Promise(function(resolve, reject){
            var session = driver.session();
            session
            .run(query, params)
            .then(result => {
                logger.log('debug', 'Records: ' + JSON.stringify(result, null, 2));
                resolve(result);
            })
            .catch(error => {
                logger.log('error', error);
                reject(error);
            })
            .then(() => session.close())
            .then(() => resolve());
        });
    }
}

class GraphDatabaseHandlerSingleton {
    constructor() {
        if (!GraphDatabaseHandlerSingleton.instance) {
            GraphDatabaseHandlerSingleton.instance = new GraphDatabaseHandler();
        }
    }

    getInstance() {
        return GraphDatabaseHandlerSingleton.instance;
    }
}

module.exports = GraphDatabaseHandlerSingleton;