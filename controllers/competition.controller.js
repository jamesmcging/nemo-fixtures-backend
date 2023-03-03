const { competition } = require('../models/index');
const db = require('../models/index');
const Competition = db.competition;
const Op = db.sequelize.Op;


/**
 * Find and return the details of a competion as found in the DB
 * @param INTEGER competitionId 
 */
exports.findByPk = (competitionId) => {
    return Competition
        .findByPk(competitionId)
        .then(data => data.dataValues)
        .catch(error => {throw error})
}

exports.create = (competitionId, competitionName, competitionShortName) => {
    return Competition
        .create({
            id: competitionId,
            name: competitionName,
            shortName: competitionShortName
        })
        .then(data => data)
        .catch(error => {
            throw error
        })
}

exports.findOrCreate = (competition) => {
    return Competition
        .findOrCreate({
            where: { 
                id: competition.id,
                name: competition.name,
                shortName: competition.shortName
            }
        })
        .then(data => data)
        .catch(error => {throw error});
}

exports.findAllCompetitions = () => {
    return Competition
        .findAll()
        .then(data => data)
        .catch(error => {throw error});
}

exports.upsert = async(competition) => {
    return Competition.upsert(competition)
}