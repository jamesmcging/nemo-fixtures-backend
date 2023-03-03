const userController = require('../controllers/user.controller');
const bcrypt = require('bcrypt');

exports.login = async(email, password) => {
    try {
        const user = await userController.findUserByEmail(email);
        if (user) {
            return bcrypt.compareSync(password, user.password);   
        } else {
            return false;
        }
    } catch (error) {
        throw error
    }
}
