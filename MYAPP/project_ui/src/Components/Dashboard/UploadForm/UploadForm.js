import React, { useState, useEffect } from 'react';
import './UploadForm.css';
import { useTranslation } from 'react-i18next';
import fileDownload from 'js-file-download';

function UploadForm({ handleFile1Change, handleFile2Change, handleSubmitForm, handleMail }) {
  const { t } = useTranslation();
  const [remcredit, setRemCredit] = useState(0);

  // Function to retrieve remcredit from the cookie
  const getRemCreditFromCookie = () => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'remcredit') {
        return parseInt(value, 10); // Assuming the value is an integer
      }
    }
    return 0; // Default value if cookie not found or not a valid integer
  };

  useEffect(() => {
    // Get remcredit from the cookie when the component mounts
    const remCreditValue = getRemCreditFromCookie();
    setRemCredit(remCreditValue);
  }, []);

  const downloadSampleFile = () => {
    fetch('/api/download-sample-file')
      .then(response => response.blob())
      .then(data => {
        fileDownload(data, "Sample_File.zip"); // Use 'fileDownload' instead of 'FileDownload'
      })
      .catch(error => {
        console.error('Error downloading sample file', error);
      });
  };

  return (
    <div class="container">
      <form class="Form" onSubmit={handleSubmitForm}>
        <div class="row">
          <div class="col-md-6">
            <label className='form-label' htmlFor="file1">{t('GST ITC As Per Accounts')}:</label>
            <input
              type="file"
              id="file1"
              className="form-control"
              onChange={handleFile1Change}
            /><br></br>
            
            <label class="form-label" htmlFor="email">
              {t('Email Address')}:
            </label>
            <input
              type="text"
              id="email"
              className="form-control"
              onChange={handleMail}
            />
          </div>
  
          <div class="col-md-6">
            <label class="form-label" htmlFor="file2">{t('GST ITC As Per 2B/2A')}:</label>
            <input
              type="file"
              id="file2"
              className="form-control"
              onChange={handleFile2Change}
            />                    
          </div>
        </div>
            <div>
              <br></br>
            </div>
        <div class="row">
          <div class="col text-center">
            <button
              type="submit"
              className="btn btn-primary btn-md"
              disabled={remcredit < 0} // Disable the button if remcredit is less than 0
            >
              {t('Submit')}
            </button>
          </div>

          <div class="col text-center">
            <button type="button" class="btn btn-link" onClick={downloadSampleFile}>{t('Get Input Sample Files')}</button>
          </div>

        </div>
      </form>
    </div>
  );
  
}
export default UploadForm; 
