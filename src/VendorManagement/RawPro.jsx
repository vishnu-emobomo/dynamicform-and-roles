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
  Stack,
  InputAdornment,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import apiClient from "../utlis/apiClient";
import Autocomplete from "@mui/material/Autocomplete";
import { Backdrop, CircularProgress } from "@mui/material";


const initalFormData = {
  PoLineNo: { value: "", type: "text" },
  POLineName: { value: "", type: "text" },
  PRJLineNo: { value: "", type: "text" },
  Product: { value: "", type: "text" },
  Quantity: { value: "", type: "number" },
  UOM: { value: "", type: "text" },
  UnitPrice: { value: "", type: "number" },
  Amount: { value: "", type: "number" },
  // LineStatus: { value: "", type: "select", options: ["Open","Closed","Active", "InActive"] },
  PurchaseDate: { value: "", type: "date" },
};

const AddPurchase = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initalFormData);
  const [tableData, setTableData] = useState([]);
  const [snoCounter, setSnoCounter] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);
  const [poNumbers, setPONumbers] = useState([]);
  const [pkList, setPKList] = useState([]);
  const [poData, setPOData] = useState([]); // Array of { PONumber, PK }
  const [lineItemNames, setLineItemNames] = useState([]);
  const [selectedPRJLineNo, setSelectedPRJLineNo] = useState("");
  const [productsName, setProductsName] = useState([]);
  const [vendorPrefix, setVendorPrefix] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);


  const [form1Data, setForm1Data] = useState({
    PurchaseNo: "",
    PurchaseDate: "",
    PurchaseUpdatedDate: "",
    PurchaseType: "",
    CreatedBy: "",
    UpdatedBy: "",
    PONumber: "",
    VendorName: "",
    tenderCodenumber: "",
    Status: "",

  });




  

  // TO FETCH ALL VENDOR NAMES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/api/vendor/get-vendor-names`);

        console.log(response.data,": the vendor names");

        response.data.LineItems.forEach((vendor) => {
          // Check if LineItems exists for this vendor
          if (vendor.LineItems && vendor.LineItems.length > 0) {
            vendor.LineItems.forEach((lineItem) => {
              console.log("SK:", lineItem.SK); // Log PK for each LineItem
            });
          }
        });

        if (response.data.success) {
          // Make sure LineItems is an array and set it to filteredItems
          const items = response.data.LineItems || []; // Safeguard in case LineItems is undefined
          setFilteredItems(items);
        } else {
          console.error("Failed to fetch tenders: No VendorName found");
        }
      } catch (error) {
        console.error("Error fetching tenders: ", error);
      }
    };

    fetchData();
  }, []);

  const handleForm1Change = async (e) => {
    const { name, value } = e.target;

   // Update form1Data with the changed field value
  setForm1Data((prevForm1Data) => {
    
    const updatedValue = name === "PurchaseNo" 
      ? value.startsWith(`SML-${vendorPrefix}-`) 
        ? value // Keep existing input if it has the correct prefix
        : `SML-${vendorPrefix}-${value}` // Add prefix if it's missing
      : value;

    return {
      ...prevForm1Data,
      [name]: updatedValue,
    };
  });

  console.log(vendorPrefix ,":  the vendor prifix data for the sample ");

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

  // get the PO number
  const handleVendorClick = async (vendorName, skArray, vendorPrefix) => {

    console.log(vendorPrefix ,": to get vendorPrefix data");

    setVendorPrefix(vendorPrefix);

    // Set the selected vendor's name in the form1Data
    setForm1Data((prevForm1Data) => ({
      ...prevForm1Data,
      VendorName: vendorName,
    }));

    // Join the SK array into a single string if required
    const skArrayString = skArray.join(","); // Join SKs with a comma

    try {
      // Make the API call with the concatenated SK string
      const response = await apiClient.get(
        `/api/vendor/get-project-number-by-vendor`,
        {
          params: {
            skArray: skArrayString, // Send SKs as a single string
          },
        }
      );

      // Extract PONumbers from the response
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.every((item) => item.success)
      ) {
        const poNumbers = response.data.map((item) => item.PONumber[0]);
        setPONumbers(poNumbers);
        const pkList = response.data.map((item) => item.PK);
        setPKList(pkList);

        const poData = response.data.map((item) => ({
          PONumber: item.PONumber[0], // Assuming PONumber is an array
          PK: item.PK,
        }));
        setPOData(poData); // Update state with combined data
        // console.log("PONumber and PK Data:", poData);
      } else {
        console.error(
          "Failed to retrieve PONumbers:",
          response.data.message || "No valid response"
        );
      }
    } catch (error) {
      console.error("Error fetching project numbers:", error);
    }
  };

  useEffect(() => {
    if (form1Data.VendorName && form1Data.selectedPK) {
      console.log(form1Data.selectedPK, "PK TO get line items");
      console.log(form1Data.VendorName, "Vendorname TO get line items");

      const fetchData = async () => {
        try {
          const response = await apiClient.get(
            `/api/vendor/get-all-lineitems-by-vendor-and-buy`,
            {
              params: {
                ProjectPK: form1Data.selectedPK,
                VendorName: form1Data.VendorName,
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
              (item) => item.LineItemName
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
  }, [form1Data.VendorName, form1Data.selectedPK]);


  // Handle opening/closing modal for table form
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Auto increment of SNO
  useEffect(() => {
    if (open) {
      // When the dialog opens, initialize formData with the current SNO value
      setFormData({
        ...initalFormData,
        PoLineNo: { value: snoCounter, type: "text" }, // Set the current SNO value
      });
    }
  }, [open, snoCounter]);

  // Handle change for table form data
  const handleTableChange = (event) => {
    const { name, value } = event.target;
    console.log("Name:", name, "Value:", value);

    if (name === "PRJLineNo") {
      setSelectedPRJLineNo(value);
    }

    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [name]: {
          ...prevState[name],
          value: value,
        },
      };

      if (name === "Quantity" || name === "UnitPrice") {
        const quantity = updatedFormData.Quantity.value || 0;
        const unitPrice = updatedFormData.UnitPrice.value || 0;
        const amount = quantity * unitPrice;

        updatedFormData.Amount = {
          ...prevState.Amount,
          value: amount,
        };
      }

      return updatedFormData;
    });
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

  console.log("Selected PRJ Line No:", selectedPRJLineNo); // This will log the selected value


const removeUndefinedValues = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues).filter(item => item !== undefined);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => [key, removeUndefinedValues(value)])
    );
  } else {
    return obj;
  }
};

  

  const handleSubmitAll = async () => {
  
    setLoading(true); // Start loading
    console.log("Submitting form data:", form1Data);
    tableData.forEach((row, index) => {
      console.log(`Submitting row ${index + 1}:`, JSON.stringify(row, null, 2));
    });
  
    try {
      // Get the PK from the selected PONumber
      const projectPK = form1Data.PONumber
        ? poData.find((item) => item.PONumber === form1Data.PONumber)?.PK
        : null;
  
      if (!projectPK) {
        console.error("Project PK is missing");
        alert("Project PK is missing. Please select a valid PONumber.");
        return;
      }
  
      // Prepare the data for the API request
      const requestData = {
        projectPK: projectPK,
        PurchaseOrderNumber: form1Data.PurchaseNo,
        VendorName: form1Data.VendorName,
        PODate: form1Data.PurchaseDate,
        POUpdatedData: form1Data.PurchaseUpdatedDate,
        POType: form1Data.PurchaseType,
        CreatedBy: form1Data.CreatedBy,
        UpdatedBy: form1Data.UpdatedBy,
        PONumber: form1Data.PONumber,
        tenderCodeNumber: form1Data.tenderCodenumber,
        Status: form1Data.Status,
      };
  
      console.log(requestData, ": form data for purchase order");
  
      // Submit form1Data to the API for creating a purchase order
      const purchaseOrderResponse = await apiClient.post(
        "/api/vendor/create-purchase-order",
        requestData
      );
  
      console.log(
        "Purchase order created successfully:",
        purchaseOrderResponse.data
      );
  
      // Retrieve PurchaseOrderId from the response
      const PurchaseOrderId = purchaseOrderResponse.data.PurchaseOrderId;
  
      // Update tableData with PurchaseOrderId and userPK for line items
      const updatedLineItems = tableData.map((row) => ({
        ...row,
        PurchaseOrderId: PurchaseOrderId,
      }));
  
      // Clean updatedLineItems before submission
      const cleanedLineItems = updatedLineItems.map(removeUndefinedValues);

      console.log(cleanedLineItems,": ");
  
      // Submit cleanedLineItems to the second API
      const lineItemPromises = cleanedLineItems.map((row, index) =>
        apiClient.post("/api/vendor/create-purchase-order-line-item", row)
          .then(response => {
            console.log(`Line item ${index + 1} response:`, response.data);
            return response;
          })
          .catch(error => {
            console.error(`Line item ${index + 1} error:`, error.response ? error.response.data : error.message);
            throw error;
          })
      );
  
      console.log("Cleaned line items:", JSON.stringify(cleanedLineItems, null, 2));
  
      // Resolve all promises
      const lineItemResponses = await Promise.allSettled(lineItemPromises);
  
      // Check for errors in line item submissions
      const lineItemErrors = lineItemResponses
        .map((result, index) => {
          if (result.status === "rejected") {
            return `Line item ${index + 1} submission failed: ${result.reason.message}`;
          }
          return null;
        })
        .filter(Boolean); // Filter out successful responses
  
      // If there are errors, alert the user
      if (lineItemErrors.length > 0) {
        alert(`Failed to create some line items: ${lineItemErrors.join(", ")}`);
        throw new Error(lineItemErrors.join(", "));
      }
  
      alert("Purchase order and line items created successfully");
  
      // Reset the forms
      setForm1Data({
        PurchaseNo: "",
        PurchaseDate: "",
        PurchaseUpdatedDate: "",
        PurchaseType: "",
        CreatedBy: "",
        UpdatedBy: "",
        PONumber: "",
        VendorName: "",
        tenderCodenumber: "",
        Status: "",
      });
  
      setTableData([]);
  
      // Reset the snoCounter back to 1
      setSnoCounter(1);

      window.location.reload();
    } catch (error) {
      console.error("Error during submission:", error);
      alert(`Failed to create purchase order and/or line items: ${error.message}`);
    } finally {
      setLoading(false);
    }
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


    // get all list of vendors
    const fetchVendorData = async () => {
      try {
        const response = await apiClient.get(`/api/vendor/getallvendors`,);
        console.log("API Response:", response.data);
   
      } catch (error) {
        console.error("Error fetching vendor data:", error);
   
      }
    };

    useEffect(() => {
        fetchVendorData();
    });

    // Modify handleRowClick to set the editing index and open the dialog
    const handleRowClick = (row, index) => {
      const updatedFormData = { ...formData };
    
      Object.keys(updatedFormData).forEach((key) => {
        if (row[key] !== undefined) {
          updatedFormData[key].value = row[key];
        }
      });
    
      setFormData(updatedFormData); 
      setSelectedRowIndex(index); 
      handleOpen();
    };
    
    

      // Handle adding a row to the table
  const handleAddRow = () => {
    const newRow = Object.keys(formData).reduce((acc, key) => {
      acc[key] = formData[key].value;
      return acc;
    }, {});
  
    let updatedTableData = [...tableData];
  
    if (selectedRowIndex !== null) {
      // Update existing row
      updatedTableData[selectedRowIndex] = newRow;
    } else {
      // Add new row
      updatedTableData = [...tableData, newRow];
    }
  
    setTableData(updatedTableData);
    setSelectedRowIndex(null);
    handleClose();
    setFormData({
      ...initalFormData,
      PoLineNo: { value: snoCounter + 1, type: "text" },
    });
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
          >
            <h3 style={{ fontFamily: "Roboto, Helvetica, Arial, sans-serif" }}>
              Vendor List
            </h3>

            <List sx={{ width: "100%", overflow: "auto" }}>
              {filteredItems.map((item, index) =>
                item.VendorName ? (
                  <ListItem
                    key={index}
                    button
                    onClick={() =>
                      handleVendorClick(
                        item.VendorName,
                        item.LineItems.map((lineItem) => lineItem.SK),
                        item.VendorPrefix
                      )
                    }
                  >
                    <ListItemText
                      primary={item.VendorName}
                      primaryTypographyProps={{ fontSize: "13px" }}
                    />
                  </ListItem>
                ) : (
                  <ListItem key={index}>
                    <ListItemText primary="No VendorName available" />
                  </ListItem>
                )
              )}
            </List>
          </Box>
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
                  Add Purchase
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
                  id="PurchaseNo"
                  name="PurchaseNo"
                  label="PO No"
                  variant="standard"
                  value={form1Data.PurchaseNo || `SML-${vendorPrefix}-`} 
                  onChange={handleForm1Change}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  
                />
              </Grid>


              <Grid item xs={12} md={2}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel id="project-number-label">
                      Project Number
                    </InputLabel>
                    <Select
                      labelId="project-number-label"
                      name="PONumber"
                      value={form1Data.PONumber}
                      onChange={handleForm1Change}
                      displayEmpty
                    >
                      {poData.map((item, index) => (
                        <MenuItem key={index} value={item.PONumber}>
                          {item.PONumber}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Tender Number"
                    name="TenderCodenumber"
                    variant="standard"
                    value={form1Data.tenderCodenumber}
                    onChange={handleForm1Change}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

              

                <Grid item xs={12} md={2}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel shrink htmlFor="purchase-type">
                      PO Type
                    </InputLabel>
                    <Select
                      name="PurchaseType"
                      label="PO Type"
                      value={form1Data.PurchaseType}
                      onChange={handleForm1Change}
                      inputProps={{
                        id: "purchase-type",
                      }}
                    >
                      <MenuItem value="Purchase Order">Purchase Order</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>


                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Vendor Name"
                    name="VendorName"
                    variant="standard"
                    value={form1Data.VendorName}
                    onChange={handleForm1Change}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel shrink htmlFor="Status">
                      Status
                    </InputLabel>
                    <Select
                      name="Status"
                      label="Status"
                      value={form1Data.Status}
                      onChange={handleForm1Change}
                      inputProps={{
                        id: "Status",
                      }}
                    >
                        <MenuItem value="In Development">In Development</MenuItem>
                        <MenuItem value="Assigned">Assigned</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Cancel">Cancel</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    id="CreatedBy"
                    label="Created By"
                    name="CreatedBy"
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
                    label="Updated By"
                    name="UpdatedBy"
                    variant="standard"
                    value={form1Data.UpdatedBy}
                    onChange={handleForm1Change}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="PurchaseDate"
                    name="PurchaseDate"
                    label="PO Date"
                    variant="standard"
                    type="date" // Correct input type
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={form1Data.PurchaseDate}
                    onChange={handleForm1Change} // Handle change
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    name="PurchaseUpdatedDate"
                    label="PO UpdatedDate"
                    type="date"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={form1Data.PurchaseUpdatedDate}
                    onChange={handleForm1Change}
                  />
                </Grid>


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

              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Line Items</DialogTitle>
                <DialogContent>
                  <Grid container spacing={3}>
                    {Object.keys(initalFormData).map((key) => {

                               
                     if (key === "Product") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <Stack spacing={4}>
                            <Autocomplete
            id="product-autocomplete"
            freeSolo
            options={productsName.map((option) => option.Name)}
            disableClearable
            value={formData.Product?.value || ""} // Directly set value from formData
            renderInput={(params) => (
              <TextField
                {...params}
                id="Product"
                name="Product"
                label="Product"
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
                  },
                }}
                sx={{ mb: 1 }}
              />
            )}
            onInputChange={(event, newValue) => {
              setFormData((prevState) => ({
                ...prevState,
                Product: {
                  ...prevState.Product,
                  value: newValue,
                },
              }));
            }}
            sx={{
              "& .MuiAutocomplete-input": {
                fontSize: "0.875rem",
                height: 40,
              },
              "& .MuiAutocomplete-option": {
                fontSize: "0.875rem",
              },
            }}
          />

                            </Stack>
                          </Grid>
                        );
                      }

                      if (key === "PRJLineNo") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <TextField
                              select
                              name={key}
                              label="PRJ Line No"
                              variant="standard"
                              value={formData[key].value}
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
                      } else 
                      
                      if (key === "LineStatus") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <TextField
                              select
                              name={key}
                              label="Line Status"
                              variant="standard"
                              value={formData[key].value}
                              onChange={handleTableChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              fullWidth
                            >
                              {initalFormData[key].options.map(
                                (option, index) => (
                                  <MenuItem key={index} value={option}>
                                    {option}
                                  </MenuItem>
                                )
                              )}
                            </TextField>
                          </Grid>
                        );
                      } 
                      
                      else {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <TextField
                              name={key}
                              label={
                                key === "Completion"
                                  ? "Completion(%)"
                                  : key.replace(/([A-Z])/g, " $1").trim()
                              }
                              type={initalFormData[key].type}
                              variant="standard"
                              value={formData[key].value}
                              onChange={handleTableChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              fullWidth
                            />
                          </Grid>
                        );
                      }
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
                      <StyledTableRow key={index} onClick={() => handleRowClick(row,index)} style={{ cursor: 'pointer' }}>
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

export default AddPurchase;