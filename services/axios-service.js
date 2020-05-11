'use strict';

const axios = require('axios');

var Logger = require('./logging-service.js');
var logger = new Logger().getInstance();

class AxiosHandler {
    constructor(baseUrl, defaultHeaders = {})
    {
        this.AxiosInstance = axios.create({
            baseURL: baseUrl,
            timeout: 1000,
            headers: defaultHeaders
        });

        this.MakeAxiosGetRequest = function(url, data = {})
        {
            logger.log('verbose','Making Get request to ' + baseUrl + url);
            var AxiosInstanceCopy = this.AxiosInstance;
            return new Promise(function(resolve, reject) {
                AxiosInstanceCopy.get(url, data)
                .then(function (response) {
                  logger.log('verbose','Successful get request from ' + baseUrl + url);
                  logger.log('debug','Response: ' + JSON.stringify(response.data, null, 2));
                  resolve(response.data);
                })
                .catch(function (error) {
                  logger.log('error', error);
                  reject(error);
                });
            });
        }

        this.MakeAxiosPostRequest = function(url, data = {})
        {
          logger.log('verbose','Making Post request to ' + baseUrl + url);
          var AxiosInstanceCopy = this.AxiosInstance;
          return new Promise(function(resolve, reject) {
              AxiosInstanceCopy.post(url, data)
              .then(function (response) {
                logger.log('verbose','Successful post request from ' + baseUrl + url);
                logger.log('debug','Response: ' + JSON.stringify(response.data, null, 2));
                resolve(response.data);
              })
              .catch(function (error) {
                logger.log('error', error);
                reject(error);
              });
          });
        }
    }
};

module.exports = AxiosHandler;