import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useAuth } from '../../Hooks/useAuth';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router';
import Avatar from '@mui/material/Avatar';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function NavBar({ isDarkMode, toggleTheme }) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      setDrawerOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted={false}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          sx={{ p: 0, mr: 1 }}
        >
          {user ? (
            <Avatar 
              alt={user.displayName || 'User'} 
              src={user.photoURL}
              sx={{ width: 32, height: 32 }}
            >
              {!user.photoURL && (user.displayName?.[0] || user.email?.[0] || 'U')}
            </Avatar>
          ) : (
            <AccountCircle />
          )}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', backgroundImage: 'none' }}>
        <Toolbar className='justify-between' sx={{ color: isDarkMode ? 'white' : 'black', backgroundColor: 'transparent' }}>
          <div className='flex items-center'>
            <IconButton
                size="large"
                edge="start"
                sx={{ mr: 2, color: isDarkMode ? 'white' : 'black' }}
                aria-label="open drawer"
                onClick={toggleDrawer(true)}
            >
                <MenuIcon />
            </IconButton>
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' }, color: isDarkMode ? 'white' : 'black' }}
            >
                Delivery
            </Typography>
          </div>
          <div className='flex items-center'>
            <Search>
                <SearchIconWrapper>
                <SearchIcon sx={{ color: isDarkMode ? 'white' : 'black' }} />
                </SearchIconWrapper>
                <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                sx={{ color: isDarkMode ? 'white' : 'black' }}
                />
            </Search>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <IconButton 
                  size="large" 
                  aria-label="toggle theme" 
                  onClick={toggleTheme}
                  sx={{ 
                    mr: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '8px',
                    color: isDarkMode ? 'white' : 'black',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                {
                  user ? (
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      sx={{ p: 0 }}
                    >
                      <Avatar 
                        alt={user.displayName || 'User'} 
                        src={user.photoURL}
                        sx={{ width: 40, height: 40 }}
                      >
                        {!user.photoURL && (user.displayName?.[0] || user.email?.[0] || 'U')}
                      </Avatar>
                    </IconButton>
                  ) : (
                    <Button 
                      variant="contained" 
                      sx={{ 
                        backgroundColor: isDarkMode ? '#60a5fa' : '#3b82f6',
                        color: 'white',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: isDarkMode ? '#3b82f6' : '#2563eb',
                        }
                      }}
                    >
                      <NavLink to={"/auth/login"} style={{ color: 'inherit', textDecoration: 'none' }}>Login</NavLink>
                    </Button>
                  )
                }
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                sx={{ color: isDarkMode ? 'white' : 'black' }}
                >
                <MoreIcon />
                </IconButton>
            </Box>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#0c1426', // matches your image
            color: 'white',
          }
        }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                {
                  user ? (
                    <>
                      <ListItemIcon>
                        <Avatar 
                          alt={user.displayName || 'User'} 
                          src={user.photoURL}
                          sx={{ width: 32, height: 32 }}
                        >
                          {!user.photoURL && (user.displayName?.[0] || user.email?.[0] || 'U')}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={user.displayName || 'User'} 
                        secondary={user.email}
                        sx={{
                          '& .MuiListItemText-secondary': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </>
                  ) : (
                    <Button 
                      variant="contained" 
                      sx={{ 
                        width: '100%',
                        backgroundColor: '#60a5fa',
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        py: 1,
                        '&:hover': {
                          backgroundColor: '#3b82f6',
                        }
                      }}
                    >
                      <NavLink to="/auth/login" style={{ color: 'inherit', textDecoration: 'none', width: '100%' }}>Login</NavLink>
                    </Button>
                  )
                }
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton><NavLink to="/">Home</NavLink></ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              {
                user ? (
                  <ListItemButton>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                  </ListItemButton>
                ):(
                  <></>
                )
              }
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton><NavLink to="/add-a-parcel">Add a Parcel</NavLink></ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton><NavLink to="/history">History</NavLink></ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton><NavLink to="/be-a-rider">Be a Rider</NavLink></ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton><NavLink to="/approve-riders">Approve Riders</NavLink></ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton><NavLink to="/users-management">Users Management</NavLink></ListItemButton>
            </ListItem>
            {user && (
              <>
                <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemText primary="Logout" sx={{ color: '#ef4444' }} />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
