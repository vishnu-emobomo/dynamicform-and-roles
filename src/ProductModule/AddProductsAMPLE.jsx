import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import { Box, Grid, TextField, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { getUserId } from "../utlis/tokenUtils";
import Autocomplete from "@mui/material/Autocomplete";
import apiClient from "../utlis/apiClient";
import { Backdrop, CircularProgress } from "@mui/material";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "10px", // Adjust this to change only the placeholder size
  },
});

const AddProduct = () => {
  const [userPK, setUserPK] = useState(null);
  const [loading, setLoading] = useState(false);

  const productType = [
    { Name: "Pipe" },
    { Name: "Round Bar" },
    { Name: "Flange" },
    { Name: "Fitting" },
    { Name: "Plate" },
    { Name: "Fasteners" },
    { Name: "Wire" },
    { Name: "Angle" },
    { Name: "Channel" },
    { Name: "Circle" },
  ];

  // Mapping of product types to related categories
  const productCategories = {
    Pipe: [
      "Carbon Steel Pipe",
      "Alloy Steel Pipe",
      "API 5L Pipe",
      "Monel Pipe",
      "Inconel Pipe",
      "Monel Pipe",
      "Inconel Pipe",
      "Titanium Pipe",
      "Corten Steel Pipe",
    ],
    "Round Bar": [
      "Stainless Steel Round Bars",
      "Carbon Steel Round Bars",
      "Alloy Steel Round Bars",
      "Aluminium Round Bars",
    ],
    Flange: [
      "Stainless Steel Flange",
      "Carbon Steel Flange",
      "Duplex Steel Flange",
      "Alloy Steel Flange",
    ],
    Fitting: [
      "Stainless Steel Fittings",
      "Carbon Steel Fittings",
      "Inconel Fittings",
    ],
    Plate: ["Stainless Steel Plates", "Titanium Plates", "Monel Plates"],
    Fasteners: [
      "Stainless Steel Fasteners",
      "Alloy Steel Fasteners",
      "Inconel Fasteners",
      "Hastelloy Fasteners",
    ],
    Wire: ["Zirconium Wire", "Niobium Wire", "Niobium Wire"],
    Angle: ["Stainless Steel Angle"],
    Channel: ["Stainless Steel Channel"],
    Circle: ["Stainless Steel Circle"],
  };

  const productTypeFields = {
    Pipe: [
      { label: "Outer Diameter", name: "OuterDiameter" },
      { label: "Length", name: "Length" },
      { label: "Thickness", name: "Thickness" },
      { label: "Specifications", name: "Specifications" },
    ],
    "Round Bar": [
      { label: "Diameter", name: "Diameter" },
      { label: "Length", name: "Length" },
      { label: "Range", name: "Range" },
      { label: "Specifications", name: "Specifications" },
    ],
    Plate: [
      { label: "Size", name: "Size" },
      { label: "Thickness", name: "Thickness" },
      { label: "Specifications", name: "Specifications" },
    ],
    Fasteners: [
      { label: "Length", name: "Length" },
      { label: "Size", name: "Size" },
      { label: "Specifications", name: "Specifications" },
    ],
    Fitting: [
      { label: "Size", name: "Size" },
      { label: "Thickness", name: "Thickness" },
      { label: "Specifications", name: "Specifications" },
    ],
    Angle: [
      { label: "Size", name: "Size" },
      { label: "Thickness", name: "Thickness" },
      { label: "Specifications", name: "Specifications" },
    ],
    Channel: [
      { label: "Size", name: "Size" },
      { label: "Thickness", name: "Thickness" },
      { label: "Specifications", name: "Specifications" },
      { label: "Range", name: "Range" },
    ],
    Circle: [
      { label: "Diameter", name: "Diameter" },
      { label: "Thickness", name: "Thickness" },
      { label: "Circle", name: "Circle" },
      { label: "Specifications", name: "Specifications" },
    ],
  };

  const [filteredCategories, setFilteredCategories] = useState([]);

  // Fetch userPK on mount
  useEffect(() => {
    const id = getUserId();
    console.log("Id - ", id);
    if (id) {
      setUserPK(id);
      // Update the form state with the fetched userPK
      setFormData((prevFormData) => ({
        ...prevFormData,
        userPK: id,
      }));
    }
  }, []); // Run this once on mount

  const [formData, setFormData] = useState({
    productNumber: "",
    productType: "",
    Quantity: "",
    Category: "",
    Dimension: "",
    Comments: "",
    Name: "",
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target; // Use name instead of id
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Directly update the corresponding field in formData
    }));
  };

  // Handle product type change
  const handleProductTypeChange = (event, newValue) => {
    setFormData((prevState) => ({
      ...prevState,
      productType: newValue,
      category: "", // Reset category when product type changes
    }));

    // Update filtered categories based on the selected product type
    setFilteredCategories(productCategories[newValue] || []);
  };

  // Handle category change
  const handleCategoryChange = (event, newValue) => {
    setFormData((prevState) => ({
      ...prevState,
      category: newValue,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    setLoading(true); // Start loading
  
    // Log formData to the console
    console.log("Submitting form data:", formData);
  
    try {
      const productResponse = await apiClient.post(
        `/api/product/create-product`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
  
      // Log the response data directly
      console.log("Product created successfully:", productResponse.data);
     
      alert("Product created successfully!");

      window.location.reload();
    } catch (error) {
      // Handle errors (e.g., network issues or API errors)
      console.error("Error during product submission:", error);
      alert(`Product submission failed: ${error.message}`);
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
                    type="text"
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Autocomplete
                    id="product-type-autocomplete"
                    freeSolo
                    options={productType.map((option) => option.Name)}
                    disableClearable
                    value={formData.productType}
                    onChange={handleProductTypeChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Product Type"
                        variant="standard"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          ...params.InputProps,
                          style: {
                            fontSize: "0.875rem",
                            height: 32,
                          }, // Reduced height
                        }}
                        sx={{ mb: 1 }} // Add margin-bottom for spacing
                      />
                    )}
                  />
                </Grid>

                {/* Category Autocomplete */}
                <Grid item xs={12} md={2}>
                  <Autocomplete
                    id="category-autocomplete"
                    freeSolo
                    options={filteredCategories}
                    disableClearable
                    value={formData.Category}
                    onChange={handleCategoryChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        name="Category"
                        variant="standard"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          ...params.InputProps,
                          style: {
                            fontSize: "0.875rem",
                            height: 32,
                          }, // Reduced height
                        }}
                        sx={{ mb: 1 }} // Add margin-bottom for spacing
                      />
                    )}
                  />
                </Grid>

                {/* Conditional Fields Based on Product Type */}
                {productTypeFields[formData.productType] &&
                  productTypeFields[formData.productType].map(
                    (field, index) => (
                      <Grid item xs={12} md={2} key={index}>
                        <TextField
                          label={field.label}
                          name={field.name}
                          variant="standard"
                          fullWidth
                          onChange={handleChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    )
                  )}

                <Grid item xs={12} md={2}>
                  <TextField
                    name="Quantity"
                    label="Quantity"
                    variant="standard"
                    type="number"
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                {/* <Grid item xs={12} md={2}>
                  <TextField
                    name="Dimension"
                    label="Dimension"
                    type="text"
                    onChange={handleChange}
                    variant="standard"
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
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
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

export default AddProduct;
