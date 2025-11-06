import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import AutoIntentUploadSingleDetails from "./uploadsingledetails";
import AutoIntentNavbar from "./autointentnavbar";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import defaultImageUrl from './VALUEDX_HEADER_IMAGE.jpg'

const AutoIntentUploadDetails = () => {
  const [formData, setFormData] = useState({
    YOUR_NAME: "",
    YOUR_EMAIL: "",
    EMAIL_PASSWORD: "",
    YOUR_MOBILE: "",
    YOUR_COMPANY_NAME: "",
    YOUR_POSITION: "",
    SCHEDULE_LINK: "",
    GOOGLE_FORM_LINK: "",  // Add this field
    username: "",
  });

  const [excelFile, setExcelFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState("UploadDetails");

  useEffect(() => {
    const username = Cookies.get("username");

    if (username) {
      axios
        .get(`/api/getUserDetails?username=${username}`)
        .then((response) => {
          const userData = response.data;

          setFormData({
            YOUR_NAME: userData.your_name || "",
            YOUR_EMAIL: userData.your_email || "",
            EMAIL_PASSWORD: userData.email_password || "",
            YOUR_MOBILE: userData.mob_number || "",
            YOUR_COMPANY_NAME: userData.company_name || "",
            YOUR_POSITION: userData.your_position || "",
            SCHEDULE_LINK: userData.schedule_link || "",
            GOOGLE_FORM_LINK: userData.google_form_link || "",
            username: userData.username || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, []);

  const handleComponentChange = (e) => {
    setSelectedComponent(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "EXCEL_FILE") {
      setExcelFile(e.target.files[0]);
    } else if (e.target.name === "IMAGE_FILE") {
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
    tempErrors.SCHEDULE_LINK = formData.SCHEDULE_LINK ? "" : "Schedule Link is required.";
    tempErrors.GOOGLE_FORM_LINK = formData.GOOGLE_FORM_LINK ? "" : "Google Form Link is required.";  // Validation for field
    tempErrors.username = formData.username ? "" : "User Name is required.";
    tempErrors.EXCEL_FILE = excelFile ? "" : "Excel file is required.";
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
      data.append("GOOGLE_FORM_LINK", formData.GOOGLE_FORM_LINK);  // Append field
      data.append("EXCEL_FILE", excelFile);

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
        const response = await axios.post("/api/uploadDetails", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Data sent successfully", response.data);
        alert(`Details uploaded successfully for Request ID: ${response.data.automationRequestId}`);
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
        })
        setExcelFile(null);
        setImageFile(null);

      } catch (error) {
        console.error("There was an error sending the data!", error);
        alert("Error occurred while sending data.");
      }
    }
  };

  return (
    <>
      <AutoIntentNavbar />
      <br /><br /><br />
      <Container>
        <Card sx={{ maxWidth: 900, mx: "auto" }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <FormControl component="fieldset">
              <FormLabel component="legend"><b>Select Upload Type</b></FormLabel>
              <RadioGroup
                row
                aria-label="upload-type"
                name="upload-type"
                value={selectedComponent}
                onChange={handleComponentChange}
              >
                <FormControlLabel
                  value="UploadDetails"
                  control={<Radio />}
                  label="Upload Multiple Details"
                />
                <FormControlLabel
                  value="UploadSingleDetails"
                  control={<Radio />}
                  label="Upload Single Detail"
                />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
        <Card sx={{ maxWidth: 900, mx: "auto", marginTop: '15px' }}>
          <CardContent>
            {selectedComponent === 'UploadDetails' && (
              <>
                <Box sx={{ textAlign: "center", my: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Upload with File</Typography>
                </Box>
                <form onSubmit={handleSubmit} style={{ width: '750px' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
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
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
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
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
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
                      />

                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        name="username"
                        label="Your Username"
                        variant="outlined"
                        value={formData.username}
                        onChange={handleChange}
                        error={!!errors.username}
                        helperText={errors.username}
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
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        name="GOOGLE_FORM_LINK"
                        label="Google Form Link"
                        variant="outlined"
                        value={formData.GOOGLE_FORM_LINK}
                        onChange={handleChange}
                        error={!!errors.GOOGLE_FORM_LINK}
                        helperText={errors.GOOGLE_FORM_LINK}
                      />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Grid container spacing={2} direction="row">
                        <Grid item xs={6}>
                          <Button
                            variant="contained"
                            component="label"
                            fullWidth
                          >
                            Upload Excel File
                            <input
                              type="file"
                              name="EXCEL_FILE"
                              accept=".xlsx"
                              hidden
                              onChange={handleFileChange}
                            />
                          </Button>
                          {excelFile && (
                            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                              {excelFile.name}
                            </Typography>
                          )}
                        </Grid>

                        <Grid item xs={6}>
                          <Button
                            variant="contained"
                            component="label"
                            fullWidth
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
                        </Grid>
                      </Grid>
                    </Box>

                  </Box>
                  <Box textAlign="center" mt={3}>
                    <Button type="submit" variant="contained" color="primary" sx={{ mr: 2, width:'110px' }}>
                      Submit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => navigate("/autointent_dashboard")} > Dashboard </Button>
                  </Box>
                </form>
              </>
            )}
            {selectedComponent === 'UploadSingleDetails' && (
              <AutoIntentUploadSingleDetails />
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default AutoIntentUploadDetails;
