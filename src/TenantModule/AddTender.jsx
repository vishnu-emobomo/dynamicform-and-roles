import React, { useState, useEffect, useRef } from "react";
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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Stack,
} from "@mui/material";
import { styled } from "@mui/system";
import apiClient from "../utlis/apiClient";
import EditIcon from "@mui/icons-material/Edit";
import TenderPDF from "../PDFComponent/TenderPDF";
import MailOutlined from "@mui/icons-material/MailOutlined";
import "../ComponentCss/AddTender.css";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import Attachments from "../AdditionalComponent/Attachments";
import { tableCellClasses } from "@mui/material/TableCell";
import axios from "axios";
import { Backdrop, CircularProgress } from "@mui/material";
import { WindowSharp } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import { Checkbox } from "@mui/material";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "10px", // Adjust this to change only the placeholder size
  },
});

const defaultTermsAndConditions = `PAYMENT TERMS               : 40% ADVANCE AND REMAINING PAYMENT 15DAYS
TAXES                                  : EXTRA GST 18% Applicable.
VALIDITY OF QUOTATION  : 30DAYS FROM THE DATE OF QUOTATION
DELIVERY                            : AS Per Your Schedule`;

const initalFormData = {
  SNO: { value: "", type: "text" },
  Description: { value: "", type: "text" },
  ItemCode: { value: "",type: "text"},
  QTYSETS: { value: "", type: "text" },
  UnitPrice: { value: "", type: "text" },
  TotalPrice: { value: "", type: "text" },
};

const AddTender = () => {
  const currentDate = new Date().toLocaleDateString("en-GB");
  const formRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [snoCounter, setSnoCounter] = useState(1); // State for SNO counter
  const [incrementValue, setIncrementValue] = useState();
  const [loading, setLoading] = useState(false);
  const [form1Data, setForm1Data] = useState(initalFormData);
  const [customerName, setCustomerName] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  const [formData, setFormData] = useState({
    EntityType: "Tender",
    Name: "",
    CreationDate: currentDate,
    Values: {
      Unit:"",
      TenderCodenumber: "",
      Quantity: "",
      TenderStatus: "",
      CustomerName: "",
      PONumber: "",
      PORecivedDate: "",
      TenderDuedate: "",
      TenderSubmitDate: "",
      Comments: "",
      TenderValue: "",
      TermsAndConditions: defaultTermsAndConditions,
    },
    // files: [], 
  });

  const [fileData, setFileData] = useState([])

  const [files, setFiles] = useState([]); // State for storing files


  const onFilesAdded = (newFiles) => {
    setFileData((prevFileData) => ({
      ...prevFileData,
      files: newFiles, // Directly store raw File objects
    }));
  
    console.log(newFiles, ": raw files passed to fileData");
  };
  
  

  // Handle form field changes

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedValues = { ...prevData.Values, [name]: value };

      // Calculate TotalPrice if the updated field is Quantity or UnitPrice
      if (name === "Quantity" || name === "UnitPrice") {
        const quantity = parseFloat(updatedValues.Quantity) || 0;
        const unitPrice = parseFloat(updatedValues.UnitPrice) || 0;
        updatedValues.TotalPrice = (quantity * unitPrice).toFixed(2); // Format to two decimal places
      }

      return {
        ...prevData,
        Values: updatedValues,
        Name: name === "Name" ? value : prevData.Name,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
  
    // Check if required fields are filled
    const { Name, Values } = formData;
  
    // Format line_items data
    const line_item = tableData.map((row) => ({
      SNO: row.SNO,
      description: row.Description,
      itemCode: row.ItemCode,
      qty: row.QTYSETS,
      unitPrice: row.UnitPrice,
      totalPrice: row.TotalPrice,
    }));
  
    // Formatted data as per your requirement
    const formattedData = {
      tenderValue: Values.TenderValue,
      CompanyName: formData.Values.CustomerName, 
      Unit: formData.Values.Unit,
      listItems: line_item,
      TermsAndConditions:
        Values.TermsAndConditions || "Default terms if needed",
    };
  
    const updatedFormData = {
      ...formData,
      Name: formData.Values.TenderCodenumber,
    };
  
    try {
      // Submit the formatted data to the specified PDF API
      const pdfResponse = await axios.post(
        "https://ie2us8ure5.execute-api.ap-south-1.amazonaws.com/Dev/api/pdf/tender.pdf",
        JSON.stringify(formattedData, null, 2),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (pdfResponse.data && pdfResponse.data) {
        const base64Pdf = pdfResponse.data; // Access the base64-encoded data
  
        const byteCharacters = atob(base64Pdf); // Decode base64 to binary string
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
  
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob); // Create a URL for the Blob
  
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = Values.TenderCodenumber; // Set the desired filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        URL.revokeObjectURL(blobUrl);
      } else {
        console.error("Failed to generate PDF");
      }
  
      // Submit the tender data to the first API
      const tenderResponse = await apiClient.post(
        `/api/tender/create-tender`,
        updatedFormData
      );
  
      const tenderResult = tenderResponse.data.result.PK;
      console.log("Tender created successfully:", tenderResult);
  
      if (fileData.files && fileData.files.length > 0) {
        try {
          const response = await apiClient.post("/api/s3-file/uploadfile", {
            files: fileData.files.map((file) => ({ fileName: file.name })),
            sortKey: tenderResult,
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
  
      const updatedLineItems = tableData.map((item) => ({
        ...item,
        tenderPK: tenderResult,
      }));
  
      // Sequentially submit each line item with retry mechanism
      const submitLineItem = async (row, retries = 3) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            await apiClient.post("/api/tender/create-tender-line-item", row);
            console.log(`Line item ${row.SNO} submitted successfully.`);
            return;
          } catch (error) {
            if (attempt < retries) {
              console.warn(`Retrying line item ${row.SNO} submission, attempt ${attempt}`);
            } else {
              console.error(`Line item ${row.SNO} submission failed: ${error}`);
            }
          }
        }
      };
  
      for (const row of updatedLineItems) {
        await submitLineItem(row);
      }
  
      if (tenderResponse.status === 200) {
        alert("Submitted successfully");
  
        // Reset form fields after successful submission
        setFormData({
          EntityType: "Tender",
          Name: "",
          CreationDate: currentDate,
          Values: {
            TenderCodenumber: "",
            Quantity: "",
            UnitPrice: "",
            TotalPrice: "",
            TenderStatus: "",
            CustomerName: "",
            Drawing: "",
            PONumber: "",
            PORecivedDate: "",
            TenderDuedate: "",
            TenderSubmitDate: "",
            Comments: "",
            TermsAndConditions: defaultTermsAndConditions,
          },
        });
        setSnoCounter(1);
        
        // Reload the current page
        window.location.reload();
  
      } else {
        alert(
          `Error: ${tenderResponse.data.message || "Failed to submit tender"}`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error in submitting form");
    } finally {
      setLoading(false);
    }
  };
  
  


  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit(); // Submits the form
    }
  };

  // add tender line items
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#325c67",
      color: theme.palette.common.white,
      padding: "10px",
      verticalAlign: "top",
      letterSpacing: 0,
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

  const fetchData = async () => {
    try {
      // Fetch customers
      const customerResponse = await apiClient.get('/api/customer/get-all-customer');
      
      // Log the entire response to confirm the structure
      // console.log("Full customer response:", customerResponse);
      
      // Check the structure of the response and set customer names
      if (Array.isArray(customerResponse.data)) {
        setCustomerName(customerResponse.data);
        // console.log("Customer Name Array:", customerResponse.data);
      } else {
        console.error("Unexpected data format for Customer:", customerResponse.data);
        setCustomerName([]);
      }
    } catch (error) {
      console.error("Error fetching Customer: ", error);
      setCustomerName([]); // Reset customers on error
    }
  };
 

  useEffect(() => {
      fetchData();
  }, []);

  const  fetchAutoIncrement = async () => {
    try {
      const AutoValue = await apiClient.get('/api/tender/get-tender-auto-increment');
      
      // Log the entire response to confirm the structure
      // console.log("Full increment response:", AutoValue.data.incrementValue);
      setIncrementValue(AutoValue.data.incrementValue);

    } catch (error) {
      console.error("Error fetching Customer: ", error);
    }
  };

  useEffect(() => {
    fetchAutoIncrement();
}, []);


    useEffect(() => {
      // Get current year
      const currentYear = new Date().getFullYear();

      // Set the formatted value with prefix, increment value, and current year
      const formattedValue = `SMSL/${incrementValue}/${currentYear}`;

      setFormData((prevData) => ({
        ...prevData,
        Values: {
          ...prevData.Values,
          TenderValue: formattedValue,
        },
      }));
    },[incrementValue]);

  
    // Handle change for table form data
    const handleTableChange = (event) => {
      const { name, value } = event.target;
  
      setForm1Data((prevState) => {
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

    const handleRowClick = (row, index) => {
      // console.log("Row clicked:", row);
    
      const updatedFormData = {};
    
      // Populate formData with the clicked row's data
      Object.keys(form1Data).forEach((key) => {
        updatedFormData[key] = {
          ...form1Data[key],
          value: row[key] || "", // Assign row value or empty string if not present
        };
      });
    
      // console.log("Populating formData for editing:", updatedFormData);
    
      // Update state with row data and index
      setForm1Data(updatedFormData);
      setEditingRowIndex(index);
    
      // Open dialog
      handleOpen();
    };
  
    // Handle adding a row to the table
    const handleAddRow = () => {
      // Prepare the row with only values from form1Data
      const newRow = Object.keys(form1Data).reduce((acc, key) => {
        acc[key] = form1Data[key].value; // Extract only the value for each key
        return acc;
      }, {});
    
      if (editingRowIndex !== null) {
        // Update the existing row during edit mode
        setTableData((prevData) =>
          prevData.map((row, index) =>
            index === editingRowIndex ? { ...row, ...newRow } : row
          )
        );
    
        // Reset editing row index after edit
        setEditingRowIndex(null);
      } else {
        // Assign SNO only for new rows
        newRow.SNO = snoCounter.toString(); // Use current counter value for SNO
        setTableData([...tableData, newRow]);
    
        // Increment SNO counter for next row
        setSnoCounter((prevCounter) => prevCounter + 1);
      }
    
      // Close the dialog
      handleClose();
    
      // Reset the form for the next row
      setForm1Data({
        ...initalFormData,
        SNO: { value: snoCounter.toString(), type: "text" }, // Use current counter for form
      });
    };


    useEffect(() => {
      if (open && editingRowIndex === null) {
        setForm1Data({
          ...initalFormData,
          SNO: { value: snoCounter.toString(), type: "text" }, 
        });
      }
    }, [open, snoCounter, editingRowIndex]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <SubHeader />

      <Grid
        container
        sx={{ flexGrow: 1, marginTop: "-80px", padding: 0 }}
        spacing={6}
      >
        <Grid item xs={12} md={11}>
          <Box
            sx={{
              minHeight: "calc(100vh - 112px)",
              backgroundColor: "white",
              padding: 2, // Adding padding for the form
              borderRadius: "10px", // Adds border radius
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adds shadow
              marginLeft: "150px",
            }}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  Details
                </Typography>
              </Grid>

              <Grid item>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* <Button
                style={{
                  minWidth: '30px',
                  minHeight: '30px',
                  borderRadius: '50%',
                  color: 'black',
                  backgroundColor: 'rgb(255, 255, 255)',
                  cursor: 'pointer', // Optional: to maintain the pointer cursor on hover
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.width = '30px';
                  e.currentTarget.style.height = '30px';
                  e.currentTarget.style.borderRadius = '50%';
                  e.currentTarget.style.color = 'black';
                  e.currentTarget.style.backgroundColor = 'rgb(222, 222, 222)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.width = '';
                  e.currentTarget.style.height = '';
                  e.currentTarget.style.borderRadius = '';
                  e.currentTarget.style.color = '';
                  e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)';
                }}
              >
                 <MailOutlined fontSize="small" style={{ color: 'black' }} />
                </Button>

              <TenderPDF formData={formData} /> */}

                  <Grid item xs={12} sm={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{
                        height: "20px",
                        width: "53px",
                        fontSize: "0.75rem",
                      }}
                      onClick={handleButtonClick}
                      fullWidth
                    >
                      <h5>submit</h5>
                    </Button>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <form
              noValidate
              autoComplete="off"
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <Grid container spacing={3}>

              <Grid item xs={12} md={2}>
               <Autocomplete
                  id="customer-name-autocomplete"
                  options={customerName.map((customer) => customer.Name)}
                  value={formData.Values.CustomerName || ""}
                  onChange={(event, newValue) => {
                    handleChange({ target: { name: "CustomerName", value: newValue } });
                  }}
                  freeSolo
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer Name"
                      variant="standard"
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {params.InputProps.endAdornment ? null : params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                  <StyledTextField
                    id="Unit"
                    name="Unit"
                    label="Unit"
                    type="text"
                    value={formData.Values.Unit}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <StyledTextField
                    id="TenderCodenumber"
                    name="TenderCodenumber"
                    label="Tender Code Number"
                    type="text"
                    value={formData.Values.TenderCodenumber}
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
                    type="text"
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
                      name="TenderStatus"
                      label="Tender Status"
                      value={formData.Values.TenderStatus}
                      onChange={handleChange}
                      labelId="tender-status-label"
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
                    label="PO Recived Date"
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
                    label="Tender Due date"
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

                <Grid item xs={12}>
                  <div>
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
                          Line Items
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          sx={{ height: "20px", width: "15px" }}
                          onClick={handleOpen}
                        >
                          Add
                        </Button>
                      </Grid>
                    </Grid>

                    <Dialog open={open} onClose={handleClose} maxWidth="md">
                      <DialogTitle>Add Line Items</DialogTitle>
                      <br />
                      <DialogContent>
                        <Grid container spacing={3}>
                          {Object.keys(initalFormData).map((key) => {
                            // Common style for reduced height
                            const fieldStyle = {
                              height: 40, // Set common height for all fields
                            };

                            // Render Other Fields from initialFormData
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
                                  type={initalFormData[key].type}
                                  variant="standard"
                                  value={form1Data[key].value}
                                  onChange={handleTableChange}
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    mb: 1, // Add margin-bottom for spacing
                                    "& .MuiOutlinedInput-root": {
                                      height: 40, // Reduce height for TextField
                                    },
                                  }}
                                />
                              </Grid>
                            );
                          })}
                        </Grid>
                      </DialogContent>

                      <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleAddRow}>Submit</Button>
                      </DialogActions>
                    </Dialog>

                    <TableContainer
                      component={Paper}
                      sx={{ marginTop: 3, flex: 1 }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                          <StyledTableCell>Action</StyledTableCell>
                            {Object.keys(initalFormData).map((key) => (
                              <StyledTableCell key={key}>
                                {key === "QTYSETS"
                                  ? "QTY/SETS"
                                  : key === "SNO"
                                  ? "SNO"
                                  : key === "MakeBuy"
                                  ? "Make/Buy" // Customize label for MakeBuy
                                  : key.replace(/([A-Z])/g, " $1").trim()}
                              </StyledTableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {tableData.map((row, index) => (
                            <StyledTableRow key={index}>
                            <StyledTableCell>
                                <Checkbox
                                    onClick={() => {
                                      handleRowClick(row, index);
                                    }}
                                    style={{cursor: "pointer",}}
                                    color="primary"
                                />
                            </StyledTableCell>
                              {Object.keys(initalFormData).map((key) => (
                                <StyledTableCell key={key}>
                                  {row[key]}{" "}
                                  {/* Directly access the value (number, string, etc.) */}
                                </StyledTableCell>
                              ))}
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
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

                  <Grid item xs={12} sm={1}></Grid>
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

                    // InputProps={{
                    //   readOnly: !isEditing, // Set readonly when not editing
                    // }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Comments"
                    name="Comments"
                    variant="outlined"
                    value={formData.Values.Comments}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    multiline
                    rows={2}
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

export default AddTender