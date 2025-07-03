const Task = require('../models/Task');
const User = require('../models/User');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    // Verify the assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.user.id
    });

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error during task creation' });
  }
};

// Get all tasks (with RBAC filtering)
const getTasks = async (req, res) => {
  try {
    const { status, assignee } = req.query;
    const userRole = req.user.role;
    
    let query = {};

    // Apply RBAC filtering
    if (userRole === 'Member') {
      // Members can only see their assigned tasks
      query.assignedTo = req.user.id;
    }
    // Admins and Managers can see all tasks

    // Apply additional filters
    if (status) {
      query.status = status;
    }
    
    if (assignee && (userRole === 'Admin' || userRole === 'Manager')) {
      query.assignedTo = assignee;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error during task retrieval' });
  }
};

// Get a single task
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const task = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Apply RBAC: Members can only view their assigned tasks
    if (userRole === 'Member' && task.assignedTo._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only view your assigned tasks.' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error during task retrieval' });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, status } = req.body;
    const userRole = req.user.role;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Apply RBAC for updates
    if (userRole === 'Member') {
      // Members can only update their assigned tasks and only the status
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied. You can only update your assigned tasks.' });
      }
      
      // Members can only update status
      if (status) {
        task.status = status;
      }
    } else {
      // Admins and Managers can update all fields
      if (title) task.title = title;
      if (description) task.description = description;
      if (assignedTo) {
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
          return res.status(400).json({ message: 'Assigned user not found' });
        }
        task.assignedTo = assignedTo;
      }
      if (status) task.status = status;
    }

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error during task update' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Apply RBAC: Only Admins and Managers can delete tasks
    if (userRole === 'Member') {
      return res.status(403).json({ message: 'Access denied. Members cannot delete tasks.' });
    }

    await Task.findByIdAndDelete(id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error during task deletion' });
  }
};

// Get all users (for task assignment)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('name email role');
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error during users retrieval' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getUsers
};
