const Sequelize = require('sequelize');
const database = require('../models/db');

const User = database.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    role: Sequelize.STRING
});

module.exports = User;


