'use strict';

const axios = require('axios');

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
                  // handle success
                  //console.log(response);
                  resolve(response);
                })
                .catch(function (error) {
                  // handle error
                  //console.log(error);
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
                  // handle success
                  //console.log(response);
                  resolve(response);
                })
                .catch(function (error) {
                  // handle error
                  //console.log(error);
                  reject(error);
                });
            });
        }
    }
};

module.exports = AxiosHandler;