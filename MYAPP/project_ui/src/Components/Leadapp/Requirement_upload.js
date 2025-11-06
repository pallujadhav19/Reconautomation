import React, { useState, useEffect } from "react";
import { Button, Typography, Box, TextField, Divider } from "@mui/material";

const StaffingUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  // Function to get a cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
    return null;
  };

  // Fetch userId from cookies when the component mounts
  useEffect(() => {
    const fetchedUserId = getCookie("userid");
    setUserId(fetchedUserId);
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Validate if the selected file is an Excel file
    if (
      file &&
      (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel")
    ) {
      setSelectedFile(file);
      setError("");
    } else {
      setSelectedFile(null);
      setError("Please select a valid Excel file (.xlsx or .xls).");
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId); 

    try {
      const response = await fetch("/api/upload/staffing", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully.");
        setSelectedFile(null);
      } else {
        alert("Failed to upload the file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding={4}
      gap={2}
      sx={{ maxWidth: '500px', margin: 'auto', marginTop:'10px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: 1 }}
    >
      <Typography variant="h6" component="h2" gutterBottom>
        Staffing Upload
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        sx={{ width: '100%' }}
      >
        <TextField
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '100%' }}
        />
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          size="large"
          disabled={!selectedFile}
          sx={{ width: '100%' }}
        >
          Submit
        </Button>
      </Box>

      <Divider sx={{ width: '100%', my: 2 }} />

      {selectedFile && (
        <Typography variant="body2" color="textSecondary">
          <strong>Selected File:</strong> {selectedFile.name}
        </Typography>
      )}
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default StaffingUpload;
