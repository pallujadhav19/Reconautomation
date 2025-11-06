import React from "react";
import { useNavigate } from 'react-router-dom';
import logoImg from '../Navbar/valuedx_logo.png';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import Cookies from 'js-cookie';

function AutoIntentNavbar() {
  const navigate = useNavigate();
  const username = Cookies.get('username');

  const handleLogout = () => {
    Cookies.remove('username');
    navigate('/autointent_login');
  };

  const handleViewTemplate = () => {
    window.open('/25-ChatGPT-prompts-to-Finish-Strong-and-Close-Deals.pdf', '_blank');
  };

  return (
    <AppBar position="fixed" style={{ backgroundColor: "#0A0C0B", height: 60 }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between", padding: '0 20px' }}>
        
        {/* Left Section - Logo and View Template Button */}
        <Box style={{ display: "flex", alignItems: "center" }}>
          <img src={logoImg} width="150" height="40" alt="Logo" />
          <Button
              sx={{
                marginLeft: 2,
                backgroundColor: '#4169E1',
                '&:hover': {
                  backgroundColor: '#D50048',
                },
                color: '#fff',
                padding: '2px 10px', // Reduced padding for height
                minHeight: '30px', // You can control the minimum height
                height: '30px',    // Or explicitly set the height
                fontSize: '0.875rem' // Adjust font size to match the button size
              }}
            onClick={handleViewTemplate}
          >
            View Template
          </Button>
        </Box>
        
        {/* Right Section - Username and Logout */}
        <Box style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1" style={{ marginRight: '20px', color: '#fff' }}>
            {username}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            onClick={handleLogout}
            sx={{
              backgroundColor: '#4169E1',
              '&:hover': {
                backgroundColor: '#D50048',
              },
              color: '#fff',
              padding: '3px 14px',
            }}
          >
            Log Out
          </Button>
        </Box>
        
      </Toolbar>
    </AppBar>
  );
}

export default AutoIntentNavbar;
