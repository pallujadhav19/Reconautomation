import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Grid,
  Button,
  Box,
  TextField,
  TablePagination, // Import TablePagination
} from "@mui/material";
import Navbar from "./Navbar";

const SalesTeam = () => {
  const [salesTeam, setSalesTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDetails, setMemberDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);

  // States for date filtering
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchSalesTeam();
  }, []);

  const fetchSalesTeam = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-salesteam-names");
      if (!response.ok) {
        throw new Error("Failed to fetch sales team data");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        // Filter out any object where the name is "Valuedx Admin"
        const filteredData = data.filter(member => member.name !== "Valuedx Admin");
        setSalesTeam(filteredData);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching sales team data:", err);
    } finally {
      setLoading(false);
    }
  };
  
  

  const fetchMemberDetails = async (userid) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/get-member-details/${userid}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch member details");
      }
      const data = await response.json();
      data.sort(
        (a, b) => new Date(b.daily_report_date) - new Date(a.daily_report_date)
      );
      setMemberDetails(data);
      setFilteredDetails(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching member details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = memberDetails.filter((report) => {
        const reportDate = new Date(report.daily_report_date);
        return (
          reportDate >= new Date(startDate) && reportDate <= new Date(endDate)
        );
      });
      setFilteredDetails(filtered);
    } else {
      setFilteredDetails(memberDetails);
    }
  }, [startDate, endDate, memberDetails]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Pagination handler
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate paginated data
  const paginatedDetails = filteredDetails.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Navbar showLogoutButton={true} />
      <Card sx={{ margin: 2, padding: 2, marginTop: "80px" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Sales Team Members
          </Typography>

          {loading ? (
            <Grid container justifyContent="center" sx={{ my: 2 }}>
              <CircularProgress />
            </Grid>
          ) : error ? (
            <Typography color="error" variant="body1">
              {error}
            </Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <strong>Sr. No.</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Contact</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salesTeam.length > 0 ? (
                      salesTeam.map((member, index) => (
                        <TableRow key={member.userid}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() => {
                                setSelectedMember(member);
                                fetchMemberDetails(member.userid);
                              }}
                            >
                              {member.name}
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            {member.email_id}
                          </TableCell>
                          <TableCell align="center">
                            {member.contact_no}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No sales team members found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedMember && filteredDetails.length > 0 && (
                <Card sx={{ margin: 2, padding: 2, marginTop: "40px" }}>
                  <CardContent>
                    <Grid
                      container
                      alignItems="center"
                      spacing={2}
                      sx={{ mb: 2, marginLeft: "10px" }}
                    >
                      <Grid item xs={12} md={3}>
                        <Typography variant="h6">
                          Details for {selectedMember.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Start Date"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="End Date"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">
                            <strong>Sr. No.</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Date</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Mail Sent</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Data Extraction LinkedIn</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Connection Request Sent</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Request Accepted</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Message Sent</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Data Extraction Oil & Gas</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Calls</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Positive Response</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedDetails.map((report, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="center">
                              {formatDate(report.daily_report_date)}
                            </TableCell>
                            <TableCell align="center">
                              {report.mail_sent}
                            </TableCell>
                            <TableCell align="center">
                              {report.data_extraction_linkedin}
                            </TableCell>
                            <TableCell align="center">
                              {report.connection_request_sent}
                            </TableCell>
                            <TableCell align="center">
                              {report.request_accepted}
                            </TableCell>
                            <TableCell align="center">
                              {report.message_sent}
                            </TableCell>
                            <TableCell align="center">
                              {report.data_extraction_oil_gas}
                            </TableCell>
                            <TableCell align="center">{report.calls}</TableCell>
                            <TableCell align="center">
                              {report.positive_response}
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredDetails.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={10} align="center">
                              No details available for this member within the
                              selected date range.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    {/* Add Pagination Controls */}
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={filteredDetails.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end", // Align pagination controls to the right
                        padding: 2, // Add padding around the pagination controls
                        borderTop: "1px solid #ddd", // Add a top border to separate from table
                        "& .MuiTablePagination-select": {
                          marginRight: 2, // Add margin to the right of the rows per page dropdown
                        },
                        "& .MuiTablePagination-actions": {
                          marginLeft: 2, // Add margin to the left of the pagination buttons
                        },
                        "& .MuiTablePagination-selectLabel": {
                          fontWeight: "bold", // Make the "Rows per page" label bold
                        },
                        "& .MuiTablePagination-displayedRows": {
                          fontWeight: "bold", // Make the displayed rows text bold
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SalesTeam;