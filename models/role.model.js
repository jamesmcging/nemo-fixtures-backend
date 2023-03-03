module.exports = (sequelize, DataTypes) => {
    const role = sequelize.define('Role', {
        title: DataTypes.STRING,
    })

    role.initialize = async() => {
        await role.findOrCreate({
            where: {
                title: 'admin'
            }
        });
        await role.findOrCreate({
            where: {
                title: 'mentor'
            }
        });
        await role.findOrCreate({
            where: {
                title: 'player'
            }
        });
    }

    role.associate = (models) => {
        role.hasMany(models.user);
    }

    role.initialize = async() => {
        await role.findOrCreate({
            where: {
                title: 'admin'
            }
        });
        await role.findOrCreate({
            where: {
                title: 'mentor'
            }
        });
    }

    return role;
}