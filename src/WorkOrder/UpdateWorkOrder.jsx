import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
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
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Autocomplete,
  Stack,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import apiClient from "../utlis/apiClient";
import { Backdrop, CircularProgress } from "@mui/material";

const initalFormData = {
  SNO: { value: "", type: "text" },
  ProjectNumber: { value: "", type: "text" },
  Description: { value: "", type: "text" },
  LineItemName: { value: "", type: "text" },
  Quantity: { value: "", type: "number" },
  WorkOrderId: { value: "", type: "text" },
  ItemCode: { value: "", type: "text" },
};

const UpdateWorkOrder = () => {
  const location = useLocation();
  // console.log(location.state);
  const { OutSourcePK } = location.state || {};
  const [lineItemPK, setLineItemPK] = useState("");
  const [incrementValue, setIncrementValue] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [outsource, setOutSource] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formDataLine, setFormDataLine] = useState(initalFormData);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    GatePass: "",
    VendorName: "",
    Issued_Date: "",
    Received_Date: "",
    Status: "",
    ReturnStatus: "",
  });

  const OutSourceId = encodeURIComponent(OutSourcePK); // Adjust this line

  // Fetch LineItems from API and display in table
  useEffect(() => {
    console.log("Out Source Id", OutSourceId);

    apiClient
      .get(
        `/api/in-out-source/Get-Line-Items-By-Work-Order?OutSourcePK=${OutSourceId}`
      )
      .then((response) => {
        console.log("Response from API:", response);
        if (response.data.success) {
          setLineItems(response.data.LineItems);
          setOutSource(response.data.OutSource);
          console.log("Fetched line items:", response.data.LineItems);
          console.log("Fetched OutSource:", response.data.OutSource);
          console.log(response.data.OutSource[0].GatePass);

          // Update formData with OutSource values
          setFormData({
            GatePass: response.data.OutSource[0].GatePass || "",
            VendorName: response.data.OutSource[0]?.VendorName || "",
            Issued_Date: response.data.OutSource[0]?.Issued_Date || "",
            Received_Date: response.data.OutSource[0]?.Received_Date || "",
            Status: response.data.OutSource[0]?.Status || "",
            ReturnStatus: response.data.OutSource[0]?.ReturnStatus || "",
          });

         
          console.log("Form data:", formData);
        } else {
          console.error("Failed to fetch line items:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the line items!", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
      });
  }, [OutSourceId]);

  const handleSaveClick = () => {

    setLoading(true); // Start loading


    const requestBody = {
      GatePass: formData.GatePass,
      VendorName: formData.VendorName,
      Received_Date: formData.Received_Date,
      Status: formData.Status,
      Issued_Date: formData.Issued_Date,
      ReturnStatus: formData.ReturnStatus,
      WorkOrderPK: OutSourcePK,
    };

    console.log("OutSource", OutSourceId);
    console.log(
      "Sending request with body:",
      JSON.stringify(requestBody, null, 2)
    );

    const token = sessionStorage.getItem("authToken"); // Ensure this is set correctly
    console.log("Using token:", token);

    apiClient
      .post(`/api/in-out-source/In-House-Update`, requestBody)
      .then((response) => {
        console.log("Full Response:", response);
        if (response.data && response.data.message) {
          console.log("In Source updated successfully");
          setIsEditing(false);
          alert("Updated the Work Order Successfully");
        } else {
          console.error(
            "Update failed:",
            response.data.message || "Unknown error"
          );
        }
      })
      .catch((error) => {
        console.error("There was an error updating the project!", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
        } else {
          console.error("Error message:", error.message); 
        }
      }) 
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEditClick = () => {
    setIsEditing((prev) => !prev); // Toggle edit mode
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const StyledTextField = styled(TextField)({
    "& .MuiInputBase-input::placeholder": {
      fontSize: "10px", // Adjust this to change only the placeholder size
    },
  });

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#325c67",
      color: theme.palette.common.white,
      padding: "10px",
      verticalAlign: "top",
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
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  useEffect(() => {
    const extractIncrementValue = (gatePass) => {
      const regex = /SMSL\/G\/(\d+)\/2024(?:\/R\d+)?/;
      const match = gatePass.match(regex);
      return match ? match[1] : ""; // Extract increment value
    };

    const updateGatePass = (status, incrementValue) => {
      let baseGatePass = `SMSL/G/${incrementValue}/2024`;
      if (status === "In Source") {
        baseGatePass += `/R${incrementValue}`; // Add /R{value} for InSource
      }
      return baseGatePass;
    };

    const currentIncrementValue = extractIncrementValue(formData.GatePass);
    setIncrementValue(currentIncrementValue);

    const updatedGatePass = updateGatePass(
      formData.Status,
      incrementValue || currentIncrementValue
    );
    setFormData((prevData) => ({
      ...prevData,
      GatePass: updatedGatePass,
    }));
  }, [formData.Status, incrementValue]);

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
              //  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adds shadow
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
              minHeight: "calc(100vh - 112px)",
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
              justifyContent="space-between"
              spacing={2}
            >
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  Work Order Details
                </Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="text"
                      sx={{ width: "5px !important", height: "30px" }}
                      onClick={handleEditClick}
                    >
                      <EditOutlinedIcon />
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{ width: "50px", height: "30px" }}
                      onClick={handleSaveClick}
                      disabled={!isEditing} // Disable save button if not in edit mode
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <form noValidate autoComplete="off">
              <Grid container spacing={2}>
                {/* First Column */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: "5px", fontSize: "12px" }}
                      >
                        Gate Pass:
                      </Typography>
                      <TextField
                        id="Gatepass"
                        name="Gatepass"
                        type="text"
                        value={formData.GatePass}
                        onChange={handleChange}
                        variant="standard"
                        InputProps={{
                          style: {
                            height: "auto", // Set height to auto
                            width: 150,
                            padding: "0px 0px", // Adjust padding (top-bottom right-left)
                            fontSize: "14px", // Adjust font size
                          },
                          sx: {
                            minHeight: "unset", // Remove any default min-height
                            "& .MuiInputBase-input": {
                              padding: "0px 0px", // Adjust padding (top-bottom right-left)
                            },
                          },
                        }}
                        InputLabelProps={{
                          shrink: true, // Ensure the label is always visible
                        }}
                        required
                        disabled={!isEditing} // Disable input if not in edit mode
                      />
                    </Box>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: "5px", fontSize: "12px" }}
                      >
                        Vendor Name
                      </Typography>
                      <TextField
                        name="VendorName" // Updated name to "CreationDate"
                        type="text"
                        value={formData.VendorName || ""}
                        onChange={handleChange}
                        variant="standard"
                        InputProps={{
                          style: {
                            height: "auto", // Set height to auto
                            width: 150,
                            padding: "0px 0px", // Adjust padding (top-bottom right-left)
                            fontSize: "14px", // Adjust font size
                          },
                          sx: {
                            minHeight: "unset", // Remove any default min-height
                            "& .MuiInputBase-input": {
                              padding: "0px 0px", // Adjust padding (top-bottom right-left)
                            },
                          },
                        }}
                        InputLabelProps={{
                          shrink: true, // Ensure the label is always visible
                        }}
                        required
                        disabled={!isEditing}
                      />
                    </Box>
                  </FormControl>
                </Grid>

                {/* Second Column */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 1, fontSize: "12px" }}
                      >
                        Issued Date:
                      </Typography>
                      <TextField
                        id="Issued_Date"
                        name="Issued_Date"
                        type="date"
                        variant="standard"
                        value={formData.Issued_Date}
                        onChange={handleChange}
                        InputProps={{
                          style: {
                            height: "auto", // Set height to auto
                            width: 150,
                            padding: "0px 0px", // Adjust padding (top-bottom right-left)
                            fontSize: "14px", // Adjust font size
                          },
                          sx: {
                            minHeight: "unset", // Remove any default min-height
                            "& .MuiInputBase-input": {
                              padding: "0px 0px", // Adjust padding (top-bottom right-left)
                            },
                          },
                        }}
                        InputLabelProps={{
                          shrink: true, // Ensure the label is always visible
                        }}
                        required
                        disabled={!isEditing}
                      />
                    </Box>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 1, fontSize: "12px" }}
                      >
                        Received Date:
                      </Typography>
                      <TextField
                        id="Received_Date"
                        name="Received_Date"
                        type="date"
                        variant="standard"
                        value={formData.Received_Date}
                        onChange={handleChange}
                        InputProps={{
                          style: {
                            height: "auto", // Set height to auto
                            width: 150,
                            padding: "0px 0px", // Adjust padding (top-bottom right-left)
                            fontSize: "14px", // Adjust font size
                          },
                          sx: {
                            minHeight: "unset", // Remove any default min-height
                            "& .MuiInputBase-input": {
                              padding: "0px 0px", // Adjust padding (top-bottom right-left)
                            },
                          },
                        }}
                        InputLabelProps={{
                          shrink: true, // Ensure the label is always visible
                        }}
                        required
                        disabled={!isEditing}
                      />
                    </Box>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 1, fontSize: "12px" }}
                      >
                        Return Status:
                      </Typography>
                      <Select
                        id="ReturnStatus"
                        name="ReturnStatus"
                        value={formData.ReturnStatus}
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          minHeight: "unset", // Remove any default min-height
                          fontSize: "14px", // Adjust font size
                          width: 150,
                          padding: "0px 0px",
                        }}
                        disabled={!isEditing}
                        required
                        displayEmpty
                        inputProps={{
                          style: {
                            padding: "0px 0px",
                          },
                        }}
                      >
                        <MenuItem value="RETURNABLE GATEPASS">RETURNABLE GATEPASS</MenuItem>
                        <MenuItem value="NON RETURNABLE GATEPASS">
                          NON RETURNABLE GATEPASS
                        </MenuItem>
                      </Select>
                    </Box>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 1, fontSize: "12px" }}
                      >
                        Status:
                      </Typography>
                      <Select
                        id="Status"
                        name="Status"
                        value={formData.Status}
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          minHeight: "unset", // Remove any default min-height
                          "& .MuiInputBase-input": {
                            padding: "0px 0px", // Adjust padding (top-bottom right-left)
                          },
                        }}
                        disabled={!isEditing}
                        required
                        displayEmpty
                        inputProps={{
                          style: {
                            height: "auto", // Set height to auto
                            width: 150,
                            padding: "0px 0px", // Adjust padding (top-bottom right-left)
                            fontSize: "14px", // Adjust font size
                          },
                        }}
                      >
                        <MenuItem value="Out Source">Out Source</MenuItem>
                        <MenuItem value="In Source">In Source</MenuItem>
                      </Select>
                    </Box>
                  </FormControl>
                </Grid>
              </Grid>
            </form>

            <br />

            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SNO</StyledTableCell>
                    <StyledTableCell> Project Number</StyledTableCell>
                    <StyledTableCell> Description</StyledTableCell>
                    <StyledTableCell> Item Code</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Work Order Id</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lineItems.map((item, index) => (
                    <TableRow key={item.PK}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{item.ProjectNumber}</StyledTableCell>
                      <StyledTableCell>{item.Description}</StyledTableCell>
                      <StyledTableCell>{item.ItemCode}</StyledTableCell>
                      <StyledTableCell>{item.Quantity}</StyledTableCell>
                      <StyledTableCell>{item.WorkOrderId}</StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

export default UpdateWorkOrder;
