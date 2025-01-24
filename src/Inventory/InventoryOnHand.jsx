import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../utlis/tokenUtils";
import Pagination from "../utlis/Pagination";
import apiClient from "../utlis/apiClient";
import { Backdrop} from "@mui/material";
import { useLocation } from "react-router-dom";

const InventoryOnHand = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    PONumber: "",
    WorkOrderId: { value: "" }, 
    ProductName: "",
    Quantity: "",
    Comments: "",
  });
  const [productsName, setProductsName] = useState([]);
  const [selectedProductPK, setSelectedProductPk] = useState([]);
  const [onHandData, setOnHandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState([]);
  const [lineItems,setLineItems] = useState([]);
  const [inventoryTrans, setInventoryTrans] = useState([]); 

  const navigate = useNavigate();

  const [materialId, setMaterialId] = useState(""); // To store Material ID
  const location = useLocation();

  useEffect(() => {
    console.log("Page reload detected, resetting states...");

    // Clear the materialId and inventoryTrans states
    setMaterialId(""); 
    setInventoryTrans([]); 

    // Fetch the transactions
    fetchOnHandInventory();

    // If materialId exists in location.state, set it
    const materialFromLocation = location.state?.materialId || "";
    setMaterialId(materialFromLocation);

  }, [location]); 

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#325c67",
      color: theme.palette.common.white,
      padding: "10px",
      verticalAlign: "top",
      letterSpacing: 0, // Set letter spacing to zero for header cells
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: "10px !important",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: "#f3f3f3",
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  // Handle opening/closing of dialog
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  // Handle form field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
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
    console.log("Project ID:", selectedProductPK);
  
      apiClient
        .get(`/api/line-item/get-lineitems-by-project`, {
          params: {
            projectId: selectedProductPK,
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
    }, [selectedProductPK]);

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

  const fetchOnHandInventory = async () => {
    setLoading(true); // Set loading to true when starting fetch
    try {
      const response = await apiClient.get(
        `/api/inventory/get-inventory-onhand`
      );

      console.log("API Response:", response.data); // Make sure to see the exact structure here

      // Check if response.data contains 'data' and 'items'
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        setOnHandData(response.data.data); // Access 'data.items'
        setInventoryTrans(response.data.data);
      } else {
        console.error("Unexpected API response structure", response.data);
        setOnHandData([]); // Fallback to an empty array in case of an unexpected structure
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      // Ensure onHandData is set to an empty array on error to prevent map errors
      setOnHandData([]);
    } finally {
      setLoading(false); // Set loading to false when fetch completes
    }
  };

  const filteredTransactions = materialId
  ? inventoryTrans.filter((trans) =>
      trans.Name.toLowerCase().includes(materialId.toLowerCase())
    )
  : inventoryTrans;




  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!formValues.Product?.pk) {
      alert("Please select a product.");
      return;
    }

    if (formValues.Quantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    const dataToSubmit = {
      PONumber: formValues.PONumber?.value || "",
      WorkOrderId: formValues.WorkOrderId?.value || "",
      ProductName: formValues.Product.value || "",
      Quantity: formValues.Quantity || 0,
      Comments: formValues.Comments || "",
      productId: selectedProductPK || "",
    };

    console.log(dataToSubmit);
    try {
      const response = await apiClient.post(
        "/api/inventory/create-on-hand",
        dataToSubmit
      );
      console.log("Response from API:", response.data);
      alert("successfully add the material");
      handleClose();
      fetchOnHandInventory();
      setFormValues({ PONumber: "", WorkOrderId:"", ProductName: "", Quantity: "", Comments: "" }); // Reset the form
    } catch (error) {
      console.error("Error submitting data: ", error);
    }  finally {
      setLoading(false); // Set loading to false when fetch completes
    }
  };

  const [snoNumber, setSnoNumber] = useState(0); // Initialize to 0 for the first page

  // State for paginated data
  const [paginatedData, setPaginatedData] = useState(
    onHandData.slice(0, 10) // Initial data slice for the first page
  );

  const handlePageDataChange = (start, end) => {
    setPaginatedData(onHandData.slice(start, end));
    setSnoNumber(start);
  };

  useEffect(() => {
    handlePageDataChange(0, 10); // Initialize paginated data
  }, [onHandData]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <SubHeader />

      <Grid
        container
        sx={{ flexGrow: 1, marginTop: "-80px", padding: 0 }}
        spacing={6}
      >
        <Grid item xs={12} md={9}>
          <Box
            sx={{
              height: "calc(100vh - 112px)",
              backgroundColor: "white",
              padding: 2,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginLeft: "180px",
              width: "1000px",
            }}
          >
            <Grid
              container
              alignItems="center"
              spacing={3}
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  Inventory On Hand
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{
                    width: "140px",
                    padding: "4px 8px", // Adjust padding as needed
                    minWidth: "unset" 
                  }}
                  onClick={handleClickOpen}
                 
                >
                  Add OnHand
                </Button>
              </Grid>
            </Grid>

            {/* Dialog for form */}
            <div>
            <Backdrop open={loading} sx={{ zIndex: 1300, color: "#fff" }}>
              <CircularProgress color="inherit" />
            </Backdrop>
            <Dialog
              open={openDialog}
              onClose={handleClose}
              maxWidth="xs"
              sx={{ zIndex: 1200 }}
              fullWidth
            >
              <DialogTitle>Add Inventory</DialogTitle>
              <DialogContent>
                <Box component="form">

                  <Autocomplete
                    id="ponumber-autocomplete"
                    freeSolo
                    options={project} 
                    getOptionLabel={(option) => option.PONumber || ""} // Display the product name
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="PO Number"
                        value={formValues.PONumber?.value || ""} 
                        onChange={handleInputChange}
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          ...params.InputProps,
                          style: {
                            fontSize: "0.875rem",
                            height: 30,
                          },
                        }}
                        sx={{ mb: 1, width: "180px" }}
                      />
                    )}
                    sx={{
                      "& .MuiAutocomplete-input": {
                        fontSize: "0.875rem",
                      },
                      "& .MuiAutocomplete-option": {
                        fontSize: "0.875rem",
                      },
                    }}
                    onChange={(event, newValue) => {
                      // When a product is selected, store its PK and Name in formValues
                      const selectedProductPKs = newValue ? newValue.PK : "";
                      const selectedProductName = newValue ? newValue.PONumber : "";

                      setSelectedProductPk(selectedProductPKs);

                      // Update the state with selected product details
                      setFormValues((prevState) => ({
                        ...prevState,
                        PONumber: {
                          ...prevState.PONumber,
                          value: selectedProductName, // Store the product name
                          pk: selectedProductPK, // Store the product PK
                        },
                      }));
                    }}
                  />

                  <Autocomplete
                    id="workorderid-autocomplete"
                    freeSolo
                    options={lineItems} // Pass the entire product object, not just the name
                    getOptionLabel={(option) => option.Values.WorkOrderId || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="WorkOrder id"
                        value={formValues.WorkOrderId?.value || ""} 
                        onChange={handleInputChange}
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          ...params.InputProps,
                          style: {
                            fontSize: "0.875rem",
                            height: 30,
                          },
                        }}
                        sx={{ mb: 1, width: "180px" }}
                      />
                    )}
                    sx={{
                      "& .MuiAutocomplete-input": {
                        fontSize: "0.875rem",
                      },
                      "& .MuiAutocomplete-option": {
                        fontSize: "0.875rem",
                      },
                    }}
                    onChange={(event, newValue) => {
                      const selectedWorkOrderId = newValue ? newValue.Values.WorkOrderId : ""; // Make sure you're accessing the correct field

                      // Update the state with the selected WorkOrderId
                      setFormValues((prevState) => ({
                        ...prevState,
                        WorkOrderId: {
                          ...prevState.WorkOrderId,
                          value: selectedWorkOrderId, // Store the WorkOrderId
                        },
                      }));
                    }}

                  />


                  <Autocomplete
                    id="product-autocomplete"
                    freeSolo
                    options={productsName} 
                    getOptionLabel={(option) => option.Name || ""} // Display the product name
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Material id"
                        value={formValues.Product?.value || ""} // Display the product name in the field
                        onChange={handleInputChange}
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          ...params.InputProps,
                          style: {
                            fontSize: "0.875rem",
                            height: 30,
                          },
                        }}
                        sx={{ mb: 1, width: "180px" }}
                      />
                    )}
                    sx={{
                      "& .MuiAutocomplete-input": {
                        fontSize: "0.875rem",
                      },
                      "& .MuiAutocomplete-option": {
                        fontSize: "0.875rem",
                      },
                    }}
                    onChange={(event, newValue) => {
                      // When a product is selected, store its PK and Name in formValues
                      const selectedProductPKs = newValue ? newValue.PK : "";
                      const selectedProductName = newValue ? newValue.Name : "";

                      setSelectedProductPk(selectedProductPKs);

                      // Update the state with selected product details
                      setFormValues((prevState) => ({
                        ...prevState,
                        Product: {
                          ...prevState.Product,
                          value: selectedProductName, // Store the product name
                          pk: selectedProductPK, // Store the product PK
                        },
                      }));
                    }}
                  />

                  <TextField
                    margin="dense"
                    name="Quantity"
                    label="Quantity"
                    type="number"
                    variant="standard"
                    value={formValues.Quantity}
                    onChange={handleInputChange}
                  />
                  <br></br>
                  <TextField
                    margin="dense"
                    name="Comments"
                    label="Comments"
                    type="text"
                    variant="standard"
                    value={formValues.Comments}
                    onChange={handleInputChange}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  type="submit"
                  onClick={handleFormSubmit}
                  variant="contained"
                 
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
         
            </div>

            {/* Table displaying the data */}
            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SNO</StyledTableCell>
                    {/* <StyledTableCell>PONumber</StyledTableCell> */}
                    {/* <StyledTableCell>WorkOrder ID</StyledTableCell> */}
                    <StyledTableCell>Material ID</StyledTableCell>
                    <StyledTableCell>Material Quantity</StyledTableCell>
                    {/* <StyledTableCell>Comments</StyledTableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    // Show loading spinner while data is being fetched
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : 
                  filteredTransactions.length > 0 ? (
                    filteredTransactions.map((OnHand, index) => (
                      <StyledTableRow key={OnHand.PK}>
                        <StyledTableCell>
                          {snoNumber + index + 1}
                        </StyledTableCell>
                        {/* <StyledTableCell>{OnHand.PONumber}</StyledTableCell> */}
                        {/* <StyledTableCell>{OnHand.WorkOrderId}</StyledTableCell> */}
                        <StyledTableCell>{OnHand.ProductName}</StyledTableCell>
                        <StyledTableCell>{OnHand.Quantity}</StyledTableCell>
                        {/* <StyledTableCell>{OnHand.Comments}</StyledTableCell> */}
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={4} align="center">
                        There Are No OnHand Items.
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>

              {/* Conditionally render Pagination only if there are purchase orders */}
              {/* {!loading && paginatedData.length > 0 && (
                <Pagination
                  totalItems={paginatedData.length}
                  onPageDataChange={handlePageDataChange}
                />
              )} */}
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryOnHand;
