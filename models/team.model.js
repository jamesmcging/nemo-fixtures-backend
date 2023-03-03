module.exports = (sequelize, Sequelize) => {
    const team = sequelize.define('team', {
        name: {
            type: Sequelize.STRING
        },
        season: {
            type: Sequelize.INTEGER
        },
    });

    team.associate = (models) => {
        team.hasOne(models.code);
        team.hasOne(models.grade);
    }

    return team;
};
