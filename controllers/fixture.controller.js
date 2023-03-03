const { competition } = require('../models/index');
const db = require('../models/index');
const Fixture = db.fixture;
const { Op } = require('sequelize');


exports.getAllFixtures = async() => {
    return await Fixture
        .findAll({
            order: ['date'],
            include: competition
        })
        .then(data => data)
        .catch(error => {throw error})
}

/**
 * Find and return the details of a fixture as found in the DB
 * @param INTEGER fixtureId 
 */
exports.findByFixtureId = (fixtureId) => {
    return Fixture
        .findByPk(fixtureId)
        .then(data => data.dataValues)
        .catch(error => {throw error})
}

/**
 * Find and return all fixtures in a competition using the competition ID
 * @param {INT} competitionId 
 * @returns 
 */
exports.findByCompetitionId = (competitionId) => {
    return Fixture
        .findAll({
            where: {
                competitionId: competitionId
            }
        })
        .then(data => data.dataValues)
        .catch(error => {throw error})
}

/**
 * Find and return a feature using any parameter
 * @param {any} parameter
 * @param {any} value
 */
exports.findByParameter = (parameter, value) => {
    const search = {};
    search[parameter] = value;

    return Fixture
        .findAll({
            where: search
        })
        .then(data => data)
        .catch(error => { throw error })
}

/**
 * Adds a fixture to the DB
 * @param {Feature} fixture 
 * @returns 
 */
exports.createFixture = (fixture) => {

    return Fixture
        .create({
            externalId: fixture.fixtureId,
            competitionId: fixture.competitionId,
            homeTeam: fixture.homeTeam,
            awayTeam: fixture.awayTeam,
            venue: fixture.venue,
            date: fixture.fixtureDate
        })
        .then(data => {
            return data
        })
        .catch(error => {throw error})
}

exports.updateFixture = async(fixtureId, field, value) => {
    const fixture = await Fixture.findOne({where: {id: fixtureId}});
    if (!fixture) {
        throw Error(`Job not updated. id: ${id}`);
    }
    fixture[field] = value;
    return await fixture.save();
}

exports.upsert = async(fixture) => {
    return Fixture.upsert(fixture)
}

exports.getFixturesForUpdate = async() => {
    return await Fixture
    .findAll({
        order: ['date'],
        include: competition,
        attributes: ['competition.name', 'homeTeam', 'awayTeam', 'venue', 'date', 'permission_sought', 'permission_obtained', 'pitch', 'referee_name', 'homeScore', 'awayScore'],
        where: { 
            [Op.or]: [
                { 
                    homeTeam: {
                        [Op.like]: 'Nemo%'
                    }
                },
                {
                    awayTeam: {
                        [Op.like]: 'Nemo%'
                    }
                }
            ]
        }
    })
    .then(data => data)
    .catch(error => {throw error})
}