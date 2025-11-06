import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import '../Leadapp/login.css';
import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LogoImage from "../Leadapp/valuedx_logo_black.png";
import BgImg from "../Leadapp/newloginbg.jpg";

const theme = createTheme();

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      {new Date().getFullYear()} ValueDx Technologies.
    </Typography>
  );
}

function AutoIntentLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSessionTimeout = () => {
    setTimeout(() => {
      alert('Your session expired');
      navigate('/autointent_login');
    }, 7 * 60 * 1000);
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${BgImg})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.margin = 0;
    document.body.style.height = "100vh";
    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/loginAutoIntent?username=${username}&password=${password}`, {
        method: 'GET',
      });
      const data = await response.json();
      if (response.ok) {
        const agentState = data.agentState;

        // check agent state is running
        if (agentState === 'RUNNING') {
        Cookies.set('username', username);
        handleSessionTimeout();
        navigate('/autointent_multipleUpload');
      } else {
        alert('Agent is not running. Please contact to your Admin');
      }
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again later.');
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: 2,
          }}
        >
          <img
            src={LogoImage}
            style={{ width: "200px", marginTop: "30px" }}
            alt="logo"
          />
          <br />
          <Typography component="h1" sx={{ fontWeight: "bold" }} variant="h5">
             MailAI
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 , width:'300px'}}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              placeholder="Username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
            />
            <Box display="flex" justifyContent="center" alignItems="center">
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            </Box>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
            className="signin_button"
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                fontWeight:'bold'
              }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <Link href="/autointent_register" variant="body2" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
              {"Don't have an account? Register"}
            </Link>
          </Box>
        </Box>
        <Copyright sx={{ mt: 4, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default AutoIntentLoginPage;
