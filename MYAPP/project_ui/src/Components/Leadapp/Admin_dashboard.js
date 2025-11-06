import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box, Link,
  Grid,
  CircularProgress,
  RadioGroup,
  FormControlLabel, InputAdornment, OutlinedInput,
  Radio,
  TextField,
  TablePagination,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import WorkReport from "./work_Report";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TitleIcon from '@mui/icons-material/Title';
import * as XLSX from 'xlsx';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FlagIcon from '@mui/icons-material/Flag';
import StarsIcon from '@mui/icons-material/Stars';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [staffingRequirements, setStaffingRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("leads");
  const [leadFilter, setLeadFilter] = useState("");
  const [staffingFilter, setStaffingFilter] = useState("");
  const [accountNameFilter, setAccountNameFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");

  const [positionFilter, setPositionFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState("");
  const [skillsetFilter, setSkillsetFilter] = React.useState("");
  const [requirementFilter, setRequirementFilter] = React.useState("");
  const [clientNameFilter, setClientNameFilter] = React.useState("");

  // Pagination state
  const [leadPage, setLeadPage] = useState(0);
  const [leadRowsPerPage, setLeadRowsPerPage] = useState(10);
  const [staffingPage, setStaffingPage] = useState(0);
  const [staffingRowsPerPage, setStaffingRowsPerPage] = useState(10);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsResponse = await fetch("/api/get-leads");
        const staffingResponse = await fetch("/api/get-staffing-requirements");

        if (!leadsResponse.ok || !staffingResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const leadsData = await leadsResponse.json();
        const staffingData = await staffingResponse.json();

        setLeads(leadsData);
        setStaffingRequirements(staffingData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // If no date is provided, return "N/A"

    const date = new Date(dateString);

    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-GB"); // Format date if it's valid
    }

    return "N/A"; // Return "N/A" if date is invalid
  };


  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", my: 5 }} />;
  if (error) return <Typography color="error" sx={{ textAlign: "center", my: 5 }}>{error}</Typography>;

  const filteredLeads = leads.filter(lead =>
    lead.account_name.toLowerCase().includes(accountNameFilter.toLowerCase()) &&
    lead.location.toLowerCase().includes(locationFilter.toLowerCase()) &&
    lead.titles.toLowerCase().includes(titleFilter.toLowerCase())
  );

  const filteredStaffingRequirements = staffingRequirements.filter(requirement =>
    (positionFilter === "" || requirement.position.toLowerCase().includes(positionFilter.toLowerCase())) &&
    (statusFilter === "" || requirement.status.toLowerCase() === statusFilter.toLowerCase()) &&
    (priorityFilter === "" || requirement.priority.toLowerCase().includes(priorityFilter.toLowerCase())) &&
    (skillsetFilter === "" || requirement.must_have_skills.toLowerCase().includes(skillsetFilter.toLowerCase())) &&
    (requirementFilter === "" || requirement.requirement_given_by.toLowerCase().includes(requirementFilter.toLowerCase())) &&
    (clientNameFilter === "" || requirement.end_client.toLowerCase().includes(clientNameFilter.toLowerCase()))
  );


  const handleLeadChangePage = (event, newPage) => {
    setLeadPage(newPage);
  };

  const handleLeadChangeRowsPerPage = (event) => {
    setLeadRowsPerPage(parseInt(event.target.value, 10));
    setLeadPage(0);
  };

  const handleStaffingChangePage = (event, newPage) => {
    setStaffingPage(newPage);
  };

  const handleStaffingChangeRowsPerPage = (event) => {
    setStaffingRowsPerPage(parseInt(event.target.value, 10));
    setStaffingPage(0);
  };
  const handleReportClick = () => {
    navigate("/work_report")
  }

  const exportLeadsToExcel = () => {
    const formatDate = (dateString) => {
      if (!dateString || isNaN(new Date(dateString))) {
        return "N/A"; // Return 'N/A' for invalid or missing dates
      }
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // Format as dd-mm-yy
    };
  
    const leadsData = leads
      .filter(record => view === "leads")
      .map(({ id, userid, updated_at ,lead_generation_date, created_at, ...rest }) => {
        // Format date fields if they exist
        if (lead_generation_date) {
          rest.lead_generation_date = formatDate(lead_generation_date);
        }
        if (created_at) {
          rest.created_at = formatDate(created_at);
        }
        return rest;
      });
  
    if (leadsData.length > 0) {
      // Get the keys from the first lead for headers
      const headers = Object.keys(leadsData[0]).map(header =>
        header.replace(/_/g, " ")  // Replace underscores with spaces
          .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) // Title Case
      );
  
      // Add the headers as the first row in the worksheet data
      const worksheetData = [headers, ...leadsData.map(obj => Object.values(obj))];
  
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); // Convert array to sheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
  
      // Download the Excel file
      XLSX.writeFile(workbook, "leads_data.xlsx");
    } else {
      alert("No leads data available to export");
    }
  };
  
  const exportRequirementsToExcel = () => {
    const formatDate = (dateString) => {
      if (!dateString || isNaN(new Date(dateString))) {
        return "N/A"; // Return 'N/A' for invalid or missing dates
      }
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // Format as dd-mm-yy
    };
  
    const requirementsData = staffingRequirements
      .filter(record => view === "staffing")
      .map(({ id, open_date, updated_at, userid, ...rest }) => {
        // Format date fields if they exist
        if (rest.hasOwnProperty('created_at')) {
          rest.created_at = formatDate(rest.created_at);
        }
        if (rest.hasOwnProperty('req_date')) {
          rest.req_date = formatDate(rest.req_date);
        }
        if (rest.hasOwnProperty('closed_date')) {
          rest.closed_date = formatDate(rest.closed_date);
        }
        return rest;
      });
  
    if (requirementsData.length > 0) {
      // Get the keys from the first requirement for headers
      const headers = Object.keys(requirementsData[0]).map(header =>
        header.replace(/_/g, " ")  // Replace underscores with spaces
          .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) // Title Case
      );
  
      // Add the headers as the first row in the worksheet data
      const worksheetData = [headers, ...requirementsData.map(obj => Object.values(obj))];
  
      // Create a new worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
      // Apply yellow background to header row
      const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // First row (0 index)
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = { fill: { fgColor: { rgb: "#FFFF00" } } }; // Yellow background
      }
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Requirements");
  
      // Download the Excel file
      XLSX.writeFile(workbook, "requirements_data.xlsx");
    } else {
      alert("No requirements data available to export");
    }
  };
  
    

  const paginatedLeads = filteredLeads.slice(leadPage * leadRowsPerPage, leadPage * leadRowsPerPage + leadRowsPerPage);
  const paginatedStaffingRequirements = filteredStaffingRequirements.slice(staffingPage * staffingRowsPerPage, staffingPage * staffingRowsPerPage + staffingRowsPerPage);

  return (
    <><Container sx={{ marginTop: "90px", margin: 0, width: '100vw', padding: '0' }}>
      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: "#e0f7fa", borderLeft: "4px solid #0097a7", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Leads</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#0097a7" }}><PeopleIcon sx={{ mr: 1 }} />{leads.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: "#f3e5f5", borderLeft: "4px solid #6a1b9a", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Req</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6a1b9a" }}><WorkIcon sx={{ mr: 1 }} />{staffingRequirements.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: "#fff8e1", borderLeft: "4px solid #ff6f00", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Active Req</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#ff6f00" }}>{staffingRequirements.filter((record) => record.status === "Active").length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: "#abda9c", borderLeft: "4px solid #258d04", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Closed Req</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#258d04" }}>{staffingRequirements.filter((record) => record.status === "Closed").length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: "#ffebee", borderLeft: "4px solid #d32f2f", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">High Priority</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#d32f2f" }}><PriorityHighIcon sx={{ mr: 1 }} />{staffingRequirements.filter((record) => record.priority === "High").length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: "#cacbde", borderLeft: "4px solid #0a1add", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Clients</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#0a1add" }}>
                {new Set(staffingRequirements
                  .map((record) => record.end_client)
                ).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Radio Buttons for selecting view */}
      <Box sx={{ mb: 4 }}>
        <Card
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h6" sx={{ mr: 2, color: '#333', marginLeft: '50px' }}>
            Select Requirement:
          </Typography>
          <RadioGroup
            row
            aria-label="view"
            name="view"
            value={view}
            onChange={(e) => setView(e.target.value)}
            sx={{
              marginLeft: '70px',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <FormControlLabel
              value="leads"
              control={<Radio sx={{ color: '#1976d2' }} />}
              label={<Typography
                variant="body1"
                sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px', }}
              >
                <PeopleIcon sx={{ mr: 0.5, color: '#1976d2' }} />
                Leads
              </Typography>} />
            <FormControlLabel
              value="staffing"
              control={<Radio sx={{ color: '#1976d2', marginLeft: '70px', }} />}
              label={<Typography
                variant="body1"
                sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px', }}
              >
                <WorkIcon sx={{ mr: 0.5, color: '#1976d2' }} />
                Staffing Requirements
              </Typography>} />

            <Button type='button' variant='contained' color='secondary' size="small" onClick={handleReportClick} sx={{ marginLeft: '50px' }}>Work Report</Button>

          </RadioGroup>
        </Card>
      </Box>

      {/* Conditional rendering of filter and table based on selected view */}
      {view === "leads" && (
        <>
          <Box sx={{ width: '100%' }}>
            <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2, width: '100%', p: 0 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Leads</Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{ width: '120px' }}
                    onClick={exportLeadsToExcel}
                  >
                    Leads Export
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Account Name"
                      variant="outlined"
                      fullWidth
                      value={accountNameFilter}
                      onChange={(e) => setAccountNameFilter(e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#1976d2', // Blue border color
                          },
                          '&:hover fieldset': {
                            borderColor: '#1565c0', // Darker blue on hover
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#0d47a1', // Darker blue when focused
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircleIcon />
                          </InputAdornment>
                        ),
                      }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Location"
                      variant="outlined"
                      fullWidth
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#1976d2', // Blue border color
                          },
                          '&:hover fieldset': {
                            borderColor: '#1565c0', // Darker blue on hover
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#0d47a1', // Darker blue when focused
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon />
                          </InputAdornment>
                        ),
                      }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Title"
                      variant="outlined"
                      fullWidth
                      value={titleFilter}
                      onChange={(e) => setTitleFilter(e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#1976d2', // Blue border color
                          },
                          '&:hover fieldset': {
                            borderColor: '#1565c0', // Darker blue on hover
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#0d47a1', // Darker blue when focused
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TitleIcon />
                          </InputAdornment>
                        ),
                      }} />
                  </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1, maxHeight: '500px', overflow: 'auto' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        {[
                          "Sr. No",
                          "Account Name",
                          // "RPA Platform User",
                          "First Name",
                          "Last Name",
                          "Title",
                          "Contact No",
                          "Email ID",
                          "LinkedIn ID",
                          "Location",
                          "Lead Generation Date",
                          "Remarks"
                        ].map((header) => (
                          <TableCell
                            key={header}
                            sx={{
                              fontWeight: 'bold',
                              position: 'sticky', // Stick header
                              top: 0, // Align to top
                              backgroundColor: '#f5f5f5', // Maintain background
                              zIndex: 1 // Ensure it's on top
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedLeads.map((lead, index) => (
                        <TableRow key={lead.id} hover>
                          <TableCell>{leadPage * leadRowsPerPage + index + 1}</TableCell>
                          <TableCell>{lead.account_name}</TableCell>
                          {/* <TableCell>{lead.rpa_platform_user}</TableCell> */}
                          <TableCell>{lead.first_name}</TableCell>
                          <TableCell>{lead.last_name}</TableCell>
                          <TableCell>{lead.titles}</TableCell>
                          <TableCell>{lead.contact_no}</TableCell>
                          <TableCell>{lead.email_id}</TableCell>
                          <TableCell>{lead.linkedin_id}</TableCell>
                          <TableCell>{lead.location}</TableCell>
                          <TableCell>{formatDate(lead.lead_generation_date)}</TableCell>
                          <TableCell sx={{ width: '300px', minWidth: '300px', maxWidth: '300px' }}>
                            {lead.remark}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredLeads.length}
                  rowsPerPage={leadRowsPerPage}
                  page={leadPage}
                  onPageChange={handleLeadChangePage}
                  onRowsPerPageChange={handleLeadChangeRowsPerPage} />
              </CardContent>
            </Card>
          </Box>
        </>
      )}

      {view === "staffing" && (
        <>
          <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <div>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Staffing Requirements</Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={exportRequirementsToExcel} 
                  >
                    Requirements Export
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Position"
                      variant="outlined"
                      fullWidth
                      value={positionFilter}
                      onChange={(e) => setPositionFilter(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Status"
                      variant="outlined"
                      fullWidth
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ListAltIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Priority"
                      variant="outlined"
                      fullWidth
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FlagIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Must Have Skillset"
                      variant="outlined"
                      fullWidth
                      value={skillsetFilter}
                      onChange={(e) => setSkillsetFilter(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StarsIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Requirement Given By"
                      variant="outlined"
                      fullWidth
                      value={requirementFilter}
                      onChange={(e) => setRequirementFilter(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonAddAltIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Client Name"
                      variant="outlined"
                      fullWidth
                      value={clientNameFilter}
                      onChange={(e) => setClientNameFilter(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonAddAltIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }} />
                  </Grid>
                </Grid>
              </div>
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1, maxHeight: 500 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      {[
                        "Sr. No.",
                        "Requirement ID",
                        "Req Date",
                        "Position",
                        "Client Name",
                        "Must Have Skills",
                        "Secondary Skills",
                        "Location",
                        "Experience Range",
                        "Requirement Given By",
                        "Priority",
                        "Status",
                        "Budget",
                        "No. of Positions",
                        "Time to Onboard",
                        "JD Available",
                        "Closed Date",
                        "Submission",
                        "Remarks",
                        "Candidate Name",
                      ].map((header) => (
                        <TableCell key={header} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedStaffingRequirements.map((requirement, index) => (
                      <TableRow key={requirement.id} hover>
                        <TableCell>{staffingPage * staffingRowsPerPage + index + 1}</TableCell>
                        <TableCell>{requirement.requirement_id}</TableCell>
                        <TableCell>{formatDate(requirement.req_date)}</TableCell>
                        <TableCell>{requirement.position}</TableCell>
                        <TableCell>{requirement.end_client}</TableCell>
                        <TableCell>{requirement.must_have_skills}</TableCell>
                        <TableCell>{requirement.secondary_skills}</TableCell>
                        <TableCell>{requirement.location}</TableCell>
                        <TableCell>{requirement.experience_range}</TableCell>
                        <TableCell>{requirement.requirement_given_by}</TableCell>
                        <TableCell>{requirement.priority}</TableCell>
                        <TableCell>{requirement.status}</TableCell>
                        <TableCell>{requirement.budget}</TableCell>
                        <TableCell>{requirement.no_of_positions}</TableCell>
                        <TableCell>{requirement.time_to_onboard}</TableCell>
                        <TableCell>{requirement.jd_available ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{formatDate(requirement.closed_date)}</TableCell>
                        <TableCell>{requirement.submission}</TableCell>
                        <TableCell>{requirement.remarks}</TableCell>
                        <TableCell>{requirement.candidate_name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredStaffingRequirements.length}
                rowsPerPage={staffingRowsPerPage}
                page={staffingPage}
                onPageChange={handleStaffingChangePage}
                onRowsPerPageChange={handleStaffingChangeRowsPerPage} />
            </CardContent>
          </Card>
        </>
      )}
    </Container>
    </>
  );
};

export default AdminDashboard;
