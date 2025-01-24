import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../ComponentCss/Admin.css";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import apiClient from '../utlis/apiClient';
import appShive from "../image/full logo.png"; // Logo for first render
import CustomLogo from "./CustomLogo";
import { AuthContext } from "../Authorization/AuthContext";

const Admin = () => {

  const { login } = useContext(AuthContext);

  const [companyEmail, setCompanyEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(true); // Initially show logo
  const navigate = useNavigate();
  const currentUrl = window.location.href;
  const urlWithoutProtocol = currentUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const hostAndPort = urlWithoutProtocol.split("/")[0];
  const { logoUrl, dynamicStyles, titleName } = CustomLogo(hostAndPort);

  useEffect(() => {
    // Check sessionStorage to determine if the logo should show
    const isSessionFirstVisit = sessionStorage.getItem("firstRender");

    if (!isSessionFirstVisit) {
      sessionStorage.setItem("firstRender", "true");
      setTimeout(() => {
        setShowLogo(false); // Hide logo after 1 second
      }, 1000);
    } else {
      setShowLogo(false); // Hide immediately on refresh
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setOpen(false);

    try {
      const response = await apiClient.post(
        `/api/user/login`,
        {
          companyEmail,
          password,
        }
      ); 

      if (response.data.message === "Login successful") {

        login(response.data.token);

        if (response.data.company.CompanyName === titleName) {
          localStorage.removeItem("token");
          localStorage.removeItem("company");

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.company));

          const { token } = response.data;
          sessionStorage.setItem("authToken", token); 

          setSuccess("Login successful");
          setOpen(true);
          navigate("/ManageTender");
        } else {
          alert("Incorrect login details");
        }
      } else {
        console.log("Unable to login");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Invalid email or password");
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  // Render loading logo first, then render rest of the content
  if (showLogo) {
    return (
      <div
        className="loading-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <img src={appShive} alt="Loading Logo" style={{ height: "200px" }} />
      </div>
    );
  }

  return (
    <div className="Adminlogin">
      <div className="container" style={{ background: dynamicStyles.backgroundColor }}>
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
              <i className="fa-solid fa-circle-exclamation"></i> Please enter a valid password
            </p>

            <button type="submit">SIGN IN</button>
          </form>
        </div>

        <div className="toggle_container">
          <div className="toggle">
            <div className="toggle_panel toggle_right">
              <img
                src={logoUrl}
                alt="Logo"
                style={{ height: "140px" }}
              />
            </div>
          </div>
        </div>
      </div>

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

export default Admin;
