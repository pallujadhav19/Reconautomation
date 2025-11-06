import React, { useEffect, useState } from "react";
import logoImg from "./newlogo.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ showLogoutButton, showGstAndTdsButton }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [fname, setFname] = useState(null);
  const [lname, setLname] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fname_user = Cookies.get("fname");
    const lname_user = Cookies.get("lname");
    if (fname_user || lname_user) {
      setFname(fname_user);
      setLname(lname_user);
    }
  }, []);

  const handleLogout = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    navigate("/");
  };

  // Determine active page
  const getButtonClass = (path) => {
    return location.pathname === path
      ? "btn btn-primary btn-sm active-nav-btn"
      : "btn btn-outline-primary btn-sm inactive-nav-btn";
  };

  return (
    <div
      className="fixed-top"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        height: 55,
        padding: "0 30px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {/* Left Section - Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logoImg} width="150" height="50" alt="Logo" />
      </div>

      {/* Center Section - Buttons */}
      {showGstAndTdsButton && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginLeft: "50px",
          }}
        >
          <button
            className={getButtonClass("/dashboard")}
            onClick={() => navigate("/dashboard")}
          >
            {t("GST")}
          </button>
          {/* <button
            className={getButtonClass("/tds")}
            onClick={() => navigate("/tds")}
          >
            {t("TDS")}
          </button> */}
          {/* <button
            className={getButtonClass("/GSTR2B-PortalAutomation")}
            onClick={() => navigate("/GSTR2B-PortalAutomation")}
          >
            {t("Download GSTR2B")}
          </button> */}
          {/* <button
            className={getButtonClass("/TDS-26AS-PortalAutomation")}
            onClick={() => navigate("/TDS-26AS-PortalAutomation")}
          >
            {t("Download TDS26AS")}
          </button> */}
        </div>
      )}

      {/* Right Section - User and Logout */}
      {showLogoutButton && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#333", fontWeight: "500" }}>
            {fname} {lname}
          </span>
          <button
            className="btn btn-danger btn-sm"
            type="button"
            onClick={handleLogout}
          >
            {t("Log Out")}
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
