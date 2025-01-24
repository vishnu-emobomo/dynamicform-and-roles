import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import SubHeader from "../../Components/SubHeader";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import axios from "axios";
import apiClient from "../../utlis/apiClient";
import { Backdrop, CircularProgress } from "@mui/material";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "10px", // Adjust this to change only the placeholder size
  },
});

const UpdateCompany = () => {
  const location = useLocation();
  const [phoneError, setPhoneError] = useState("");
  const { pk } = location.state;
  const [loading, setLoading] = useState(false);

  // console.log(pk,": the partition key from the company");

  // Updated formData structure
  const [formData, setFormData] = useState({
    EntityType: "Customer",
    CreationDate: "",
    customerPK: pk,
    Name: "",
    CustomerEmail: "",
    GSTNumber: "",
    Address: "",
    PhoneNumber: "",
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
    // Fetch customer data by pk
    const fetchCustomerData = async () => {
      const partitionKey = encodeURIComponent(pk);

      // console.log(partitionKey,": the pk for the update the customer");
      try {
        const response = await apiClient(
          `/api/customer/get-customer-by-id/${partitionKey}`
        );

        // Log the full response to check its structure
        console.log("API Response:", response.data);

        console.log(response.data.data.Name,": name of the customer ");

        // Check if the response structure matches what you expect
        if (response.data && response.data.data && response.data.data.Values) {
          const values = response.data.data.Values; // Accessing Values from data

          // Update the formData state with fetched values
          setFormData((prevData) => ({
            ...prevData,
        
            EntityType: response.data.data.EntityType || prevData.EntityType,
            CreationDate:response.data.data.CreationDate || prevData.CreationDate,
            customerPK: response.data.data.PK || prevData.customerPK,
            CustomerEmail: values.CustomerEmail || "",
            Address: values.Address || "",
            PhoneNumber: values.PhoneNumber || "",
            Name: response.data.data.Name || "",
            GSTNumber: values.GSTNumber || "",
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

    fetchCustomerData();
  }, [pk]);

  const token = sessionStorage.getItem("authToken"); // Ensure this is set correctly
  // console.log("Using token:", token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await axios.put(
        "https://rnl2s9ho61.execute-api.ap-south-1.amazonaws.com/Dev/api/customer/update-customer",
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
      console.log("Customer updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating vendor:", error);
    } finally {
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
              Customer Update
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={2}>
                  <TextField
                    id="Name"
                    name="Name"
                    label="Customer Name"
                    variant="standard"
                    type="text"
                    value={formData.Name}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="CustomerEmail"
                    name="CustomerEmail"
                    label="Customer Email"
                    type="email"
                    value={formData.CustomerEmail}
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
                    id="GSTNumber"
                    name="GSTNumber"
                    label="GST Number"
                    type="text"
                    value={formData.GSTNumber}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
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
          </Box>
        </Grid>
      </Grid>
      <Backdrop
        open={loading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default UpdateCompany;