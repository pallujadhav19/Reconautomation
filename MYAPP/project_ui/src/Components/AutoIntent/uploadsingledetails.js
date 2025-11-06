import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Container,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import defaultImageUrl from './VALUEDX_HEADER_IMAGE.jpg';

const AutoIntentUploadSingleDetails = () => {
  const [formData, setFormData] = useState({
    YOUR_NAME: "",
    YOUR_EMAIL: "",
    EMAIL_PASSWORD: "",
    YOUR_MOBILE: "",
    YOUR_COMPANY_NAME: "",
    YOUR_POSITION: "",
    SCHEDULE_LINK: "",
    GOOGLE_FORM_LINK: "", // New field for Google Form Link
    username: "",
    CLIENT_NAME: "",
    CLIENT_EMAIL: "",
    DETAILS: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState(""); // To store the username
  const navigate = useNavigate(); 

  useEffect(() => {
    // Get username from cookies
    const username = Cookies.get("username");
    if (username) {
      setUsername(username);
      // Fetch data based on username
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/getUserDetails?username=${username}`);
          // Set form data based on the response
          setFormData({
            YOUR_NAME: response.data.your_name || "",
            YOUR_EMAIL: response.data.your_email || "",
            EMAIL_PASSWORD: response.data.email_password || "",
            YOUR_MOBILE: response.data.mob_number || "",
            YOUR_COMPANY_NAME: response.data.company_name || "",
            YOUR_POSITION: response.data.your_position || "",
            SCHEDULE_LINK: response.data.schedule_link || "",
            GOOGLE_FORM_LINK: response.data.google_form_link || "", // New field
            username: response.data.username || "",
            CLIENT_NAME: "", // Set these fields as needed
            CLIENT_EMAIL: "",
            DETAILS: "",
          });
        } catch (error) {
          console.error("There was an error fetching the data!", error);
        }
      };
      fetchData();
    }
  }, [username]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "IMAGE_FILE") {
      setImageFile(e.target.files[0]);
    }
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.YOUR_NAME = formData.YOUR_NAME ? "" : "Name is required.";
    tempErrors.YOUR_EMAIL = formData.YOUR_EMAIL ? "" : "Email is required.";
    tempErrors.EMAIL_PASSWORD = formData.EMAIL_PASSWORD ? "" : "Password is required.";
    tempErrors.YOUR_MOBILE =
      formData.YOUR_MOBILE.length === 10 ? "" : "Mobile Number must be 10 digits.";
    tempErrors.YOUR_COMPANY_NAME = formData.YOUR_COMPANY_NAME ? "" : "Company Name is required.";
    tempErrors.YOUR_POSITION = formData.YOUR_POSITION ? "" : "Position is required.";
    tempErrors.SCHEDULE_LINK = formData.SCHEDULE_LINK ? "" : "Schedule link is required.";
    tempErrors.GOOGLE_FORM_LINK = formData.GOOGLE_FORM_LINK ? "" : "Google Form Link is required."; // Validation for new field
    tempErrors.CLIENT_NAME = formData.CLIENT_NAME ? "" : "Client Name is required.";
    tempErrors.CLIENT_EMAIL = formData.CLIENT_EMAIL ? "" : "Client EmailID is required.";
    tempErrors.DETAILS = formData.DETAILS ? "" : "Details is required.";
    tempErrors.username = formData.username ? "" : "User Name is required.";
    // tempErrors.IMAGE_FILE = imageFile ? "" : "Image is required.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const data = new FormData();
      data.append("YOUR_NAME", formData.YOUR_NAME);
      data.append("username", formData.username);
      data.append("YOUR_EMAIL", formData.YOUR_EMAIL);
      data.append("EMAIL_PASSWORD", formData.EMAIL_PASSWORD);
      data.append("YOUR_MOBILE", formData.YOUR_MOBILE);
      data.append("YOUR_COMPANY_NAME", formData.YOUR_COMPANY_NAME);
      data.append("YOUR_POSITION", formData.YOUR_POSITION);
      data.append("SCHEDULE_LINK", formData.SCHEDULE_LINK);
      data.append("GOOGLE_FORM_LINK", formData.GOOGLE_FORM_LINK); // Include the new field
      data.append("CLIENT_NAME", formData.CLIENT_NAME);
      data.append("CLIENT_EMAIL", formData.CLIENT_EMAIL);
      data.append("DETAILS", formData.DETAILS);
        
      if (imageFile) {
        data.append("IMAGE_FILE", imageFile);
      } else {
        // Fetch the default image as blob if no image is uploaded
        try {
          const response = await fetch(defaultImageUrl);
          const blob = await response.blob();
          data.append("IMAGE_FILE", blob, "defaultImage.jpg");
        } catch (error) {
          console.error("Failed to fetch default image", error);
          alert("Failed to upload data. Please try again.");
          return;
        }
      }

      try {
        const response = await axios.post("/api/uploadSingleDetails", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Data sent successfully", response.data);
        alert(`Details are uploaded..! for Request ID: ${response.data.automationRequestId}`);
        setFormData({
          YOUR_NAME: "",
          YOUR_EMAIL: "",
          EMAIL_PASSWORD: "",
          YOUR_MOBILE: "",
          YOUR_COMPANY_NAME: "",
          YOUR_POSITION: "",
          SCHEDULE_LINK: "",
          GOOGLE_FORM_LINK: "",
          username: "",
          CLIENT_NAME: "",
          CLIENT_EMAIL: "",
          DETAILS: "",
        })
      } catch (error) {
        console.error("There was an error sending the data!", error);
        alert("Error occurred while sending data.");
      }
    }
  };

  return (
    <Container>
      <Box sx={{ textAlign: "center", my: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Upload Single Details</Typography>
      </Box>
      <form onSubmit={handleSubmit} style={{ width: '750px' }}>
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
              InputLabelProps={{
                shrink: !!formData.YOUR_NAME,
              }}
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
              InputLabelProps={{
                shrink: !!formData.YOUR_EMAIL,
              }}
            />
            <TextField
              fullWidth
              name="EMAIL_PASSWORD"
              label="Email Password"
              type="password"
              variant="outlined"
              value={formData.EMAIL_PASSWORD}
              onChange={handleChange}
              error={!!errors.EMAIL_PASSWORD}
              helperText={errors.EMAIL_PASSWORD}
              sx={{ mt: 2 }}
              InputLabelProps={{
                shrink: !!formData.EMAIL_PASSWORD,
              }}
            />
            <TextField
              fullWidth
              name="YOUR_MOBILE"
              label="WhatsApp Number"
              variant="outlined"
              value={formData.YOUR_MOBILE}
              onChange={handleChange}
              error={!!errors.YOUR_MOBILE}
              helperText={errors.YOUR_MOBILE}
              sx={{ mt: 2 }}
              InputLabelProps={{
                shrink: !!formData.YOUR_MOBILE,
              }}
            />
              <TextField
              fullWidth
              name="GOOGLE_FORM_LINK" 
              label="Google Form Link"
              variant="outlined"
              value={formData.GOOGLE_FORM_LINK}
              onChange={handleChange}
              error={!!errors.GOOGLE_FORM_LINK}
              helperText={errors.GOOGLE_FORM_LINK}
              sx={{ mt: 2 }}
              InputLabelProps={{
                shrink: !!formData.GOOGLE_FORM_LINK,
              }}
            />
            <TextField
              fullWidth
              name="DETAILS"
              label="Enter Details"
              multiline
              rows={6}
              variant="outlined"
              value={formData.DETAILS}
              onChange={handleChange}
              error={!!errors.DETAILS}
              helperText={errors.DETAILS}
              sx={{ mt: 2 }}
              InputLabelProps={{
                shrink: !!formData.DETAILS,
              }}
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
              InputLabelProps={{
                shrink: !!formData.YOUR_COMPANY_NAME,
              }}
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
              InputLabelProps={{
                shrink: !!formData.YOUR_POSITION,
              }}
            />
            <TextField
              fullWidth
              name="username"
              label="User Name"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              sx={{ mt: 2 }}
              InputLabelProps={{
                shrink: !!formData.username,
              }}
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
              InputLabelProps={{
                shrink: !!formData.SCHEDULE_LINK,
              }}
            />
            <TextField
              fullWidth
              name="CLIENT_NAME"
              label="Client Name"
              variant="outlined"
              value={formData.CLIENT_NAME}
              onChange={handleChange}
              error={!!errors.CLIENT_NAME}
              helperText={errors.CLIENT_NAME}
              sx={{ mt: 2 }}
              InputLabelProps={{
                shrink: !!formData.CLIENT_NAME,
              }}
            />
            <TextField
              fullWidth
              name="CLIENT_EMAIL"
              label="Client Email"
              variant="outlined"
              value={formData.CLIENT_EMAIL}
              onChange={handleChange}
              error={!!errors.CLIENT_EMAIL}
              helperText={errors.CLIENT_EMAIL}
              sx={{ mt: 2 }}
              InputLabelProps={{
                shrink: !!formData.CLIENT_EMAIL,
              }}
            />
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Upload Image File
              <input
                type="file"
                name="IMAGE_FILE"
                accept=".jpg"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            <Box sx={{ mt: 2 }}>
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : defaultImageUrl}
                alt="Preview"
                width={368}
                height={37}
              />
            </Box>
            {/* {imageFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {imageFile.name}
              </Typography>
            )} */}
          </Grid>
        </Grid>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mr: 2, width:'110px' }}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/autointent_dashboard")}
          >
            Dashboard
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AutoIntentUploadSingleDetails;
