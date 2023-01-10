const Sequelize = require('sequelize');
const database = require('../config/database');

const Project = database.define('project', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT
});

module.exports = Project;
