import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit,
  AdminPanelSettings,
  SupervisorAccount,
  Person,
} from '@mui/icons-material';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      // Note: This would require an additional API endpoint in the backend
      // For now, we'll just update the local state
      setUsers(prev =>
        prev.map(user =>
          user._id === editingUser._id ? editingUser : user
        )
      );
      setEditDialogOpen(false);
      setEditingUser(null);
      
      // In a real implementation, you would call:
      // await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, editingUser);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'error';
      case 'Manager':
        return 'warning';
      case 'Member':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <AdminPanelSettings />;
      case 'Manager':
        return <SupervisorAccount />;
      case 'Member':
        return <Person />;
      default:
        return <Person />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* User Statistics */}
      <Box mb={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Statistics
            </Typography>
            <Box display="flex" gap={4}>
              <Box>
                <Typography variant="h4" color="error">
                  {users.filter(user => user.role === 'Admin').length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Admins
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" color="warning.main">
                  {users.filter(user => user.role === 'Manager').length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Managers
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" color="primary">
                  {users.filter(user => user.role === 'Member').length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Members
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4">
                  {users.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Users
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Users
          </Typography>
          
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2 }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {user.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        icon={getRoleIcon(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(user.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {users.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                No users found
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          {editingUser && (
            <Box>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ mr: 2, width: 56, height: 56 }}>
                  {editingUser.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {editingUser.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {editingUser.email}
                  </Typography>
                </Box>
              </Box>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={editingUser.role}
                  label="Role"
                  onChange={(e) => setEditingUser(prev => ({ ...prev, role: e.target.value }))}
                >
                  <MenuItem value="Member">
                    <Box display="flex" alignItems="center">
                      <Person sx={{ mr: 1 }} />
                      Member
                    </Box>
                  </MenuItem>
                  <MenuItem value="Manager">
                    <Box display="flex" alignItems="center">
                      <SupervisorAccount sx={{ mr: 1 }} />
                      Manager
                    </Box>
                  </MenuItem>
                  <MenuItem value="Admin">
                    <Box display="flex" alignItems="center">
                      <AdminPanelSettings sx={{ mr: 1 }} />
                      Admin
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Role Permissions:</strong>
                </Typography>
                <Typography variant="body2">
                  • <strong>Admin:</strong> Full access to all features and user management
                </Typography>
                <Typography variant="body2">
                  • <strong>Manager:</strong> Can create, update, and delete tasks
                </Typography>
                <Typography variant="body2">
                  • <strong>Member:</strong> Can view and update only their assigned tasks
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
