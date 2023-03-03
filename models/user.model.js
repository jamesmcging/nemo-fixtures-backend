module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        password: DataTypes.STRING,
        year_of_birth: DataTypes.INTEGER,
    })

    user.associate = (models) => {
        user.belongsTo(models.role);
    }

    return user;
}