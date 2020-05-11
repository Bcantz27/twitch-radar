'use strict';

var neo4j = require('neo4j-driver');
var env = process.env.NODE_ENV || "development";
var config = require('../config/' + env + '.js');

var driver = neo4j.driver(
    config.neo4jDb.connectionString
    //neo4j.auth.basic('neo4j', 'neo4j')
);

class GraphDatabaseHandler {
    constructor()
    {
        this.log('info','Starting Graph Database Handler Service');
    }

    query(query, params)
    {
        var session = driver.session();

        session
        .run(query, params)
        .then(result => {
            logger.log('debug', 'Records: ' + JSON.stringify(records, null, 2));
        })
        .catch(error => {
          logger.log('error', error);
        })
        .then(() => session.close());
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