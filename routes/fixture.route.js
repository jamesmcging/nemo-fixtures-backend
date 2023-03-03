'use strict';
const fs = require('fs');
var express = require('express');
const { fixture } = require('../models');
var router = express.Router();

const fixtureService = require('../services/fixture.service');
const competitionService = require('../services/competition.service');

/**
 * Return all fixtures in the DB, these will be sorted by date
 */
router.get('/', async(req, res) => {
    try {
        res.send(await fixtureService.getAllFixtures());
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

/**
 * Return all fixtures in the DB, these will be sorted by date in an excel file
 */
router.get('/excel', async(req, res) => {
    try {
        const buf = await fixtureService.generateFixtureList();
        const fileName = `nemo-fixture-update-${new Date().toISOString()}.xlsx`;
    
        /* prepare response headers */
        res.statusCode = 200;
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/vnd.ms-excel');

        res.end(buf);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

/**
 * Return fixture in the DB identified by fixtureId
 */
router.get('/:fixtureId', async(req, res) => {
    try {
        res.send(await fixtureService.getFixtureById(req.params.fixtureId));
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

/**
 * Fetches all fixtures in a competition from Sports Manager and inserts them into the DB
 */
router.get('/fetchAndPopulateByCompetitionId/:competitionId', async(req, res) => {
    try {
        res.send(await fixtureService.addFixturesByCompetitionId(req.params.competitionId));
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * Update a fixture field with a given value
 */
router.get('/updateFixture/:fixtureId/:field/:value', async(req, res) => {
    try {
        const arrUpdateableFields = ['venue', 'pitch', 'homeScore', 'awayScore', 'date', 'permission_sought', 'permission_obtained', 'referee_name'];
        if (!arrUpdateableFields.includes(req.params.field)) {
            res.status(400).send(`The following fields can be updated: ${arrUpdateableFields.join(', ')}`)
        } else {
            res.send(await fixtureService.updateFixture(req.params.fixtureId, req.params.field, req.params.value));
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * Update fixtures in the DB from Sportslomo for a given competition
 */
router.get('/updateFixtures/:competitionId', async(req, res) => {
    try {
        const competition = await competitionService.getCompetionById(req.params.competitionId);
        if (competition) {
            const updateFixtureResult = await fixtureService.addFixturesByCompetitionId(competition.id);
            res.send(updateFixtureResult);
        } else {
            res.status(400).send(`cannot find competition with Id ${req.params.competitionId}`);
        }
    } catch(error) {
        res.status(500).send(error);
    }
});


module.exports = router;
