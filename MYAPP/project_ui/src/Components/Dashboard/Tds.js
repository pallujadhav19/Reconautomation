import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "../Navbar/Navbar";
import UploadForm from './UploadForm/UploadForm';
import UploadTdsForm from "./UploadForm/UploadTdsForm";
import RenderComponent from "./RenderComponent";
import axios from "axios";
import Footer from "../Footer/Footer";
import "./UploadForm/Dashboard.css";
import Cookies from "js-cookie";
import cors from "cors";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Languageoption from "../language_dropdown";
import TdsRenderComponent from "./TdsRenderComponent";

function Tds({ onLogout }) {
  const [msg, setMsg] = useState("Click On Submit To get Response");
  const [load, setLoad] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const registerid = Cookies.get("registerid");
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const tdsremcredit = parseInt(Cookies.get("tdsremcredit") || "0");
  useEffect(() => {
    // Update the message based on the value of remcredit
    if (tdsremcredit < 0) {
      setMsg("Credit has expired. Please purchase it from admin.");
    }
  }, [tdsremcredit]);

  const [mailId, setMailId] = useState(null);

  const [req_id, setReqId] = useState(null);
  const [file, setFile] = useState(null);
  const [down, setDown] = useState(false);

  
  const [total_credit, setTotalCredit] = useState(tdsremcredit);
  const [row_count, setRowCount] = useState(0);
  const { t } = useTranslation();

  const validateFileExtension = (file, allowedExtensions) => {
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop();
    return allowedExtensions.includes(fileExtension);
  };

  const validateEmail = (email) => {
    // Regular expression for a simple email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    console.log(email);
    console.log(emailRegex.test(email));
    return !emailRegex.test(email);
  };

  // Handling file1 extension and file name
  const handleFile1Change = (event) => {
    setFile1(event.target.files[0]);
  };

  // Handling File2 extension and file name
  const handleFile2Change = (event) => {
    setFile2(event.target.files[0]);
  };

  // Handling mail input

  const handlMail = (event) => {
    setMailId(event.target.value);
  };

  
  const callRender = (res) => {
    console.log("set load false");
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

  const tdsdownloadF = async () => {
    const sessionToken = Cookies.get("sessionToken");
    const currentDate = new Date();
    const options = { day: 'numeric', month: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedDate = currentDate.toLocaleDateString('en-GB', options).replace(/[/: ]/g, "_");

    const filename = `TDS_Reconciliation_${formattedDate}.xlsx`;
    const requestData = {
      sessionToken: sessionToken,
      requestId: req_id,
      fileId: file,
    };
    await axios({
      url: "/tdsdownload",
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
      .catch((error) => {
        alert(
          "Error occurred while downloading the file! Please try again.",
          error
        );
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
    const registerid = Cookies.get("registerid");

    formData.append("sessionToken", sessionToken);
    formData.append("tenantName", tenantInfo.name);
    formData.append("tenantOrgCode", tenantInfo.orgCode);
    formData.append("registerid", registerid);

    //call to upload api - express
    const response = await axios
      .post("/uploadtds", formData)
      .then((response) => {
        setRequestId(response.data);
        //console.log(response.data);
        console.log("set load true");
        setLoad(true);
      })
      .catch((error) => {
        alert("Upload unsuccessfull - do it once again");
      });
  };

  return (
    <>
      <div className="container">
        <Navbar
          showLogoutButton={true}
          showGstAndTdsButton={true}
          onLogout={onLogout}
        />

        <div class="container mt-3 pt-5">
          <div class="row">
            <div class="col-md-6">
              <div class="card bg-card bg-light text-black h-100">
                <div class="card-body shadow border rounded border-2">
                  <div class="form-group">
                    <div class="border-bottom border-info fs-4 fw-semibold mb-3 text-center">
                      <h4>{t("Reconciliation Of TDS")}</h4>
                    </div>
                    <UploadTdsForm
                      handleFile1Change={handleFile1Change}
                      handleFile2Change={handleFile2Change}
                      handleSubmitForm={handleSubmitForm}
                      handleMail={handlMail}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card bg-card bg-light text-black h-100">
                <div class="card-body border rounded border-2 shadow text-center">
                  <h4 className="response-field text-center border-bottom border-info">
                    {t("Check Your Response")}
                  </h4>
                  <div class="mt-5 p-4"></div>
                  {load ? (
                    <TdsRenderComponent
                      requestId={requestId}
                      registerid={registerid}
                      callRender={callRender}
                    />
                  ) : (
                    <div>
                      <h5>{t("Click On Submit To get Response")}</h5>
                      {down && (
                        <button className="btn btn-primary border border-dark me-3" onClick={tdsdownloadF}>{t("Download Here!")}</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container pt-3">
          <div class="row">
            <div class="col-md-6">
              <div class="box border rounded">
                <div class="card-deck">
                  <div class="card bg-card bg-light text-black h-100">
                    <div class="card-body card-body shadow border rounded border-2">
                      <div class="form-group">
                        <div className="empty-component d-grid gap-2 col-6 mx-auto">
                          <h4 class="text fs-4 fw-semibold text-center">
                            {t("Click to Pay")}
                          </h4>
                          <a
                            href="#"
                            target="_blank"
                            class="btn btn-primary fs-6 fst-italic border"
                          >
                            {t("Pay")}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="row">
                <div class="col-md-6 col-sm-4">
                  <div class="card-deck">
                    <div class="card bg-card bg-light text-black h-100">
                      <div
                        class="card-body text-center card-body shadow border rounded border-2"
                        style={{ fontSize: 25 }}
                      >
                        <p class="card-text  fs-4 fw-semibold">
                          {t("Total Rows Count")}
                        </p>
                        <div class="border border-2">{row_count}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-sm-4">
                  <div class="card-deck">
                    <div class="card bg-card bg-light text-black h-100">
                      <div
                        class="card-body text-center card-body shadow border rounded border-2"
                        style={{ fontSize: 25 }}
                      >
                        <p class="card-text  fs-4 fw-semibold">
                          {t("Total Credit Left")}
                        </p>
                        <div class="border border-2">{total_credit}</div>
                      </div>
                    </div>
                  </div>
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

export default Tds;
