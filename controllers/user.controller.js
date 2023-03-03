const db = require('../models/index');
const User = db.user;

exports.findUserByEmail = (email) => {
    return User
        .findOne({
            where: {
                email: email
            }
        })
        .then(data => data)
        .catch(error => {throw error})
}

exports.addUser = async (name, email, hashedPassword) => {
    return await User.upsert({name, email, password: hashedPassword})
}