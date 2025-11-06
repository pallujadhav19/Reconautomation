import React, { useEffect, useState } from "react";
import Navbar from "../Leadapp/Navbar";
import { Link } from 'react-router-dom';
import {
  Container,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Card,
  CardContent,
  Typography, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

const RequirementStaffing = () => {
  const [formData, setFormData] = useState({
    requirement_id: "",
    job_id: "",
    position: "",
    end_client: "",
    must_have_skills: "",
    secondary_skills: "",
    location: "",
    experience_range: "",
    open_date: "",
    requirement_given_by: "",
    priority: "",
    status: "",
    budget: "",
    no_of_positions: "",
    time_to_onboard: "",
    jd_available: "",
    closed_date: "",
    submission: "",
    remarks: "",
    candidate_name: "",
    user_id: "", 
  });
  const [openDialog, setOpenDialog] = useState(false);
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
  };
  
  useEffect(() => {
    const userId = getCookie('userid');
    console.log("My UserId:", userId);

    // Update formData with userId
    setFormData((prevData) => ({
      ...prevData,
      user_id: userId,
    }));
  }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const submissionData = { ...formData };

    // Remove undefined or empty optional fields from submissionData
    Object.keys(submissionData).forEach((key) => {
      if (submissionData[key] === "" || submissionData[key] === undefined) {
        delete submissionData[key];
      }
    });

    try {
      const response = await fetch(
        "/api/staffing-requirements",
        {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Staffing requirement created:", result);
        setOpenDialog(true);
        setFormData({
          requirement_id: "",
          job_id: "",
          position: "",
          end_client: "",
          must_have_skills: "",
          secondary_skills: "",
          location: "",
          experience_range: "",
          open_date: "",
          requirement_given_by: "",
          priority: "",
          status: "",
          budget: "",
          no_of_positions: "",
          time_to_onboard: "",
          jd_available: "",
          closed_date: "",
          submission: "",
          remarks: "",
          candidate_name: "",
        })

      } else {
        console.error("Failed to create staffing requirement");
        alert("Failed to create staffing requirement.");
      }
    } catch (error) {
      console.error("Error submitting staffing requirement:", error);
      alert("Failed to create staffing requirement.");
    }
  };

  const priorities = ["High", "Medium", "Low"];
  const statuses = ["Active", "Inactive", "Hold", "Closed"];
  const jdavailable = ["Yes", "No"];

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
              ValueDx Staffing Requirements
            </Typography>
            <form onSubmit={handleSubmit} style={{width:'700px'}}>
              <Grid container spacing={2}>
                {/* Requirement ID */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Requirement ID"
                    required
                    fullWidth
                    variant="outlined"
                    name="requirement_id"
                    value={formData.requirement_id}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Job ID */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Job ID"
                    fullWidth
                    required
                    variant="outlined"
                    name="job_id"
                    value={formData.job_id}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Position */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Position"
                    fullWidth
                    required
                    variant="outlined"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </Grid>
                {/* End Client */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Client"
                    fullWidth
                    required
                    variant="outlined"
                    name="end_client"
                    value={formData.end_client}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Must Have Skills */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Must Have Skills"
                    fullWidth
                    required
                    variant="outlined"
                    name="must_have_skills"
                    value={formData.must_have_skills}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Secondary Skills */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Secondary Skills"
                    fullWidth
                    required
                    variant="outlined"
                    name="secondary_skills"
                    value={formData.secondary_skills}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Location */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    fullWidth
                    required
                    variant="outlined"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Experience Range */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Experience Range"
                    fullWidth
                    required
                    variant="outlined"
                    name="experience_range"
                    value={formData.experience_range}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Open Date */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Open Date"
                    fullWidth
                    required
                    variant="outlined"
                    name="open_date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formData.open_date}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Requirement Given By */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Requirement Given By"
                    fullWidth
                    required
                    variant="outlined"
                    name="requirement_given_by"
                    value={formData.requirement_given_by}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Priority */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      name="priority"
                      required
                      value={formData.priority}
                      onChange={handleChange}
                      label="Priority"
                    >
                      {priorities.map((priority) => (
                        <MenuItem key={priority} value={priority}>
                          {priority}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      required
                      value={formData.status}
                      onChange={handleChange}
                      label="Status"
                    >
                      {statuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Budget */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Budget"
                    fullWidth
                    required
                    variant="outlined"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Number of Positions */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Number of Positions"
                    fullWidth
                    type="number"
                    required
                    variant="outlined"
                    name="no_of_positions"
                    value={formData.no_of_positions}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Time to Onboard */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Time to Onboard"
                    fullWidth
                    required
                    variant="outlined"
                    name="time_to_onboard"
                    value={formData.time_to_onboard}
                    onChange={handleChange}
                  />
                </Grid>
                {/* JD Available */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>JD Available</InputLabel>
                    <Select
                      name="jd_available"
                      value={formData.jd_available}
                      required
                      onChange={handleChange}
                      label="JD Available"
                    >
                      {jdavailable.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Closed Date */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Closed Date"
                    fullWidth
                    variant="outlined"
                    name="closed_date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formData.closed_date}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Submission */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Submission"
                    fullWidth
                    required
                    variant="outlined"
                    name="submission"
                    value={formData.submission}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Remarks */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Remarks"
                    fullWidth
                    required
                    variant="outlined"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Candidate Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Candidate Name"
                    fullWidth
                    required
                    variant="outlined"
                    name="candidate_name"
                    value={formData.candidate_name}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Submit Button */}
                <Grid item xs={12} container justifyContent='center'>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{width:'120px', marginTop:'20px'}}
                  >
                    Submit
                  </Button>
                  <Link to="/user_dashboard" style={{ textDecoration: "none" }}>
                    <Button
                      type="submit"
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
        open={openDialog}
        onClose={handleDialogClose}
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
      >
        <DialogTitle sx={{ color: "green", textAlign: "center" }}>
          Staffing Requirement!
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: "center" }}>
            Staffing Requirement Details Submitted Successfully!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ justifyContent: "center" }}
            onClick={handleDialogClose}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>  
      </Dialog>
      </Container>
    </>
  );
};

export default RequirementStaffing;
