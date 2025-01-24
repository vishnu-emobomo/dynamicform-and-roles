import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import { Box, Grid, TextField, Button, Typography, FormControl,
  InputLabel,
  Select,
  MenuItem, } from "@mui/material";
import { styled } from "@mui/system";
import apiClient from "../utlis/apiClient";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "10px", // Adjust this to change only the placeholder size
  },
});

const UpdateMaterial = () => {
  const location = useLocation();
  const { productPK, productData } = location.state || {};
  // console.log("HI", productPK, productData);

  const [ProductPK, setProductPK] = useState(encodeURIComponent(productPK));

  const [formData, setFormData] = useState({
    MaterialName: "",
    Grade: "",
    Dimension: "",
    MaterialId: "",
    // Quantity: "",
    Comments: "",
  });

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      const updatedData = { ...prevState, [name]: value };

      // Calculate the MaterialId if necessary fields change
      if (name === 'MaterialName' || name === 'Grade' || name === 'Dimension') {
        const materialId = `${updatedData.MaterialName}${updatedData.Grade}-${updatedData.Dimension}`;
        updatedData.MaterialId = materialId;
      }

      return updatedData;
    });
  };

  useEffect(() => {
    // Fetch tender data by PK
    const fetchProductData = async () => {
      try {
        const response = await apiClient.get(
          `/api/product/get-product-by-id/${ProductPK}`
        );
        const fetchedData = response.data;

        // console.log(fetchedData, "Fetched Products Details"); // Log the entire response

        // Check if data exists and is an array with at least one item
        if (fetchedData && fetchedData.data && fetchedData.data.length > 0) {
          const product = fetchedData.data[0]; // Safely access the first product
          // console.log("Product", product);

          // Update formData with the fetched product data
          setFormData((prevData) => ({
            ...prevData,
            MaterialName: product.MaterialName || "",
            Grade: product.Grade || "",
            Dimension: product.Dimension || "",
            // Quantity: product.Quantity || "",
            MaterialId: product.Name || "",
            Comments: product.Comments || "",
            ProductPK: product.PK || "",
          }));

          // console.log(formData);
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

  const token = sessionStorage.getItem("authToken");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { Quantity, ...otherFields } = formData;
    const payload = {
      ...otherFields,
      Values: { ...otherFields }, // Store other fields under Values
      // Quantity: Number(Quantity), // Ensure Quantity is a number
    };

    try {
      const response = await axios.put(
        `https://622xlqs7dh.execute-api.ap-south-1.amazonaws.com/Dev/api/product/update-product`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add authorization if needed
          },
        }
      );
      // console.log("Product updated successfully", payload);
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
              Material Update
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>

                <Grid item xs={12} md={2}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="material-label" shrink>
                      Material Name
                    </InputLabel>
                    <Select
                      id="MaterialName"
                      name="MaterialName"
                      label="Material Name"
                      value={formData.MaterialName}
                      onChange={handleChange}
                      labelId="material-label"
                    >
                      <MenuItem value="Aluminum">Aluminum SS</MenuItem>
                      <MenuItem value="Copper">Copper</MenuItem>
                      <MenuItem value="EN">EN Series</MenuItem>
                      <MenuItem value="SS">SS Series</MenuItem>
                      <MenuItem value="Brass">Brass</MenuItem>
                      <MenuItem value="MS">MS</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <StyledTextField
                  id="Grade"
                    name="Grade"
                    label="Grade"
                    value={formData.Grade}
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
                  id="Dimension"
                    name="Dimension"
                    label="Dimension"
                    type="text"
                    value={formData.Dimension}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <StyledTextField
                  id="MaterialId"
                    name="MaterialId"
                    label="Material Id"
                    type="text"
                    value={formData.MaterialId}
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
                    id="Comments"
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

export default UpdateMaterial;