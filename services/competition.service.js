const { HttpStatusCode } = require('axios');
const competitionController = require('../controllers/competition.controller');
const { ItemNotFoundError, CompetitionNotFound } = require('../errors');
const sportsManagerClient = require('./sportsManagerClient.service');

/**
 * Returns summary information on a competition that is already in the DB
 * @param {INT} competitionId 
 * @returns 
 */
exports.getCompetionById = async(competitionId) => {
    try {
        const competition = await competitionController.findByPk(competitionId);
        if (!competition) {
            throw new ItemNotFoundError(`unable to find competition with ID ${competitionId}`);
        } else {
            return competition;
        }
    } catch (error) {
        throw error
    }
}

/**
 * This calls Sports manager with a competition ID and uses the response to add a new competition to the competition table.
 * @param {INT} competitionId 
 * @returns 
 */
exports.addCompetition = async(competitionId) => {
    try {
        const competitionSummary = await sportsManagerClient.summarizeCompetition(competitionId);
        if (!competitionSummary) {
            throw new CompetitionNotFound(`Cannot find competition with ID ${competitionId} on Sports Manager`)
        } else {
           return competitionController.create(competitionId, competitionSummary.competition_name, competitionSummary.competition_short_name, competitionSummary.competition_year);
        }
    } catch (error) {
        throw error
    }
}

exports.findOrCreate = async(possibleCompetition) => {
    try {
        const [competition, created] = await competitionController.findOrCreate(possibleCompetition);
        console.log(created, competition);
        
        return competition;
    } catch (error) {
        throw error
    }
}

exports.upsert = async(competition) => {
    return await competitionController.upsert(competition);
}

exports.getCompetitions = async() => {
    return await competitionController.findAllCompetitions();
}
