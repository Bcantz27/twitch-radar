'use strict';

var env = process.env.NODE_ENV || "development";
var config = require('../config/' + env + '.js');

var GraphDatabaseHandlerSingleton = require('./neo4j-service.js');
var GraphDatabaseHandler = new GraphDatabaseHandlerSingleton().getInstance();

var TwitchApi = require('./twitch-api-service.js');

var Logger = require('./logging-service.js');
var logger = new Logger().getInstance();

class RecommendationEngine {
    constructor()
    {
        logger.log('info','Initialized Recommendation Engine Service');
    }

    async CreateUserChannelNodes(userName, channelFetchAmount = config.services.recommendationEngine.channelFetchAmount)
    {
        logger.log('info','Creating User channel data into graph user: ' + userName);

        return new Promise(function(resolve, reject){
            TwitchApi.GetUserFollowingList(userName, {first: channelFetchAmount}) //Get json list of all the channels the user follows
            .then(async(followingList) => { 
                try {
                    let channels = followingList.data;

                    let i = 0;
                    let j = 0;
                    for (i = 0; i < channels.length; i++) {
                        let channel = channels[i];
                        await GraphDatabaseHandler.query(
                            'MERGE (u:User { name: "' + userName + '", twitchId: "' + channel.from_id + '"}) MERGE (c:User { name: "' + channel.to_name + '", twitchId: "' + channel.to_id + '"}) MERGE (u)-[:FOLLOWS]->(c)');
                    }

                    logger.log('info','Done creating user channel data for: ' + userName);
                    resolve(channels);
                } catch (err){
                    logger.log('error','Error: ' + err);
                    reject(err);
                }
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    async CreateUserClipNodes(userName, clipFetchAmount = config.services.recommendationEngine.clipFetchAmount, clipFetchRange = config.services.recommendationEngine.clipFetchRange)
    {
        logger.log('info','Creating User clip data into graph user: ' + userName);

        return new Promise(async function(resolve, reject){
            try {
                const curDate = new Date();
                const prevDate = new Date();
                prevDate.setDate(curDate.getDate()-clipFetchRange);
                
                let clips = await TwitchApi.GetBroadcasterClips(userName, {first: clipFetchAmount, started_at: prevDate.toISOString(), ended_at: curDate.toISOString()})
                let i = 0;
                for (i = 0; i < clips.data.length; i++) {
                    let clip = clips.data[i];
                    let clipTitle = clip.title;
                    clipTitle = clipTitle.replace(/["]/g, "'");
                    await GraphDatabaseHandler.query(
                        'MERGE (c:User { name: "' + userName + '", twitchId: "' + clip.broadcaster_id + '"}) MERGE (u:Clip { title: "' + clipTitle + '", clipId: "' + clip.id + '", embedUrl: "' + clip.embed_url + '", url: "' + clip.url + '", viewCount: ' + clip.view_count + ', lang: "' + clip.language + '", createdAt: "' + clip.created_at + '", broadcasterName: "' + clip.broadcaster_name + '"}) MERGE (c)-[:CREATED]-(u)');   
                }

                logger.log('info','Done creating user clip data for: ' + userName);
                resolve(clips);
            } catch (err){
                logger.log('error','Error: ' + err);
                reject(err);
            }
        });
    }

    //Heavy Task
    async CreateAllUserClipNodes(clipFetchAmount = config.services.recommendationEngine.clipFetchAmount, clipFetchRange = config.services.recommendationEngine.clipFetchRange)
    {
        logger.log('info','Creating All User clip data into graph');

        let RecommendationEngineCopy = this;
        return new Promise(async function(resolve, reject){
            GraphDatabaseHandler.query('MATCH (u:User) RETURN u')
            .then(async function(results){
                results = results.records;
                if(results.length == 0){
                    logger.log('warn','CreateAllUserClipNodes - No users found.');
                    resolve({});
                }
                
                let clipCount = 0;
                let i = 0;
                for (i = 0; i < results.length; i++) {
                    let channel = results[i];
                    let clips = await RecommendationEngineCopy.CreateUserClipNodes(channel._fields[0].properties.name, clipFetchAmount, clipFetchRange);
                    clipCount += clips.data.length;
                }

                logger.log('info','Done creating ' + clipCount +' clips for ' + results.length + ' users');
                resolve(results);
            })
            .catch(function(err){
                logger.log('error','Error: ' + err);
                reject(err);
            });
        });
    }

    async SetUserWatchedClip(username, clipId)
    {
        return new Promise(async function(resolve, reject){
            if(username == "" || clipId == ""){
                logger.log('warn','SetUserWatchedClip - Invalid username or clipId - Username: ' + username + ' ClipId: ' + clipId);
                reject('Invalid username or clipId - Username: ' + username + ' ClipId: ' + clipId);
            }

            GraphDatabaseHandler.query('MATCH (u:User {name: "' + username + '"}) MATCH(c:Clip {clipId: "' + clipId + '"}) MERGE (u)-[:WATCHED]->(c)') // Set relationship
            .then(async function(results){
                results = results.records;
                if(results.length == 0){
                    logger.log('warn','CreateAllUserClipNodes - No users found.');
                    resolve({});
                }

                logger.log('verbose','User watched clip - User: ' + username + ' Clip: ' + clipId.url + '');
                resolve(results);
            })
            .catch(function(err){
                logger.log('error','Error: ' + err);
                reject(err);
            });
        });
    }

    async SetUserLikedClip(username, clipId)
    {
        return new Promise(async function(resolve, reject){
            if(username == "" || clipId == ""){
                logger.log('warn','SetUserWatchedClip - Invalid username or clipId - Username: ' + username + ' ClipId: ' + clipId);
                reject('Invalid username or clipId - Username: ' + username + ' ClipId: ' + clipId);
            }

            GraphDatabaseHandler.query('MATCH (u:User {name: "' + username + '"}) MATCH(c:Clip {clipId: "' + clipId + '"}) MERGE (u)-[:LIKED]->(c)') // Set relationship
            .then(async function(results){
                results = results.records;
                if(results.length == 0){
                    logger.log('warn','CreateAllUserClipNodes - No users found.');
                    resolve({});
                }

                logger.log('verbose','User watched clip - User: ' + username + ' Clip: ' + clipId.url + '');
                resolve(results);
            })
            .catch(function(err){
                logger.log('error','Error: ' + err);
                reject(err);
            });
        });
    }

    async GetClipsByUserInterest(username, numberOfClips = 10, offset = 0)
    {
        let RecommendationEngineCopy = this;
        return new Promise(async function(resolve, reject){
            if(username == ""){
                logger.log('warn','GetClipsByUserInterest - Invalid username - Username: ' + username);
                reject('Invalid username  - Username: ' + username);
            }

            GraphDatabaseHandler.query(
                'MATCH (u:User {name: "' + username + '"})-[:FOLLOWS]->(followedUser:User) ' +
                'MATCH (c:Clip {broadcasterName: followedUser.name}) ' +
                'WHERE NOT (u)-[:WATCHED]->(c) ' +
                'RETURN c ' +
                'ORDER BY c.viewCount DESC ' +
                'SKIP ' + offset + ' ' +
                'LIMIT ' + numberOfClips + '')
            .then(async function(results){
                results = results.records;
                if(results.length == 0){
                    logger.log('warn','GetClipsByUserInterest - No clips found user: ' + username);
                    resolve({});
                }

                logger.log('verbose','GetClipsByUserInterest - Found ' + results.length + ' clips.');
                resolve(results);
            })
            .catch(function(err){
                logger.log('error','Error: ' + err);
                reject(err);
            });
        });
    }
};

class Singleton {
    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new RecommendationEngine();
        }
    }

    getInstance() {
        return Singleton.instance;
    }
};

module.exports = Singleton;