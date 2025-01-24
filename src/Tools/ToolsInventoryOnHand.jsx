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
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../utlis/tokenUtils";
import Pagination from "../utlis/Pagination";
import apiClient from "../utlis/apiClient";
import { Backdrop } from "@mui/material";
import { useLocation } from "react-router-dom";

const ToolsInventoryOnHand = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogWO, setOpenDialogWO] = useState(false);
  const [onHandLoading, setOnHandLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    ToolsId: "",
    Name: "",
    Quantity: "",
    Comments: "",
  });

  const [formValuesWO, setFormValuesWO] = useState({
    Name: "",
    WorkOrderQuantity: "",
    Comments: "",
  });
  const { state } = useLocation();
  const [toolsName, setToolsName] = useState([]);
  const [selectedToolPK, setSelectedToolPk] = useState([]);
  const [onHandData, setOnHandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  

  const navigate = useNavigate();

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

  const handleClickOpenWO = () => {
    setOpenDialogWO(true);
  };

  const handleCloseWO = () => {
    setOpenDialogWO(false);
  };

  // Handle form field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle form field change
  const handleInputChangeWO = (e) => {
    const { name, value } = e.target;
    setFormValuesWO((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const fetchData = async () => {
    try {
      // Fetch products
      const ToolsResponse = await apiClient.get(`/api/tools/get-all-tools`);
      console.log("Tools:", ToolsResponse.data);

      if (Array.isArray(ToolsResponse.data.data)) {
        setToolsName(ToolsResponse.data.data);
      } else {
        console.error(
          "Unexpected data format for products:",
          ToolsResponse.data.data
        );
        setToolsName([]);
      }
    } catch (error) {
      console.error("Error fetching Products or Vendors: ", error);
      setToolsName([]); // Reset products on error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchOnHandInventory = async () => {
    setLoading(true); // Set loading to true when starting fetch
    try {
      const response = await apiClient.get(`/api/tools/get-all-onhand`);

      console.log("API Response:", response.data); // Make sure to see the exact structure here

      // Check if response.data contains 'data' and 'items'
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        setOnHandData(response.data.data); // Access 'data.items'
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

  useEffect(() => {
    fetchOnHandInventory();
  }, []);

  useEffect(() => {
    if (state?.ToolsName && Array.isArray(onHandData)) {
      const filtered = onHandData.filter(item => item.Name === state.ToolsName);
      setFilteredData(filtered);
    } else {
      setFilteredData(onHandData); // Show all data if no filter applied
    }
  }, [state, onHandData]);

  // Log the PK of the selected product to the console
  //   console.log("Selected Product PK:", selectedProductPK);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.Name) {
      alert("Please select a Tools.");
      return;
    }

    if (formValues.Quantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    const dataToSubmit = {
      Name: formValues.Name || "",
      Quantity: formValues.Quantity || 0,
      Comments: formValues.Comments || "",
      ToolsId: selectedToolPK || "",
    };

    setOnHandLoading(true); // Start loading

    try {
      const response = await apiClient.post(
        "/api/tools/add-onhand",
        dataToSubmit
      );
      console.log("Response from API:", response.data);
      handleClose();
      fetchOnHandInventory();
      setFormValues({ Name: "", Quantity: "", Comments: "", ToolsId: "" }); // Reset the form
    } catch (error) {
      console.error("Error submitting data: ", error);
    } finally {
      setOnHandLoading(false); // End loading
    }
  };

  const handleFormSubmitWO = async (event) => {
    event.preventDefault();

    if (!formValuesWO.Name) {
      alert("Please select a Tools.");
      return;
    }

    if (formValuesWO.WorkOrderQuantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    const dataToSubmit = {
      Name: formValuesWO.Name || "",
      WorkOrderQuantity: formValuesWO.WorkOrderQuantity || 0,
      Comments: formValuesWO.Comments || "",
    };

    setOnHandLoading(true); // Start loading

    try {
      const response = await apiClient.post(
        "/api/tools/create-tools-work-order",
        dataToSubmit
      );
      console.log("Response from API:", response.data);
      handleCloseWO();
      fetchOnHandInventory();
      setFormValuesWO({
        Name: "",
        WorkOrderQuantity: "",
        Comments: "",
      }); // Reset the form
    } catch (error) {
      console.error("Error submitting data: ", error);
    } finally {
      setOnHandLoading(false); // End loading
    }
  };

  const [snoNumber, setSnoNumber] = useState(0); // Initialize to 0 for the first page

  // State for paginated data
  // const [paginatedData, setPaginatedData] = useState(
  //   onHandData.slice(0, 10) // Initial data slice for the first page
  // );

  // const handlePageDataChange = (start, end) => {
  //   setPaginatedData(onHandData.slice(start, end));
  //   setSnoNumber(start);
  // };

  // useEffect(() => {
  //   handlePageDataChange(0, 10); // Initialize paginated data
  // }, [onHandData]);

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
              minHeight: "calc(100vh - 112px)",
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
                  Tools Inventory On Hand
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ fontSize:"10px", marginRight: "10px" }}
                  onClick={handleClickOpenWO}
                  size="small"
                >
                  Tools WorkOrder
                </Button>
                <Button
                  variant="contained"
                  sx={{ fontSize:"10px"}}
                  onClick={handleClickOpen}
                  size="small"
                >
                  Tools OnHand
                </Button>
              </Grid>
            </Grid>

            {/* Dialog for on hand form */}
            <div>
              <Backdrop open={onHandLoading} sx={{ zIndex: 1300, color: "#fff" }}>
                <CircularProgress color="inherit" />
              </Backdrop>
              <Dialog
                open={openDialog}
                onClose={handleClose}
                maxWidth="xs"
                sx={{ zIndex: 1200 }}
                fullWidth
              >
                <DialogTitle>OnHand Tools Inventory</DialogTitle>
                <DialogContent>
                  <Box component="form">
                    <Autocomplete
                      id="product-autocomplete"
                      freeSolo
                      options={toolsName} // Pass the entire product object, not just the name
                      getOptionLabel={(option) => option.Name || ""} // Display the product name
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tool Name"
                          value={formValues.Name || ""} // Display the product name in the field
                          // onChange={handleInputChange}
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: {
                              fontSize: "0.875rem",
                              height: 40,
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
                        const selectedToolPK = newValue ? newValue.PK : "";
                        const selectedToolName = newValue ? newValue.Name : "";

                        setSelectedToolPk(selectedToolPK);

                        // Update the state with selected product details
                        setFormValues((prevValues) => ({
                          ...prevValues,
                          Name: selectedToolName,
                          ToolsId: selectedToolPK,
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
                    {/* <TextField
                      margin="dense"
                      name="Comments"
                      label="Comments"
                      type="text"
                      variant="standard"
                      value={formValues.Comments}
                      onChange={handleInputChange}
                    /> */}
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

            {/* Dialog for workorder  form */}
            <div>
            <Backdrop open={onHandLoading} sx={{ zIndex: 1300, color: "#fff" }}>
              <CircularProgress color="inherit" />
            </Backdrop>
              <Dialog
                open={openDialogWO}
                onClose={handleCloseWO}
                maxWidth="xs"
                sx={{ zIndex: 1200 }}
                fullWidth
              >
                <DialogTitle>Work Order Inventory</DialogTitle>
                <DialogContent>
                  <Box component="form">
                    <Autocomplete
                      id="product-autocomplete"
                      freeSolo
                      options={toolsName} // Pass the entire product object, not just the name
                      getOptionLabel={(option) => option.Name || ""} // Display the product name
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tool Name"
                          value={formValues.Name || ""} // Display the product name in the field
                          // onChange={handleInputChange}
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: {
                              fontSize: "0.875rem",
                              height: 40,
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
                        const selectedToolName = newValue ? newValue.Name : "";

                        // Update the state with selected product details
                        setFormValuesWO((prevValues) => ({
                          ...prevValues,
                          Name: selectedToolName,
                        }));
                      }}
                    />

                    <TextField
                      margin="dense"
                      name="WorkOrderQuantity"
                      label="Quantity"
                      type="number"
                      variant="standard"
                      value={formValuesWO.WorkOrderQuantity}
                      onChange={handleInputChangeWO}
                    />
                    <br></br>
                    {/* <TextField
                      margin="dense"
                      name="Comments"
                      label="Comments"
                      type="text"
                      variant="standard"
                      value={formValuesWO.Comments}
                      onChange={handleInputChangeWO}
                    /> */}
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseWO}>Cancel</Button>
                  <Button
                    type="submit"
                    onClick={handleFormSubmitWO}
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
                    <StyledTableCell>Tool Name</StyledTableCell>
                    <StyledTableCell>Tool Quantity</StyledTableCell>
                    {/* <StyledTableCell>Comments</StyledTableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                {loading ? (
          <TableRow>
            <TableCell colSpan={4} align="center">
              {/* <CircularProgress /> */}
            </TableCell>
          </TableRow>
        ) : filteredData.length > 0 ? (
          filteredData.map((tool, index) => (
            <StyledTableRow key={tool.PK}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>{tool.Name}</StyledTableCell>
              <StyledTableCell>{tool.Quantity}</StyledTableCell>
              {/* <StyledTableCell>{tool.Comments}</StyledTableCell> */}
            </StyledTableRow>
          ))
        ) : (
          <StyledTableRow>
            <StyledTableCell colSpan={4} align="center">
              No Tools Found.
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
      <Backdrop
        open={loading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default ToolsInventoryOnHand;