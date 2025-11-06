import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, Dialog, DialogTitle, DialogContent, IconButton, TextField, Button, Box, Grid,Typography
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import CloseIcon from "@mui/icons-material/Close";
import Navbar from '../AutoIntent/autointentnavbar';
import Cookies from 'js-cookie';
import DeleteIcon from '@mui/icons-material/Delete';  

const AutoIntentDashboard = () => {
  const [emailDetails, setEmailDetails] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ email_body: '', details: '' });
  const [popupField, setPopupField] = useState('');
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  useEffect(() => {
    const username = Cookies.get('username');
    fetch(`/api/email-details?username=${username}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmailDetails(data);
        } else {
          console.error('Fetched data is not an array:', data);
          setEmailDetails([]);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  

  const handleClickOpen = (email_body, details, field, index) => {
    setPopupContent({ email_body, details });
    setPopupField(field);
    setSelectedRowIndex(index);
    setOpenPopup(true);
  };

  const handleClose = () => {
    setOpenPopup(false);
    setPopupContent({ email_body: '', details: '' });
    setPopupField('');
    setSelectedRowIndex(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (index, field, value) => {
    const updatedEmailDetails = [...emailDetails];
    updatedEmailDetails[index][field] = value;
    setEmailDetails(updatedEmailDetails);
  };

  const handlePopupChange = (field, value) => {
    if (selectedRowIndex !== null) {
      handleInputChange(selectedRowIndex, field, value);
      setPopupContent(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCheck = (index) => {
    const actualIndex = page * rowsPerPage + index;
    const updatedEmailDetails = [...emailDetails];
    updatedEmailDetails[actualIndex].checked = !updatedEmailDetails[actualIndex].checked;
    setEmailDetails(updatedEmailDetails);
    console.log('Checked data ready to send:', updatedEmailDetails[actualIndex]);
  };

  const handleUpdateRecords = () => {
    const checkedData = emailDetails
      .filter(row => row.checked)
      .map(({ id, client_name, client_email, subject, email_body }) => ({
        id,
        client_name,
        client_email,
        subject,
        email_body
      }));
  
    if (checkedData.length === 0) {
      alert("No data has been checked for updating.");
      return;
    }
  
    fetch('/api/update-email-details', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: checkedData }),
    })
      .then(response => {
        if (response.ok) {
          alert("Records updated successfully!");
        } else {
          alert("Failed to update records.");
        }
      })
      .catch(error => console.error('Error updating records:', error));
  };

  const handleSendMail = () => {
    // Get the username from the cookies
    const username = Cookies.get('username'); // Adjust the key to match the cookie name
  
    // Include the username in the request body
    axios.post(`/api/send-mail?username=${username}`)
      .then(response => {
        if (response.status === 200) {
          // Check if the response contains the automationRequestId
          if (response.data.automationRequestId) {
            alert(`Mail sent successfully..! for Request ID: ${response.data.automationRequestId}`);
          } else {
            alert("No records to be found");
          }
        } else {
          alert("Failed to send mail.");
        }
      })
      .catch(error => {
        console.error('Error sending mail:', error);
        alert("No records to be found");
      });
  };
  //Delete api call
  const handleDelete = (index) => {
    const actualIndex = page * rowsPerPage + index;
    const recordToDelete = emailDetails[actualIndex];
    const recordId = recordToDelete.id;  // Assuming 'id' is the identifier of the record
  
    // Call the API to delete the record
    axios.delete(`/api/delete-dashboard-email/${recordId}`)
      .then((response) => {
        if (response.status === 200) {
          // Remove the deleted record from the state
          const updatedEmailDetails = [...emailDetails];
          updatedEmailDetails.splice(actualIndex, 1);  // Remove the item from the array
          setEmailDetails(updatedEmailDetails);  // Update the state
          alert('Record deleted successfully');
        }
      })
      .catch((error) => {
        console.error('Error deleting record:', error);
        alert('Failed to delete the record');
      });
  };
  

  return (
    <>
      <Navbar />
      <br /><br />
      <TableContainer component={Paper} sx={{ p: 2, mt: 2, borderRadius: 2, boxShadow: 3 }}>
      <Table aria-label="email details table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell><Typography fontWeight="bold" align='center'>Client Name</Typography></TableCell>
            <TableCell><Typography fontWeight="bold" align='center'>Client Email</Typography></TableCell>
            <TableCell><Typography fontWeight="bold" align='center'>Subject</Typography></TableCell>
            <TableCell><Typography fontWeight="bold" align='center'>Email Body</Typography></TableCell>
            <TableCell><Typography fontWeight="bold" align='center'>Actions</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {Array.isArray(emailDetails) &&
    emailDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
      <TableRow key={row.id} hover sx={{ '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' } }}>
        <TableCell align="center">
          <TextField
            value={row.client_name}
            onChange={(e) => handleInputChange(index, 'client_name', e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ '& .MuiInputBase-root': { textAlign: 'center' } }}
          />
        </TableCell>
        <TableCell align="center">
          <TextField
            value={row.client_email}
            onChange={(e) => handleInputChange(index, 'client_email', e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ '& .MuiInputBase-root': { textAlign: 'center' } }}
          />
        </TableCell>
        <TableCell align="center">
          <TextField
            value={row.subject}
            onChange={(e) => handleInputChange(index, 'subject', e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ '& .MuiInputBase-root': { textAlign: 'center' } }}
          />
        </TableCell>
        <TableCell align="center">
          <IconButton color="primary" onClick={() => handleClickOpen(row.email_body, row.details, 'email_body', index)}>
            <InfoIcon />
          </IconButton>
        </TableCell>
        <TableCell align="center">
          <Button
            variant="contained"
            color={row.checked ? 'success' : 'primary'}
            startIcon={<CheckIcon />}
            onClick={() => handleCheck(index)}
            size="small"
            sx={{ textTransform: 'none' }} // Ensure the button text is not capitalized
          >
            {row.checked ? 'Checked' : 'Check'}
          </Button>
          <IconButton color="error" onClick={() => handleDelete(index)} sx={{ ml: 1 }}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ))}
</TableBody>
      </Table>
      <TablePagination
        component="div"
        count={emailDetails.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openPopup} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          Edit Details
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Details"
                value={popupContent.details}
                onChange={(e) => handlePopupChange('details', e.target.value)}
                fullWidth
                multiline
                minRows={3}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Body"
                value={popupContent.email_body}
                onChange={(e) => handlePopupChange('email_body', e.target.value)}
                fullWidth
                multiline
                minRows={3}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Box display="flex" justifyContent="center"  gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateRecords}
          sx={{ px: 2 }}
        >
          Update Records
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSendMail}
          sx={{ px: 5 }}
        >
          Send Mail
        </Button>
      </Box>
    </TableContainer>
    </>
  );
};

export default AutoIntentDashboard;