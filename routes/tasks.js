const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.post('/', (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403); // Seuls les administrateurs peuvent créer
