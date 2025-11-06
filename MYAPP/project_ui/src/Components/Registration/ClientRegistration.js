import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import backgroundImage from '../Login/loginpage.jpg';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const ClientRegistration = () => {
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleRegister = async () => {
    // Perform form validation
    if (!clientName || !email || !mobileNo || !state || !country) {
      // Display an error message to the user
      console.error('Please fill out all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName,
          email,
          mobileNo,
          state,
          country,
        }),
      });

      if (response.ok) {
        // Registration successful
        console.log('Registration successful!');
        setRegistrationStatus('success');

        // Display success message in alert
        alert('Client Registration successful');

        // Reset form fields after successful registration
        setClientName('');
        setEmail('');
        setMobileNo('');
        setState('');
        setCountry('');
      } else {
        // Registration failed
        console.error('Registration failed');
        setRegistrationStatus('error');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setRegistrationStatus('error');
    }
  };

  return (
    
    <div
      className="container-fluid p-0"
      
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh', // Full height of the viewport
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: 'white', // Text color
      }}
    >
     
    <div className="container p-2">
     
        <h2 className="mb-4 mt-3 text-center">Client Registration</h2>
        <form className="text-center">
          <div className="mb-3">
            <label className="form-label">Client Name:</label>
            <input
              type="text"
              placeholder='Enter The Client Name'
              className="form-control"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email Id:</label>
            <input
              type="email"
              placeholder='Enter The Email Id'
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mobile No:</label>
            <input
              type="tel"
              placeholder='Enter The Mobile Number'
              className="form-control"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">State:</label>
            <input
              type="text"
              placeholder='Enter The State'
              className="form-control"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Country:</label>
            <input
              type="text"
              placeholder='Enter The Country'
              className="form-control"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary border border-dark"
            onClick={handleRegister}
          >
            Register
          </button>&nbsp;&nbsp;&nbsp;
          <Link to= "/" className="btn btn-primary border border-dark">Login</Link>
        </form>
        {registrationStatus === 'success' && (
          <p className="text-success mt-3">Registration successful!</p>
        )}
        {registrationStatus === 'error' && (
          <p className="text-danger mt-3">Registration failed. Please try again.</p>
        )}
      </div>
      </div>
    
  );
};

export default ClientRegistration;
