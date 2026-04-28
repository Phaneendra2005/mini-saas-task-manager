const { Task } = require('../models');

// GET /api/tasks — fetch all tasks for the authenticated user
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks — create a new task
const createTask = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    if (title.trim().length > 500) {
      return res.status(400).json({ error: 'Task title must be 500 characters or fewer.' });
    }

    const task = await Task.create({
      title: title.trim(),
      userId: req.user.id,
      status: 'pending',
    });

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id — toggle task status (pending ↔ completed)
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id, userId: req.user.id }, // Ownership check (prevents IDOR)
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or you do not have permission to update it.' });
    }

    // Toggle status
    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id — delete a task
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id, userId: req.user.id }, // Ownership check (prevents IDOR)
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or you do not have permission to delete it.' });
    }

    await task.destroy();

    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
