import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import axios from 'axios';

const CreateTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'To Do',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks/users/list');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Task title is required');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Task description is required');
      setLoading(false);
      return;
    }

    if (!formData.assignedTo) {
      setError('Please assign the task to a user');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/tasks', formData);
      
      setSuccess('Task created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        status: 'To Do',
      });

      // Redirect to tasks page after a short delay
      setTimeout(() => {
        navigate('/tasks');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Task
      </Typography>

      <Card>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              placeholder="Enter a descriptive title for the task"
            />

            <TextField
              fullWidth
              label="Task Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={4}
              disabled={loading}
              placeholder="Provide detailed description of the task requirements and expectations"
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Assign To</InputLabel>
              <Select
                name="assignedTo"
                value={formData.assignedTo}
                label="Assign To"
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="">
                  <em>Select a team member</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Initial Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Initial Status"
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>

            <Box mt={3} display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                disabled={loading}
                fullWidth
              >
                {loading ? 'Creating Task...' : 'Create Task'}
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate('/tasks')}
                disabled={loading}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Task Creation Guidelines
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            • Provide clear and specific task titles that explain what needs to be done
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            • Include detailed descriptions with requirements, deadlines, and success criteria
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            • Assign tasks to appropriate team members based on their skills and workload
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Consider the initial status - most new tasks should start as "To Do"
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateTask;
