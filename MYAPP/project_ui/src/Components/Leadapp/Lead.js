import React, { useEffect, useState } from "react";
import Navbar from "../Leadapp/Navbar";
import { Link } from 'react-router-dom';
import {
  Container,
  TextField,
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const LeadGeneration = () => {
  const [formData, setFormData] = useState({
    accountName: "",
    rpaPlatformUser: "",
    firstName: "",
    lastName: "",
    titles: "",
    contactNo: "",
    emailId: "",
    linkedinId: "",
    location: "",
    leadGenerationDate: "", // Added leadGenerationDate field
    userId: "", // Added userId field
  });

  const [formErrors, setFormErrors] = useState({
    accountName: "",
    rpaPlatformUser: "",
    firstName: "",
    lastName: "",
    titles: "",
    contactNo: "",
    emailId: "",
    linkedinId: "",
    location: "",
    leadGenerationDate: "",
  });

  const [openDialog, setOpenDialog] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop().split(";").shift());
    return null;
  };

  useEffect(() => {
    const userId = getCookie("userid");
    console.log("My UserId:", userId);

    // Update formData with userId
    setFormData((prevData) => ({
      ...prevData,
      userId: userId,
    }));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear the error for the field being edited
    setFormErrors({
      ...formErrors,
      [e.target.name]: "",
    });
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    if (!formData.accountName) errors.accountName = "Account Name is required";
    if (!formData.rpaPlatformUser) errors.rpaPlatformUser = "RPA Platform User is required";
    if (!formData.firstName) errors.firstName = "First Name is required";
    if (!formData.lastName) errors.lastName = "Last Name is required";
    if (!formData.titles) errors.titles = "Titles are required";
    if (!formData.contactNo) errors.contactNo = "Contact No is required";
    if (!formData.emailId || !/\S+@\S+\.\S+/.test(formData.emailId)) errors.emailId = "Valid Email ID is required";
    if (!formData.linkedinId) errors.linkedinId = "LinkedIn ID is required";
    if (!formData.location) errors.location = "Location is required";
    if (!formData.leadGenerationDate) errors.leadGenerationDate = "Lead Generation Date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(
        "/api/lead-generation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Lead generated:", result);
        setOpenDialog(true); // Open dialog on successful submission
        setFormData({
          accountName: "",
          rpaPlatformUser: "",
          firstName: "",
          lastName: "",
          titles: "",
          contactNo: "",
          emailId: "",
          linkedinId: "",
          location: "",
          leadGenerationDate: "", // Clear the new field as well
        });
      } else {
        console.error("Failed to create lead");
        alert("Failed to create lead.");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("Failed to create lead.");
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Navbar showLogoutButton={true} />
      <Container maxWidth="md" sx={{ marginTop: "70px" }}>
        <br />
        <Card
          sx={{
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#3f51b5",
              }}
            >
              Lead Generation Form
            </Typography>
            <form onSubmit={handleSubmit} style={{width:'700px'}}>
              <Grid container spacing={2}>
                {/* Account Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Account Name"
                    fullWidth
                    variant="outlined"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    error={!!formErrors.accountName}
                    helperText={formErrors.accountName}
                  />
                </Grid>
                {/* RPA Platform User */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="RPA Platform User"
                    fullWidth
                    variant="outlined"
                    name="rpaPlatformUser"
                    value={formData.rpaPlatformUser}
                    onChange={handleChange}
                    error={!!formErrors.rpaPlatformUser}
                    helperText={formErrors.rpaPlatformUser}
                  />
                </Grid>
                {/* First Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    fullWidth
                    variant="outlined"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                  />
                </Grid>
                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    fullWidth
                    variant="outlined"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                  />
                </Grid>
                {/* Titles */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Titles"
                    fullWidth
                    variant="outlined"
                    name="titles"
                    value={formData.titles}
                    onChange={handleChange}
                    error={!!formErrors.titles}
                    helperText={formErrors.titles}
                  />
                </Grid>
                {/* Contact No */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact No"
                    fullWidth
                    variant="outlined"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    error={!!formErrors.contactNo}
                    helperText={formErrors.contactNo}
                  />
                </Grid>
                {/* Email ID */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email ID"
                    fullWidth
                    variant="outlined"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleChange}
                    error={!!formErrors.emailId}
                    helperText={formErrors.emailId}
                  />
                </Grid>
                {/* LinkedIn ID */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="LinkedIn ID"
                    fullWidth
                    variant="outlined"
                    name="linkedinId"
                    value={formData.linkedinId}
                    onChange={handleChange}
                    error={!!formErrors.linkedinId}
                    helperText={formErrors.linkedinId}
                  />
                </Grid>
                {/* Location */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    fullWidth
                    variant="outlined"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    error={!!formErrors.location}
                    helperText={formErrors.location}
                  />
                </Grid>
                {/* Lead Generation Date */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Lead Generation Date"
                    fullWidth
                    variant="outlined"
                    type="date" // Use 'date' input type for date picker
                    name="leadGenerationDate"
                    value={formData.leadGenerationDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }} // Ensures the label is visible for date input
                    error={!!formErrors.leadGenerationDate}
                    helperText={formErrors.leadGenerationDate}
                  />
                </Grid>
                {/* Submit Button */}
                <Grid item xs={12} container justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ width: "120px", marginTop: "20px" }}
                  >
                    Submit
                  </Button>
                  <Link to="/user_dashboard" style={{ textDecoration: "none" }}>
                    <Button
                      type="button"
                      variant="contained"
                      color="secondary"
                      sx={{
                        width: "120px",
                        marginTop: "20px",
                        marginLeft: "20px",
                      }}
                    >
                      Home
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        <Dialog
          PaperProps={{
            style: {
              position: "absolute",
              top: "10%",
              margin: "auto",
              padding: "20px",
              borderRadius: "10px",
              background: "linear-gradient(to right, #e0f7fa, #e1bee7)",
            },
          }}
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          <DialogTitle id="dialog-title" sx={{ color: "green", textAlign: "center" }}>Lead!</DialogTitle>
          <DialogContent>
            <Typography>
              Your lead has been successfully submitted!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default LeadGeneration;
