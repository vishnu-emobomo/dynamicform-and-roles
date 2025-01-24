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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ListItem,
  ListItemText,
  List,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { getUserId } from "../utlis/tokenUtils";
import Autocomplete from "@mui/material/Autocomplete";
import { Login, WindowSharp } from "@mui/icons-material";
import apiClient from "../utlis/apiClient";
import { Backdrop, CircularProgress } from "@mui/material";
import { Checkbox } from "@mui/material";

const initalFormData = {
  ReceiptLineNo: { value: "", type: "text" },
  PurchaseOrderNumber: { value: "", type: "text" },
  WorkOrderId: { value: "", type: "text" },
  MaterialId: { value: "", type: "text" },
  ActualQuantity: { value: "", type: "number" },
  ReceiptQuantity: { value: "", type: "number" },
  Unit: { value: "", type: "text" },
  Rate: { value: "", type: "number" },
  Amount: { value: "", type: "number" },
};

const AddReceipt = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initalFormData);
  const [tableData, setTableData] = useState([]);
  const [userPK, setUserPK] = useState(null);
  const [snoCounter, setSnoCounter] = useState(1);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [poData, setPOData] = useState([]); // Array of { PONumber, PK }
  const [vendors, setVendors] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [purchasePK, setPurchasePK] = useState(null);
  const [data, setData] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [poLinePK, setPOLinePK] = useState(null);
  const [incrementValue, setIncrementValue] = useState();
  const [vendorName, setVendorName ] = useState(null);
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  const [form1Data, setForm1Data] = useState({
    ReceiptNo: "",
    ReceiptName: "",
    PurchaseOrderNumber: "",
    ReceiptType: "",
    CreatedBy: "",
    UpdatedBy: "",
    VendorName: "",
    // Status: "",
  });

  const handleForm1Change = async (e) => {
    const { name, value } = e.target;

    // Update form1Data with the changed field value
    setForm1Data((prevForm1Data) => ({
      ...prevForm1Data,
      [name]: value,
    }));

    // Find the PK based on the selected PONumber
    if (name === "PONumber") {
      const selectedPOData = poData.find((item) => item.PONumber === value);
      if (selectedPOData) {
        console.log("Selected PK:", selectedPOData.PK);

        setForm1Data((prevForm1Data) => ({
          ...prevForm1Data,
          selectedPK: selectedPOData.PK, // Update the state with selected PK
        }));

        try {
          // Make the API call with the PK as a query parameter
          const response = await apiClient.get(
            `/api/tender/get-tender-by-project`,
            {
              params: {
                projectPK: selectedPOData.PK, // Send PK as a query parameter
              },
            }
          );

          // Update form1Data with the TenderCodenumber from the API response
          setForm1Data((prevForm1Data) => ({
            ...prevForm1Data,
            tenderCodenumber: response.data.tenderCodeNumber,
          }));

          console.log("Tender API Response:", response.data);
          console.log("Tender API Response:", response.data.tenderCodeNumber);
        } catch (error) {
          console.error("Error fetching tender by project:", error);
        }
      }
    }
  };

  // Handle opening/closing modal for table form
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  // get the list of purchase order from the api
  const fetchPurchaseOrders = async () => {
    try {
      const response = await apiClient.get(
        `/api/vendor/get-all-purchase-orders`
      );

      // console.log(response.data,": purchase data");

      const purchaseOrderMapping = response.data.data.map((order) => ({
        purchaseOrderNumber: order.PurchaseOrderNumber,
        pk: order.PK, // Assuming PK is the key for the primary key
        VendorName: order.VendorName
      }));

      setPurchaseOrders(purchaseOrderMapping); // Store the list in state
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    }
  };

  // Fetch purchase orders on
  useEffect(() => {
    fetchPurchaseOrders();
  },[]);

  // get the list of vendor name with the PK
  const fetchVendors = async () => {
    try {
      const response = await apiClient.get(`/api/vendor/getallvendors`);

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

  // Fetch LineItems from API
  useEffect(() => {
    console.log(purchasePK, ": get all purchase pk");

    const fetchData = async () => {
      try {
        const response = await apiClient.get(
          "/api/vendor/get-all-lineitems-by-purchase",
          {
            params: {
              purchaseOrderId: purchasePK,
            },
          }
        );

        console.log("Response from API:", response.data);
        if (response.data.success) {
          const lineItems = response.data.LineItems;
          setLineItems(lineItems); // Store line items in state
          const WorkOrderId = lineItems.map((item) => item.WorkOrderId);
          setData(WorkOrderId);
          console.log("Fetched PK values:", WorkOrderId);
        } else {
          console.error("Failed to fetch line items:", response.data.message);
        }
      } catch (error) {
        console.error("There was an error fetching the line items!", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      }
    };

    fetchData();
  }, [purchasePK]);


//  console.log(poLinePK , ": PO lINE PK ID ");

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


  const  fetchAutoIncrement = async () => {
    try {
      const AutoValue = await apiClient.get('/api/receipts/get-auto-increment-value');
      
      // Log the entire response to confirm the structure
      console.log("Full increment response:", AutoValue.data.incrementValue);
      setIncrementValue(AutoValue.data.incrementValue);

      setForm1Data(prevState =>({
        ...prevState,
        ReceiptNo: AutoValue.data.incrementValue,
      }));

    } catch (error) {
      console.error("Error fetching Customer: ", error);
    }
  };

  useEffect(() => {
    fetchAutoIncrement();
}, []);

const handleRowClick = (row, index) => {
  console.log("Row clicked:", row);

  const updatedFormData = {};

  // Populate formData with the clicked row's data
  Object.keys(formData).forEach((key) => {
    updatedFormData[key] = {
      ...formData[key],
      value: row[key] || "", // Assign row value or empty string if not present
    };
  });

  console.log("Populating formData for editing:", updatedFormData);

  // Update state with row data and index
  setFormData(updatedFormData);
  setEditingRowIndex(index);

  // Open dialog
  handleOpen();
};

const handleAddRow = () => {
  // Prepare the row with only values from formData
  const newRow = Object.keys(formData).reduce((acc, key) => {
    acc[key] = formData[key].value; // Extract only the value for each key
    return acc;
  }, {});

  if (editingRowIndex !== null) {
    setTableData((prevData) =>
      prevData.map((row, index) =>
        index === editingRowIndex ? { ...row, ...newRow } : row
      )
    );
  } else {
    // If adding a new row, append it to the table data
    setTableData([...tableData, newRow]);
    setSnoCounter(snoCounter + 1);
  }

  // Reset editing state and close dialog
  setEditingRowIndex(null);
  handleClose();

  // Reset formData for new row
  setFormData({
    ...initalFormData,
    ReceiptLineNo: { value: snoCounter + 1, type: "text" }, // Auto-incremented SNO
  });
};

// Auto increment of SNO when dialog opens for a new row
useEffect(() => {
  if (open && editingRowIndex === null) {
    setFormData({
      ...initalFormData,
      ReceiptLineNo: { value: snoCounter, type: "text" },
    });
  }
}, [open, snoCounter, editingRowIndex]);


  // const handleRowClick = (row, index) => {

  //   console.log("Row clicked:", row);


  //   const updatedFormData = {};

  //   Object.keys(formData).forEach((key) => {
  //     updatedFormData[key] = {
  //       ...formData[key].value,
  //       value: row[key] || "", // Assign row value or empty string if not present
  //     };
  //   });


  //   console.log("Populating formData for editing:", updatedFormData);

  //   // Update state with row data
  //   setFormData(updatedFormData);
  //   setEditingRowIndex(index);

  //   // Open dialog
  //   handleOpen();
  // };

    // Handle change for table form data
    
    
    const handleTableChange = (event) => {
      const { name, value } = event.target;
      console.log("Name:", name, "Value:", value);
  
      setFormData((prevState) => {
        const updatedFormData = {
          ...prevState,
          [name]: {
            ...prevState[name],
            value: value,
          },
        };
  
        if (name === "ReceiptQuantity" || name === "Rate") {
          const quantity = updatedFormData.ReceiptQuantity.value || 0;
          const unitPrice = updatedFormData.Rate.value || 0;
          const amount = quantity * unitPrice;
  
          updatedFormData.Amount = {
            ...prevState.Amount,
            value: amount,
          };
        }
  
        return updatedFormData;
      });
    };

      // Handle adding a row to the table
  // const handleAddRow = () => {
  //   // Prepare the row with only values from formData
  //   const newRow = Object.keys(formData).reduce((acc, key) => {
  //     acc[key] = formData[key].value; // Extract only the value for each key
  //     return acc;
  //   }, {});

  //   // Add the new row to the table data
  //   setTableData([...tableData, newRow]);

  //   // Increment the SNO counter for the next row
  //   setSnoCounter(snoCounter + 1);

  //   setTableData((prevData) =>
  //   editingRowIndex !== null
  //     ? prevData.map((row, index) =>
  //         index === editingRowIndex ? { ...row, ...newRow } : row
  //       )
  //     : [...prevData, newRow]
  // );

  //   setEditingRowIndex(null);
  //   // Close the dialog
  //   handleClose();

  //   setFormData({
  //     ...initalFormData,
  //     ReceiptLineNo: { value: snoCounter + 1, type: "text" }, 
  //   });
  // };

    // Auto increment of SNO
    // useEffect(() => {
    //   if (open) {
    //     // When the dialog opens, initialize formData with the current SNO value
    //     setFormData({
    //       ...initalFormData,
    //       ReceiptLineNo: { value: snoCounter, type: "text" },
    //     });
    //   }
    // }, [open, snoCounter]);
  
    const handleSubmitAll = async () => {

      // if (!form1Data.ReceiptName || !form1Data.VendorName) {
      //   let missingFields = [];
      //   if (!form1Data.ReceiptName) {
      //     missingFields.push("Receipt Name");
      //   }
      //   if (!form1Data.VendorName) {
      //     missingFields.push("Vendor Name");
      //   }
      //   alert(`Please fill the following required fields: ${missingFields.join(", ")}`);
      //   return; // Prevent form submission
      // }
  
  
  
      console.log("Submitting form data:", form1Data);
      setLoading(true); // Start loading
      tableData.forEach((row, index) => {
        console.log(`Submitting row ${index + 1}:`, JSON.stringify(row, null, 2));
      });
  
      try {
        // if (!selectedVendor) {
        //   console.error("Vendor is missing");
        //   return;
        // }
  
        const requestData = {
          ReceiptNo: form1Data.ReceiptNo,
          ReceiptName: form1Data.ReceiptName,
          VendorId: selectedVendor,
          ReceiptType: form1Data.ReceiptType,
          CreatedBy: form1Data.CreatedBy,
          UpdatedBy: form1Data.UpdatedBy,
          VendorName: vendorName,
          // Status: form1Data.Status,
        };
  
  
        console.log(requestData, ": form data for receipt");
  
        const receiptResponse = await apiClient.post(
          `/api/receipts/create-receipts`,
          requestData
        );

        // console.log(receiptResponse.data);
  
        if (!receiptResponse || receiptResponse.status !== 200) {
          console.error("Failed to create receipt:", receiptResponse);
          alert("Failed to create receipt");
          return;
        }
  
        const ReceiptId = receiptResponse.data.ReceiptId;
  
        console.log(tableData);
  
        const updatedLineItems = tableData.map((row) => ({
          ...row,
          ReceiptId: ReceiptId,
          PurchaseOrderLineId: poLinePK,
        }));
  
        console.log(
          "Data being sent for line items:",
          JSON.stringify(updatedLineItems, null, 2)
        );
  
        const lineItemPromises = updatedLineItems.map((row) =>
          apiClient.post("/api/receipts/create-receipts-line-items", row)
        );
  
        const lineItemResponses = await Promise.all(lineItemPromises);
  
        const lineItemErrors = lineItemResponses
          .map((response, index) => {
            if (response.status !== 200) {
              console.error(`Error from line item ${index + 1}:`, response.data);
              return `Line item ${index + 1} submission failed: ${
                response.statusText
              }`;
            }
            return null;
          })
          .filter(Boolean);
  
        if (lineItemErrors.length > 0) {
          alert(`Failed to create line items: ${lineItemErrors.join(", ")}`);
          throw new Error(lineItemErrors.join(", "));
        }
  
        alert("Receipt and line items created successfully");
  
        setForm1Data({
          ReceiptNo: "",
          ReceiptName: "",
          PurchaseOrderNumber: "",
          ReceiptType: "",
          CreatedBy: "",
          UpdatedBy: "",
          VendorName: "",
          // Status: "",
        });
  
        setTableData([]);
        setSnoCounter(1);
        setFormData(initalFormData);
  
        window.location.reload();
      } catch (error) {
        console.error("Error during submission:", error);
        alert(`Failed to create receipt and/or line items: ${error.message}`);
      } finally {
        setLoading(false); // End loading
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
              height: "calc(100vh - 112px)",
              backgroundColor: "white",
              borderRadius: "10px",
              marginLeft: "15px",
              marginRight: "25px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          ></Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box
            sx={{
              minHeight: "calc(100vh - 112px)",
              backgroundColor: "white",
              padding: 2,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginLeft: "-60px",
              marginRight: "-85px",
            }}
          >
            {/* Form 1 */}
            <Grid
              container
              alignItems="center"
              spacing={2}
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  Add Receipt
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ width: "75px" }}
                  onClick={handleSubmitAll}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>

            <br />
            <form noValidate autoComplete="off">
              <Grid container spacing={3}>
                <Grid item xs={12} md={2}>
                  <TextField
                    id="ReceiptNo"
                    name="ReceiptNo"
                    label="Receipt No"
                    variant="standard"
                    value={form1Data.ReceiptNo}
                    onChange={handleForm1Change}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="ReceiptName"
                    name="ReceiptName"
                    label="Receipt Name"
                    variant="standard"
                    value={form1Data.ReceiptName}
                    onChange={handleForm1Change}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="ReceiptType"
                    name="ReceiptType"
                    label="Receipt Type"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleForm1Change}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    id="CreatedBy"
                    name="CreatedBy"
                    label="Created By"
                    
                    variant="standard"
                    value={form1Data.Comments}
                    onChange={handleForm1Change}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    id="UpdatedBy"
                    label="Updated By"
                    name="UpdatedBy"
                    variant="standard"
                    value={form1Data.Comments}
                    onChange={handleForm1Change}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    id="VendorName"
                    label="Vendor Name"
                    name="VendorName"
                    variant="standard"
                    value={vendorName}
                    // onChange={handleForm1Change}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                {/* <Grid item xs={12} md={2}>
                  <Autocomplete
                    freeSolo
                    options={Object.keys(vendors || {})} // Ensure vendors is an object
                    value={form1Data.VendorName}
                    onChange={(event, newValue) => {
                      // Set the vendor name
                      setForm1Data((prev) => ({
                        ...prev,
                        VendorName: newValue,
                      }));

                      // Get the PK based on the selected vendor name
                      const selectedVendor = vendors[newValue]; // Retrieve PK from the mapping
                      if (selectedVendor) {
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
                        onChange={handleForm1Change}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                      />
                    )}
                  />
                </Grid> */}

                {/* <Grid item xs={12} md={2}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel shrink htmlFor="Status">
                      Status
                    </InputLabel>
                    <Select
                      id="Status"
                      name="Status"
                      label="Status"
                      value={form1Data.Status}
                      onChange={handleForm1Change}
                      inputProps={{
                        id: "Status",
                      }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="In Active">In Active</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}
              </Grid>
            </form>

            {/* Table and Form 2 */}
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
                    sx={{ width: "75px" }}
                    onClick={handleOpen}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
              <Dialog open={open} onClose={handleClose}   maxWidth="md">
                <DialogTitle>Add Line Items</DialogTitle>
                <br />
                <DialogContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        name="ReceiptLineNo"
                        label="Receipt Line No"
                        type="text"
                        variant="standard"
                        value={formData.ReceiptLineNo.value || null}
                        onChange={handleTableChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Autocomplete
                        options={purchaseOrders}
                        getOptionLabel={(option) => option.purchaseOrderNumber}
                        value={
                          purchaseOrders.find(
                            (po) =>
                              po.purchaseOrderNumber ===
                              formData.PurchaseOrderNumber.value
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          if (newValue) {
                            handleTableChange({
                              target: {
                                name: "PurchaseOrderNumber",
                                value: newValue.purchaseOrderNumber,
                              },
                            });
                            setPurchasePK(newValue.pk);
                            setVendorName(newValue.VendorName)
                            console.log("Selected PK:", newValue);
                    
                          } else {
                            // Handle the case when the input is cleared
                            handleTableChange({
                              target: {
                                name: "PurchaseOrderNumber",
                                value: "",
                              },
                            });
                          }
                        }}
                        filterSelectedOptions
                        freeSolo 
                        disableClearable
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Purchase Order Number"
                            variant="standard"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Autocomplete
                        options={lineItems} 
                        getOptionLabel={(option) =>
                          option.WorkOrderId
                        }
                        value={
                          lineItems.find(
                              (item) => item.WorkOrderId === formData.WorkOrderId.value
                            )
                        } 
                        onChange={(event, newValue) => {
                          if (newValue) {

                            handleTableChange({
                              target: {
                                name: "WorkOrderId",
                                value: newValue.WorkOrderId,
                              },
                            });
                            setPOLinePK(newValue.PK);

                          
                            handleTableChange({
                              target: {
                                name: "ActualQuantity",
                                value: newValue.Values.Quantity,
                              },
                            });

                            handleTableChange({
                              target: {
                                name: "Rate",
                                value: newValue.Values.Rate,
                              },
                            });

                            handleTableChange({
                              target: {
                                name: "Unit",
                                value: newValue.Values.Unit,
                              },
                            });


                            handleTableChange({
                              target: {
                                name: "MaterialId",
                                value: newValue.MaterialId,
                              },
                            });
                          } else {
                            handleTableChange({
                              target: { name: "WorkOrderId", value: "" },
                            });
                            handleTableChange({
                              target: { name: "ActualQuantity", value: "" },
                            });
                            // handleTableChange({
                            //   target: { name: "UOM", value: "" },
                            // });
                            handleTableChange({
                              target: { name: "Unit", value: "" },
                            });
                            handleTableChange({
                              target: { name: "Rate", value: "" },
                            });
                            handleTableChange({
                              target: { name: "MaterialId", value: "" },
                            });
                          }
                        }}
                        filterSelectedOptions
                        freeSolo
                        disableClearable
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="WorkOrderId"
                            label="WorkOrder Id" // Updated label to PO Line Name
                            variant="standard"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {Object.keys(formData).map((key) => {
                      if (
                        key === "PurchaseOrderNumber" ||
                        key === "ReceiptLineNo" ||
                        key === "WorkOrderId"
                      ) {
                        return null;
                      }

                      if (formData[key].type === "select") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <FormControl variant="standard" fullWidth>
                              <InputLabel>
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </InputLabel>
                              <Select
                                name={key}
                                value={formData[key].value}
                                onChange={handleTableChange}
                                label={key.replace(/([A-Z])/g, " $1").trim()}
                              >
                                {formData[key].options.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
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
                              key === "Completion"
                                ? "Completion(%)"
                                : key.replace(/([A-Z])/g, " $1").trim()
                            }
                            type={formData[key].type}
                            variant="standard"
                            value={formData[key].value}
                            onChange={handleTableChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
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

              <TableContainer component={Paper} sx={{ marginTop: 4, flex: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                    <StyledTableCell>Action</StyledTableCell>
                      {Object.keys(initalFormData).map((key) => (                    
                        <StyledTableCell key={key}>
                          {key === "Completion"
                            ? "Completion(%)"
                            : key === "PRJLineNo"
                            ? "PRJ Line No"
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
                            {row[key]}
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
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

export default AddReceipt;