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

    async CreateUserChannelNodes(userName)
    {
        logger.log('info','Creating User channel data into graph user: ' + userName);
        
        let channelFetchAmount = config.services.recommendationEngine.channelFetchAmount;
        let clipFetchAmount = config.services.recommendationEngine.clipFetchAmount;

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
                    
                    logger.log('info','Done creating new user channel data for: ' + userName);
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

    async CreateUserClipNodes(userName)
    {
        logger.log('info','Creating User clip data into graph user: ' + userName);
        
        let channelFetchAmount = config.services.recommendationEngine.channelFetchAmount;
        let clipFetchAmount = config.services.recommendationEngine.clipFetchAmount;

        return new Promise(function(resolve, reject){
            TwitchApi.GetUserFollowingList(userName, {first: channelFetchAmount}) //Get json list of all the channels the user follows
            .then(async(followingList) => { 
                try {
                    let channels = followingList.data;

                    
                    const curDate = new Date();
                    const prevDate = new Date();
                    prevDate.setDate(curDate.getDate()-7);
                    
                    let clips = await TwitchApi.GetBroadcasterClips(channel.to_name, {first: clipFetchAmount, started_at: prevDate.toISOString(), ended_at: curDate.toISOString()})
                    let i = 0;
                    for (i = 0; i < clips.data.length; i++) {
                        let clip = clips.data[i];
                        let clipTitle = clip.title;
                        clipTitle.replace("\"","'");
                        await GraphDatabaseHandler.query(
                            'MERGE (c:User { name: "' + channel.to_name + '", twitchId: "' + channel.to_id + '"}) MERGE (u:Clip { title: "' + clip.title + '", clipId: "' + clip.id + '", embedUrl: "' + clip.embed_url + '", url: "' + clip.url + '", viewCount: ' + clip.view_count + ', lang: "' + clip.language + '", createdAt: "' + clip.created_at + '"}) MERGE (c)-[:CREATED]-(u)');   
                    }

                    logger.log('info','Done creating new user clip data for: ' + userName);
                    resolve(clips);
                } catch (err){
                    logger.log('error','Error: ' + err);
                    reject(error);
                }
            })
            .catch(function (error) {
                reject(error);
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