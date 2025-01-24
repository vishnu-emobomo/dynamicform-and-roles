import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import axios from "axios";
import apiClient from "../utlis/apiClient";
import { Backdrop, CircularProgress } from "@mui/material";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "10px", // Adjust this to change only the placeholder size
  },
});

const UpdateVendor = () => {
  const location = useLocation();
  const [phoneError, setPhoneError] = useState("");
  const { pk } = location.state;
  const [loading, setLoading] = useState(false);

  // Updated formData structure
  const [formData, setFormData] = useState({
    userPK: null,
    EntityType: "Vendor",
    CreationDate: "",
    vendorPK: pk,
    CompanyName: "",
    CompanyEmail: "",
    // VendorPrefix: "",
    Address: "",
    PhoneNumber: "",
    Name: "",
    VendorStatus: "",
    Comments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Changing:", name, value); // Log changes to see if they are captured
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "PhoneNumber") {
      if (value.length !== 10) {
        setPhoneError("Phone number must be exactly 10 digits");
      } else {
        setPhoneError(""); // Clear error if valid
      }
    }
  };

  useEffect(() => {
    // Fetch vendor data by pk
    const fetchVendorData = async () => {
      const partitionKey = encodeURIComponent(pk);
      try {
        const response = await apiClient(
          `/api/vendor/get-vendor-by-id/${partitionKey}`
        );

        // Log the full response to check its structure
        console.log("API Response:", response.data);

        // Check if the response structure matches what you expect
        if (response.data && response.data.data && response.data.data.Values) {
          const values = response.data.data.Values; // Accessing Values from data

          // Update the formData state with fetched values
          setFormData((prevData) => ({
            ...prevData,
            userPK: response.data.data.userPK || prevData.userPK,
            EntityType: response.data.data.EntityType || prevData.EntityType,
            CreationDate:
              response.data.data.CreationDate || prevData.CreationDate,
            vendorPK: response.data.data.PK || prevData.vendorPK,
            // VendorPrefix: values.VendorPrefix || prevData.VendorPrefix,
            CompanyName: values.CompanyName || "",
            CompanyEmail: values.CompanyEmail || "",
            Address: values.Address || "",
            PhoneNumber: values.PhoneNumber || "",
            Name: response.data.data.Name || "",
            VendorStatus: values.VendorStatus || "",
            Comments: values.Comments || "",
          }));
        } else {
          console.warn(
            "Values section not found in the response. Structure: ",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchVendorData();
  }, [pk]);

  const token = sessionStorage.getItem("authToken"); // Ensure this is set correctly
  console.log("Using token:", token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await axios.put(
        "https://rnl2s9ho61.execute-api.ap-south-1.amazonaws.com/Dev/api/vendor/update-vendor",
        {
          ...formData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("updated successfully");
      // Log the response for debugging
      console.log("Vendor updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating vendor:", error);
    }  finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <SubHeader />

      <Grid
        container
        sx={{ flexGrow: 1, marginTop: "-80px", padding: 0 }}
        spacing={6}
      >
        <Grid item xs={12} md={2}>
          <Box
            sx={{
              height: "calc(100vh - 112px)",
              backgroundColor: "white",
              borderRadius: "10px",
              marginLeft: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          ></Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box
            sx={{
              height: "calc(100vh - 112px)",
              backgroundColor: "white",
              padding: 2,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginLeft: "-60px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Vendor
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={2}>
                  <TextField
                    id="CompanyName"
                    name="CompanyName"
                    label="Company Name"
                    variant="standard"
                    type="text"
                    value={formData.CompanyName}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="CompanyEmail"
                    name="CompanyEmail"
                    label="Company Email"
                    type="email"
                    value={formData.CompanyEmail}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="Address"
                    name="Address"
                    label="Address"
                    variant="standard"
                    value={formData.Address}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="PhoneNumber"
                    name="PhoneNumber"
                    label="Phone Number"
                    type="tel"
                    variant="standard"
                    value={formData.PhoneNumber}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!phoneError} // Highlights input in red if there's an error
                    helperText={phoneError} // Shows the error message below the field
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="Name"
                    name="Name"
                    label="Vendor Name"
                    type="text"
                    value={formData.Name}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                {/* <Grid item xs={12} md={2}>
                  <TextField
                    id="Name"
                    name="VendorPrefix"
                    label="Vendor Prefix"
                    type="text"
                    value={formData.VendorPrefix}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid> */}

                <Grid item xs={12} md={2}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="vendor-status-label" shrink>
                      Vendor Status
                    </InputLabel>
                    <Select
                      id="VendorStatus"
                      name="VendorStatus"
                      label="Vendor Status"
                      value={formData.VendorStatus}
                      onChange={handleChange}
                      labelId="vendor-status-label"
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="InActive">In Active</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Comments"
                    name="Comments"
                    variant="standard"
                    value={formData.Comments}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              <br></br>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Backdrop
              open={loading}
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateVendor;