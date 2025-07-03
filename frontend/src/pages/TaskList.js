import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Edit,
  Delete,
  FilterList,
  Assignment,
  CheckCircle,
  PlayArrow,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const TaskList = () => {
  const { user, hasRole } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    assignedTo: '',
    search: '',
  });
  const [users, setUsers] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks/users/list');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Filter by assigned user
    if (filters.assignedTo) {
      filtered = filtered.filter(task => task.assignedTo._id === filters.assignedTo);
    }

    // Filter by search text
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTasks(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      assignedTo: '',
      search: '',
    });
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        status: newStatus,
      });
      
      // Update local state
      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
        setTasks(prev => prev.filter(task => task._id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Failed to delete task');
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${editingTask._id}`, editingTask);
      setTasks(prev =>
        prev.map(task =>
          task._id === editingTask._id ? editingTask : task
        )
      );
      setEditDialogOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'default';
      case 'In Progress':
        return 'warning';
      case 'Done':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'To Do':
        return <Assignment />;
      case 'In Progress':
        return <PlayArrow />;
      case 'Done':
        return <CheckCircle />;
      default:
        return <Assignment />;
    }
  };

  const canEditTask = (task) => {
    return hasRole(['Admin', 'Manager']) || task.assignedTo._id === user._id;
  };

  const canDeleteTask = () => {
    return hasRole(['Admin', 'Manager']);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search tasks..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={filters.assignedTo}
                  label="Assigned To"
                  onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                fullWidth
                sx={{ height: '56px' }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      <Grid container spacing={3}>
        {filteredTasks.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" color="textSecondary" align="center">
              No tasks found
            </Typography>
          </Grid>
        ) : (
          filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" component="h2">
                      {task.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={task.status}
                      color={getStatusColor(task.status)}
                      icon={getStatusIcon(task.status)}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {task.description}
                  </Typography>
                  
                  <Typography variant="caption" color="textSecondary">
                    Assigned to: {task.assignedTo.name}
                  </Typography>
                  <br />
                  <Typography variant="caption" color="textSecondary">
                    Created by: {task.createdBy.name}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  {canEditTask(task) && (
                    <>
                      {task.status !== 'Done' && (
                        <Button
                          size="small"
                          onClick={() => handleStatusUpdate(
                            task._id,
                            task.status === 'To Do' ? 'In Progress' : 'Done'
                          )}
                        >
                          Mark as {task.status === 'To Do' ? 'In Progress' : 'Done'}
                        </Button>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleEditTask(task)}
                      >
                        <Edit />
                      </IconButton>
                    </>
                  )}
                  
                  {canDeleteTask() && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          {editingTask && (
            <Box>
              <TextField
                fullWidth
                label="Title"
                value={editingTask.title}
                onChange={(e) => setEditingTask(prev => ({ ...prev, title: e.target.value }))}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={editingTask.description}
                onChange={(e) => setEditingTask(prev => ({ ...prev, description: e.target.value }))}
                margin="normal"
                multiline
                rows={3}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingTask.status}
                  label="Status"
                  onChange={(e) => setEditingTask(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskList;
