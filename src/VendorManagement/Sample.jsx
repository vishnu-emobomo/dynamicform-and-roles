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
import { getUserId } from "../utlis/tokenUtils";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import apiClient from "../utlis/apiClient";


const initalFormData = {
  SNO: { value: "", type: "text" },
  Name: { value: "", type: "text" },
  Product: { value: "", type: "text" },
  Desc: { value: "", type: "text" },
  Quantity: { value: "", type: "number" },
  Drawings: { value: "", type: "text" },
  CompletedQuantity: { value: "", type: "text" },
  PendingQuantity: { value: "", type: "text" },
  QCCleared: { value: "", type: "text" },
  PaymentReceived: { value: "", type: "text" }, // Ensure this exists
  DeliverDate: { value: "", type: "date" },
  StartDate: { value: "", type: "date" },
  ActualStartDate: { value: "", type: "date" },
  EndDate: { value: "", type: "date" },
  ActualEndDate: { value: "", type: "date" },
  TeamMember: { value: "", type: "text" },
  MakeBuy: { value: "", type: "text" }, // Ensure this exists
  VendorName: { value: "", type: "text" },
  LineStatus: { value: "", type: "text" },
};

const LineItems = () => {
  const [userPK, setUserPK] = useState(null);
  const location = useLocation();
  const { projectPK, projectData } = location.state || {}; // Safely access projectPK
  const [lineItemPK, setLineItemPK] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formDataLine, setFormDataLine] = useState(initalFormData);
  const [open, setOpen] = useState(false);
  const [productsName, setProductsName] = useState([]);
  const [vendors, setVendors] = useState([]);


  // Fetch userPK on mount
  useEffect(() => {
    const id = getUserId();
    if (id) {
      setUserPK(id);
    }
  }, []); // Run this once on mount

  const [formData, setFormData] = useState({
    PONumber: "",
    ProjectDeliverydate: "",
    TenderCodenumber: "",
    Name: "",
    CreationDate: "",
    StartDate: "",
    EndDate: "",
    DeliverDate: "",
  });

  const projectId = encodeURIComponent(projectPK); // Adjust this line
 

  const userPK1 = encodeURIComponent(userPK); // Adjust this line
  console.log(userPK1, " the sample  to get the project id");

  

  // Fetch LineItems from API and display in table
  useEffect(() => {
    console.log("Project ID:", projectId);
  
    apiClient
      .get(
        `/api/line-item/get-lineitems-by-project`, 
        {
          params: {
            projectId: projectPK, 
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
  }, [projectId]);

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

  const handleAddRow = async () => {
    // Construct the data object based on formDataLine
    const updatedLineItem = {
      SNO: formDataLine["SNO"]?.value || "",
      Name: formDataLine["Name"]?.value || "",
      Product: formDataLine["Product"]?.value || "",
      Quantity: formDataLine["Quantity"]?.value || "",
      Drawings: formDataLine["Drawings"]?.value || "",
      Status: formDataLine["Status"]?.value || "",
      Completion: formDataLine["Completion"]?.value || "",
      QCCleared: formDataLine["QCCleared"]?.value || "",
      PaymentReceived: formDataLine["PaymentReceived"]?.value || "",
      DeliverDate: formDataLine["DeliverDate"]?.value || "",
      StartDate: formDataLine["StartDate"]?.value || "",
      ActualStartDate: formDataLine["ActualStartDate"]?.value || "",
      EndDate: formDataLine["EndDate"]?.value || "",
      ActualEndDate: formDataLine["ActualEndDate"]?.value || "",
      TeamMember: formDataLine["TeamMember"]?.value || "",
      VendorName: formDataLine["VendorName"]?.value || "",
      MakeBuy: formDataLine["MakeBuy"]?.value || "",
      projectPK: projectPK,
      lineItemId: lineItemPK,
    };

    console.log(updatedLineItem);

    try {
      const response = await apiClient.put(
        `/api/line-item/update-lineitem`, 
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
        updatedFormDataLine["SNO"] = {
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




  useEffect(() => {
    console.log("Updated lineItems:", lineItems);
  }, [lineItems]);


  // Fetch project details and display in the form using the projectPK
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectPK) return;

      try {
        const response = await apiClient.get(
          `/api/project/get-project-by-id/${projectId}`
        );
        if (response.data.success) {
          const projectData = response.data.data[0]; // Access the first item in the array
          console.log("Project Details Response:",  projectData.Values);

          setFormData({
            PONumber: projectData.Values.PONumber || "",
            TenderCodenumber: projectData.Values.TenderCodenumber || "",
            Name: projectData.Name || "",
            ProjectDeliverydate: projectData.Values.ProjectDeliverydate || "",
            CreationDate: formatDate(projectData.CreationDate) || "",
            StartDate: projectData.Values.StartDate || "",
            EndDate: projectData.Values.EndDate || "",
            DeliverDate: projectData.Values.DeliverDate || "",
          });
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
  }, [projectPK]);


// update the form data of project 
  const handleSaveClick = () => {
    const requestBody = {
      tenderId: projectData.SK,
      CreationDate: formData.CreationDate,
      Name: formData.Name,
      Values: {
        PONumber: formData.PONumber,
        ProjectDeliverydate: formData.ProjectDeliverydate,
        TenderCodenumber: formData.TenderCodenumber,
        StartDate: formData.StartDate,
        EndDate: formData.EndDate,
        DeliverDate: formData.DeliverDate,
      },
    };

    console.log("Sending request with body:", requestBody); // Log the request body

    apiClient.put(
      `/api/project/update-project/${projectId}`,
      requestBody
    )
      .then((response) => {
        console.log("Response:", response);
        if (response.data.success) {
          console.log("Project updated successfully");
          setIsEditing(false);
        } else {
          console.error("Update failed:", response.data.message); // Log failure message
        }
      })
      .catch((error) => {
        console.error("There was an error updating the project!", error);
        // Check if error response is available
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
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

  



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Extract only the values from formDataLine
    const newLineItem = {
      ...Object.fromEntries(
        Object.entries(formDataLine).map(([key, obj]) => [key, obj.value])
      ),
      projectPK: projectPK, // Add projectPK

    };
  
    // Log the data in JSON format
    console.log(JSON.stringify(newLineItem), ": JSON formatted data for single entry");
  
    try {
      const response = await apiClient.post(
        `/api/line-item/create-line-item`, // Assuming this is the relative URL
        newLineItem, // Directly passing the line item data as the request body
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        console.log("Line item created successfully:", data);
        // Reset formDataLine to its initial state (clear form)
        setFormDataLine(initalFormData);
        handleClose(); // Close dialog after successful submission
      // Reload the page after submission
        window.location.reload();
      } else {
        console.error("Error creating line item:", response.statusText);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
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


      useEffect(() => {
        if (open) {
          // Calculate the highest SNO value and increment it by 1
          const highestSNO = lineItems.length > 0 ? Math.max(...lineItems.map((_, index) => index + 1)) : 0;
          const newSNO = highestSNO + 1;
      
          // Initialize formData with the incremented SNO value
          setFormDataLine({
            ...formDataLine,
            SNO: { value: newSNO.toString(), type: "text" }, 
          });
        }
      }, [open, lineItems]); 
      

  

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
                  Project Details
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
                        PRJ Number:
                      </Typography>
                      <TextField
                        id="PONumber"
                        name="PONumber"
                        type="text"
                        value={formData.PONumber}
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
                        Project Delivery Date:
                      </Typography>
                      <TextField
                        name="ProjectDeliverydate" // Updated name to "CreationDate"
                        type="date"
                        value={formData.ProjectDeliverydate || ""} 
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
                        Tender Code Number:
                      </Typography>
                      <TextField
                        id="TenderCodenumber"
                        name="TenderCodenumber"
                        type="text"
                        variant="standard"
                        value={formData.TenderCodenumber}
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
                        sx={{ marginRight: 2, fontSize: "12px" }}
                      >
                        Project Name:
                      </Typography>
                      <TextField
                        id="Name"
                        name="Name"
                        type="text"
                        variant="standard"
                        value={formData.Name}
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

                {/* New Row with Creation Date */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 2, fontSize: "12px" }}
                      >
                        Creation Date:
                      </Typography>
                      <TextField
                        name="CreationDate" // Updated name to "CreationDate"
                        type="date"
                        value={formData.CreationDate || ""} // Ensure the value is in "YYYY-MM-DD" format
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

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 2, fontSize: "12px" }}
                      >
                        Start Date:
                      </Typography>
                      <TextField
                        id="StartDate"
                        name="StartDate"
                        type="date"
                        variant="standard"
                        value={formData.StartDate || " "}
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

                {/* New Row with End Date */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 2, fontSize: "12px" }}
                      >
                        End Date:
                      </Typography>
                      <TextField
                        name="EndDate" // Updated name to "CreationDate"
                        type="date"
                        value={formData.EndDate || ""}
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

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ marginRight: 2, fontSize: "12px" }}
                      >
                        Deliver Date:
                      </Typography>
                      <TextField
                        id="DeliverDate"
                        name="DeliverDate"
                        type="date"
                        variant="standard"
                        value={formData.DeliverDate}
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
              </Grid>
            </form>

            <br/>
            
            <div>
              <Button variant="contained" color="primary" onClick={handleClickOpen}>
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
                      if (key === "MakeBuy") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <FormControl variant="standard" fullWidth sx={{ mb: 1 }}>
                              <InputLabel shrink>Make/Buy</InputLabel>
                              <Select
                                name="MakeBuy"
                                value={formDataLine.MakeBuy?.value || ""}
                                onChange={handleTableChange}
                                label="Make/Buy"
                                sx={{ ...fieldStyle, height: 32 }}
                              >
                                <MenuItem value="Make" sx={{ height: 28 }}>
                                  Make
                                </MenuItem>
                                <MenuItem value="Buy" sx={{ height: 28 }}>
                                  Buy
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        );
                      }

                      if (key === "LineStatus") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <FormControl variant="standard" fullWidth sx={{ mb: 1 }}>
                              <InputLabel shrink>Line Status</InputLabel>
                              <Select
                                name="LineStatus"
                                value={formDataLine.LineStatus?.value || ""}
                                onChange={handleTableChange}
                                label="Line Status"
                                sx={{ ...fieldStyle ,
                                        height: 32 }}
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

                      if (key === "PaymentReceived") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <FormControl variant="standard" fullWidth sx={{ mb: 1 }}>
                              <InputLabel shrink>Payment Received</InputLabel>
                              <Select
                                name="PaymentReceived"
                                value={formDataLine.PaymentReceived?.value || ""}
                                onChange={handleTableChange}
                                label="Payment Received"
                                sx={{ ...fieldStyle,
                                      height: 32
                                  }}
                              >
                                <MenuItem value="Yes" sx={{ height: 28 }}>
                                  Yes
                                </MenuItem>
                                <MenuItem value="No" sx={{ height: 28 }}>
                                  No
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        );
                      }

                      if (key === "QCCleared") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <FormControl variant="standard" fullWidth sx={{ mb: 1 }}>
                              <InputLabel shrink>QC Cleared</InputLabel>
                              <Select
                                name="QCCleared"
                                value={formDataLine.QCCleared?.value || ""}
                                onChange={handleTableChange}
                                label="QC Cleared"
                                sx={{ ...fieldStyle,
                                        height: 32 }}
                              >
                                <MenuItem value="Yes" sx={{ height: 28 }}>
                                  Yes
                                </MenuItem>
                                <MenuItem value="No" sx={{ height: 28 }}>
                                  No
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
                                options={productsName.map((option) => option.Name)}
                                disableClearable
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Product"
                                    variant="standard"
                                    value={formDataLine.Product?.value || ""}
                                    onChange={handleTableChange}
                                    fullWidth
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    sx={{ mb: 1 }}
                                  />
                                )}
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

                      // Render Autocomplete for "VendorName" key
                      if (key === "VendorName") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <Stack spacing={4}>
                              <Autocomplete
                                id="vendor-autocomplete"
                                freeSolo
                                options={vendors.map((option) => option.Name)}
                                disableClearable
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Vendor Name"
                                    variant="standard"
                                    value={formDataLine.VendorName?.value || ""}
                                    onChange={handleTableChange}
                                    fullWidth
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    sx={{ mb: 1 }}
                                  />
                                )}
                                onInputChange={(event, newValue) => {
                                  setFormDataLine((prevState) => ({
                                    ...prevState,
                                    VendorName: {
                                      ...prevState.VendorName,
                                      value: newValue,
                                    },
                                  }));
                                }}
                              />
                            </Stack>
                          </Grid>
                        );
                      }

                
                      return (
                        <Grid item xs={12} md={3} key={key}>
                          <TextField
                            name={key}
                            label={
                              key === "SNO"
                                ? "SNO"
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
                  <Button onClick={handleClose} color="secondary">
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
                    <StyledTableCell>Line Item No</StyledTableCell>
                    <StyledTableCell> Name</StyledTableCell>
                    <StyledTableCell> Product</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Drawings</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Completed Quantity</StyledTableCell>
                    <StyledTableCell>Pending Quantity</StyledTableCell>
                    <StyledTableCell>Payment Received</StyledTableCell>
                    <StyledTableCell>Deliver Date</StyledTableCell>
                    <StyledTableCell>Start Date</StyledTableCell>
                    <StyledTableCell>Actual Start Date</StyledTableCell>
                    <StyledTableCell>End Date</StyledTableCell>
                    <StyledTableCell>Actual End Date</StyledTableCell>
                    <StyledTableCell>Team Member</StyledTableCell>
                    <StyledTableCell>Make/Buy</StyledTableCell>
                    <StyledTableCell>Vendor Name</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lineItems.map((item, index) => (
                    <TableRow
                      key={item.PK}
                      onClick={() => handleRowClick(item, index)}
                      style={{ cursor: "pointer" }}
                    >
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{item.Name}</StyledTableCell>
                      <StyledTableCell>{item.Values.Product}</StyledTableCell>
                      <StyledTableCell>{item.Values.Quantity}</StyledTableCell>
                      <StyledTableCell>{item.Values.Drawings}</StyledTableCell>
                      <StyledTableCell>{item.Values.LineStatus}</StyledTableCell>
                      <StyledTableCell>
                        {item.Values.CompletedQuantity}
                      </StyledTableCell>
                      <StyledTableCell>
                        {item.Values.PendingQuantity}
                      </StyledTableCell>
                      <StyledTableCell>
                        {item.Values.PaymentReceived}
                      </StyledTableCell>
                      <StyledTableCell>
                        {item.Values.DeliverDate}
                      </StyledTableCell>
                      <StyledTableCell>{item.Values.StartDate}</StyledTableCell>
                      <StyledTableCell>
                        {item.Values.ActualStartDate}
                      </StyledTableCell>
                      <StyledTableCell>{item.Values.EndDate}</StyledTableCell>
                      <StyledTableCell>
                        {item.Values.ActualEndDate}
                      </StyledTableCell>
                      <StyledTableCell>
                        {item.Values.TeamMember}
                      </StyledTableCell>
                      <StyledTableCell>{item.Values.MakeBuy}</StyledTableCell>
                      <StyledTableCell>
                        {item.Values.VendorName}
                      </StyledTableCell>
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
                <DialogTitle>Add New Row</DialogTitle>
                <br />
                <DialogContent>
                  <Grid container spacing={3}>
                    {Object.keys(initalFormData).map((key) => {
                      // Conditionally render dropdowns for MakeBuy and PaymentReceived
                      if (key === "MakeBuy") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <FormControl  variant="standard"
                              fullWidth
                              sx={{ mb: 1 }}>
                              <InputLabel shrink>Make/Buy</InputLabel>
                              <Select
                                name="MakeBuy"
                                value={formDataLine.MakeBuy?.value || ""}
                                onChange={handleTableChange}
                                label="Make/Buy"
                              >
                                 <MenuItem value="Make" sx={{ height: 28 }}>
                                  Make
                                </MenuItem>
                                <MenuItem value="Buy" sx={{ height: 28 }}>
                                  Buy
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        );
                      }

                      if (key === " LineStatus") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <FormControl variant="standard" fullWidth>
                              <InputLabel shrink>Line Status</InputLabel>
                              <Select
                                name="LineStatus"
                                value={formDataLine.LineStatus?.value || ""}
                                onChange={handleTableChange}
                                label="Make/Buy"
                              >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="In Active">In Active</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        );
                      }

                      if (key === "PaymentReceived") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <FormControl variant="standard" fullWidth>
                              <InputLabel shrink>Payment Received</InputLabel>
                              <Select
                                name="PaymentReceived"
                                value={
                                  formDataLine.PaymentReceived?.value || ""
                                }
                                onChange={handleTableChange}
                                label="Payment Received"
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        );
                      }

                      // Render other fields as text fields
                      return (
                        <Grid item xs={12} md={3} key={key}>
                          <TextField
                            name={key}
                            label={
                              key === "SNO"
                                ? "SNO"
                                : key.replace(/([A-Z])/g, " $1").trim()
                            }
                            type={initalFormData[key].type}
                            variant="standard"
                            value={formDataLine[key].value}
                            onChange={handleTableChange}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button onClick={handleAddRow}>Submit</Button>
                </DialogActions>
              </Dialog>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LineItems;