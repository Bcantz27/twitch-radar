'use strict';

var env = process.env.NODE_ENV || "development";
var config = require('../config/' + env + '.js');

var Logger = require('./logging-service.js');
var logger = new Logger().getInstance();

const CLIENT_ID = config.strategies.twitch.clientID;
const CLIENT_SECRET = config.strategies.twitch.clientSecret;
const BASE_URL = config.strategies.twitch.baseURL;

const AxiosHandler = require('./axios-service.js');
const AxiosInstance = new AxiosHandler(BASE_URL, {'Client-ID': CLIENT_ID, 'Authorization': 'Bearer 903zjl98ck5gajhdoweydmmepzq9k1'});

class TwitchApi {
    constructor()
    {
        logger.log('info','Initialized Twitch Api');
    }

    /**
     * GetBroadcasterClips
     *
     * @alias GetBroadcasterClips
     * @param {type}   name               Username/Channel Name
     * @param {Object} optionalParams   Optional. Add additional optional query parameters Full list here: https://dev.twitch.tv/docs/api/reference#get-clips

     * @return {JSON} Returns a json list of clip data. Results are ordered by view count
     */
    GetBroadcasterClips(name, optionalParams = {})
    {
        let url = 'clips';
        let nameCopy = name;
        let instance = this;
        return new Promise(function(resolve, reject){
            instance.GetUsers(nameCopy)
            .then(function (response) {
                let results = response.data;

                if(results.length == 0)
                {
                    logger.log('warn','Twitch Api - GetBroadcasterClips cound not find user with name: ' + name);
                    reject();
                }

                let params = { 
                    params: {
                        broadcaster_id: results[0].id,
                        ...optionalParams
                    }
                }

                logger.log('verbose','Twitch Api - Call GetBroadcasterClips', params);
                AxiosInstance.MakeAxiosGetRequest(url, params)
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
                });
            })
            .catch(function (error) {
                logger.log('error','Twitch Api - GetBroadcasterClips Error: ' + error);
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

        logger.log('verbose','Twitch Api - Call GetGameClips', params);

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

        logger.log('verbose','Twitch Api - Call GetClips', params);

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
     * GetUser
     *
     * @alias GetUser
     * @param {type}   names               Twitch usernames seperated by ,

     * @return {JSON} Returns a json object containing the users information
     */
    GetUsers(names)
    {
        let url = 'users';

        let params = { 
            params: {
                login: names
            }
        }

        logger.log('verbose','Twitch Api - Call GetUser', params);

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

    GetUserFollowingList(name, optionalParams = {})
    {
        let url = 'users/follows';
        let nameCopy = name;
        let instance = this;
        return new Promise(function(resolve, reject){
            instance.GetUsers(nameCopy)
            .then(function (response) {
                let results = response.data;

                if(results.length == 0)
                {
                    logger.log('warn','Twitch Api - GetUserFollowingList cound not find user with name: ' + name);
                    reject();
                }

                let params = { 
                    params: {
                        from_id: results[0].id,
                        ...optionalParams
                    }
                }

                logger.log('verbose','Twitch Api - Call GetUserFollowingList', params);
                AxiosInstance.MakeAxiosGetRequest(url, params)
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
                });
            })
            .catch(function (error) {
                logger.log('error','Twitch Api - GetUserFollowingList Error: ' + error);
                reject(error);
            });
        });
    }


}


module.exports = new TwitchApi();