import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import logins from './LoginSide.jpg';
import Footer from '../Footer/Footer';
import './LoginPage.css';
import { useCookies } from "react-cookie";
import Cookies from 'js-cookie';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

function LoginPage({ onLogin, isAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie] = useCookies(["user"]);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.get('/authenticate', {
      params: { username, password },
    })
    .then(response => {
      console.log(response);
      const sessionToken = response.data.sessionToken;
      setCookie("fname", response.data.userFirstName, { path: "/" });
      setCookie("lname", response.data.userLastName, { path: "/" });
      setCookie("registerid", response.data.registerid, { path: "/" });
      setCookie("remcredit", response.data.remcredit, { path: "/" });
      setCookie("tdsremcredit", response.data.tdsremcredit, { path: "/" });
      setCookie("tenantInfo", response.data.tenant, { path: "/" });

      const timer = setTimeout(() => {
        Cookies.remove('sessionToken');
        alert("Session Expired!! Please Login Again.");
        window.location.reload();
      }, 300000);

      onLogin(sessionToken, timer);
    })
    .catch(() => {
      alert("False Credential! Re-enter the credentials correctly.");
    });
  };

  return (
    <>
      <div className="login-container bg-image rounded mx-auto d-block">
        <Navbar showLogoutButton={false} showGstAndTdsButton={false} />

        <div className="container-fluid pt-4">
          <div className="row rounded mt-5 align-items-center justify-content-center">
            {/* Form Section */}
            <div className="col-12 col-md-6">
              <form className="login-form-box" onSubmit={handleSubmit}>
                <h1 className="mb-4 pt-3 login-heading text-center">
                  {t("Login To VDX Recon")}
                </h1>

                <div className="form-group mb-3">
                  <label htmlFor="username" className="label">{t("Username")}</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control input-box"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="password" className="label">{t("Password")}</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control input-box"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>

                {/* Main Login button */}
                <div className="text-center">
                  <button type="submit" className="btn login-main-btn mb-3">
                    {t("Login")}
                  </button>
                </div>

                {/* Secondary Buttons */}
                <div className="d-flex justify-content-between">
                  {/* <Link to="/autointent_login" className="btn small-btn w-50 me-2">
                    {t("Auto Intent BOT")}
                  </Link> */}
                  {/* <Link to="/lead_login" className="btn small-btn w-50">
                    {t("Req / Lead App")}
                  </Link> */}
                </div>
              </form>
            </div>

            {/* Image Section */}
            <div className="col-md-6 d-flex justify-content-center mt-4 mt-md-0">
              <img className="img-fluid rounded login-image" src={logins} alt="Login" />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default LoginPage;
