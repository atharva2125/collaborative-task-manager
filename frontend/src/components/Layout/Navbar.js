import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Chip,
} from '@mui/material';
import {
  AccountCircle,
  Dashboard,
  Task,
  Add,
  People,
  ExitToApp,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const isActivePath = (path) => {
    return location.pathname === path;
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

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo/Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Task Manager
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<Dashboard />}
            onClick={() => navigate('/dashboard')}
            variant={isActivePath('/dashboard') ? 'outlined' : 'text'}
          >
            Dashboard
          </Button>

          <Button
            color="inherit"
            startIcon={<Task />}
            onClick={() => navigate('/tasks')}
            variant={isActivePath('/tasks') ? 'outlined' : 'text'}
          >
            Tasks
          </Button>

          {/* Create Task - Only for Admin and Manager */}
          {hasRole(['Admin', 'Manager']) && (
            <Button
              color="inherit"
              startIcon={<Add />}
              onClick={() => navigate('/create-task')}
              variant={isActivePath('/create-task') ? 'outlined' : 'text'}
            >
              Create Task
            </Button>
          )}

          {/* User Management - Only for Admin */}
          {hasRole(['Admin']) && (
            <Button
              color="inherit"
              startIcon={<People />}
              onClick={() => navigate('/users')}
              variant={isActivePath('/users') ? 'outlined' : 'text'}
            >
              Users
            </Button>
          )}
        </Box>

        {/* User Info and Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* User Role Chip */}
          <Chip
            label={user?.role}
            color={getRoleColor(user?.role)}
            size="small"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />

          {/* User Name */}
          <Typography variant="body1">
            {user?.name}
          </Typography>

          {/* User Menu */}
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <AccountCircle sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
