module.exports = (sequelize, DataTypes) => {
    const grade = sequelize.define('grade', {
        title: DataTypes.STRING,
    })

    return grade;
}