'use strict';
var express = require('express');
var router = express.Router();
const competitionRoutes = require('./competition.route');
const fixtureRoutes = require('./fixture.route');
const authenticationRoute = require('./authentication.route');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.use('/competition', competitionRoutes);
router.use('/fixtures', fixtureRoutes);
router.use('/authentication', authenticationRoute)

module.exports = router;