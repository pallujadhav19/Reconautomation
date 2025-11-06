import React, { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import "./RenderComponent.css";

function RenderComponent({ requestId, callRender }) {
  const { t } = useTranslation();

  const getStatus = async () => {
    const sessionToken = Cookies.get("sessionToken");
    const registerid = Cookies.get("registerid");
    const requestData = {
      sessionToken,
      requestId,
      registerid,
    };

    try {
      const response = await axios.get("/status", { params: requestData });
      callRender(response.data);
    } catch (error) {
      callRender();
    }
  };

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <div className="loading-container">
      <div className="modern-spinner"></div>
      <h2 className="loading-text">{t("Loading")}...</h2>
      <p className="loading-subtext">{t("Please wait while we fetch your data")}</p>
    </div>
  );
}

export default RenderComponent;
