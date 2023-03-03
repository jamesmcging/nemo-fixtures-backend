const { HttpStatusCode } = require('axios');
const fixtureController = require('../controllers/fixture.controller');
const { ItemNotFoundError, CompetitionNotFound } = require('../errors');
const sportsManagerClient = require('./sportsManagerClient.service');
const competitionService = require('./competition.service');
const XLSX = require('xlsx');

/**
 * Return a single fixture identified by fixtureId in the DB
 * @param {INT} fixtureId 
 * @returns 
 */
exports.getFixtureById = async (fixtureId) => {
    try {
        const fixture = await fixtureController.findByFixtureId(fixtureId);
        if (!fixture) {
            throw new ItemNotFoundError(`unable to find fixture with ID ${fixtureId}`);
        } else {
            return fixture;
        }
    } catch (error) {
        throw error
    }
}

/**
 * Return all fixtures in a competition in the DB
 * @param {INT} competitionId 
 * @returns 
 */
exports.getFixtureByCompetitionId = async (competitionId) => {
    try {
        const fixtures = await fixtureController.findByCompetitionId(competitionId);
        if (!fixtures) {
            throw new ItemNotFoundError(`unable to find fixtures in the competition with ID ${competitionId}`);
        } else {
            return fixtures;
        }
    } catch (error) {
        throw error
    }
}

/**
 * Returns all fixtures in the DB
 * @returns [Fixtures]
 */
exports.getAllFixtures = async () => {
    try {
        const fixtures = await fixtureController.getAllFixtures();

        if (!fixtures) {
            throw new ItemNotFoundError(`unable to find any fixtures in the DB`);
        } else {
            return fixtures;
        }
    } catch (error) {
        throw error
    }
}

/**
 * Fetches all fixtures in a competition from Sports Manager and adds them to the DB
 * @param {INT} competitionId 
 * @returns number of new fixtures added to the DB
 */
exports.addFixturesByCompetitionId = async(competitionId) => {
    let newFixtureCount = 0;
    let fixtureUpdatedCount = 0;
    try {
        const fixtures = await sportsManagerClient.fetchFixturesByCompetitionId(competitionId);
        console.log('fixtures', fixtures);

        if (!fixtures) {
            throw new ItemNotFound(`Cannot find fixtures with the competition ID ${competitionId} on Sports Manager`)
        } else {
            // extract the competition from the first fixture
            const competition = {
                id: fixtures[0].competitionId,
                name: fixtures[0].competitionName,
                shortName: fixtures[0].competitionShortName,
                year: fixtures[0].compYear
            };
            // ensure competition is in the DB
            await competitionService.upsert(competition);

            // iterate over the fixtures adding where it doesn't exist, updating where it does
            await Promise.all(fixtures.map(async(fixture) => {
                try {
                    const [db_fixture, created] = await fixtureController.upsert({
                        externalId: fixture.fixtureId,
                        homeTeam: fixture.homeTeam,
                        awayTeam: fixture.awayTeam,
                        venue: fixture.venue,
                        date: fixture.fixtureDate,
                        homeScore: fixture.homeScore,
                        awayScore: fixture.awayScore,
                        referee_name: fixture.matchOfficials.Referee.name,
                        competitionId: fixture.competitionId
                    });

                    if (created) {
                        newFixtureCount++
                    } else {
                        fixtureUpdatedCount++
                    }
                } catch (error) {
                    throw error
                }
            }));

            return `Number of fixtures added to DB: ${newFixtureCount}, number of fixtures updated ${fixtureUpdatedCount}`;
        }
    } catch (error) {
        console.log('fixture.service.addFixtureByCompetition throws an error', error);
        throw error
    }
}

exports.updateFixture = async(fixtureId, fieldToBeUpdated, value) => {
    try {
        return await fixtureController.updateFixture(fixtureId, fieldToBeUpdated, value)
    } catch (error) {
        throw error
    }
}

exports.generateFixtureList = async() => {
    const fixtureList = await fixtureController.getFixturesForUpdate();
    const fixtures = fixtureList.map( fixture => {
        return {
            date: formatDate(fixture.date),
            time: new Date(Number(fixture.date)*1000).toLocaleTimeString(),
            competition: fixture.competition.dataValues.name,
            homeTeam: fixture.homeTeam,
            awayTeam: fixture.awayTeam,
            venue: fixture.venue,
            pitch: fixture.pitch,
            referee: fixture.referee_name,
            homeScore: fixture.homeScore,
            awayScore: fixture.awayScore
        }
    })
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(fixtures);
    XLSX.utils.book_append_sheet(wb, ws, "Fixtures");

    /* generate and return buffer */
    return XLSX.write(wb, { type:"buffer", bookType:"xlsx" });
}

function formatDate(epoch) {
    const date = new Date(epoch * 1000);
    let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    let day = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(date);
    let dayName = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date);

    return `${dayName} ${month} ${day} ${year}`;
}
