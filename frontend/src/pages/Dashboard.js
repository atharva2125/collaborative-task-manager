import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  PlayArrow,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    myTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const tasksResponse = await axios.get('http://localhost:5000/api/tasks');
      const tasks = tasksResponse.data.tasks;

      // Calculate statistics
      const totalTasks = tasks.length;
      const todoTasks = tasks.filter(task => task.status === 'To Do').length;
      const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
      const doneTasks = tasks.filter(task => task.status === 'Done').length;
      const myTasks = tasks.filter(task => task.assignedTo._id === user._id).length;

      setStats({
        totalTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
        myTasks,
      });

      // Get recent tasks (last 5)
      const recent = tasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentTasks(recent);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Here's your task overview
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Tasks
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalTasks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    To Do
                  </Typography>
                  <Typography variant="h4">
                    {stats.todoTasks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PlayArrow color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    In Progress
                  </Typography>
                  <Typography variant="h4">
                    {stats.inProgressTasks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Done
                  </Typography>
                  <Typography variant="h4">
                    {stats.doneTasks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* My Tasks Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Tasks
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.myTasks}
              </Typography>
              <Typography color="textSecondary">
                Tasks assigned to you
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Tasks
              </Typography>
              {recentTasks.length === 0 ? (
                <Typography color="textSecondary">
                  No recent tasks
                </Typography>
              ) : (
                <Box>
                  {recentTasks.map((task) => (
                    <Box key={task._id} mb={2} p={1} border={1} borderColor="grey.300" borderRadius={1}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2">
                          {task.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={task.status}
                          color={getStatusColor(task.status)}
                          icon={getStatusIcon(task.status)}
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {task.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Assigned to: {task.assignedTo.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
