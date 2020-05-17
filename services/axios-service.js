'use strict';

const axios = require('axios');

var Logger = require('./logging-service.js');
var logger = new Logger().getInstance();

class AxiosHandler {
    constructor(baseUrl, clientId, clientSecret)
    {
        this.AxiosInstance = axios.create({
            baseURL: baseUrl,
            timeout: 1000,
            headers: {
              'Client-ID': clientId
            }
        });

        let AxiosInstanceCopy = this.AxiosInstance;
        this.AxiosInstance.post('https://id.twitch.tv/oauth2/token?client_id=' + clientId + '&client_secret=' + clientSecret + '&grant_type=client_credentials')
        .then(function (response) {
          logger.log('verbose','Set twitch access token');
          //Set Access Token
          AxiosInstanceCopy.defaults.headers['Authorization'] = 'Bearer ' + response.data.access_token;
        })
        .catch(function (error) {
          logger.log('error', error);
          reject(error);
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