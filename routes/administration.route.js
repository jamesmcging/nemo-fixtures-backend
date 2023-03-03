'use strict';
var express = require('express');
var sportsManagerClient = require('../services/sportsManagerClient.service')
var router = express.Router();

const db = require('../models')
const Competition = db.competition;
const Op = db.sequelize.Op;

/**
 * Fetch all fixtures in a competition and add them to the DB. If they are already in the DB, update the entries
 */
router.get('/populate/fixtures/:competitionId', async(req, res) => {
    const competition = await sportsManagerClient.fetchFixturesByCompetitionId(req.params.competitionId);


});

/**
 * Fetch and return all fixtures in a competition without adding them to the DB
 */
router.get('/fetch/fixtures/:competitionId', async (req, res) => {
    res.send(await sportsManagerClient.summarizeCompetition(req.params.competitionId));
});

module.exports = router;
