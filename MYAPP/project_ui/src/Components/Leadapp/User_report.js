import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, TextField, Button, Snackbar, Alert } from "@mui/material";
import Cookies from "universal-cookie";

const DailyReport = () => {
  const [userId, setUserId] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [formData, setFormData] = useState({
    reportDate: "",
    mailSent: "",
    dataExtractionLinkedIn: "",
    connectionRequestSent: "",
    requestAccepted: "",
    messageSent: "",
    dataExtractionOilGas: "",
    calls: "",
    positiveResponse: "",
    remark: ""
  });
  const [errors, setErrors] = useState({});

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop().split(";").shift());
    return null;
  };

  useEffect(() => {
    const user_Id = getCookie("userid");
    setUserId(user_Id);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToSubmit = {
      userId,
      ...formData,
    };

    try {
      const response = await fetch("/api/dailyReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();
      console.log(data); // For debugging purposes

      if (response.ok) {
        setSnackbarMessage("Daily Report Submitted Successfully!");
        setSnackbarSeverity("success"); // Set snackbar to success
        setFormData({
          reportDate: "",
          mailSent: "",
          dataExtractionLinkedIn: "",
          connectionRequestSent: "",
          requestAccepted: "",
          messageSent: "",
          dataExtractionOilGas: "",
          calls: "",
          positiveResponse: "",
          remark: ""
        });
        setErrors({});
      } else {
        setSnackbarMessage(data.message || "Submission failed.");
        setSnackbarSeverity("error"); // Set snackbar to error
      }
    } catch (error) {
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error"); // Set snackbar to error
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Card style={{ maxWidth: 600, margin: "20px auto", padding: "20px" }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'center', marginBottom: '20px' }} gutterBottom>
            Daily Report
          </Typography>
          <form onSubmit={handleSubmit} style={{width:'450px'}}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                <TextField
                  label="Report Date"
                  variant="outlined"
                  name="reportDate"
                  type="date" // Date input field
                  value={formData.reportDate}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.reportDate}
                  helperText={errors.reportDate}
                  InputLabelProps={{
                    shrink: true, 
                  }}
                />
                </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mail Sent"
                  variant="outlined"
                  name="mailSent"
                  value={formData.mailSent}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.mailSent}
                  helperText={errors.mailSent}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Data Extraction from LinkedIn"
                  variant="outlined"
                  name="dataExtractionLinkedIn"
                  value={formData.dataExtractionLinkedIn}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.dataExtractionLinkedIn}
                  helperText={errors.dataExtractionLinkedIn}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Connection Request Sent"
                  variant="outlined"
                  name="connectionRequestSent"
                  value={formData.connectionRequestSent}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.connectionRequestSent}
                  helperText={errors.connectionRequestSent}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Request Accepted on LinkedIn"
                  variant="outlined"
                  name="requestAccepted"
                  value={formData.requestAccepted}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.requestAccepted}
                  helperText={errors.requestAccepted}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Message Sent on LinkedIn"
                  variant="outlined"
                  name="messageSent"
                  value={formData.messageSent}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.messageSent}
                  helperText={errors.messageSent}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Data Extraction Oil & Gas Industries"
                  variant="outlined"
                  name="dataExtractionOilGas"
                  value={formData.dataExtractionOilGas}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.dataExtractionOilGas}
                  helperText={errors.dataExtractionOilGas}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Calls"
                  variant="outlined"
                  name="calls"
                  value={formData.calls}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.calls}
                  helperText={errors.calls}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Positive Response from Mail/LinkedIn"
                  variant="outlined"
                  name="positiveResponse"
                  value={formData.positiveResponse}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.positiveResponse}
                  helperText={errors.positiveResponse}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Remark"
                  variant="outlined"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.remark}
                  helperText={errors.remark}
                />
              </Grid>
              <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '10px' ,marginLeft:'30px'}}>
                  If you don't have data to enter, please input 'NA' in the respective fields
                </Typography>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ marginTop: '45px' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </>
  );
};

export default DailyReport;