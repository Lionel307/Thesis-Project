import React from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import MenuIcon from '@mui/icons-material/Menu';

import {
  useNavigate,
  useLocation,
} from 'react-router-dom';

const Navbar = (props) => {
  
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const token = 'test'
  const logout = async () => {
    localStorage.clear();

    navigate('/')
  }

  const goHome = () => {
    const typeString = localStorage.getItem('user');
    const zIDString = localStorage.getItem('zID');
    const type = JSON.parse(typeString);
    const zID = JSON.parse(zIDString);
    navigate('/Home/'+ type + '/' + zID)
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={goHome}
          >
          {/* <MenuIcon /> */}
            Home
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
          <Button
            id="basic-button"
            name="profile"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}color="inherit"
          >
            <Avatar src="/broken-image.jpg" />
          </Button>
          {/* menu code is from https://mui.com/material-ui/react-menu/ */}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <>
              <MenuItem name="logout" onClick={() => { handleClose(); logout(); }}>Logout</MenuItem>
            </>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
    </div>

  );
}

export default Navbar
