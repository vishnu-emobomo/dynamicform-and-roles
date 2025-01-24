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
  Stack,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { getUserId } from "../utlis/tokenUtils";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import apiClient from "../utlis/apiClient";


const initalFormData = {
  PoLineNo: { value: "", type: "text" },
  // POLineName: { value: "", type: "text" },
  WorkOrderId: { value: "", type: "text" },
  // Product: { value: "", type: "text" },
  MaterialName: { value: "", type: "text" },
  Grade: { value: "", type: "text" },
  Dimension: { value: "", type: "text" },
  MaterialId: { value: "", type: "text" },
  Quantity: { value: "", type: "number" },
  // UOM: { value: "", type: "text" },
  Unit:{ value: "", type: "text" },
  Rate: { value: "", type: "number" },
  Price: { value: "", type: "number" },
  PurchaseDate: { value: "", type: "date" },
};

const POLineItem = () => {
  const [userPK, setUserPK] = useState(null);
  const location = useLocation();
  const { purchasePK, projectPK } = location.state || {}; // Safely access projectPK
  const [lineItemPK, setLineItemPK] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formDataLine, setFormDataLine] = useState(initalFormData);
  const [open, setOpen] = useState(false);
  const [productsName, setProductsName] = useState([]);
  const [lineItemNames, setLineItemNames] = useState([]);

  console.log(purchasePK, ": the purchase pk from the form");
  console.log(projectPK, ": the Project pk from the form");

  const [formData, setFormData] = useState({
    PurchaseNo: "",
    PurchaseDate: "",
    PurchaseUpdatedDate: "",
    PurchaseType: "",
    CreatedBy: "",
    UpdatedBy: "",
    PONumber: "",
    VendorName: "",
    TenderCodenumber: "",
    TermsAndConditions:"",
    Status: "",
  });

  const purchaseId = encodeURIComponent(purchasePK); // Adjust this line
  const projectId = encodeURIComponent(projectPK); // Adjust this line
  console.log("ProjectPK:-", projectId);

  const userPK1 = encodeURIComponent(userPK); // Adjust this line
  console.log(userPK1, " the sample  to get the project id");

  // Fetch LineItems from API
  useEffect(() => {
    apiClient
      .get("/api/vendor/get-all-lineitems-by-purchase", {
        params: {
          purchaseOrderId: purchasePK,
        },
      })
      .then((response) => {
        console.log("Response from API:", response.data);
        if (response.data.success) {
          setLineItems(response.data.LineItems);
          // alert("Fetched line items successfully!"); // Alert on success
          console.log("Fetched line items:", response.data.LineItems);
        } else {
          // alert("Failed to fetch line items: " + response.data.message); // Alert on failure
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
  }, [purchaseId]); // Use userPK here instead of userPK1

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

    updatedFormDataLine["PoLineNo"] = {
      value: index + 1,
      type: "number",
    };

    setFormDataLine(updatedFormDataLine); // Set the form data for the dialog
    setOpenDialog(true);
  };

  const handleAddRow = async () => {
    // Construct the data object based on formDataLine
    const updatedLineItem = {
      PoLineNo: formDataLine["PoLineNo"]?.value || "",
      Name: formDataLine["Name"]?.value || "",
      Product: formDataLine["Product"]?.value || "",
      Quantity: formDataLine["Quantity"]?.value || "",
      Drawings: formDataLine["Drawings"]?.value || "",
      ActualStartDate: formDataLine["ActualStartDate"]?.value || "",
      EndDate: formDataLine["EndDate"]?.value || "",
      ActualEndDate: formDataLine["ActualEndDate"]?.value || "",
      TeamMember: formDataLine["TeamMember"]?.value || "",
      VendorName: formDataLine["VendorName"]?.value || "",
      MakeBuy: formDataLine["MakeBuy"]?.value || "",
      projectPK: purchasePK,
      lineItemId: lineItemPK,
    };

    console.log(updatedLineItem);

    try {
      const response = await apiClient.put(
        "/api/line-item/update-lineitem",
        updatedLineItem
      );
      console.log("Response from API:", response.data);

      // Check for successful update in the response
      if (response.data.message === "LineItem updated successfully") {
        const updatedData = response.data.updatedData;

        // Update lineItems in state
        setLineItems((prevLineItems) =>
          prevLineItems.map((item) =>
            item.PK === lineItemPK
              ? {
                  ...item,
                  Name: updatedData.Name,
                  Values: {
                    ...item.Values,
                    ...updatedData.Values, // Spread to update only the necessary fields
                  },
                }
              : item
          )
        );

        // Also update formDataLine with the new data
        const updatedFormDataLine = {};
        Object.keys(initalFormData).forEach((key) => {
          updatedFormDataLine[key] = {
            value: updatedData.Values[key] || "", // Set to the updated value
            type: initalFormData[key].type,
          };
        });

        updatedFormDataLine["Name"] = {
          value: updatedData.Name || "",
          type: "text",
        };

        // Update SNO
        updatedFormDataLine["PoLineNo"] = {
          value: lineItems.length + 1, // Recalculate SNO based on the current state length
          type: "number",
        };

        setFormDataLine(updatedFormDataLine); // Set the updated form data for the dialog
      } else {
        alert("Failed to update line item: " + response.data.message); // Alert on failure
      }
    } catch (error) {
      console.error("Error submitting line item:", error);
      // Handle the error (e.g., show a notification)
    } finally {
      // Close the dialog after submission
      handleCloseDialog();
    }
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

  // console.log(projectPK ,"to get tender by id");

  // Fetch project details using the projectPK
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!purchasePK) return;

      console.log("Fetching purchase details for ID:", purchaseId); // Log the purchaseId

      try {
        const response = await apiClient.get(
          `/api/vendor/get-purchase-by-id/${purchaseId}`
        );

        console.log("API Response:", response.data); // Log the entire response

        if (response.data.success) {
          const purchaseData = response.data.data; // This is now a single object, not an array
          console.log("Purchase Data Object:", purchaseData); // Log the purchase data object

          if (purchaseData) {
            // Check if purchaseData exists
            console.log("Purchase Details:", purchaseData); // Log the purchase details

            setFormData({
              PurchaseOrderNumber: purchaseData.PurchaseOrderNumber || "",
              PODate: purchaseData.Values?.PODate || "",
              POUpdatedDate: purchaseData.Values?.POUpdatedData || "",
              POType: purchaseData.Values?.POType || "",
              CreatedBy: purchaseData.Values?.CreatedBy || "",
              UpdatedBy: purchaseData.Values?.UpdatedBy || "",
              PONumber: purchaseData.Values?.PONumber || "",
              VendorName: purchaseData.VendorName || "",
              TenderCodeNumber: purchaseData.Values?.tenderCodeNumber || "", 
              TermsAndConditions:  purchaseData.Values?.TermsAndConditions || "",
              Status: purchaseData.Values?.Status || "",
            });
          } else {
            console.error("Purchase data is undefined");
          }
        } else {
          console.error(
            "Failed to fetch project details:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [purchasePK]);

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

  const handleTableChange = (e) => {
    const { name, value } = e.target;

    //Update form data with the new value
    let updatedFormDataLine = {
      ...formDataLine,
      [name]: { ...formDataLine[name], value },
    };

          // Calculate the MaterialId if necessary fields change
          if (name === 'MaterialName' || name === 'Grade' || name === 'Dimension') {
            const materialId = `${updatedFormDataLine.MaterialName.value}${updatedFormDataLine.Grade.value}-${updatedFormDataLine.Dimension.value}`;
            updatedFormDataLine.MaterialId = {
              ...formDataLine.MaterialId,  // Use formDataLine instead of prevState
              value: materialId,
            };
          }

    if (name === "Quantity" || name === "Rate") {
      const quantity = updatedFormDataLine.Quantity.value || 0;
      const unitPrice = updatedFormDataLine.Rate.value || 0;

      const amount = parseFloat(quantity) * parseFloat(unitPrice);

      updatedFormDataLine = {
        ...updatedFormDataLine,
        Price: { ...updatedFormDataLine.Price, value: amount || 0 },
      };
    }

    setFormDataLine(updatedFormDataLine);
  };

  // Open dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setFormDataLine(initalFormData); // Reset form data when closing
  };

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

  useEffect(() => {
    if (open) {
      // Calculate the highest SNO value and increment it by 1
      const highestSNO =
        lineItems.length > 0
          ? Math.max(...lineItems.map((_, index) => index + 1))
          : 0;
      const newSNO = highestSNO + 1;

      // Initialize formData with the incremented SNO value
      setFormDataLine({
        ...formDataLine,
        PoLineNo: { value: newSNO.toString(), type: "text" },
      });
    }
  }, [open, lineItems]);

  useEffect(() => {
    if (formData.VendorName && projectPK) {
      console.log(projectPK, "PK TO get line items");
      console.log(formData.VendorName, "Vendorname TO get line items");

      const fetchData = async () => {
        try {
          const response = await apiClient.get(
            `/api/vendor/get-all-lineitems-by-vendor-and-buy`,
            {
              params: {
                ProjectPK: projectPK,
                VendorName: formData.VendorName,
              },
            }
          );

          console.log("Line Items API Response:", response.data);

          // Access the LineItems inside the result object
          if (
            response.data &&
            response.data.result &&
            Array.isArray(response.data.result.LineItems)
          ) {
            const fetchedLineItemNames = response.data.result.LineItems.map(
              (item) => item.WorkOrderId
            );
            setLineItemNames(fetchedLineItemNames); // Set the line item names to state
            console.log("LineItems Data:", fetchedLineItemNames);
          } else {
            console.log(
              "No Line Items found in response or LineItems is not an array"
            );
          }
        } catch (error) {
          console.error("Error fetching line items:", error);
        }
      };

      fetchData();
    }
  }, [formData.VendorName, projectPK]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract only the values from formDataLine
    const newLineItem = {
      ...Object.fromEntries(
        Object.entries(formDataLine).map(([key, obj]) => [key, obj.value])
      ),
      PurchaseOrderId: purchasePK,
    };

    console.log(
      JSON.stringify(newLineItem),
      ": JSON formatted data for single entry"
    );

    try {
      const response = await apiClient.post(
        "/api/vendor/create-purchase-order-line-item",
        newLineItem,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Axios automatically handles non-2xx statuses as errors, so this block runs only on success.
      if (response.status === 200 && response.data.result.success) {
        console.log("Line item created successfully:", response.data.message);
        setFormDataLine(initalFormData); // Clear form
        handleClose(); // Close dialog
        window.location.reload(); // Reload page
      } else {
        console.error(
          "Error creating line item:",
          response.data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error during form submission:", error);
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
                  PurchaseOrder Details
                </Typography>
              </Grid>
              {/* <Grid item>
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
                </Grid>
              </Grid> */}
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
                        Po Number:
                      </Typography>
                      <TextField
                        id="PONumber"
                        name="PONumber"
                        type="text"
                        value={formData.PurchaseOrderNumber}
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

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: "5px", fontSize: "12px" }}
                      >
                        PO Create Date:
                      </Typography>
                      <TextField
                        name="PODate" // Updated name to "CreationDate"
                        type="date"
                        value={formData.PODate || ""}
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
                        PO Type:
                      </Typography>
                      <TextField
                        id="POType"
                        name="POType"
                        variant="standard"
                        value={formData.POType}
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
                        Project Number:
                      </Typography>
                      <TextField
                        id="ProjectNumber"
                        name="ProjectNumber"
                        variant="standard"
                        value={formData.PONumber}
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
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 2, fontSize: "12px" }}
                      >
                        Created By:
                      </Typography>
                      <TextField
                        name="CreatedBy"
                        value={formData.CreatedBy || ""}
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

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 2, fontSize: "12px" }}
                      >
                        Updated By:
                      </Typography>
                      <TextField
                        id="UpdatedBy"
                        name="UpdatedBy"
                        variant="standard"
                        value={formData.UpdatedBy || " "}
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

                {/* New Row with End Date */}
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
                        name="VendorName" // Updated name to "CreationDate"
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
                        Status:
                      </Typography>
                      <Select
                        id="Status"
                        name="Status"
                        value={formData.Status}
                        onChange={handleChange}
                        variant="standard"
                        inputProps={{
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
                        required
                      >
                        <MenuItem value="Open">Open</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                      </Select>
                    </Box>
                  </FormControl>
                </Grid>


                {/* new row */}
                {/* <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 1, fontSize: "12px" }}
                      >
                        Tender Number:
                      </Typography>
                      <TextField
                        id="TenderNumber"
                        name="TenderNumber"
                        variant="standard"
                        value={formData.tenderCodenumber}
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
                </Grid> */}

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 2, fontSize: "12px" }}
                      >
                        PO Updated Date:
                      </Typography>
                      <TextField
                        id="POUpdatedDate"
                        name="POUpdatedDate"
                        type="date"
                        variant="standard"
                        value={formData.POUpdatedDate}
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

                <Grid item xs={12}>
                      <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleClickOpen}
                    >
                      Add
                    </Button>
                    <Dialog open={open} onClose={handleClose}>
                      <DialogTitle>Add New Item</DialogTitle>
                      <DialogContent>
                        <Grid container spacing={3}>
                          {Object.keys(formDataLine).map((key) => {
                            const fieldStyle = {
                              height: 40,
                            };

                            // Dropdowns for specific fields
                            if (key === "LineStatus") {
                              return (
                                <Grid item xs={12} md={3} key={key}>
                                  <FormControl
                                    variant="standard"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                  >
                                    <InputLabel shrink>Line Status</InputLabel>
                                    <Select
                                      name="LineStatus"
                                      value={formDataLine.LineStatus?.value || ""}
                                      onChange={handleTableChange}
                                      label="Line Status"
                                      sx={{ ...fieldStyle, height: 32 }}
                                    >
                                      <MenuItem value="Active" sx={{ height: 28 }}>
                                        Active
                                      </MenuItem>
                                      <MenuItem value="In Active" sx={{ height: 28 }}>
                                        In Active
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                              );
                            }

                            // Render Autocomplete for "Product" key
                            if (key === "Product") {
                              return (
                                <Grid item xs={12} md={3} key={key}>
                                  <Stack spacing={4}>
                                    <Autocomplete
                                      id="product-autocomplete"
                                      freeSolo
                                      options={productsName.map(
                                        (option) => option.Name
                                      )}
                                      disableClearable
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          name="Product"
                                          label="Product"
                                          value={formDataLine.Product?.value || ""}
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
                                        setFormDataLine((prevState) => ({
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

                            if (key === "WorkOrderId") {
                              return (
                                <Grid item xs={12} md={3} key={key}>
                                  <TextField
                                    select
                                    name={key}
                                    label="WorkOrderId"
                                    variant="standard"
                                    value={formDataLine[key].value}
                                    onChange={handleTableChange}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    fullWidth
                                  >
                                    {lineItemNames.length > 0 ? (
                                      lineItemNames.map((lineItemName, index) => (
                                        <MenuItem key={index} value={lineItemName}>
                                          {lineItemName}
                                        </MenuItem>
                                      ))
                                    ) : (
                                      <MenuItem disabled>
                                        No line items available
                                      </MenuItem>
                                    )}
                                  </TextField>
                                </Grid>
                              );
                            }

                            if (key === "MaterialName") {
                          return (
                                        <Grid item xs={12} md={3} key={key}>
                                        <FormControl
                                            variant="standard"
                                            fullWidth
                                            sx={{ mb: 1 }}
                                          >
                                            <InputLabel shrink>Material Name</InputLabel>
                                            <Select
                                              name="MaterialName"
                                              value={formData.MaterialName?.value || ""}
                                              onChange={handleTableChange}
                                              label="Material Name"
                                              sx={{
                                                ...fieldStyle,
                                                height: 32,
                                                lineHeight: "1.5em",
                                              }}
                                            >
                                              <MenuItem value="Aluminum" sx={{ height: 28 }}>
                                              Aluminum
                                              </MenuItem>
                                              <MenuItem value="Copper" sx={{ height: 28 }}>
                                              Copper
                                              </MenuItem>
                                              <MenuItem value="EN" sx={{ height: 28 }}>
                                              EN Series
                                              </MenuItem>
                                              <MenuItem value="SS" sx={{ height: 28 }}>
                                              SS Series
                                              </MenuItem>
                                <MenuItem value="Brass" sx={{ height: 28 }}> Brass</MenuItem>
                                              <MenuItem value="MS" sx={{ height: 28 }}>
                                              MS
                                              </MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>
                                  );
                          }

                            return (
                              <Grid item xs={12} md={3} key={key}>
                                <TextField
                                  name={key}
                                  label={
                                    key === "PoLineNo"
                                      ? "PoLineNo"
                                      : key.replace(/([A-Z])/g, " $1").trim()
                                  }
                                  type={formDataLine[key].type}
                                  variant="standard"
                                  value={formDataLine[key].value}
                                  onChange={handleTableChange}
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    mb: 1,
                                    "& .MuiOutlinedInput-root": {
                                      height: 40,
                                    },
                                  }}
                                />
                              </Grid>
                            );
                          })}
                        </Grid>
                      </DialogContent>

                      <DialogActions>
                        <Button onClick={handleClose} color="primary">
                          Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                          Submit
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>

                  <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>PO Line No</StyledTableCell>
                          <StyledTableCell>WorkOrder ID</StyledTableCell>
                          <StyledTableCell>MaterialName</StyledTableCell>
                          <StyledTableCell>Grade</StyledTableCell>
                          <StyledTableCell>Dimension</StyledTableCell>
                          <StyledTableCell>Material Id</StyledTableCell>
                          <StyledTableCell>Quantity</StyledTableCell>
                          <StyledTableCell>Unit</StyledTableCell>
                          <StyledTableCell>Rate</StyledTableCell>
                          <StyledTableCell>Price</StyledTableCell>
                          {/* <StyledTableCell>Line Status</StyledTableCell> */}
                          <StyledTableCell>Purchase Date</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                          {lineItems
                            .sort((a, b) => a.PoLineNo - b.PoLineNo) 
                            .map((item, index) => (
                              <TableRow
                                key={item.PK}
                                onClick={() => handleRowClick(item, index)}
                                style={{ cursor: "pointer" }}
                              >
                                <StyledTableCell>{item.PoLineNo}</StyledTableCell>
                                <StyledTableCell>{item.WorkOrderId}</StyledTableCell>
                                <StyledTableCell>{item.Values.MaterialName}</StyledTableCell>
                                <StyledTableCell>{item.Values.Grade}</StyledTableCell>
                                <StyledTableCell>{item.Values.Dimension}</StyledTableCell>
                                <StyledTableCell>{item.MaterialId}</StyledTableCell> 
                                <StyledTableCell>{item.Values.Quantity}</StyledTableCell>
                                <StyledTableCell>{item.Values.Unit}</StyledTableCell>
                                <StyledTableCell>{item.Values.Rate}</StyledTableCell>
                                <StyledTableCell>{item.Values.Price}</StyledTableCell>
                                {/* <StyledTableCell>{item.Values.LineStatus}</StyledTableCell> */}
                                <StyledTableCell>{item.Values.PurchaseDate}</StyledTableCell>
                              </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                  </TableContainer>


                </Grid>

                {/* <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 2, fontSize: "12px" }}
                      >
                        Terms And Conditions:
                      </Typography>
                      <TextField
                        id="TermsAndConditions"
                        name="TermsAndConditions"
                        type="text"
                        variant="standard"
                        value={formData.TermsAndConditions}
                        onChange={handleChange}
                        InputProps={{
                          style: {
                            height: "auto", // Set height to auto
                            width: 150,
                            padding: "0px 0px", 
                            fontSize: "14px", 
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

                <Grid
                  container
                  spacing={3}
                  style={{ marginTop: "0px" }}
                  justifyContent="space-between"
                >
                  <Grid item xs={12} sm={5} style={{ marginLeft: "20px" }}>
                    <Typography variant="h6" component="div" fontWeight="bold">
                      Terms and Conditions
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    id="TermsAndConditions"
                    name="TermsAndConditions"
                    value={formData.TermsAndConditions}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </form>

            <br />

            {/* {selectedItem && (
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
              >
                <DialogTitle>Add New Row</DialogTitle>
                <br />
                <DialogContent>
                  <Grid container spacing={3}>
                    {Object.keys(formDataLine).map((key) => {})}
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button onClick={handleAddRow}>Submit</Button>
                </DialogActions>
              </Dialog>
            )} */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default POLineItem;