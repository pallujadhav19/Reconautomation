import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Popover from '@mui/material/Popover';
import Avatar from '@mui/material/Avatar';
import ValueDxLogo from '../Leadapp/valuedx_logo_black.png';

function Navbar({ showLogoutButton }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    });
  
    // Remove localStorage item
    localStorage.removeItem('isAuthenticated');
  
    // Redirect to home page
    navigate("/lead_login");
  };
  

  // Fetch user info from cookies
  const name = getCookie('name');
  const username = getCookie('username'); // Assuming email is stored in cookies

  // Function to get cookie value
  function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? decodeURIComponent(cookieValue.pop()) : '';
  }

  // Open popover
  const handleUserIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close popover
  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'user-popover' : undefined;

  return (
    <AppBar position="fixed" style={{ backgroundColor: "#cfd8dc" }}>
      <Toolbar>
        <div style={{ flexGrow: 1 }}>
          <img src={ValueDxLogo} alt="valuedx_logo" style={{ height: 60, width: 200 }} />
        </div>
        {showLogoutButton && (
          <div>
            <IconButton
              aria-describedby={id}
              onClick={handleUserIconClick}
              edge="end"
              color="inherit"
              style={{ color: "black" }} 
            >
              <AccountCircleIcon fontSize="large" />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <div style={{ padding: 20, width: 350 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <Avatar src="profile-picture-url" style={{ marginRight: 10, color:'#cfd8dc',backgroundColor:'black' }} /> 
                  <div style={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{name}</Typography>
                  </div>
                  <Button variant="contained" color="primary" size="small" onClick={handleLogout}>
                    Log Out
                  </Button>
                </div>
              </div>
            </Popover>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
