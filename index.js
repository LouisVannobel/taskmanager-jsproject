const Task = require('./task');
const User = require('./user');
const Project = require('./project');

Task.belongsTo(Project);
Project.hasMany(Task);

User.belongsToMany(Project, { through: 'ProjectUsers' });
Project.belongsToMany(User, { through: 'ProjectUsers' });

module.exports = {Task, User, Project};
