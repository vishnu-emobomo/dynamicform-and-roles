import React, { useState, useEffect } from "react";
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
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import { getUserId } from "../utlis/tokenUtils";
import apiClient from "../utlis/apiClient";
import axios from "axios";
import { tableCellClasses } from "@mui/material/TableCell";
import { Backdrop, CircularProgress } from "@mui/material";
import Attachments from "../AdditionalComponent/Attachments";
import { WindowSharp } from "@mui/icons-material";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';


const initalFormData = {
  SNO: { value: "", type: "text" },
  Description: { value: "", type: "text" },
  ItemCode: { value: "", type: "text" },
  QTYSETS : { value: "", type: "text" },
  UnitPrice : { value: "", type: "text" },
  TotalPrice: { value: "", type: "text" },
};

const UpdateTender = () => {
  const location = useLocation();
  const { tenderSK } = location.state || {}; // Safely access projectPK
  const [lineItems, setLineItems] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [formDataLine, setFormDataLine] = useState(initalFormData);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lineItemPK, setLineItemPK] = useState("");
  const [incrementValue, setIncrementValue] = useState(1);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]); // State for storing files

  const [fileData, setFileData] = useState({
    SortKey: "",
    Name: "TenderFile",
    Type:"Tender",
    files: [], 
  })

  const [tenderPK, setTenderPK] = useState(encodeURIComponent(tenderSK));
  const [formData, setFormData] = useState({
    EntityType: "Tender",
    CreationDate: "",
    Values: {
      Name: "",
      TenderCodenumber: "",
      TenderStatus: "",
      CustomerName: "",
      Drawing: "",
      PONumber: "",
      Unit:"",
      PORecivedDate: "",
      TenderDuedate: "",
      TenderSubmitDate:"",
      TenderValue:"",
      TermsAndConditions: "",
      Comments: "",
    },
  });

  const  tender = tenderSK;

  const formatDate = (dateString) => {
    // Return an empty string if dateString is invalid
    if (!dateString) return "";
  
    // Check if the dateString is already in "yyyy-MM-dd" format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
  
    // Parse "dd/MM/yyyy" format and convert to "yyyy-MM-dd"
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  
    return ""; // Return empty string if format doesn't match
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedValues = { ...prevData.Values, [name]: value };

      // Automatically calculate TotalPrice if Quantity and UnitPrice change
      if (name === "Quantity" || name === "UnitPrice") {
        const quantity = parseFloat(updatedValues.Quantity) || 0;
        const unitPrice = parseFloat(updatedValues.UnitPrice) || 0;
        updatedValues.TotalPrice = (quantity * unitPrice).toFixed(2);
      }

      return {
        ...prevData,
        Values: updatedValues,
      };
    });
  };

  useEffect(() => {
    // Get user ID and set it
    const id = getUserId();
    if (id) {
      setFormData((prevData) => ({
        ...prevData,
        userPK: id,
      }));
    }
  }, []);

  useEffect(() => {
    const fetchTenderData = async () => {
      try {
        const response = await apiClient.get(
          `/api/tender/get-tender-by-id/${tenderPK}`
        );
        const fetchedData = response.data;


        console.log(response.data,": the  data to get");
  
        if (fetchedData.data && fetchedData.data.Values) {
          const values = fetchedData.data.Values;
          setFormData((prevData) => ({
            ...prevData,
            EntityType: fetchedData.data.EntityType || prevData.EntityType,
            CreationDate: fetchedData.data.CreationDate || prevData.CreationDate,
            Values: {
              ...prevData.Values,
              Name: values.Name || "",
              TenderCodenumber: values.TenderCodenumber || "",
              TenderStatus: values.TenderStatus || "",
              CustomerName: values.CustomerName || "",
              Drawing: values.Drawing || "",
              PONumber: values.PONumber || "",
              Unit: values.Unit || "",
              PORecivedDate: formatDate(values.PORecivedDate),
              TenderDuedate: formatDate(values.TenderDuedate),
              TenderSubmitDate: formatDate(values.TenderSubmitDate),
              TenderValue: values.TenderValue || "",
              Comments: values.Comments || "",
              TermsAndConditions: values.TermsAndConditions || "",
            },
          }));
        } else {
          console.warn("Values section not found in the response.");
        }
      } catch (error) {
        console.error("Error fetching tender data: ", error);
      }
    };
  
    if (tenderPK) {
      fetchTenderData();
    }
  }, [tenderPK]);
  
  const onFilesAdded = (newFiles) => {
    setFileData((prevFileData) => ({
      ...prevFileData,
      files: newFiles, // Directly store raw File objects
    }));
  
    console.log(newFiles, ": raw files passed to fileData");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
  
    const { Name, Values } = formData;
  
    console.log("Form Data:", formData);
    console.log("Current lineItems:", lineItems);
  
    // Format line_items data
    const List_Item = sortedLineItems.map((row) => ({
      SNO: row.Values.SNO,
      description: row.Name,
      itemCode: row.Values.ItemCode,
      qty: row.Values.QTYSETS,
      unitPrice: row.Values.UnitPrice,
      totalPrice: row.Values.TotalPrice,
    }));
  
    // Formatted data with a default `text` value
    const formattedData = {
      tenderValue: Values.TenderValue,
      CompanyName: Values.CustomerName,
      Unit: Values.Unit,
      listItems: List_Item,
      TermsAndConditions: Values.TermsAndConditions || "Default terms if needed",
    };
  
    console.log("Formatted Data for Submission:", JSON.stringify(formattedData, null, 2));
  
    try {
      const token = sessionStorage.getItem("authToken");
  
      // Submit data to PDF API
      const pdfResponse = await axios.post(
        "https://ie2us8ure5.execute-api.ap-south-1.amazonaws.com/Dev/api/pdf/tender.pdf",
        JSON.stringify(formattedData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      console.log("PDF API Response:", pdfResponse);
  
      if (pdfResponse.data) {
        const base64Pdf = pdfResponse.data;
        // console.log("Base64 PDF Data:", base64Pdf);
  
        if (typeof base64Pdf === "string" && base64Pdf.length > 0) {
          const byteCharacters = atob(base64Pdf);
          const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
          const byteArray = new Uint8Array(byteNumbers);
  
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const blobUrl = URL.createObjectURL(blob);
  
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = Values.TenderCodenumber;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        } else {
          console.error("PDF generation failed: Invalid base64 data");
          alert("PDF generation failed: Invalid data received.");
        }
      }
  
      // Update the tender data
      const response = await axios.put(
        `https://natapvtqhj.execute-api.ap-south-1.amazonaws.com/Dev/api/tender/update-tender/${tenderPK}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Tender updated successfully:", response.data);
      alert("Updated successfully");



      if (fileData.files && fileData.files.length > 0) {
        try {
          const response = await apiClient.post("/api/s3-file/uploadfile", {
            files: fileData.files.map((file) => ({ fileName: file.name })),
            sortKey: tenderSK,
            Name: fileData.files.map((file) => ({ fileName: file.name })),
            Type: "Tender",
          });
      
          const { files: signedUrls } = response.data;
      
          for (const file of fileData.files) {
            const signedUrlObj = signedUrls.find((item) => item.fileName === file.name);
      
            if (!signedUrlObj) {
              throw new Error(`No signed URL found for file: ${file.name}`);
            }
      
            const { signedUrl } = signedUrlObj;
      
            await axios.put(signedUrl, file, {
              headers: {
                "Content-Type": file.type,
              },
            });
      
            console.log(`File ${file.name} uploaded successfully.`);
          }
        } catch (error) {
          console.error("Error during file upload:", error);
        }
      } else {
        console.log("No files to upload.");
      }

      window.location.reload();
  
      } catch (error) {
        console.error("Error occurred:", error);
    
        if (error.response) {
          console.error("Response Status:", error.response.status);
          console.error("Response Data:", error.response.data);
          alert(`Unable to update: ${error.response.data.message || "Unknown error"}`);
        } else {
          alert("Network error. Please try again.");
        }
      } finally {
        setLoading(false); // End loading
      }
  };
  


  // get the attachment files
  useEffect(() => {
    const fetchDrawingById = async () => {
      console.log(tenderPK, ": SK from project");
      const SK = encodeURIComponent(tenderPK);

      try {
        const response = await apiClient.get(
          `/api/s3-file/get-s3Attachments-By-Id/${SK}`
        );
        console.log("Full API response:", response.data);

        // Extract data array from the response
        const dataArray = response.data?.data || [];

        // Collect file URLs along with their PK and SK values
        const filesWithKeys = dataArray.flatMap((item) => {
          const locationData = item.Location || {};

          // Map each URL with its corresponding PK and SK
          return Object.entries(locationData)
            .filter(
              ([_, value]) =>
                typeof value === "string" && value.startsWith("http")
            )
            .map(([_, url]) => ({
              PK: item.PK,
              SK: item.SK,
              url,
            }));
        });

        console.log("Extracted files with PK and SK:", filesWithKeys);

        // Update state with the extracted data
        setFileList(filesWithKeys); // Example: [{ PK: ..., SK: ..., url: ... }, ...]
      } catch (error) {
        console.error("Error fetching S3 attachments:", error);
      }
    };

    if (tenderPK) fetchDrawingById();
  }, [tenderPK]);
  

  // get the line item data from tender 
  useEffect(() => {
    // Check if tenderPK is defined and not null
    if (!tenderPK) {
      console.error("Tender ID is not defined");
      return;
    }
  
    console.log("Tender ID:", tenderPK);
  
    apiClient.get(`/api/lineitem/get-lineitem-by-tender?tenderId=${tenderPK}`)
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
  }, [tenderPK]);

    // Open dialog
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    // Close dialog
    const handleClose = () => {
      setOpen(false);
      setFormDataLine(initalFormData); // Reset form data when closing
    };

     // Handle row click to open dialog and set selected item
  const handleRowClick = (item, index) => {
    setSelectedItem(item);
    setLineItemPK(item.PK);
   
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

    // Set the Description field with the Name value from the item
    updatedFormDataLine["Description"] = {
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
      Name: formDataLine["Description"]?.value || "",
      QTYSETS: formDataLine["QTYSETS"]?.value || "",
      ItemCode: formDataLine["ItemCode"]?.value || "",
      UnitPrice: formDataLine["UnitPrice"]?.value || "",
      TotalPrice: formDataLine["TotalPrice"]?.value || "",
      tenderPK: tender,
      lineItemId: lineItemPK,
    };

    console.log(updatedLineItem);

    try {
      const token = sessionStorage.getItem("authToken");

      // console.log(token, "Token");
      const response = await axios.put(
        `https://natapvtqhj.execute-api.ap-south-1.amazonaws.com/Dev/api/lineitem/update-tender-lineitem`,
        updatedLineItem,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add authorization if needed
          },
        }
      );
      console.log("Response from API:", response);

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

    const handleTableChange = (event) => {
      const { name, value } = event.target;
    
      setFormDataLine((prevState) => {
        const updatedFormData = {
          ...prevState,
          [name]: {
            ...prevState[name],
            value: value,
          },
        };
    
        if (name === "QTYSETS" || name === "UnitPrice") {
          const quantity = updatedFormData.QTYSETS?.value || 0;
          const unitPrice = updatedFormData.UnitPrice?.value || 0;
          const amount = quantity * unitPrice;
    
          updatedFormData.TotalPrice = {
            ...prevState.TotalPrice,
            value: `${amount}`,
          };
        }
    
        return updatedFormData;
      });
    };

  const handleSubmitLineItem = async (e) => {
    e.preventDefault();

    // Extract only the values from formDataLine
    const newLineItem = {
      ...Object.fromEntries(
        Object.entries(formDataLine).map(([key, obj]) => [key, obj.value])
      ),
      tenderPK: tender, 
    };

    // Log the data in JSON format
    console.log(
      JSON.stringify(newLineItem),
      ": JSON formatted data for single entry"
    );

    try {
      // Make the POST request to create the line item
      const response = await apiClient.post(
        "/api/tender/create-tender-line-item",
        newLineItem,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Successfully inserted data
      console.log("Line item created successfully:", response.data);

      // Reset formDataLine to its initial state (clear form)
      setFormDataLine(initalFormData);
      handleClose(); // Close dialog after successful submission

      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.error("Error during form submission:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

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
        SNO: { value: newSNO.toString(), type: "text" },
      });
    }
  }, [open, lineItems]);

  
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
    // Get current year
    const currentYear = new Date().getFullYear();

    // Set the formatted value with prefix, increment value, and current year
    const formattedValue = `SMSL/V${incrementValue}/${currentYear}`;

    setFormData((prevData) => ({
      ...prevData,
      Values: {
        ...prevData.Values,
        TenderValue: formattedValue,
      },
    }));
  }, [incrementValue]);

  const sortedLineItems = [...lineItems].sort((a,b) =>  a.Values.SNO - b.Values.SNO);

  const handleDelete = async (pk,sk,url) => {
    setLoading(true);
    const updateDelete = {
      url: url,
      pk: pk,
      sk: sk,
      tableName:"S3DyamobdFile",
    };

    if (window.confirm(`Are you sure you want to delete this file?`)) {
        try {
          const response = await apiClient.post("/api/remove", updateDelete); 
          console.log(response.data);
      
          // Optionally, refresh tenders after deletion
          setFileList((prevTenders) =>
            prevTenders.filter((item) => item.PK !== pk)
          );
        } catch (error) {
          console.error("Error deleting tender:", error);
        } finally {
          setLoading(false); // Set loading to false when fetch completes
        }
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
              marginRight: "25px",
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
              marginLeft: "-50px",
            }}
          >
         <Grid container spacing={3} alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom>
                Update Tender
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right" }}>
              <Button 
                variant="contained" 
                color="primary" 
                type="submit" 
                onClick={handleSubmit}
                sx={{ height: "30px", fontSize: "0.8rem", padding: "8px 8px" , width: "10px" }}
                >
                Submit
              </Button>
            </Grid>
          </Grid>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={2}>
                  <TextField
                    id="CustomerName"
                    name="CustomerName"
                    label="Customer Name"
                    variant="standard"
                    type="text"
                    value={formData.Values.CustomerName} 
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="Unit"
                    name="Unit"
                    label="Unit"
                    variant="standard"
                    type="text"
                    value={formData.Values.Unit} 
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <StyledTextField
                    id="TenderCodenumber"
                    name="TenderCodenumber"
                    label="Tender Code Number"
                    type="text"
                    value={formData.Values.TenderCodenumber || ""}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="PONumber"
                    name="PONumber"
                    label="PO Number"
                    // type="number"
                    variant="standard"
                    value={formData.Values.PONumber}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>


                <Grid item xs={12} md={2}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="tender-status-label" shrink>
                      Tender Status
                    </InputLabel>
                    <Select
                      id="TenderStatus"
                      labelId="tender-status-label" // Ensure labelId matches
                      name="TenderStatus"
                      value={formData.Values.TenderStatus}
                      onChange={handleChange} // Ensure this updates the state correctly
                    >
                      <MenuItem value="Open">Open</MenuItem>
                      <MenuItem value="Submitted">Submitted</MenuItem>
                      <MenuItem value="Won">Won</MenuItem>
                      <MenuItem value="Lost">Lost</MenuItem>
                      <MenuItem value="Issued">Issued</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>



                <Grid item xs={12} md={2}>
                  <TextField
                    id="PORecivedDate"
                    name="PORecivedDate"
                    label="PO Received Date"
                    type="date"
                    variant="standard"
                    value={formData.Values.PORecivedDate}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="TenderDuedate"
                    name="TenderDuedate"
                    label="Tender Due Date"
                    type="date"
                    variant="standard"
                    value={formData.Values.TenderDuedate}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="TenderSubmitDate"
                    name="TenderSubmitDate"
                    label="Tender Submit Date"
                    type="date"
                    variant="standard"
                    value={formData.Values.TenderSubmitDate}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="TenderValue"
                    name="TenderValue"
                    label="Tender ID"
                    type="text"
                    variant="standard"
                    value={formData.Values.TenderValue}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={9}>
                  <Typography variant="h6" component="div" fontWeight="bold">
                    Attachments
                  </Typography>
                  <Attachments
                    onFilesAdded={onFilesAdded}
                    existingFiles={files}
                  />
                </Grid>

                <Grid item xs={12} md={9}>
                  <Typography variant="h6" gutterBottom>
                    File List
                  </Typography>
                  {fileList.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <StyledTableRow>
                            <StyledTableCell>File Name</StyledTableCell>
                            <StyledTableCell>Actions</StyledTableCell>
                          </StyledTableRow>
                        </TableHead>
                        <TableBody>
  {fileList.map((file, index) => {
  
    const fullFileName = file.url.substring(file.url.lastIndexOf("/") + 1);
    const decodedFileName = decodeURIComponent(fullFileName);
    const cleanFileName = decodedFileName.replace(/^C#1232\/(Tender|Project)\//, '');

    return (
      <StyledTableRow key={index}>
        <StyledTableCell>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", fontSize: '15px' }}
          >
            {cleanFileName}
          </a>
        </StyledTableCell>
        <StyledTableCell>
          <DeleteSweepIcon
            onClick={() => handleDelete(file.PK, file.SK, file.url)}
            style={{ color: "red", cursor: "pointer" }}
          />
        </StyledTableCell>
      </StyledTableRow>
    );
  })}
</TableBody>


                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>No files available</Typography>
                  )}
                </Grid>

              <Grid item xs={12}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    sx={{ height: "30px", fontSize: "0.8rem", padding: "8px 8px" , width: "10px" }}

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


                          return (
                            <Grid item xs={12} md={3} key={key}>
                              <TextField
                                name={key}
                                label={
                                key === "SNO"
                                ? "SNO"
                                : key === "QTYSETS"
                                ? "QTY/SETS"
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
                      <Button onClick={handleSubmitLineItem} color="primary">
                        Submit
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>

                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>SNo</StyledTableCell>
                        <StyledTableCell> Description</StyledTableCell>
                        <StyledTableCell> Item Code</StyledTableCell>
                        <StyledTableCell>QTY/SETS</StyledTableCell>
                        <StyledTableCell>Unit Price</StyledTableCell>
                        <StyledTableCell>Total Price</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedLineItems.map((item, index) => (
                        <TableRow key={item.PK}>
                          <StyledTableCell
                            onClick={() => handleRowClick(item, index)}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                             {item.Values.SNO}
                          </StyledTableCell>
                          <StyledTableCell
                            onClick={() => handleRowClick(item, index)}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {item.Name}
                          </StyledTableCell>

                          <StyledTableCell
                            onClick={() => handleRowClick(item, index)}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {item.Values.ItemCode}
                          </StyledTableCell>

                          <StyledTableCell
                            onClick={() => handleRowClick(item, index)}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {item.Values.QTYSETS}
                          </StyledTableCell>

                          <StyledTableCell
                            onClick={() => handleRowClick(item, index)}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {item.Values.UnitPrice}
                          </StyledTableCell>

                          <StyledTableCell
                            onClick={() => handleRowClick(item, index)}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {item.Values.TotalPrice}
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
                    maxWidth="md"
                  >
                    <DialogTitle>Edit Line Item</DialogTitle>
                    <br />
                    <DialogContent>
                      <Grid container spacing={3}>
                        {Object.keys(initalFormData).map((key) => {

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
              </Grid>

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

                  <Grid item xs={12} sm={1}>
                    
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    id="TermsAndConditions"
                    name="TermsAndConditions"
                    value={formData.Values.TermsAndConditions}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="Comments"
                    name="Comments"
                    label="Comments"
                    variant="outlined"
                    value={formData.Values.Comments}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    multiline
                    rows={2}
                    fullWidth
                  />
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

export default UpdateTender;
