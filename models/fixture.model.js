module.exports = (sequelize, Sequelize) => {

    const fixture = sequelize.define('fixture', {
        externalId: {
            type: Sequelize.INTEGER,
            unique: true
        },
        homeTeam: {
            type: Sequelize.STRING
        },
        awayTeam: {
            type: Sequelize.STRING
        },
        venue: {
            type: Sequelize.STRING
        },
        pitch: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.STRING
        },
        homeScore: {
            type: Sequelize.STRING
        },
        awayScore: {
            type: Sequelize.STRING
        },
        referee_name: {
            type: Sequelize.STRING
        },
        permission_sought: {
            type: Sequelize.BOOLEAN
        },
        permission_obtained: {
            type: Sequelize.BOOLEAN
        }
    });

    fixture.associate = (models) => {
        fixture.belongsTo(models.competition);
        fixture.belongsTo(models.team);
    }

    return fixture;
};
