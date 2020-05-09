'use strict';

var env = process.env.NODE_ENV || "development";
var config = require('../config/' + env + '.js');

var Logger = require('./logging-service.js');
var logger = new Logger().getInstance();

const CLIENT_ID = config.strategies.twitch.clientID;
const CLIENT_SECRET = config.strategies.twitch.clientSecret;
const BASE_URL = config.strategies.twitch.baseURL;

const AxiosHandler = require('./axios-service.js');
const AxiosInstance = new AxiosHandler(BASE_URL, {'Client-ID': CLIENT_ID});

class TwitchApi {
    constructor()
    {
        logger.log('info','Initialize Twitch Api');
    }

    /**
     * GetBroadcasterClips
     *
     * @alias GetBroadcasterClips
     * @param {type}   id               Broadcaster Id
     * @param {Object} optionalParams   Optional. Add additional optional query parameters Full list here: https://dev.twitch.tv/docs/api/reference#get-clips

     * @return {JSON} Returns a json list of clip data. Results are ordered by view count
     */
    GetBroadcasterClips(id, optionalParams = {})
    {
        let url = 'clips';

        let params = { 
            params: {
                broadcaster_id: id,
                ...optionalParams
            }
        }

        return new Promise(function(resolve, reject){
            AxiosInstance.MakeAxiosGetRequest(url, params)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    /**
     * GetGameClips
     *
     * @alias GetGameClips
     * @param {type}   id               Game Id
     * @param {Object} optionalParams   Optional. Add additional optional query parameters Full list here: https://dev.twitch.tv/docs/api/reference#get-clips

     * @return {JSON} Returns a json list of clip data. Results are ordered by view count
     */
    GetGameClips(id, optionalParams = {})
    {
        let url = 'clips';

        let params = { 
            params: {
                game_id: id,
                ...optionalParams
            }
        }

        return new Promise(function(resolve, reject){
            AxiosInstance.MakeAxiosGetRequest(url, params)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    /**
     * GetClips
     *
     * @alias GetGameClips
     * @param {type}   id               Clip Id(s). This can also be an array of id's
     * @param {Object} optionalParams   Optional. Add additional optional query parameters Full list here: https://dev.twitch.tv/docs/api/reference#get-clips

     * @return {JSON} Returns a json list of clip data. Results are ordered by view count
     */
    GetClips(id, optionalParams = {})
    {
        let url = 'clips';

        let params = { 
            params: {
                id: id,
                ...optionalParams
            }
        }

        return new Promise(function(resolve, reject){
            AxiosInstance.MakeAxiosGetRequest(url, params)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }
};

module.exports = new TwitchApi();