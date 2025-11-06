import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "../Navbar/Navbar";
import UploadForm from "./UploadForm/UploadForm";
import RenderComponent from "./RenderComponent";
import axios from "axios";
import Footer from "../Footer/Footer";
import "./UploadForm/Dashboard.css";
import Cookies from "js-cookie";
import config from "../../config/config";
import { useTranslation } from "react-i18next";

function Dashboard({ onLogout, isAuthenticated }) {
  const [msg, setMsg] = useState("Click On Submit To get Response");
  const [load, setLoad] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [mailId, setMailId] = useState(null);
  const [message, setMessage] = useState("");
  const [req_id, setReqId] = useState(null);
  const [file, setFile] = useState(null);
  const [down, setDown] = useState(false);
  const messageRef = useRef();
  const remcredit = parseInt(Cookies.get("remcredit") || "0");
  const registerid = Cookies.get("registerid");
  const { t } = useTranslation();

  const [total_credit, setTotalCredit] = useState(remcredit);
  const [row_count, setRowCount] = useState(0);

  useEffect(() => {
    if (remcredit < 0) {
      setMsg("Credit has expired. Please purchase it from admin.");
    }
  }, [remcredit]);

  const validateFileExtension = (file, allowedExtensions) => {
    const fileExtension = file.name.split(".").pop();
    return allowedExtensions.includes(fileExtension);
  };

  const handleSendMessage = async () => {
    const message = messageRef.current.value;
    try {
      const response = await axios.post(`${config.baseURL.message}${config.api.messages.send}`, {
        message,
      });
      if (response.data.success) {
        messageRef.current.value = "";
      } else {
        console.error("Failed to send message:", response.data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return !emailRegex.test(email);
  };

  const handleFile1Change = (event) => setFile1(event.target.files[0]);
  const handleFile2Change = (event) => setFile2(event.target.files[0]);
  const handlMail = (event) => setMailId(event.target.value);

  const displayMessage = (msg) => setMessage(msg);

  const callRender = (res) => {
    setLoad(false);
    setMsg(res.status);
    if (res.file_id) {
      setFile(res.file_id);
      setReqId(res.request_id);
      setDown(true);
    }
    setRowCount(res.row_count);
    setTotalCredit(res.total_credit);
  };

  const downloadF = async () => {
    const sessionToken = Cookies.get("sessionToken");
    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/[/: ]/g, "_");

    const filename = `GST_Reconciliation_${formattedDate}.xlsx`;
    const requestData = { sessionToken, requestId: req_id, fileId: file };

    await axios({
      url: "/download",
      method: "GET",
      params: requestData,
      responseType: "blob",
    })
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => {
        alert("Error occurred while downloading the file! Please try again.");
      });
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const allowedExtensions = ["xlsx", "xls"];
    if (!file1 || !file2) {
      alert("Files Not selected!! Please select the files.");
      return;
    }
    if (!validateFileExtension(file1, allowedExtensions)) {
      alert("File1 has an invalid extension!");
      return;
    }
    if (!validateFileExtension(file2, allowedExtensions)) {
      alert("File2 has an invalid extension!");
      return;
    }
    if (!mailId) {
      alert("Please enter an email address.");
      return;
    }
    if (validateEmail(mailId)) {
      alert("Please enter a valid email address.");
      return;
    }

    const formData = new FormData();
    formData.append("files", file1);
    formData.append("files", file2);
    formData.append("mailId", mailId);

    const sessionToken = Cookies.get("sessionToken");
    const tenantInfo = JSON.parse(Cookies.get("tenantInfo"));
    formData.append("sessionToken", sessionToken);
    formData.append("tenantName", tenantInfo.name);
    formData.append("tenantOrgCode", tenantInfo.orgCode);
    formData.append("registerid", registerid);

    await axios
      .post("/upload", formData)
      .then((response) => {
        setRequestId(response.data);
        setLoad(true);
      })
      .catch(() => alert("Upload unsuccessful - please try again."));
  };

  return (
    <>
      <div className="container-fluid">
        <Navbar showLogoutButton={true} showGstAndTdsButton={true} onLogout={onLogout} />

        <div className="container mt-3 pt-5">
          <div className="row">
            <div className="col-md-6">
              <div className="card bg-light text-black h-100">
                <div className="card-body shadow border rounded border-2">
                  <div className="border-bottom border-info fs-4 fw-semibold mb-3 text-center">
                    <h4>{t("Reconciliation Of GST")}</h4>
                  </div>
                  <UploadForm
                    handleFile1Change={handleFile1Change}
                    handleFile2Change={handleFile2Change}
                    handleSubmitForm={handleSubmitForm}
                    handleMail={handlMail}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card bg-light text-black h-100">
                <div className="card-body border rounded border-2 shadow text-center">
                  <h4 className="response-field text-center border-bottom border-info">
                    {t("Check Your Response")}
                  </h4>
                  <div className="mt-5 p-4"></div>
                  {load ? (
                    <RenderComponent
                      requestId={requestId}
                      registerid={registerid}
                      callRender={callRender}
                    />
                  ) : (
                    <div>
                      <h5>{t("Click On Submit To get Response")}</h5>
                      {down && (
                        <button
                          className="btn btn-primary border border-dark me-3"
                          onClick={downloadF}
                        >
                          {t("Download Here!")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Payment + Stats Section ===== */}
        <div className="container pt-3">
          <div className="row">
            {/* Left Pay Section */}
            {/* <div className="col-md-6">
              <div className="card bg-light text-black h-100">
                <div className="card-body shadow border rounded border-2 text-center">
                  <h4 className="response-field text-center border-bottom border-info">
                    {t("Click to Pay")}
                  </h4>
                  <a
                    href="#"
                    target="_blank"
                    className="btn btn-primary fs-6 fst-italic border my-3"
                    rel="noreferrer"
                  >
                    {t("Pay")}
                  </a>
                  <hr />
                  <div style={{ textAlign: "center", marginLeft: "5px" }}>
                    <button onClick={() => displayMessage("Text message Template 1")} className="btn btn-primary btn-sm me-2">
                      {t("MSG1")}
                    </button>
                    <button onClick={() => displayMessage("Text message Template 2")} className="btn btn-primary btn-sm me-2">
                      {t("MSG2")}
                    </button>
                    <button onClick={() => displayMessage("Text message Template 3")} className="btn btn-primary btn-sm">
                      {t("MSG3")}
                    </button>
                  </div>
                  <div className="d-grid gap-2 col-8 mx-auto mt-3">
                    <textarea
                      ref={messageRef}
                      rows="4"
                      className="form-control"
                      placeholder="Write Your SMS"
                      value={message}
                      readOnly
                    ></textarea>
                    <button className="btn btn-primary btn-sm" onClick={handleSendMessage}>
                      {t("Send SMS To Client")}
                    </button>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Right Stats Section */}
            <div className="col-md-6">
              <div className="stats-container">
                <div className="stats-card">
                  <h5>{t("Total Rows Count")}</h5>
                  <p>{row_count}</p>
                </div>
                <div className="stats-card">
                  <h5>{t("Total Credit Left")}</h5>
                  <p>{total_credit}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Dashboard;
