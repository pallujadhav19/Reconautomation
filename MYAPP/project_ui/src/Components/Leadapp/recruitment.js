import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import './Dashboard.css';
import CloseIcon from '@mui/icons-material/Close';
import AdminDashboard from "./Admin_dashboard";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  IconButton,
  Box,
  TextField,
  TablePagination, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DailyReport from "./User_report";
import StaffingUpload from "./Requirement_upload";
import LeadUpload from "./Lead_upload";
import { Alert } from "bootstrap";

const UserDashboard = () => {
  const [records, setRecords] = useState([]); 
  const [userId, setUserId] = useState("");
  const [selectedTable, setSelectedTable] = useState("leads");
  const [open, setOpen] = useState(false);
  const [openStaffingDialog, setOpenStaffingDialog] = useState(false);
  const [openLeadDialog, setOpenLeadDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [role, setRole] = useState("");
  const [editLeadsDialogOpen, setEditLeadsDialogOpen] = useState(false);
  const [editRequirementDialogOpen, setEditRequirementDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({
    account_name: '',
    rpa_platform_user: '',
    first_name: '',
    last_name: '',
    titles: '',
    contact_no: '',
    email_id: '',
    linkedin_id: '',
    location: '',
    remark: ''
  });
  const validPriorities = ["High", "Medium", "Low"];
  const validStatuses = ["Active", "Inactive", "Hold", "Closed"];
 
  // const [accountNameFilter, setAccountNameFilter] = useState("");
  // const [locationFilter, setLocationFilter] = useState("");
  // const [firstNameFilter, setFirstNameFilter] = useState("");
  // const [lastNameFilter, setLastNameFilter] = useState(""); 

  // const filteredRecords = currentRecord.filter(record => 
  //   record.account_name.toLowerCase().includes(accountNameFilter.toLowerCase()) &&
  //   record.location.toLowerCase().includes(locationFilter.toLowerCase()) &&
  //   record.first_name.toLowerCase().includes(firstNameFilter.toLowerCase()) &&
  //   record.last_name.toLowerCase().includes(lastNameFilter.toLowerCase())
  // );

  useEffect(() => {
    if (currentRecord) {
      setEditFormData({
        account_name: currentRecord.account_name || "",
        rpa_platform_user: currentRecord.rpa_platform_user || "",
        first_name: currentRecord.first_name || "",
        last_name: currentRecord.last_name || "",
        titles: currentRecord.titles || "",
        contact_no: currentRecord.contact_no || "",
        email_id: currentRecord.email_id || "",
        linkedin_id: currentRecord.linkedin_id || "",
        location: currentRecord.location || "",
        remark: currentRecord.remark || ""
      });
    }
  }, [currentRecord]);

  const [editRequirementsData, setEditRequirementsData] = useState({
    requirement_id: '',
    req_date: '',
    position: '',
    end_client: '',
    must_have_skills: '',
    secondary_skills: '',
    location: '',
    experience_range: '',
    requirement_given_by: '',
    priority: '',
    status: '',
    budget: '',
    no_of_positions: '',
    time_to_onboard: '',
    submission: '',
    remarks: '',
    candidate_name: '',
  });

  useEffect(() => {
    if (currentRecord) {
      setEditRequirementsData({
        requirement_id: currentRecord.requirement_id || "",
        job_id: currentRecord.job_id || "",
        position: currentRecord.position || "",
        end_client: currentRecord.end_client || "",
        must_have_skills: currentRecord.must_have_skills || "",
        secondary_skills: currentRecord.secondary_skills || "",
        location: currentRecord.location || "",
        experience_range: currentRecord.experience_range || "",
        requirement_given_by: currentRecord.requirement_given_by || "",
        priority: currentRecord.priority || "",
        status: currentRecord.status || "",
        budget: currentRecord.budget || "",
        no_of_positions: currentRecord.no_of_positions || "",
        time_to_onboard: currentRecord.time_to_onboard || "",
        submission: currentRecord.submission || "",
        remarks: currentRecord.remarks || "",
        candidate_name: currentRecord.candidate_name || ""
      });
    }
  }, [currentRecord]);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleEditOpen = (record) => {
    setCurrentRecord(record);
    setEditFormData(record);

    if (selectedTable === "leads") {
      setEditLeadsDialogOpen(true);
    } else if (selectedTable === "staffing_requirements") {
      setEditRequirementDialogOpen(true);
    }
  };

  const handleEditCloseLeadsDialog = () => {
    setEditLeadsDialogOpen(false);
    setCurrentRecord(null);
    setEditFormData({});
    setEditRequirementsData({});

  };

  const handleEditCloseRequirementDialog = () => {
    setEditRequirementDialogOpen(false);
    setCurrentRecord(null);
    setEditFormData({});
  };


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenStaffingDialog = () => {
    setOpenStaffingDialog(true);
  };

  const handleCloseStaffingDialog = () => {
    setOpenStaffingDialog(false);
  };

  const handleOpenLeadDialog = () => {
    setOpenLeadDialog(true);
  };

  const handleCloseLeadDialog = () => {
    setOpenLeadDialog(false);
  };

  const getRoleFromCookie = () => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "role") {
        return value;
      }
    }
    return "";
  };

  useEffect(() => {
    const userRole = getRoleFromCookie();
    setRole(userRole);
  }, [])

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
    return null;
  };

  useEffect(() => {

    const fetchedUserId = getCookie("userid");
    setUserId(fetchedUserId);

    const fetchRecords = async (table) => {
      if (!fetchedUserId) return;

      try {
        const response = await fetch(`/api/dashboard/${fetchedUserId}/${table}`);
        if (response.ok) {
          const data = await response.json();
          setRecords(data);
        } else {
          console.error("Failed to fetch records");
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    if (userId) {
      fetchRecords(selectedTable);
    }
  }, [selectedTable, userId]);

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // If no date is provided, return "N/A"

    const date = new Date(dateString);

    // Check if the date is valid and is in ISO 8601 format with timestamp
    if (!isNaN(date.getTime()) && dateString.includes('T') && dateString.includes('Z')) {
      // Extract day, month, and year
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = date.getUTCFullYear();

      // Return formatted date as DD/MM/YYYY
      return `${day}/${month}/${year}`;
    }

    return "N/A"; // Return "N/A" if date is invalid
  };

  const formatBoolean = (value) => {
    return value ? "Yes" : "No";
  };
  // Update API
  const handleSave = async () => {
    if (!currentRecord) return;

    try {
      const apiEndpoint = `/api/dashboard/${userId}/${selectedTable}/${currentRecord.id}`;
      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        setRecords(records.map(record => record.id === currentRecord.id ? editFormData : record));
        if (selectedTable === "leads") {
          alert("Leads Updated Successfully")
          handleEditCloseLeadsDialog();
          window.location.reload();
        } else if (selectedTable === "staffing_requirements") {
          alert("Requirement Updated Successfully")
          handleEditCloseRequirementDialog();
          window.location.reload();
        }
      } else {
        console.error("Failed to update record");
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleReqSave = async () => {
    if (!currentRecord) return;

    try {
      const apiEndpoint = `/api/dashboard/${userId}/${selectedTable}/${currentRecord.id}`;
      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editRequirementsData),
      });

      if (response.ok) {
        setRecords(records.map(record => record.id === currentRecord.id ? editRequirementsData : record));
        if (selectedTable === "leads") {
          alert("Leads Updated Successfully")
          handleEditCloseLeadsDialog();
          window.location.reload();
        } else if (selectedTable === "staffing_requirements") {
          alert("Requirement Updated Successfully")
          handleEditCloseRequirementDialog();
          window.location.reload();
        }
      } else {
        console.error("Failed to update record");
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };
// delete API calling
const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this record?")) {
    try {
      const apiEndpoint = `/api/dashboard/${selectedTable}/${id}`;
      const response = await fetch(apiEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setRecords(records.filter(record => record.id !== id));
        alert("Deleted Successfully!");
      } else {
        // Handle server-side errors
        const errorData = await response.json();
        console.error("Failed to delete record:", errorData.error);
        alert(`Failed to delete record: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("An error occurred while deleting the record.");
    }
  }
};

  const renderTableHeaders = () => {
    if (selectedTable === "staffing_requirements") {
      return (
        <>
          <TableCell>Sr. No.</TableCell>
          <TableCell>Requirement ID</TableCell>
          <TableCell>Job ID</TableCell>
          <TableCell>Position</TableCell>
          <TableCell>End Client</TableCell>
          <TableCell>Must Have Skills</TableCell>
          <TableCell>Secondary Skills</TableCell>
          <TableCell>Location</TableCell>
          <TableCell>Experience Range</TableCell>
          <TableCell>Open Date</TableCell>
          <TableCell>Requirement Given By</TableCell>
          <TableCell>Priority</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Budget</TableCell>
          <TableCell>Number of Positions</TableCell>
          <TableCell>Time to Onboard</TableCell>
          <TableCell>JD Available</TableCell>
          <TableCell>Closed Date</TableCell>
          <TableCell>Submission</TableCell>
          <TableCell>Remarks</TableCell>
          <TableCell>Candidate Name</TableCell>
          <TableCell>Created At</TableCell>
          <TableCell>Action</TableCell>
        </>
      );
    }

    if (selectedTable === "leads") {
      return (
        <>
          <TableCell>Sr. No.</TableCell>
          <TableCell>Account Name</TableCell>
          <TableCell>RPA Platform User</TableCell>
          <TableCell>First Name</TableCell>
          <TableCell>Last Name</TableCell>
          <TableCell>Titles</TableCell>
          <TableCell>Contact No</TableCell>
          <TableCell>Email ID</TableCell>
          <TableCell>LinkedIn ID</TableCell>
          <TableCell>Location</TableCell>
          <TableCell>Lead Generation Date</TableCell>
          <TableCell>Created Date</TableCell>
          <TableCell sx={{ width: '300px', minWidth: '300px', maxWidth: '300px' }}>Remarks</TableCell>
          <TableCell>Action</TableCell>
        </>
      );
    }
  };

  const filterRecordFields = (record) => {
    if (selectedTable === "staffing_requirements") {
      const { requirement_id, job_id, position, end_client, must_have_skills, secondary_skills, location, experience_range, open_date, requirement_given_by, priority, status, budget, no_of_positions, time_to_onboard, jd_available, closed_date, submission, remarks, candidate_name, created_at } = record;
      return { requirement_id, job_id, position, end_client, must_have_skills, secondary_skills, location, experience_range, open_date, requirement_given_by, priority, status, budget, no_of_positions, time_to_onboard, jd_available, closed_date, submission, remarks, candidate_name, created_at };
    }

    if (selectedTable === "leads") {
      const { account_name, rpa_platform_user, first_name, last_name, titles, contact_no, email_id, linkedin_id, location, lead_generation_date, created_at, remark } = record;
      return { account_name, rpa_platform_user, first_name, last_name, titles, contact_no, email_id, linkedin_id, location, lead_generation_date, created_at, remark };
    }
  };

  const renderTableRows = () => {
    // Slice the records based on pagination
    const paginatedRecords = records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return paginatedRecords.map((record, index) => (
      <TableRow key={index}>
        <TableCell className="table-cell">{page * rowsPerPage + index + 1}</TableCell>
        {Object.values(filterRecordFields(record)).map((value, idx) => (
          <TableCell key={idx} className="table-cell">
            {typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
              ? formatDate(value)
              : typeof value === "boolean"
                ? formatBoolean(value)
                : value}
          </TableCell>
        ))}
        <TableCell>
          <div style={{display:'flex'}}>
          <IconButton sx={{color:'#0096FF'}} onClick={() => handleEditOpen(record)} aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton sx={{color:'#C70039'}} onClick={() => handleDelete(record.id)} aria-label="delete">
            <DeleteIcon />
          </IconButton>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <Navbar showLogoutButton={true} />
      <Container maxWidth="xl" sx={{ marginTop: "90px", maxWidth: '95%' }}>
        {role === "admin" && <AdminDashboard />}
        {role === "user" && (
          <><><><><Card sx={{ boxShadow: 3, marginBottom: "20px" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <FormControl variant="outlined" sx={{ width: "30%", marginLeft: '30px' }}>
                  <InputLabel>Type</InputLabel>
                  <Select value={selectedTable} onChange={handleTableChange} label="Table">
                    {/* <MenuItem value="staffing_requirements">Staffing Requirements</MenuItem> */}
                    <MenuItem value="leads">Leads</MenuItem>
                  </Select>
                </FormControl>

                {/* Icons with Names */}
                <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ marginBottom: "20px" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{ marginRight: '10px' }}
                    onClick={handleOpenStaffingDialog}
                  >
                    Staffing Upload
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{ marginRight: '10px' }}
                    onClick={handleOpenLeadDialog}
                  >
                    Lead Upload
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{ marginRight: '30px' }}
                    onClick={handleOpen}
                  >
                    Daily Report
                  </Button>
                  <Box display="flex" alignItems="center" sx={{ marginRight: "20px" }}>
                    <Typography variant="body1" sx={{ marginRight: "8px", color: 'secondary.main', fontWeight: 'bold' }}>Requirement Staffing</Typography>
                    <Link to="/requirement_staffing">
                      <IconButton color="primary" sx={{ fontSize: "30px" }}>
                        <AddIcon fontSize="inherit" />
                      </IconButton>
                    </Link>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" sx={{ marginRight: "8px", color: 'secondary.main', fontWeight: 'bold' }}>Leads</Typography>
                    <Link to="/lead_generation">
                      <IconButton color="primary" sx={{ fontSize: "30px" }}>
                        <AddIcon fontSize="inherit" />
                      </IconButton>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, marginTop: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#cfd8dc" }}>
                    {renderTableHeaders()}
                  </TableRow>
                </TableHead>
                <TableBody>{renderTableRows()}</TableBody>
              </Table>
              <Box sx={{ marginTop: '25px', position: 'absolute' }}>
                <TablePagination
                  sx={{ color: '#C21E56', display: 'flex', justifyContent: 'center' }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={records.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage} />
              </Box>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
              <DialogTitle>
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
              <DialogContent>
                <DailyReport />
              </DialogContent>
            </Dialog>
            
            <Dialog open={openStaffingDialog} onClose={handleCloseStaffingDialog} fullWidth maxWidth="sm">
              <DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseStaffingDialog}
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
              <DialogContent>
                <StaffingUpload />
              </DialogContent>
            </Dialog></>

            <Dialog open={openLeadDialog} onClose={handleCloseLeadDialog} fullWidth maxWidth="sm">
              <DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseLeadDialog}
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
              <DialogContent>
                <LeadUpload />
              </DialogContent>
            </Dialog>
            </>

            <Dialog open={editLeadsDialogOpen} onClose={handleEditCloseLeadsDialog}>
              <DialogTitle sx={{ textAlign: 'center', color: '#0096FF' }}>Edit Lead Record</DialogTitle>
              <DialogContent>
                {currentRecord && (
                  <>
                    <TextField
                      margin="dense"
                      name="account_name"
                      label="Account Name"
                      value={editFormData.account_name || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, account_name: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="rpa_platform_user"
                      label="RPA Platform User"
                      value={editFormData.rpa_platform_user || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, rpa_platform_user: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="first_name"
                      label="First Name"
                      value={editFormData.first_name || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="last_name"
                      label="Last Name"
                      value={editFormData.last_name || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="titles"
                      label="Titles"
                      value={editFormData.titles || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, titles: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="contact_no"
                      label="Contact No"
                      value={editFormData.contact_no || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, contact_no: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="email_id"
                      label="Email ID"
                      value={editFormData.email_id || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, email_id: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="linkedin_id"
                      label="LinkedIn ID"
                      value={editFormData.linkedin_id || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, linkedin_id: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="location"
                      label="Location"
                      value={editFormData.location || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="remark"
                      label="Remarks"
                      value={editFormData.remark || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, remark: e.target.value })}
                      fullWidth />
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditCloseLeadsDialog} color="primary">Cancel</Button>
                <Button onClick={handleSave} color="primary">Update</Button>
              </DialogActions>
            </Dialog></>
            
            <Dialog open={editRequirementDialogOpen} onClose={handleEditCloseRequirementDialog}>
              <DialogTitle sx={{ textAlign: 'center', color: '#0096FF' }}>Edit Staffing Requirement Record</DialogTitle>
              <DialogContent>
                {currentRecord && (
                  <>
                    <TextField
                      margin="dense"
                      name="requirement_id"
                      label="Requirement ID"
                      value={editRequirementsData.requirement_id || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, requirement_id: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="job_id"
                      label="Job ID"
                      value={editRequirementsData.job_id || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, job_id: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="position"
                      label="Position"
                      value={editRequirementsData.position || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, position: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="end_client"
                      label="End Client"
                      value={editRequirementsData.end_client || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, end_client: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="must_have_skills"
                      label="Must Have Skills"
                      value={editRequirementsData.must_have_skills || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, must_have_skills: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="secondary_skills"
                      label="Secondary Skills"
                      value={editRequirementsData.secondary_skills || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, secondary_skills: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="location"
                      label="Location"
                      value={editRequirementsData.location || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, location: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="experience_range"
                      label="Experience Range"
                      value={editRequirementsData.experience_range || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, experience_range: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="requirement_given_by"
                      label="Requirement Given By"
                      value={editRequirementsData.requirement_given_by || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, requirement_given_by: e.target.value })}
                      fullWidth />

                    <FormControl fullWidth margin="dense">
                      <InputLabel id="priority-label">Priority</InputLabel>
                      <Select
                        labelId="priority-label"
                        name="priority"
                        value={editRequirementsData.priority || ""}
                        onChange={(e) =>
                          setEditRequirementsData({
                            ...editRequirementsData,
                            priority: e.target.value  // Update priority on change
                          })
                        }
                        label="Priority"
                      >
                        {!validPriorities.includes(editRequirementsData.priority) && (
                          <MenuItem value={editRequirementsData.priority}>
                            {editRequirementsData.priority}
                          </MenuItem>
                        )}
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        labelId="status-label"
                        name="status"
                        value={editRequirementsData.status || ""}  // Ensure current status is displayed
                        onChange={(e) =>
                          setEditRequirementsData({
                            ...editRequirementsData,
                            status: e.target.value,  // Update status on change
                          })
                        }
                        label="Status"
                      >
                        {/* Show the current value if it's not a valid status */}
                        {!validStatuses.includes(editRequirementsData.status) && (
                          <MenuItem value={editRequirementsData.status}>
                            {editRequirementsData.status}
                          </MenuItem>
                        )}

                        {/* Dropdown options */}
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                        <MenuItem value="Hold">Hold</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      margin="dense"
                      name="budget"
                      label="Budget"
                      value={editRequirementsData.budget || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, budget: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="no_of_positions"
                      label="Number of Positions"
                      type="number"
                      value={editRequirementsData.no_of_positions || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, no_of_positions: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="time_to_onboard"
                      label="Time to Onboard"
                      value={editRequirementsData.time_to_onboard || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, time_to_onboard: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="submission"
                      label="Submission"
                      value={editRequirementsData.submission || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, submission: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="remarks"
                      label="Remarks"
                      value={editRequirementsData.remarks || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, remarks: e.target.value })}
                      fullWidth />
                    <TextField
                      margin="dense"
                      name="candidate_name"
                      label="Candidate Name"
                      value={editRequirementsData.candidate_name || ""}
                      onChange={(e) => setEditRequirementsData({ ...editRequirementsData, candidate_name: e.target.value })}
                      fullWidth />
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditCloseRequirementDialog} color="primary">Cancel</Button>
                <Button onClick={handleReqSave} color="primary">Update</Button>
              </DialogActions>
            </Dialog>
            </>
        )}
      </Container>
    </>
  );
};

export default UserDashboard;
