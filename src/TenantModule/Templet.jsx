import React, { useEffect, useState } from "react";

import {
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

} from "@mui/material";
import "../ComponentCss/OnBoard.css";
import Header from "../Components/Header";
import SideBar from "../Components/SideBar";

import { useLocation } from "react-router-dom";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const StudentData = () => {
  const location = useLocation();
  const selectedLogo = new URLSearchParams(location.search).get("selectedLogo");





  const [formData, setFormData] = useState({
    EMP_CODE: "",
    NAME: "",
    SURNAME: "",
    SEX: "",
    AGE: "",
    PHONE_NUMBER: "",
    GUARDIAN_NAME: "",
    GUARDIAN_PHONE_NUMBER: "",
    RELATIONSHIP: "",
    ADDRESS: "",
    CITY: "",
    STATE: "",
    STATUS: "",
  });





  // const title = "Student Details";

  return (
    <div className="background">
      <Header/>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#eae7eb",
        }}
      >
        <SideBar />
{/* 
          <div id="main">
            <form id="form">
              <br></br>

              <Grid container spacing={3} className="grid2">
                <Grid item xs={11} sm={5} md={4} lg={2}>
                  <TextField
                    fullWidth
                    label="Student Id"
                    name="EMP_CODE"
                    variant="outlined"
              

                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>

                <Grid item xs={11} sm={5} md={4} lg={2}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="NAME"
                    variant="outlined"

                  />
                </Grid>

                <Grid item xs={11} sm={5} md={4} lg={2}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="SURNAME"
                    variant="outlined"
   
                  />
                </Grid>

                <Grid item xs={11} sm={5} md={4} lg={2}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      label="Sex"
                      name="SEX"
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>

                  </FormControl>
                </Grid>

                <Grid item xs={11} sm={5} md={4} lg={2}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="AGE"
                    type="number"
                    variant="outlined"
                  />
                </Grid>

            



                <Grid item xs={12} sm={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ width: "20%", backgroundColor: "#306ef3" }}
                    fullWidth
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div> */}
        {/* </motion.Container> */}
      </div>
    </div>
  );
};

export default StudentData;
