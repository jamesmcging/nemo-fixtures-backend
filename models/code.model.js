module.exports = (sequelize, DataTypes) => {
    const code = sequelize.define('code', {
        title: DataTypes.STRING,
    })

    return code;
}