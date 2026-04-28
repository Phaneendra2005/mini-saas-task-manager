const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

// All task routes require authentication
router.use(verifyToken);

// GET    /api/tasks       — list all tasks for current user
router.get('/', getTasks);

// POST   /api/tasks       — create a new task
router.post('/', createTask);

// PATCH  /api/tasks/:id   — toggle task status
router.patch('/:id', updateTask);

// DELETE /api/tasks/:id   — delete a task
router.delete('/:id', deleteTask);

module.exports = router;
