import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ComponentCss/Admin.css";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import apiClient from '../utlis/apiClient';
import appShive from "../image/full logo.png";

const TestLogin = () => {
  const [companyEmail, setCompanyEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [urlPK, setUrlPk] = useState('');
  const navigate = useNavigate();
  const [dynamicStyles, setDynamicStyles] = useState({});

  const currentUrl = window.location.href;

  const urlWithoutProtocol = currentUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const hostAndPort = urlWithoutProtocol.split('/')[0]; // Get the host and port

  console.log(hostAndPort)

    fetch(`https://a9ut8qu643.execute-api.ap-south-1.amazonaws.com/api/data-from-url/${hostAndPort}`)
        .then( response =>{
            if(!response.ok){
                throw new Error("Network response was not ok");
            }
            return response.json();
    })
    .then(data => {
        if(data.items && data.items.length > 0){
        console.log(data.items)
        setLogoUrl(data.items[0].Logo);
        setUrlPk(data.items[0].PK);
        setDynamicStyles(data.items[0].style.backgroundColor)
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });



  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setOpen(false);

    try {
      const response = await apiClient.post(
        `/api/users/login`,
        {
          companyEmail,
          password,
        }
      ); 

      console.log(response)

      if (response.data.message === "Login successful") {

        console.log(response.data.response.company.PK)
        if (response.data.response.company.PK === urlPK ) {
            localStorage.removeItem("token");
            localStorage.removeItem("company");

            // Store token and user details in localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.company));

            const { token } = response.data;
            console.log(token)
            sessionStorage.setItem("authToken", token); 

            setSuccess("Login successful");
            setOpen(true);
            navigate("/ManageTender");
        } else{
          alert("in correct login details ")
        }
      }
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Invalid email or password");
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <div className="Adminlogin">
      <div className="container" style={{backgroundColor: dynamicStyles}} >
        <div className="sign_in form_container">
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <br />
            <input
              className="email1"
              type="email"
              placeholder="Email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              required
            />
            <p className="emailfield1 text">
              <i className="fa-solid fa-circle-exclamation"></i>
              Please enter a valid email-address
            </p>

            <div className="passdiv">
              <input
                className="pass1"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="fa-solid fa-lock show-hide"></i>
            </div>
            <p className="passfield1 text">
              <i className="fa-solid fa-circle-exclamation"></i> Please enter a
              valid password
            </p>

            <button type="submit">SIGN IN</button>
          </form>
        </div>
        <div className="toggle_container">
          <div className="toggle">
            <div className="toggle_panel toggle_right">
              <img
                src={logoUrl}
                alt="Description of the image"
                style={{ height: "140px" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Snackbar for error/success messages */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {error ? (
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        ) : (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default TestLogin;
