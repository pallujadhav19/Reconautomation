import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Paper,
  IconButton,
  Modal,
  Divider,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AutoIntentNavbar from "./autointentnavbar";

const RegisterDetails = () => {
  const [formData, setFormData] = useState({
    YOUR_NAME: "",
    YOUR_EMAIL: "",
    EMAIL_PASSWORD: "",
    YOUR_MOBILE: "",
    YOUR_COMPANY_NAME: "",
    YOUR_POSITION: "",
    SCHEDULE_LINK: "",
    USERNAME: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  //const handleClose = () => setOpen(false);
  const handleClose = () => {
    setOpen(false);
    navigate("/autointent_login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.YOUR_NAME = formData.YOUR_NAME ? "" : "Name is required.";
    tempErrors.YOUR_EMAIL = formData.YOUR_EMAIL ? "" : "Email is required.";
    tempErrors.EMAIL_PASSWORD = formData.EMAIL_PASSWORD ? "" : "Password is required.";
    tempErrors.YOUR_MOBILE = formData.YOUR_MOBILE.length === 10 ? "" : "Mobile Number must be 10 digits.";
    tempErrors.YOUR_COMPANY_NAME = formData.YOUR_COMPANY_NAME ? "" : "Company Name is required.";
    tempErrors.YOUR_POSITION = formData.YOUR_POSITION ? "" : "Position is required.";
    tempErrors.SCHEDULE_LINK = formData.SCHEDULE_LINK ? "" : "Schedule link is required.";
    tempErrors.USERNAME = formData.USERNAME ? "" : "User Name is required.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const data = new FormData();
      data.append("YOUR_NAME", formData.YOUR_NAME);
      data.append("YOUR_EMAIL", formData.YOUR_EMAIL);
      data.append("EMAIL_PASSWORD", formData.EMAIL_PASSWORD);
      data.append("YOUR_MOBILE", formData.YOUR_MOBILE);
      data.append("YOUR_COMPANY_NAME", formData.YOUR_COMPANY_NAME);
      data.append("YOUR_POSITION", formData.YOUR_POSITION);
      data.append("SCHEDULE_LINK", formData.SCHEDULE_LINK);
      data.append("USERNAME", formData.USERNAME);

      try {
        const response = await axios.post("/api/RegisterDetails", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 201) {
          //alert(response.data.message); // Display success message
          setOpen(true);
          //navigate("/autointent_login");
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Error occurred while sending data.';
        alert(message); // Display error message
      }
      
    }
  };

  return (
    <>
    <AutoIntentNavbar />
    <br /><br /><br />
    <Container>
      <Box sx={{ textAlign: "center", my: 3 }}>
        <Typography variant="h5" sx={{fontWeight:'bold'}}>Register Details</Typography>
      </Box>
      <Card sx={{ maxWidth: 900, mx: "auto" }}>
        <CardContent>
          <form onSubmit={handleSubmit} style={{width:'750px'}}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="YOUR_NAME"
                  label="Your Name"
                  variant="outlined"
                  value={formData.YOUR_NAME}
                  onChange={handleChange}
                  error={!!errors.YOUR_NAME}
                  helperText={errors.YOUR_NAME}
                />
                <TextField
                  fullWidth
                  name="YOUR_EMAIL"
                  label="Your Email"
                  variant="outlined"
                  value={formData.YOUR_EMAIL}
                  onChange={handleChange}
                  error={!!errors.YOUR_EMAIL}
                  helperText={errors.YOUR_EMAIL}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  name="EMAIL_PASSWORD"
                  label="Email Password 16 Digit"
                  type="password"
                  variant="outlined"
                  value={formData.EMAIL_PASSWORD}
                  onChange={handleChange}
                  error={!!errors.EMAIL_PASSWORD}
                  helperText={errors.EMAIL_PASSWORD}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  name="YOUR_MOBILE"
                  label="Mobile Number"
                  variant="outlined"
                  value={formData.YOUR_MOBILE}
                  onChange={handleChange}
                  error={!!errors.YOUR_MOBILE}
                  helperText={errors.YOUR_MOBILE}
                  sx={{ mt: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="YOUR_COMPANY_NAME"
                  label="Company Name"
                  variant="outlined"
                  value={formData.YOUR_COMPANY_NAME}
                  onChange={handleChange}
                  error={!!errors.YOUR_COMPANY_NAME}
                  helperText={errors.YOUR_COMPANY_NAME}
                />
                <TextField
                  fullWidth
                  name="YOUR_POSITION"
                  label="Your Position"
                  variant="outlined"
                  value={formData.YOUR_POSITION}
                  onChange={handleChange}
                  error={!!errors.YOUR_POSITION}
                  helperText={errors.YOUR_POSITION}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  name="USERNAME"
                  label="User Name"
                  variant="outlined"
                  value={formData.USERNAME}
                  onChange={handleChange}
                  error={!!errors.USERNAME}
                  helperText={errors.USERNAME}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  name="SCHEDULE_LINK"
                  label="Your Schedule Link"
                  variant="outlined"
                  value={formData.SCHEDULE_LINK}
                  onChange={handleChange}
                  error={!!errors.SCHEDULE_LINK}
                  helperText={errors.SCHEDULE_LINK}
                  sx={{ mt: 2 }}
                />
                
              </Grid>
            </Grid>
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
              >
                Submit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/autointent_login")}
              >
                Login
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
      <Modal open={open} onClose={handleClose}>
          <Paper
            sx={{
              position: "absolute",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography id="modal-title" variant="h6" component="h2">
              Register Details Submitted
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography id="modal-description" sx={{ mt: 2 , color:'green'}}>
              Your register details has been successfully submitted!
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClose}
              >
                OK
              </Button>
            </Box>
          </Paper>
        </Modal>
    </Container>
    </>
  );
};

export default RegisterDetails;