'use strict';
const fs = require('fs');
var express = require('express');
var router = express.Router();

const fixtureService = require('../services/fixture.service');
const competitionService = require('../services/competition.service');
const authenticationService = require('../services/authentication.service');
const { default: isEmail } = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');
const userController = require('../controllers/user.controller');

/**
 * Attempt to log in a user
 */
router.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body;
        if (email.length > 3 && password.length > 3) {
            if (await authenticationService.login(email, password)) {
                res.cookie('nemo-fixture', 'cookie-value', {maxAge: 1000 * 60 * 60})
                res.status(200).send('success');
            } else {
                res.status(400).send('login failed');
            }
        } else {
            res.status(401).send({ message: 'login failed' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

// router.get('/hashedPassword/:password', (req, res) => {
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(req.params.password, salt);
//     return res.json({"hashedPassword": hashedPassword});
// });

router.post('/user', async(req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (name && email && password) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const user = await userController.addUser(name, email, hashedPassword);
        res.send(user);
    } else {
        res.status(400).send('missing a required parameter')
    }
});


module.exports = router;
