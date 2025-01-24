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
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { getUserId } from "../utlis/tokenUtils";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import apiClient from "../utlis/apiClient";


const initalFormData = {
    ReceiptLineNo: { value: "", type: "text" },
    PurchaseOrderNumber: { value: "", type: "text"},
    POLineName: { value: "", type: "text" }, 
    Product: { value: "", type: "text"},
    ActualQuantity: { value: "", type: "number" },
    ReceiptQuantity: { value:"", type: "number"},
    Unit: { value: "", type: "text" },
    Rate: { value: "", type: "number" },
    Amount: { value:"", type:"number"},
};

const ROLineItem = () => {
  const [userPK, setUserPK] = useState(null);
  const location = useLocation();
  const { receiptPK } = location.state || {}; 
  const [lineItemPK, setLineItemPK] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formDataLine, setFormDataLine] = useState(initalFormData);
  const [productsName, setProductsName] = useState([]);
  const [vendors, setVendors] = useState([]);

  console.log(receiptPK , ": the receipt pk from the form");

  // Fetch userPK on mount
  useEffect(() => {
    const id = getUserId();
    if (id) {
      setUserPK(id);
    }
  }, []); // Run this once on mount

  const [formData, setFormData] = useState({
    ReceiptNo : "",
    ReceiptName: "",
    ReceiptType:"",
    VendorName:"",
    Status:"",
  });

  const receiptId = encodeURIComponent(receiptPK); // Adjust this line


  const userPK1 = encodeURIComponent(userPK); // Adjust this line
  console.log(userPK1, " the sample  to get the project id");

  // Fetch LineItems from API
  useEffect(() => {

    console.log("Fetching line items for userPK:", userPK1);
    console.log("Purchase ID:", receiptId);

    apiClient
      .get(
        "/api/receipts/get-lineitem-by-receiptid",
        {
          params: {
            receiptId: receiptPK , 
          },
        }
      )
      .then((response) => {
        console.log("Response from API:", response.data);
        if (response.data.success) {
          setLineItems(response.data.LineItems);
          console.log("Fetched line items:", response.data.LineItems);
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
  }, [receiptId]); // Use userPK here instead of userPK1

  // Handle row click to open dialog and set selected item
  const handleRowClick = (item, index) => {
    setSelectedItem(item);
    setLineItemPK(item.PK);
    // Initialize formDataLine with the values from the selected item
    const updatedFormDataLine = {};
    Object.keys(initalFormData).forEach((key) => {
      updatedFormDataLine[key] = {
        value: item.Values[key] || "", // Set to an empty string if undefined
        type: initalFormData[key].type,
      };
    });

    // Explicitly set the values for Name and Desc if they exist in the item
    updatedFormDataLine["Name"] = {
      value: item.Name || "",
      type: "text",
    };

    updatedFormDataLine["SNO"] = {
      value: index + 1,
      type: "number",
    };

    setFormDataLine(updatedFormDataLine); // Set the form data for the dialog
    setOpenDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null); // Clear the selected item when dialog is closed 
  };

  // Handle form data changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormDataLine((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  useEffect(() => {
    console.log("Updated lineItems:", lineItems);
  }, [lineItems]);

  // Fetch receipt details using the receiptPK
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!receiptPK) return;
  
      console.log("Fetching purchase details for ID:", receiptId); 
  
      try {
        const response = await apiClient.get(
          `/api/vendor/get-purchase-by-id/${receiptId}`
        );
  
        console.log("API Response:", response.data); // Log the entire response
  
        if (response.data.success) {
          const receiptData = response.data.data; // This is now a single object, not an array
          console.log("Receipt Data Object:", receiptData); // Log the purchase data object
  
          if (receiptData) { // Check if receiptData exists
            console.log("Purchase Details:", receiptData); // Log the purchase details
  
            setFormData({
              ReceiptNo: receiptData.Values?.ReceiptNo || "",
              ReceiptName: receiptData.Values?.ReceiptName || "",
              ReceiptType: receiptData.Values?.ReceiptType || "", 
              VendorName: receiptData.Values?.VendorName || "",
              Status: receiptData.Values?.Status || "",
            });
          } else {
            console.error("Purchase data is undefined");
          }
        } else {
          console.error("Failed to fetch project details:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
  
    fetchProjectDetails();
  }, [receiptPK]);
  

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

  const formatDate = (date) => {
    const parts = date.split("-"); // Assuming date comes as 'MM-DD-YY'
    const formattedDate = new Date(`20${parts[2]}`, parts[0] - 1, parts[1]);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format to 'YYYY-MM-DD'
  };

  // Handle change for table form data
  const handleTableChange = (e) => {
    const { name, value } = e.target;
    setFormDataLine({
      ...formDataLine,
      [name]: { ...formDataLine[name], value },
    });
  };

  const fetchData = async () => {
    try {

      // Fetch products
      const productResponse = await apiClient.get(
          `/api/product/get-all-products`
      );

      if (Array.isArray(productResponse.data.data)) {
        setProductsName(productResponse.data.data);
    } else {
        console.error(
        "Unexpected data format for products:",
        productResponse.data.data
        );
        setProductsName([]);
    }

      // Fetch vendors
      const vendorResponse = await apiClient.get(
        `/api/vendor/getallvendors`
    );
      // console.log("Vendors:", vendorResponse.data);

      if (Array.isArray(vendorResponse.data)) {
        setVendors(vendorResponse.data); 
      } else {
        console.error(
          "Unexpected data format for vendors:",
          vendorResponse.data
        );
        setVendors([]); 
      }
    } catch (error) {
      console.error("Error fetching Products or Vendors: ", error);
      setProductsName([]); // Reset products on error
      setVendors([]); // Reset vendors on error
    }
  };

  useEffect(() => {
      fetchData();
  });

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
              minHeight: "calc(100vh - 112px)",
              backgroundColor: "white",
              borderRadius: "10px", // Adds border radius
             
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
              minHeight: "calc(100vh - 112px) !important", 
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
                  Receipt Details
                </Typography>
              </Grid>
              <Grid item>
                {/* <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="text"
                      sx={{ width: "5px !important", height: "30px" }}
                      onClick={handleEditClick}
                    >
                      <EditOutlinedIcon />
                    </Button>
                  </Grid>
                </Grid> */}
              </Grid>
            </Grid>

            <form noValidate autoComplete="off">
              <Grid container spacing={2}>
                {/* First Column */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: "5px", fontSize: "12px" }}
                      >
                        Receipt No:
                      </Typography>
                      <TextField
                        id="ReceiptNo"
                        name="ReceiptNo"
                        type="text"
                        value={formData.ReceiptNo}
                        onChange={handleChange}
                        variant="standard"
                        InputProps={{
                          style: {
                            height: "auto", // Set height to auto
                            width: 150,
                            padding: "0px 0px", 
                            fontSize: "14px", // Adjust font size
                          },
                          sx: {
                            minHeight: "unset", 
                            "& .MuiInputBase-input": {
                              padding: "0px 0px",
                            },
                          },
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                      />
                    </Box>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: "5px", fontSize: "12px" }}
                      >
                        Receipt Name:
                      </Typography>
                      <TextField
                        name="ReceiptName" // Updated name to "CreationDate"
                        type="text"
                        value={formData.ReceiptName || ""}
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
                       
                      />
                    </Box>
                  </FormControl>
                </Grid>

                {/* Second Column */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 1, fontSize: "12px" }}
                      >
                        Receipt Type:
                      </Typography>
                      <TextField
                        id="ReceiptType"
                        name="ReceiptType"
                        
                        variant="standard"
                        value={formData.ReceiptType}
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
                        
                      />
                    </Box>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 2, fontSize: "12px" }}
                      >
                        Vendor Name:
                      </Typography>
                      <TextField
                        id="VendorName"
                        name="VendorName"
                       
                        variant="standard"
                        value={formData.VendorName}
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
                       
                      />
                    </Box>
                  </FormControl>
                </Grid>

                {/* New Row with Creation Date */}
                {/* <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 2, fontSize: "12px" }}
                      >
                        Status:
                      </Typography>
                      <TextField
                        name="Status" 
                        value={formData.Status || ""}
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
                        
                      />
                    </Box>
                  </FormControl>
                </Grid> */}


               
              </Grid>
            </form>

            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <StyledTableCell>SNo</StyledTableCell> */}
                    <StyledTableCell>Receipt Line No</StyledTableCell>
                    <StyledTableCell>Purchase Order Number</StyledTableCell>
                    <StyledTableCell>WorkOrder Id</StyledTableCell>
                    <StyledTableCell>Material Id</StyledTableCell>
                    <StyledTableCell>Actual Quantity</StyledTableCell>
                    <StyledTableCell>Receipt Quantity</StyledTableCell>
                    <StyledTableCell>Unit</StyledTableCell>
                    <StyledTableCell>Rate</StyledTableCell>
                    <StyledTableCell>Amount</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lineItems.map((item, index) => (
                    <TableRow
                      key={item.PK}
                      onClick={() => handleRowClick(item, index)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* <StyledTableCell>{index + 1}</StyledTableCell> */}
                      
                      <StyledTableCell>{item.Values.ReceiptLineNo}</StyledTableCell>
                      <StyledTableCell>{item.Values.PurchaseOrderNumber}</StyledTableCell>
                      <StyledTableCell>{item.WorkOrderId}</StyledTableCell>
                      <StyledTableCell>{item.Values.MaterialId}</StyledTableCell>
                      <StyledTableCell>{item.Values.ActualQuantity}</StyledTableCell>
                      <StyledTableCell>{item.Values.ReceiptQuantity} </StyledTableCell>
                      <StyledTableCell>{item.Values.Unit}</StyledTableCell>
                      <StyledTableCell>{item.Values.Rate}</StyledTableCell>
                      <StyledTableCell>{item.Values.Amount}</StyledTableCell>
                      {/* <StyledTableCell>
                        {item.Values.LineStatus}
                      </StyledTableCell>
                      <StyledTableCell>{item.Values.PurchaseDate}</StyledTableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {selectedItem && (
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
              >
                {/* <DialogTitle>Add New Row</DialogTitle> */}
                <br />
                {/* <DialogContent>
                  <Grid container spacing={3}>
                    {Object.keys(initalFormData).map((key) => {

                      
                      // Render Autocomplete for "Product" key
                      if (key === "Product") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <Stack spacing={4}>
                              <Autocomplete
                                id="product-autocomplete"
                                freeSolo
                                options={productsName.map(
                                  (option) => option.ProductName
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Product"
                                    value={formData.ProductName?.value || ""}
                                    onChange={handleTableChange}
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
                                    Product: {
                                      ...prevState.Product,
                                      value: newValue,
                                    },
                                  }));
                                }}
                              />
                            </Stack>
                          </Grid>
                        );
                      }


                    })}
                  </Grid>
                </DialogContent> */}
                {/* <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button onClick={handleAddRow}>Submit</Button>
                </DialogActions> */}
              </Dialog>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ROLineItem;
