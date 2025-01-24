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

import "../ComponentCss/AddTender.css";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import { tableCellClasses } from "@mui/material/TableCell";
import axios from "axios";
import { Backdrop, CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "10px", // Adjust this to change only the placeholder size
  },
});

const initalFormData = {
  SNO: { value: "", type: "text" },
  ProjectNumber: { value: "", type: "text" },
  Description: { value: "", type: "text" },
  ItemCode: { value: "", type: "text" },
  Quantity: { value: "", type: "text" },
  WorkOrderId: { value: "", type: "text" },
};

const AddWorkOrder = () => {
  const formRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [incrementValue, setIncrementValue] = useState();
  const [snoCounter, setSnoCounter] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [form1Data, setForm1Data] = useState(initalFormData);
  const [projectsName, setProjectsName] = useState([]);
  const [descriptionOptions, setDescriptionOptions] = useState([]);
  const [vendors, setVendors] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [formData, setFormData] = useState({
    GatePass: "",
    VendorName: "",
    Status: "",
    Issued_Date: "",
    Received_Date: "",
    Comments: "",
    ReturnStatus: "",
    line_items: [],
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);

    setLoading(true); // Start loading

    // console.log(formData); // Print formData to verify it's correct

    // Format line_items data
    const line_item = tableData.map((row) => ({
      SNO: row.SNO,
      ProjectNumber: row.ProjectNumber,
      Description: row.Description,
      Quantity: row.Quantity,
      WorkOrderId: row.WorkOrderId,
      ItemCode: row.ItemCode,
    }));

    // Formatted data as per your requirement
    const formattedData = {
      GatePass: formData.GatePass,
      VendorName: formData.VendorName,
      ReturnStatus: formData.ReturnStatus,
      Issued_Date: formData.Issued_Date,
      Received_Date: formData.Received_Date,
      listItems: line_item,
    };

    // console.log(
    //   "Formatted Data for Submission:",
    //   JSON.stringify(formattedData, null, 2)
    // );

    try {
      const pdfResponse = await axios.post(
        "https://q3cyoq1992.execute-api.ap-south-1.amazonaws.com/Dev/api/work.order/work-order-pdf",
        JSON.stringify(formattedData, null, 2),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // console.log(pdfResponse);
      // Check if the response contains base64-encoded PDF data
      if (pdfResponse.data && pdfResponse.data) {
        const base64Pdf = pdfResponse.data; // Access the base64-encoded data
        // console.log(base64Pdf);

        // Convert the base64 string to a Blob
        const byteCharacters = atob(base64Pdf); // Decode base64 to binary string
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob from the byte array
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob); // Create a URL for the Blob

        // Trigger download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = formData.GatePass; // Set the desired filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the Blob URL
        URL.revokeObjectURL(blobUrl);
      } else {
        console.error("Failed to generate PDF");
      }

      const response = await apiClient.post(
        `/api/in-out-source/create-outsource`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Response:", response); // Log full response to inspect its structure

      // Check for the expected fields in the new response structure
      if (response?.data?.message && response?.data?.workOrderResult) {
        const { message, workOrderResult, lineItemResults, lambdaResponse } =
          response.data;

        // If workOrderResult is present, consider the operation successful
        if (workOrderResult) {
          // console.log("Created successfully:", message);
          alert(message || "Inserted successfully");


          // Reload the page or perform further actions
          window.location.reload();
        } else {
          console.error(
            "Error creating Work Order:",
            message || "Unknown error"
          );
          alert(message || "Unable to insert the Work Order");
        }
      } else {
        console.error("Unexpected response format:", response.data);
        alert("Unexpected response format. Please check the API response.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("There was a network error, please try again.");
    } finally {
      setLoading(false); // End loading
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

  useEffect(() => {
    if (open) {
      setForm1Data({
        ...initalFormData,
        SNO: { value: snoCounter.toString(), type: "text" }, // Set SNO as a string
      });
    }
  }, [open, snoCounter]);

  // Handle change for table form data
  const handleTableChange = (event) => {
    const { name, value } = event.target;
  
    // Update form data
    setForm1Data((prevState) => {
      const updatedFormData = {
        ...prevState,
        [name]: {
          ...prevState[name],
          value: value,
        },
      };
  
      return updatedFormData;
    });
  
    // Perform specific actions based on the name of the field
    if (name === "ProjectNumber" && value) {
      ProjectLineItem(value);
    } 
  
    if (name === "Description") {
      const selectedDescription = descriptionOptions.find(
        (option) => option.label === value
      );
  
      if (selectedDescription) {
        setForm1Data((prevState) => ({
          ...prevState,
          Description: {
            ...prevState.Description,
            value: value,
          },
        }));
  
        // Fetch additional data by Description PK
        ProjectLineItemById(selectedDescription.pk);
      } else {
        // Clear the PK if the entered description is not found
        setForm1Data((prevState) => ({
          ...prevState,
          Description: {
            ...prevState.Description,
            value: value,
            pk: "",
          },
        }));
      }
    }
  };
  

  // Handle adding a row to the table
  const handleAddRow = () => {
    // Prepare the row with only values from form1Data
    const newRow = Object.keys(form1Data).reduce((acc, key) => {
      acc[key] = form1Data[key].value; // Extract only the value for each key
      return acc;
    }, {});

    // Add the new row to the table data
    setTableData([...tableData, newRow]);

    setFormData({
      ...formData,
      line_items: [...tableData, newRow],
    });

    // Increment the SNO counter for the next row
    setSnoCounter(snoCounter + 1);

    // Close the dialog
    handleClose();

    // Clear all fields in form1Data by setting each field to an empty string
    const clearedFormData = Object.keys(initalFormData).reduce((acc, key) => {
      acc[key] = { ...initalFormData[key], value: "" };
      return acc;
    }, {});

    // Set SNO with the incremented value, and reset the rest of the form fields
    setForm1Data({
      ...clearedFormData,
      SNO: { value: (snoCounter + 1).toString(), type: "text" },
    });
  };

  const fetchAutoIncrement = async () => {
    try {
      const AutoValue = await apiClient.get(
        "/api/in-out-source/gate-pass-increment"
      );

      // Log the entire response to confirm the structure
       console.log("Full increment response:", AutoValue.data.incrementValue);
      setIncrementValue(AutoValue.data.incrementValue);
    } catch (error) {
      console.error("Error fetching Customer: ", error);
    }
  };

  useEffect(() => {
    fetchAutoIncrement();
  },[]);

  useEffect(() => {
    // Get current year
    const currentYear = new Date().getFullYear();

    // Conditionally format the value based on Status
    let formattedValue = `SMSL/G/${incrementValue}/${currentYear}`;
    if (formData.Status === "In Source") {
      formattedValue += `/R${incrementValue}`;
    }

    // Update the formData state with the formatted value
    setFormData((prevData) => ({
      ...prevData,
      GatePass: formattedValue,
    }));
  },[incrementValue]);

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
      // Fetch products
      const projectResponse = await apiClient.get(
        `/api/project/get-all-projects`
      );

      // console.log("Projects:", projectResponse.data);

      if (Array.isArray(projectResponse.data.data)) {
        setProjectsName(projectResponse.data.data);
      } else {
        console.error(
          "Unexpected data format for products:",
          projectResponse.data.data
        );
        setProjectsName([]);
      }
    } catch (error) {
      console.error("Error fetching Project Details: ", error);
      setProjectsName([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ProjectLineItem = async (ProjectNumber) => {
    // console.log(ProjectNumber);

    try {
      const projectResponse = await apiClient.get(
        `/api/line-item/get-lineitems-by-projectnumber`,
        {
          params: { ProjectNumber },
        }
      );

      // console.log("Full Response:", projectResponse.data);

      // Check if the response contains LineItems
      if (projectResponse.data.success && projectResponse.data.LineItems) {
        const descriptionOptions = projectResponse.data.LineItems.map(
          (item) => ({
            label: item.Values.Description,
            pk: item.PK,
          })
        );
        setDescriptionOptions(descriptionOptions); 
      } else {
        console.error("No line items found in the response.");
        setDescriptionOptions([]); // Reset if no line items found
      }
    } catch (error) {
      console.error("Error fetching line items:", error);
      setDescriptionOptions([]); // Reset on error
    }
  };

  // GET THE ITEMS BY THE LINE
  const ProjectLineItemById = async (projectLinePK) => {
    const projectLinePKs = encodeURIComponent(projectLinePK);

    // console.log(projectLinePKs,": the link from des")

    try {
      const projectResponse = await apiClient.get(
        `/api/line-item/get-line-item-by-id/${projectLinePKs}`
      );

      // console.log("Full Response:", projectResponse.data.data[0]);

      const lineItem = projectResponse.data.data[0];

      if (lineItem) {
        const { Values } = lineItem;

        setForm1Data((prevState) => ({
          ...prevState,
          WorkOrderId: {
            ...prevState.WorkOrderId,
            value: Values?.WorkOrderId || "",
          },
          Quantity: {
            ...prevState.Quantity,
            value: Values?.QTYSETS || "",
          },
          Description: {
            ...prevState.Description,
            value: Values?.Description || "",
          },
          ItemCode: {
            ...prevState.ItemCode,
            value: Values?.ItemCode || "",
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching line items:", error);
    }
  };


  // Handle removing a row from the table
  const handleRemoveRow = (index) => {
     console.log("remove row");
    // Remove the row by filtering out the row at the given index
    const updatedTableData = tableData.filter(
      (_, rowIndex) => rowIndex !== index
    );

    // Adjust the SNO after removal by updating each row's SNO in the remaining rows
    const updatedTableDataWithSno = updatedTableData.map((row, idx) => ({
      ...row,
      SNO: (idx + 1).toString(), 
    }));

    // Update the table data and form data
    setTableData(updatedTableDataWithSno);

    // Set the form data with the updated table data
    setFormData({
      ...formData,
      line_items: updatedTableDataWithSno,
    });

     setSnoCounter(updatedTableDataWithSno.length + 1);
  };

  // get the list of vendor name with the PK
const fetchVendors = async () => {
    try {
      const response = await apiClient.get(`/api/vendor/getallvendors`);

      console.log(response.data, " the data vendor");

      // Create an object to map vendor names to their PKs
      const vendorMap = {};
      response.data.forEach((vendor) => {
        vendorMap[vendor.Name] = vendor.PK; // Assuming each vendor has a 'PK' field
      });

      // console.log("API Response:", vendorMap);
      setVendors(vendorMap); // Store the mapping in state
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    }
  };
  
  // get the list of vendors from the api
  useEffect(() => {
    fetchVendors();
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
                  <TextField
                    id="GatePass"
                    name="GatePass"
                    label="Gate Pass "
                    type="text"
                    value={formData.GatePass}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Autocomplete
                    freeSolo
                    options={Object.keys(vendors || {})} // Ensure vendors is an object
                    value={form1Data.VendorName}
                    onChange={(event, newValue) => {
                      // Set the vendor name
                      setFormData((prev) => ({
                        ...prev,
                        VendorName: newValue,
                      }));

                      const selectedVendor = vendors[newValue];
                      if (selectedVendor) {
                        console.log(selectedVendor);
                        setSelectedVendor(selectedVendor);
                      }
                    }}
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Vendor Name"
                        name="VendorName"
                        variant="standard"
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                      />
                    )}
                  />
                </Grid>


           


                <Grid item xs={12} md={2}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="status-label" shrink>
                      Status
                    </InputLabel>
                    <Select
                      id="Status"
                      name="Status"
                      label="Status"
                      value={formData.Status}
                      onChange={handleChange}
                      labelId="status-label"
                    >
                      <MenuItem value="Out Source">Out Source</MenuItem>
                      <MenuItem value="In Source">In Source</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="Issued_Date"
                    name="Issued_Date"
                    label="Issued Date"
                    type="Date"
                    value={formData.Issued_Date}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="Received_Date"
                    name="Received_Date"
                    label="Received Date"
                    type="Date"
                    value={formData.Received_Date}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="ReturnStatus-label" shrink>
                      ReturnStatus
                    </InputLabel>
                    <Select
                      id="ReturnStatus"
                      name="ReturnStatus"
                      label="ReturnStatus"
                      value={formData.ReturnStatus}
                      onChange={handleChange}
                      labelId="ReturnStatus-label"
                    >
                      <MenuItem value="RETURNABLE GATEPASS">
                        RETURNABLE GATEPASS
                      </MenuItem>
                      <MenuItem value="NON RETURNABLE GATEPASS">
                        NON RETURNABLE GATEPASS
                      </MenuItem>
                    </Select>
                  </FormControl>
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

                    <Dialog open={open} onClose={handleClose}  maxWidth="md">
                      <DialogTitle>Add Line Items</DialogTitle>
                      <br />
                      <DialogContent>
                        <Grid container spacing={3}>
                          {Object.keys(initalFormData).map((key) => {
                            if (key === "ProjectNumber") {
                              return (
                                <Grid item xs={12} md={3} key={key}>
                                  <Stack spacing={4}>
                                  <Autocomplete
                                      id="projects-autocomplete"
                                      freeSolo
                                      options={projectsName.map((option) => option.Values.PONumber)}
                                      disableClearable
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="Project Number"
                                          variant="standard"
                                          value={form1Data.ProjectNumber?.value || ""}
                                          onChange={handleTableChange}
                                          fullWidth
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          sx={{ mb: 1 }}
                                        />
                                      )}
                                      onInputChange={(event, newValue) => {
                                        handleTableChange({
                                          target: { name: "ProjectNumber", value: newValue },
                                        });
                                      }}
                                    />

                                  </Stack>
                                </Grid>
                              );
                            }

                            if (key === "Description") {
                              return (
                                <Grid item xs={12} md={3} key={key}>
                                  <Stack spacing={4}>
                                  <Autocomplete
                                      id="description-autocomplete"
                                      freeSolo
                                      options={descriptionOptions.map((option) => option.label)}
                                      disableClearable
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="Description"
                                          variant="standard"
                                          value={form1Data.Description?.value || ""}
                                          onChange={handleTableChange}
                                          fullWidth
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          sx={{ mb: 1 }}
                                        />
                                      )}
                                      onInputChange={(event, newValue) => {
                                        handleTableChange({
                                          target: { name: "Description", value: newValue },
                                        });
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
                                      : key === "Quantity"
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
                            {Object.keys(initalFormData).map((key) => (
                              <StyledTableCell key={key}>
                                {key === "Quantity"
                                  ? "QTY/SETS"
                                  : key === "SNO"
                                  ? "SNO"
                                  : key.replace(/([A-Z])/g, " $1").trim()}
                              </StyledTableCell>
                            ))}
                            <StyledTableCell>Actions</StyledTableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {tableData.map((row, index) => (
                            <StyledTableRow key={index}>
                              {Object.keys(initalFormData).map((key) => (
                                <StyledTableCell key={key}>
                                  {row[key]}
                                </StyledTableCell>
                              ))}
                              <StyledTableCell>
                              
                                <Button
                                  color="secondary"
                                  sx={{
                                    height: "20px",
                                    width: "53px",
                                    fontSize: "0.75rem",
                                  }}
                                  variant="contained"
                                   onClick ={()=> handleRemoveRow(index)}
                               
                                >
                                  Remove
                                </Button>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Comments"
                    name="Comments"
                    variant="outlined"
                    value={formData.Comments}
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

export default AddWorkOrder;