const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getTasks, 
  getTask, 
  updateTask, 
  deleteTask, 
  getUsers 
} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (Manager, Admin)
router.post('/', auth, rbac(['Manager', 'Admin']), createTask);

// @route   GET /api/tasks
// @desc    Get all tasks (filtered by role)
// @access  Private
router.get('/', auth, getTasks);

// @route   GET /api/tasks/users/list
// @desc    Get all users for task assignment
// @access  Private
router.get('/users/list', auth, getUsers);

// @route   GET /api/tasks/:id
// @desc    Get a single task
// @access  Private
router.get('/:id', auth, getTask);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private (Manager, Admin)
router.delete('/:id', auth, rbac(['Manager', 'Admin']), deleteTask);

module.exports = router;
