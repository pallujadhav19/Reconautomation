import React, { useState, useEffect } from "react";
import config from './config/config';
import { BrowserRouter as Router, Route, Routes, Switch,Navigate } from "react-router-dom";
import LoginPage from "./Components/Login/LoginPage";
import Dashboard from "./Components/Dashboard/Dashboard";
import RegistrationForm from "./Components/Registration/RegistrationForm";
import ClientRegistration from "./Components/Registration/ClientRegistration";
import GSTForm from "./Components/GSTForm/GSTForm";
import TDSForm from "./Components/TDSForm/TDSForm";
import Cookies from "js-cookie";
import { useCookies } from "react-cookie";
import Tds from "./Components/Dashboard/Tds";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ProtectedRoute from './Components/ProtectedRoute';
import AutoIntentDashboard from "./Components/AutoIntent/autointentdashboard";
import AutoIntentLoginPage from "./Components/AutoIntent/autointentlogin";
import AutoIntentUploadDetails from "./Components/AutoIntent/uploaddetails";
import AutoIntentUploadSingleDetails from "./Components/AutoIntent/uploadsingledetails";
import AutoIntentNavbar from "./Components/AutoIntent/autointentnavbar";
import RegisterDetails from "./Components/AutoIntent/RegistrationForm";
import Login from "./Components/Leadapp/Login";
import Register from "./Components/Leadapp/Register";
import LeadGeneration from "./Components/Leadapp/Lead";
import RequirementStaffing from "./Components/Leadapp/Req_staffing";
import UserDashboard from "./Components/Leadapp/User_dashboard";
import AdminDashboard from "./Components/Leadapp/Admin_dashboard";
import DailyReport from "./Components/Leadapp/User_report";
import LeadUpload from "./Components/Leadapp/Lead_upload";
import StaffingUpload from "./Components/Leadapp/Requirement_upload";
import AdminWorkReport from "./Components/Leadapp/work_Report";
import SalesTeam from "./Components/Leadapp/Sales_team";

function App() {
  const [sessionToken, setSessionToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutTimeId, setLogoutTimeId] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  // Function to handle successful login
  const handleLogin = (token, timeId) => {
    setCookie("sessionToken", token); // Store the session token Cookies
    setSessionToken(token);
    setIsAuthenticated(true);
    setLogoutTimeId(timeId);
    window.location.href="/dashboard"
  };

  // Function to handle logout
  const handleLogout = () => {
    console.log("logout");
    Cookies.remove("sessionToken");
    Cookies.remove("fname");
    Cookies.remove("lname");
    Cookies.remove("tenantInfo");
    setSessionToken("");
    setIsAuthenticated(false);
    clearTimeout(logoutTimeId);
  };

  // Retrieve session token from localStorage on component mount
  useEffect(() => {
    const token = Cookies.get("sessionToken");
    if (token) {
      setSessionToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  // Render login page or dashboard based on sessionToken state
  const renderContent = () => {
    if (sessionToken) {
      // User is logged in, render dashboard
      return (
        <Dashboard isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      );
    } else {
      // User is not logged in, render login page
      return (
        <LoginPage isAuthenticated={isAuthenticated} onLogin={handleLogin} />
      );
      //return <RegistrationForm />
    }
    
  };

 
  return (
    <div className="App">
      <Router>   
        { 
        <Routes>
          <Route path={config.routes.home} element={<LoginPage isAuthenticated={isAuthenticated} onLogin={handleLogin}/>}/>
          <Route path={config.routes.register} element={<RegistrationForm />} />
          <Route path="/clientregistration" element={<ClientRegistration />} />
          <Route path="/tds" element={<Tds onLogout={handleLogout} isAuthenticated={isAuthenticated} /> }/>
          <Route path={config.routes.dashboard} element={<Dashboard onLogout={handleLogout} isAuthenticated={isAuthenticated} /> }/>
          <Route path="/GSTR2B-PortalAutomation" element={<GSTForm />} />
          <Route path={config.routes.tds.form} element={<TDSForm />} />
          <Route path="/autointent_login" element={<AutoIntentLoginPage/>} />
          <Route path="/autointent_register" element={<RegisterDetails/>} />
          <Route path={config.routes.autoIntent.dashboard} element={<AutoIntentDashboard/>} />
          <Route path={config.routes.autoIntent.upload} element={<AutoIntentUploadDetails />} />
          <Route path={config.routes.autoIntent.singleUpload} element={<AutoIntentUploadSingleDetails />} />

          <Route path="/lead_login" element={<Login/>} />
          <Route path="/lead_generation" element={<LeadGeneration/>} />
          <Route path="/requirement_staffing" element={<RequirementStaffing/>} />
          <Route path="/user_dashboard" element={<UserDashboard/>} />
          <Route path="/lead_register" element={<Register/>} />
          <Route path="/daily_report" element={<DailyReport />} />
          <Route path="/staffing_upload" element={<StaffingUpload />} />
          <Route path="/lead_upload" element={<LeadUpload />} />
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route path="/work_report" element={<AdminWorkReport />} />
          <Route path="/sales-team" element={<SalesTeam />} />
        </Routes> 
        }
      </Router>
    </div>
  );
}

export default App;
