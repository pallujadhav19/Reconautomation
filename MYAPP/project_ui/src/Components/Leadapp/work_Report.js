import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaUser } from "react-icons/fa";
import Navbar from "./Navbar";
import { Navigate, useNavigate } from "react-router-dom";


const AdminWorkReport = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [reportType, setReportType] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-daily-report");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setReports(data);
      filterReports(data, "daily");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = (data, type) => {
    const today = new Date();
    let filteredData = [];

    switch (type) {
      case "daily":
        filteredData = data.filter((report) => {
          const reportDate = new Date(report.daily_report_date);
          return reportDate.toDateString() === today.toDateString();
        });
        break;

      case "weekly":
        const startOfWeek = new Date();
        startOfWeek.setDate(today.getDate() - today.getDay());
        filteredData = data.filter((report) => {
          const reportDate = new Date(report.daily_report_date);
          return reportDate >= startOfWeek && reportDate <= today;
        });
        break;

      case "monthly":
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        filteredData = data.filter((report) => {
          const reportDate = new Date(report.daily_report_date);
          return reportDate >= startOfMonth && reportDate <= today;
        });
        break;

      default:
        filteredData = data;
        break;
    }

    const aggregatedReports = aggregateReports(filteredData);
    setFilteredReports(aggregatedReports);
  };

  const aggregateReports = (data) => {
    const aggregated = data.reduce((acc, report) => {
      if (!acc[report.name]) {
        acc[report.name] = {
          name: report.name,
          mail_sent: Number(report.mail_sent) || 0,
          data_extraction_linkedin: Number(report.data_extraction_linkedin) || 0,
          connection_request_sent: Number(report.connection_request_sent) || 0,
          request_accepted: Number(report.request_accepted) || 0,
          message_sent: Number(report.message_sent) || 0,
          data_extraction_oil_gas: Number(report.data_extraction_oil_gas) || 0,
          calls: Number(report.calls) || 0,
          positive_response: Number(report.positive_response) || 0,
          daily_report_date: report.daily_report_date,
        };
      } else {
        acc[report.name] = {
          ...acc[report.name],
          mail_sent: acc[report.name].mail_sent + (Number(report.mail_sent) || 0),
          data_extraction_linkedin: acc[report.name].data_extraction_linkedin + (Number(report.data_extraction_linkedin) || 0),
          connection_request_sent: acc[report.name].connection_request_sent + (Number(report.connection_request_sent) || 0),
          request_accepted: acc[report.name].request_accepted + (Number(report.request_accepted) || 0),
          message_sent: acc[report.name].message_sent + (Number(report.message_sent) || 0),
          data_extraction_oil_gas: acc[report.name].data_extraction_oil_gas + (Number(report.data_extraction_oil_gas) || 0),
          calls: acc[report.name].calls + (Number(report.calls) || 0),
          positive_response: acc[report.name].positive_response + (Number(report.positive_response) || 0),
        };
      }
      return acc;
    }, {});

    return Object.values(aggregated);
  };

  const calculateTotals = () => {
    return filteredReports.reduce(
      (totals, report) => {
        return {
          mail_sent: totals.mail_sent + report.mail_sent,
          data_extraction_linkedin: totals.data_extraction_linkedin + report.data_extraction_linkedin,
          connection_request_sent: totals.connection_request_sent + report.connection_request_sent,
          request_accepted: totals.request_accepted + report.request_accepted,
          message_sent: totals.message_sent + report.message_sent,
          data_extraction_oil_gas: totals.data_extraction_oil_gas + report.data_extraction_oil_gas,
          calls: totals.calls + report.calls,
          positive_response: totals.positive_response + report.positive_response,
        };
      },
      {
        mail_sent: 0,
        data_extraction_linkedin: 0,
        connection_request_sent: 0,
        request_accepted: 0,
        message_sent: 0,
        data_extraction_oil_gas: 0,
        calls: 0,
        positive_response: 0,
      }
    );
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
    filterReports(reports, type);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const memoizedFilteredReports = useMemo(
    () => filteredReports,
    [filteredReports]
  );

  const handleHome = () => {
    navigate("/user_dashboard");
  };

  const handleSalesTeam=()=>{
    navigate('/sales-team');
  }

  const totals = useMemo(() => calculateTotals(), [memoizedFilteredReports]);

  return (
    <>
      <Navbar showLogoutButton={true} />
      <Card sx={{ margin: 2, padding: 2, marginTop: "80px" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            <FaUser style={{ marginRight: 8 }} /> Work Report
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Grid item>
              <Button
                variant={reportType === "daily" ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleReportTypeChange("daily")}
                startIcon={<FaCalendarDay />}
              >
                Daily Report
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={reportType === "weekly" ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleReportTypeChange("weekly")}
                startIcon={<FaCalendarWeek />}
              >
                Weekly Report
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={reportType === "monthly" ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleReportTypeChange("monthly")}
                startIcon={<FaCalendarAlt />}
              >
                Monthly Report
              </Button>
            </Grid>
            <Grid item>
              <Button
                sx={{ width: "150px" }}
                variant="contained"
                color="primary"
                onClick={handleSalesTeam}
              >
               Sales Team
              </Button>
            </Grid>
            <Grid item>
              <Button
                sx={{ width: "150px" }}
                variant="contained"
                color="primary"
                onClick={handleHome}
              >
                Home
              </Button>
            </Grid>
          </Grid>

          {loading ? (
            <Grid container justifyContent="center" sx={{ my: 2 }}>
              <CircularProgress />
            </Grid>
          ) : error ? (
            <Typography color="error" variant="body1">
              {error}
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table
                sx={{
                  "& tbody tr:hover": {
                    backgroundColor: "#dcdcdc", // Highlight color on hover
                  },
                  "& tbody tr": {
                    transition: "background-color 0.3s ease", // Smooth transition effect
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <strong>Employee Name</strong>
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
                  {memoizedFilteredReports.map((report) => (
                    <TableRow key={report.name}>
                      <TableCell align="center">{report.name}</TableCell>
                      <TableCell align="center">{report.mail_sent}</TableCell>
                      <TableCell align="center">{report.data_extraction_linkedin}</TableCell>
                      <TableCell align="center">{report.connection_request_sent}</TableCell>
                      <TableCell align="center">{report.request_accepted}</TableCell>
                      <TableCell align="center">{report.message_sent}</TableCell>
                      <TableCell align="center">{report.data_extraction_oil_gas}</TableCell>
                      <TableCell align="center">{report.calls}</TableCell>
                      <TableCell align="center">{report.positive_response}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ backgroundColor: "#e0f7fa" }}>
                    <TableCell align="center">
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align="center" sx={{ color: "green", fontWeight: "bold" }}>
                      {totals.mail_sent}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "green", fontWeight: "bold" }}>
                      {totals.data_extraction_linkedin}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "green", fontWeight: "bold" }}>
                      {totals.connection_request_sent}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "green", fontWeight: "bold" }}>
                      {totals.request_accepted}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "green", fontWeight: "bold" }}>
                      {totals.message_sent}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "green", fontWeight: "bold" }}>
                      {totals.data_extraction_oil_gas}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "green", fontWeight: "bold" }}>
                      {totals.calls}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "green", fontWeight: "bold" }}>
                      {totals.positive_response}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AdminWorkReport;