module.exports = (sequelize, Sequelize) => {
    const competition = sequelize.define('competition', {
        name: {
            type: Sequelize.STRING
        },
        shortName: {
            type: Sequelize.STRING
        },
        year: {
            type: Sequelize.STRING
        }
    });

    competition.associate = (models) => {
        competition.hasMany(models.fixture);
        competition.hasOne(models.team);
    }

    return competition;
};
