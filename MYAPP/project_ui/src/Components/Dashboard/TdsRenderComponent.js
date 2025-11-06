import React, { useEffect, useState } from "react";
import "./RenderComponent.css";
import axios from "axios";
import "./Tds"
import { saveAs } from "file-saver";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

function TdsRenderComponent({ requestId, callRender }) {
  const { t } = useTranslation();

 //tds status api call
 const gettdsStatus = async () => {
  const sessionToken = Cookies.get("sessionToken");
  const registerid = Cookies.get("registerid");
  const requestData = {
    sessionToken: sessionToken,
    requestId: requestId,
    registerid: registerid,
  };

  await axios
    .get("/tdsstatus", { params: requestData })
    .then((response) => {
      console.log("I am here");
      callRender(response.data);
    })
    .catch((error) => {
      callRender();
    });
};
useEffect(() => {
  gettdsStatus();
}, []);

  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <h2>{t("Loading")}... </h2>
    </div>
  );
}

export default TdsRenderComponent;
