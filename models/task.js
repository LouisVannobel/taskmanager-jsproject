const Sequelize = require('sequelize');
const database = require('../models/db');

const Task = database.define('task', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    status: Sequelize.BOOLEAN
});

module.exports = Task;
