const Sequelize = require('sequelize');
const database = require('../models/db');

const Project = database.define('project', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT
});

module.exports = Project;
