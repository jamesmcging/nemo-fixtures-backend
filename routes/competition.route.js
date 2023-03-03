'use strict';
var express = require('express');
var router = express.Router();

const competitionService = require('../services/competition.service');

const getErrorResponse = (res, error) => {
    switch (error.name) {
        case 'ItemNotFoundError': {
            return res.status(401).send(error.message);
        }
        case 'CompetitionNotFound': {
            return res.status(401).send(error.message);
        }
        default:
            return res.status(500).send(error);
    }
}

/**
 * Fetch all competitions from the DB
 */
router.get('/', async(req, res) => {
    try {
        return res.send(await competitionService.getCompetitions());
    } catch (error) {
        return getErrorResponse(res, error)
    }
});

/**
 * Return all fixtures in the DB using a competition ID
 */
router.get('/fixtures/:competitionId', async(req, res) => {
    try {
        res.send(await competitionService.getCompetionById(req.params.competitionId));
    } catch (error) {
        return getErrorResponse(res, error)
    }
});

/**
 * Add a new competition to the DB, this will look up a competition on sportsManager and save high level info to the DB
 */
router.get('/:competitionId', async(req, res) => {
    try {
        return res.send(await competitionService.addCompetition(req.params.competitionId));
    } catch (error) {
        return getErrorResponse(res, error)
    }
});

module.exports = router;
