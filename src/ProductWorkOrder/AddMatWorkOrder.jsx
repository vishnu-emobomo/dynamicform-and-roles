import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Stack,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/system";
import apiClient from "../utlis/apiClient";
import "../ComponentCss/AddTender.css";
import { Backdrop, CircularProgress,InputLabel,FormControl,MenuItem,Select } from "@mui/material";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "10px", // Adjust this to change only the placeholder size
  },
});

const AddMaterialWorkOrder = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    PONumber: "",
    WorkOrderId: "",
    ProductName: "",
    WorkOrderQuantity: "",
    ProjectLineId: "",
    Description: "",
    AssignedTo: "",
  });
  const [project,setProject] = useState([]);
  const [projectPK,setProjectPK] = useState([]);
  const [lineItems,setLineItems] = useState([]);

  const [productsName, setProductsName] = useState([]);

      // Handle form field changes
      const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("Submitting form data:", formData);
        setLoading(true); // Start loading
        try {
          // Submit formData to the API
          const WorkOrderResponse = await apiClient.post(
            "/api/work.order/create",
            formData
          );

          const WorkOrderResult = WorkOrderResponse.data;
          console.log("Material WorkOrder performed successfully:", WorkOrderResult);

          // Provide feedback to the user
          alert("Material WorkOrder performed successfully!");

          window.location.reload();
        } catch (error) {
          if (error.response) {
            console.error("API Error:", error.response.data);
            alert(
              `WorkOrder submission failed: ${
                error.response.data.message || error.message
              }`
            );
          } else if (error.request) {
            console.error("No response received:", error.request);
            alert("Material Work Order submission failed: No response from the server.");
          } else {
            console.error("Error setting up request:", error.message);
            alert(`Material Work Order submission failed: ${error.message}`);
          }
        } finally {
          setLoading(false); // End loading
        }
      };

      useEffect(() => {
        const fetchProject = async () => {
          try {
      
          const projectResponse = await apiClient.get(
              `/api/project/get-all-projects`
          );
          console.log("Project data:", projectResponse.data);

          if (Array.isArray(projectResponse.data.data)) {
              setProject(projectResponse.data.data);
              console.log(projectResponse.data.data);
          } else {
              console.error(
              "Unexpected data format for products:",
              projectResponse.data.data
              );
              setProject([]);
          }
          } catch (error) {
          console.error("Error fetching Products or Vendors: ", error);
          setProject([]);
          }
      };

      fetchProject();
      }, []);

      useEffect(() => {
      console.log("Project ID:", projectPK);
    
        apiClient
          .get(`/api/line-item/get-lineitems-by-project`, {
            params: {
              projectId: projectPK,
            },
          })
          .then((response) => {
            console.log("Response from API:", response.data);
            if (response.data.success) {
              setLineItems(response.data.LineItems);
            } else {
              console.error("Failed to fetch line items:", response.data.message);
            }
          })
          .catch((error) => {
            console.error("There was an error fetching the line items!", error);
            if (error.response) {
              console.error("Response data:", error.response.data);
            }
          });
      }, [projectPK]);

      const fetchData = async () => {
        try {
          // Fetch products
          const productResponse = await apiClient.get(
            `/api/product/get-all-products`
          );
          console.log("Products:", productResponse.data);

          if (Array.isArray(productResponse.data.data)) {
            setProductsName(productResponse.data.data);
          } else {
            console.error(
              "Unexpected data format for products:",
              productResponse.data.data
            );
            setProductsName([]);
          }
        } catch (error) {
          console.error("Error fetching Products or Vendors: ", error);
          setProductsName([]); // Reset products on error
        }
      };

      useEffect(() => {
        fetchData();
      }, []);

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
              height: "calc(100vh - 112px)", // Adjusted height based on Header + SubHeader
              backgroundColor: "white",
              borderRadius: "10px", // Adds border radius
              // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adds shadow
              marginLeft: "15px",
              display: "flex",
              flexDirection: "column", // Stack items vertically
              alignItems: "center", // Center items horizontally
            }}
          ></Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box
            sx={{
              minHeight: "calc(100vh - 112px) ",
              backgroundColor: "white",
              padding: 2, // Adding padding for the form
              borderRadius: "10px", // Adds border radius
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adds shadow
              marginLeft: "-60px",
            }}
          >
            <Grid
              container
              alignItems="center"
              spacing={3}
              justifyContent="space-between"
            >
              <Grid item>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ marginTop: "10px" }}
                >
                  Material Work Order
                </Typography>
              </Grid>
            </Grid>

            <br />

            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="PONumber">PO Number</InputLabel>
                  <Select
                    id="PONumber"
                    name="PONumber"
                    value={formData.PONumber} // Value is bound to formData
                    onChange={(e) => {
                      const selectedPONumber = e.target.value;
                      const selectedProject = project.find(
                        (proj) => proj.Values.PONumber === selectedPONumber
                      );

                      setFormData((prevData) => ({
                        ...prevData,
                        PONumber: selectedPONumber,
                        ProjectPK: selectedProject?.PK || "", 
                      }));
                      setProjectPK(selectedProject?.PK || "");
                    }}
                    variant="standard"
                    displayEmpty
                  >
                    {project.map((proj) => (
                      <MenuItem key={proj.PK} value={proj.Values.PONumber}>
                        {proj.Values.PONumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>


              <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="WorkOrderId">WorkOrder Id</InputLabel>
                    <Select
                      id="WorkOrderId"
                      name="WorkOrderId"
                      value={formData.WorkOrderId}
                      onChange={handleChange}
                      variant="standard"
                    >
                      {lineItems.map((lineItems) => (
                        <MenuItem key={lineItems.PK} value={lineItems.Values.WorkOrderId}>
                          {lineItems.Values.WorkOrderId}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>


                <Grid item xs={12} md={2}>
                  <Stack spacing={4}>
                    <Autocomplete
                      id="product-autocomplete"
                      freeSolo
                      options={productsName.map((option) => option.Name)}
                      disableClearable
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Material Id"
                          name="MaterialId"
                          variant="standard"
                          value={formData.MaterialId}
                          onChange={handleChange}
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
                      sx={{
                        "& .MuiAutocomplete-input": {
                          fontSize: "0.875rem",
                          height: 40, // Reduce height for Autocomplete input
                        },
                        "& .MuiAutocomplete-option": {
                          fontSize: "0.875rem",
                        },
                      }}
                      onInputChange={(event, newValue) => {
                        setFormData((prevState) => ({
                          ...prevState,
                          ProductName: newValue,
                        }));
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} md={2}>
                  <StyledTextField
                    id="WorkOrderQuantity"
                    name="WorkOrderQuantity"
                    label="Work Order Quantity"
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
                    id="Description"
                    name="Description"
                    label="Description"
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
                    id="AssignedTo"
                    name="AssignedTo"
                    label="Assigned To"
                    type="text"
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      style={{ marginTop: "10px", marginLeft: "20px" }}
                    >
                      Submit
                    </Button>
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

export default AddMaterialWorkOrder;