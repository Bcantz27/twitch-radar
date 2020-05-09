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
            var AxiosInstanceCopy = this.AxiosInstance;
            return new Promise(function(resolve, reject) {
                AxiosInstanceCopy.get(url, data)
                .then(function (response) {
                  logger.log('debug','Successful get request from ' + url, {res: response});
                  resolve(response);
                })
                .catch(function (error) {
                  logger.log('error', error);
                  reject(error);
                });
            });
        }

        this.MakeAxiosPostRequest = function(url, data = {})
        {
            var AxiosInstanceCopy = this.AxiosInstance;
            return new Promise(function(resolve, reject) {
                AxiosInstanceCopy.post(url, data)
                .then(function (response) {
                  logger.log('debug','Successful post request from ' + url, {res: response});
                  resolve(response);
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