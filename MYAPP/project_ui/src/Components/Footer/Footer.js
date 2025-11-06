import React from "react";
import './Footer.css';
import Languageoption from "../language_dropdown";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const footerClass = isDashboard ? 'fixed-footer' : 'fixed-bottom';

  const { t } = useTranslation();
  const whatsappLink = "https://web.whatsapp.com/";

  const handleClick = (e) => {
    i18next.changeLanguage(e.target.value);
  };

  return (
    <footer className={`footer ${footerClass}`}>
      <div className="footer-container">
        <div className="footer-left">
          <a href="https://valuedx.com/" target="_blank" rel="noopener noreferrer">
            ValueDx Technologies Pvt Ltd
          </a>
        </div>
        <div className="footer-center">
          ☎ 8857861943 | © 2023 ValueDx, All rights reserved
        </div>
        <div className="footer-right">
          <Languageoption onChange={(e) => handleClick(e)} />
          <a id="whatsapp" href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} size="lg" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
