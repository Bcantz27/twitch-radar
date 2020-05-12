var express = require('express');
var router = express.Router();
var User = require("../models/User");

var Logger = require('../services/logging-service.js');
var logger = new Logger().getInstance();

module.exports = function(passport) {
    router.post('/login', passport.authenticate('local-login'), function(req, res) {
        res.json(req.user);
    });

    router.get('/twitch', passport.authenticate('twitch-login'));
    router.get('/twitch/callback', passport.authenticate('twitch-login', { failureRedirect: '/' }), function(req, res) {
        // Successful authentication, redirect home.
        req.session.user = req.user;
        res.redirect(req.session.returnTo || '/');
    });

    router.post('/signup', passport.authenticate('local-signup'), function(req, res) {
        res.json(req.user);
    });

    router.get('/user', function(req, res) {
        res.json(req.user);
    });

    router.post('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    router.post('/logout', function(req, res) {
        req.logOut();
        res.json(req.user);
    });

    return router;
}