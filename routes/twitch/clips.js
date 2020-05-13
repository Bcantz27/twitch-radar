var express = require('express');
var util = require('util');
var router = express.Router();
var env = process.env.NODE_ENV || "development";
var config = require('../../config/' + env + '.js');

var Logger = require('../../services/logging-service.js');
var logger = new Logger().getInstance();

var RecommendationEngineSingleton = require('../../services/recommendation-engine-service.js');
var RecommendationEngine = new RecommendationEngineSingleton().getInstance();

var TwitchApi = require('../../services/twitch-api-service.js');

router.get('/GetBroadcasterClips', function(req, res, next) {
    TwitchApi.GetBroadcasterClips(req.body.broadcasterName, req.body.optionalParams)
    .then(function (response) {
        res.send(util.inspect(response.data));
    })
    .catch(function (error) {
        next(error);
    });
});

router.get('/GetGameClips', function(req, res, next) {
    TwitchApi.GetGameClips(req.body.gameId, req.body.optionalParams)
    .then(function (response) {
        res.send(util.inspect(response.data));
    })
    .catch(function (error) {
        next(error);
    });
});

router.post('/CreateUserChannelNodes', function(req, res, next) {
    RecommendationEngine.CreateUserChannelNodes(req.body.twitchName, req.body.channelFetchAmount)
    .then(function (response) {
        res.send(util.inspect(response));
    })
    .catch(function (error) {
        next(error);
    });
});

router.post('/CreateUserClipNodes', function(req, res, next) {
    RecommendationEngine.CreateUserClipNodes(req.body.twitchName, req.body.clipFetchAmount, req.body.clipFetchRange)
    .then(function (response) {
        res.send(util.inspect(response));
    })
    .catch(function (error) {
        next(error);
    });
});

router.post('/CreateAllUserClipNodes', function(req, res, next) {
    RecommendationEngine.CreateAllUserClipNodes(req.body.clipFetchAmount, req.body.clipFetchRange)
    .then(function (results) {
        res.send(util.inspect(results));
    })
    .catch(function (error) {
        next(error);
    });
});

module.exports = router;