const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const Sequelize = require('sequelize');
let sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {dialect: 'mysql'});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-8) === 'model.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize);
        console.log(`Adding model ${file} to db`)
        db[model.name.toLowerCase()] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Now we insert some base data into the DB
db.initialize = async() => {
    await db.role.initialize();
}


module.exports = db;
