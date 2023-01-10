const express = require('express');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

const app = express();

// Configuration de la base de données avec Sequelize
const database = new Sequelize({
  host: 'localhost',
  username: '',
  password: '',
  database: ''
});

// Modèle de données pour les tâches
const Task = database.define('task', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  status: Sequelize.BOOLEAN
});

// Modèle de données pour les utilisateurs
const User = database.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  role: Sequelize.STRING
});

// Modèle de données pour les projets
const Project = database.define('project', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT
});

// Association des tâches aux projets
Task.belongsTo(Project);
Project.hasMany(Task);

// Association des utilisateurs aux projets
User.belongsToMany(Project, { through: 'ProjectUsers' });
Project.belongsToMany(User, { through: 'ProjectUsers' });

// Middleware pour vérifier le token JWT et ajouter l'utilisateur à la requête
app.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // Pas de token, non autorisé

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token invalide, non autorisé
    req.user = user;
    next();
  });
});

// Route pour créer une tâche
app.post('/tasks', (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403); // Seuls les administrateurs peuvent créer des tâches

  const task = Task.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    projectId: req.body.projectId
  });

  return res.json({ task });
});

// Route pour mettre à jour une tâche
app.patch('/tasks/:id', (req, res) => {
    const task = Task.findByPk(req.params.id);
    if (task == null) return res.sendStatus(404); // Tâche non trouvée
  
    // Vérifie si l'utilisateur a le droit de mettre à jour la tâche
    if (req.user.role !== 'admin' && task.userId !== req.user.id) return res.sendStatus(403);
  
    task.title = req.body.title;
    task.description = req.body.description;
    task.status = req.body.status;
    task.projectId = req.body.projectId;
    task.save();
  
    return res.json({ task });
  });
  
  // Route pour créer un projet
  app.post('/projects', (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403); // Seuls les administrateurs peuvent créer des projets
  
    const project = Project.create({
      title: req.body.title,
      description: req.body.description
    });
  
    return res.json({ project });
  });
  
  // Route pour lister les projets
  app.get('/projects', (req, res) => {
    const projects = Project.findAll();
    return res.json({ projects });
  });
  
  // Route pour supprimer un projet
  app.delete('/projects/:id', (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403); // Seuls les administrateurs peuvent supprimer des projets
  
    const project = Project.findByPk(req.params.id);
    if (project == null) return res.sendStatus(404); // Projet non trouvé
    project.destroy();
  
    return res.sendStatus(200);
  });
  
  // Route pour créer un utilisateur
  app.post('/users', (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403); // Seuls les administrateurs peuvent créer des utilisateurs
  
    const user = User.create({
      username: req.body.username,
      password: req.body.password,
      role: req.body.role
    });
  
    return res.json({ user });
  });

// Route pour lister les utilisateurs
app.get('/users', (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403); // Seuls les administrateurs peuvent lister les utilisateurs
  
    const users = User.findAll();
    return res.json({ users });
  });
  
  // Route pour supprimer un utilisateur
  app.delete('/users/:id', (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403); // Seuls les administrateurs peuvent supprimer des utilisateurs
  
    const user = User.findByPk(req.params.id);
    if (user == null) return res.sendStatus(404); // Utilisateur non trouvé
    user.destroy();
  
    return res.sendStatus(200);
  });
  
  // Route pour l'authentification
  app.post('/login', (req, res) => {
    // Vérifie si l'utilisateur existe en base de données
    const user = User.findOne({
      where: {
        username: req.body.username,
        password: req.body.password
      }
    });
    if (user == null) return res.sendStatus(401); // Utilisateur non trouvé ou mot de passe incorrect
  
    // Génère et envoie un token JWT
    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m'
    });
    res.json({ accessToken });
  });
  
  // Démarre le serveur
  app.listen(3000, () => {
    console.log('API de gestion de tâches en cours d\'exécution sur le port 3000');
  });
