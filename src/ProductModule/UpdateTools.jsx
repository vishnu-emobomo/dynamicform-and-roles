import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import { Box, Grid, TextField, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import apiClient from "../utlis/apiClient";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "10px", // Adjust this to change only the placeholder size
  },
});

const UpdateTools = () => {
  const location = useLocation();
  const { productPK, productData } = location.state || {};
  console.log("HI", productPK, productData);

  const [ProductPK, setProductPK] = useState(encodeURIComponent(productPK));

  const [formData, setFormData] = useState({
    Name: "",
    Type: "",
    Description: "",
    PhoneNumber: "",
    // Size: "",
    UOM: "",
    Quantity: "",
    Composition:"",
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target; // Use name instead of id
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Directly update the corresponding field in formData
    }));
  };

  useEffect(() => {
    // Fetch tender data by PK
    const fetchProductData = async () => {
      try {
        const response = await apiClient.get(
          `/api/product/get-product-by-id/${ProductPK}`
        );
        const fetchedData = response.data;

        console.log(fetchedData, "Fetched Products Details"); // Log the entire response

        // Check if data exists and is an array with at least one item
        if (fetchedData && fetchedData.data && fetchedData.data.length > 0) {
          const product = fetchedData.data[0]; // Safely access the first product
          console.log("Product", product);

          // Update formData with the fetched product data
          setFormData((prevData) => ({
            ...prevData,
            productNumber: product.Values.productNumber || "",
            productType: product.Values.productType || "",
            Quantity: product.Quantity || "",
            Category: product.Values.Category || "",
            Comments: product.Values.Comments || "",
            Name: product.Name || "",
            ProductPK: product.PK || "",
          }));

          console.log(formData);
        } else {
          console.log("No product data found");
        }
      } catch (error) {
        console.error("Error fetching Product data: ", error);
      }
    };

    if (ProductPK) {
      fetchProductData(); // Fetch data when PK is available
    }
  }, [ProductPK]);

  const token = sessionStorage.getItem("authToken"); // Ensure this is set correctly
  console.log("Using token:", token);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { Quantity, ...otherFields } = formData;
    const payload = {
      ...otherFields,
      Values: { ...otherFields }, // Store other fields under Values
      Quantity: Number(Quantity), // Ensure Quantity is a number
    };

    try {
      const response = await axios.put(
        `https://622xlqs7dh.execute-api.ap-south-1.amazonaws.com/Dev/api/product/update-product`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add authorization if needed
          },
        }
      );
      console.log("Product updated successfully", payload);
      alert("Updated successfully");
    } catch (error) {
      console.error("Error updating Product: ", error.response || error);
      alert("Unable to update");
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
              Product
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={2}>
                  <TextField
                    name="productNumber"
                    label="Product Number"
                    variant="standard"
                    type="text"
                    value={formData.productNumber}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <StyledTextField
                    name="Name"
                    label="Product Name"
                    value={formData.Name}
                    type="text"
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <StyledTextField
                    name="productType"
                    label="Product Type"
                    type="text"
                    value={formData.productType}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    name="Quantity"
                    label="Quantity"
                    variant="standard"
                    value={formData.Quantity}
                    type="number"
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
{/* 
                <Grid item xs={12} md={2}>
                  <TextField
                    name="Category"
                    label="Category"
                    value={formData.Category}
                    type="text"
                    variant="standard"
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid> */}

                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Comments"
                    name="Comments"
                    value={formData.Comments}
                    variant="standard"
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Grid container justify="flex-start">
                    <Grid item xs={12} md={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                      >
                        Update
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateTools;