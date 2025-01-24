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
import { Checkbox } from "@mui/material";
import axios from "axios";

const defaultTermsAndConditions = `PAYMENT TERMS               : 40% ADVANCE AND REMAINING PAYMENT 15DAYS
TAXES                                  : EXTRA GST 18% Applicable.
VALIDITY OF QUOTATION  : 30DAYS FROM THE DATE OF QUOTATION
DELIVERY                            : AS Per Your Schedule`;

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
  const [incrementValue, setIncrementValue] = useState();
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  const [form1Data, setForm1Data] = useState({
    PurchaseNo: "",
    PurchaseDate: "",
    PurchaseUpdatedDate: "",
    PurchaseType: "",
    Purpose: "",
    CreatedBy: "",
    UpdatedBy: "",
    PONumber: "",
    VendorName: "",
    tenderCodenumber: "",
    Status: "",
    TermsAndConditions: defaultTermsAndConditions,
  });




  

  // TO FETCH ALL VENDOR NAMES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/api/vendor/get-vendor-names`);

        // console.log(response.data,": the vendor names");

        response.data.LineItems.forEach((vendor) => {
          // Check if LineItems exists for this vendor
          if (vendor.LineItems && vendor.LineItems.length > 0) {
            vendor.LineItems.forEach((lineItem) => {
              // console.log("SK:", lineItem.SK); // Log PK for each LineItem
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


    setForm1Data((prevState) => {
      const updatedData = {
        ...prevState,
        [name]: value,
      };
  
      // Update PurchaseNo based on PurchaseType
      if (name === "PurchaseType") {
        const currentYear = new Date().getFullYear(); // Get current year
        const prefix = value === "Purchase Order" ? "SML/PO" : "SML/JO";
        updatedData.PurchaseNo = `${prefix}/${incrementValue}/${currentYear}`;
      }
  
      return updatedData;
    });
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
  }, [form1Data.VendorName, form1Data.selectedPK]);


  // Handle opening/closing modal for table form
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Auto increment of SNO
  // useEffect(() => {
  //   if (open) {
  //     // When the dialog opens, initialize formData with the current SNO value
  //     setFormData({
  //       ...initalFormData,
  //       PoLineNo: { value: snoCounter, type: "text" }, // Set the current SNO value
  //     });
  //   }
  // }, [open, snoCounter]);


  // Handle change for table form data
 
  const handleTableChange = (event) => {
    const { name, value } = event.target;
    console.log("Name:", name, "Value:", value);

    if (name === "WorkOrderId") {
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

      // Calculate the MaterialId if necessary fields change
      if (name === 'MaterialName' || name === 'Grade' || name === 'Dimension') {
        const materialId = `${updatedFormData.MaterialName.value}${updatedFormData.Grade.value}-${updatedFormData.Dimension.value}`;
        updatedFormData.MaterialId = {
          ...prevState.MaterialId,
          value: materialId,
        };
      }

      // Calculate the Amount if Quantity or UnitPrice change
      if (name === "Quantity" || name === "Rate") {
        const quantity = updatedFormData.Quantity.value || 0;
        const unitPrice = updatedFormData.Rate.value || 0;
        const amount = quantity * unitPrice;

        updatedFormData.Price = {
          ...prevState.Price,
          value: amount,
        };
      }

      return updatedFormData;
    });
  };

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


  // Handle adding a row to the table
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
    // Close the dialog
    handleClose();

    // Reset the form for the next row, keeping the next SNO ready
    setFormData({
      ...initalFormData,
      PoLineNo: { value: snoCounter + 1, type: "text" }, // Increment SNO for next row
    });
  };

    // Auto increment of SNO when dialog opens for a new row
useEffect(() => {
  if (open && editingRowIndex === null) {
    setFormData({
      ...initalFormData,
      PoLineNo: { value: snoCounter, type: "text" },
    });
  }
}, [open, snoCounter, editingRowIndex]);

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

          // Format line_items data
    const line_item = tableData.map((row) => ({
      SNO: row.PoLineNo.toString(),
      Description: row.MaterialId,
      WorkOrderId: row.WorkOrderId,
      Quantity: row.Quantity,
      Unit: row.Unit,
      Rate: row.Rate,
      totalPrice: row.Price.toString(),
    }));

    // Formatted data as per your requirement
    const formattedData = {
      PurchaseOrderNumber: form1Data.PurchaseNo,
      VendorName: form1Data.VendorName, 
      PurchaseOrderDate: form1Data.PurchaseDate,
      listItems: line_item,
      TermsAndConditions: form1Data.TermsAndConditions || "Default terms if needed",
    };

    console.log(
      "Formatted Data for Submission:",
      JSON.stringify(formattedData, null, 2)
    );
    

      try {

         // Submit the formatted data to the specified PDF API
      const pdfResponse = await axios.post(
        "https://ie2us8ure5.execute-api.ap-south-1.amazonaws.com/Dev/api/pdf/Purchase-order",
        JSON.stringify(formattedData, null, 2),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(pdfResponse);
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
        link.download = form1Data.PurchaseNo; // Set the desired filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the Blob URL
        URL.revokeObjectURL(blobUrl);
      } else {
        console.error("Failed to generate PDF");
      }


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
          TenderCodeNumber: form1Data.tenderCodenumber,
          TermsAndConditions: form1Data.TermsAndConditions || "Default terms if needed",
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
        console.log(PurchaseOrderId, ": purchase id");

        // Update tableData with PurchaseOrderId for line items
        const updatedLineItems = tableData.map((row) => ({
          ...row,
          PurchaseOrderId: PurchaseOrderId,
        }));

        // Log updated line items to verify PurchaseOrderId is included
        updatedLineItems.forEach((row, index) => {
          console.log(`Updated row ${index + 1} with PurchaseOrderId:`, JSON.stringify(row, null, 2));
        });

        const cleanedLineItems = updatedLineItems.map(removeUndefinedValues);
        console.log(cleanedLineItems, ": cleaned line items");

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
          Purpose: "",
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


        
    // const fetchData = async () => {
    //     try {
    //     // Fetch products
    //     const productResponse = await apiClient.get(
    //         `/api/product/get-all-products`
    //     );
    //     console.log("Products:", productResponse.data);

    //     if (Array.isArray(productResponse.data.data)) {
    //         setProductsName(productResponse.data.data);
    //     } else {
    //         console.error(
    //         "Unexpected data format for products:",
    //         productResponse.data.data
    //         );
    //         setProductsName([]);
    //     }
    //     } catch (error) {
    //     console.error("Error fetching Products or Vendors: ", error);
    //     setProductsName([]); // Reset products on error
    //     }
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);



    // get all list of vendors
    
    const fetchVendorData = async () => {
      try {
        const response = await apiClient.get(`/api/vendor/getallvendors`,);
        // console.log("API Response:", response.data);
   
      } catch (error) {
        console.error("Error fetching vendor data:", error);
   
      }
    };

    useEffect(() => {
        fetchVendorData();
    });

    const  fetchAutoIncrement = async () => {
      try {
        const AutoValue = await apiClient.get('/api/vendor/purchase-increment');
        
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
                  Add Purchase Order
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
                      <MenuItem value="Job Order">Job Order</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  id="PurchaseNo"
                  name="PurchaseNo"
                  label="PO No"
                  variant="standard"
                  value={form1Data.PurchaseNo } 
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

                {/* <Grid item xs={12} md={2}>
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
                </Grid> */}

                
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    id="Purpose"
                    label="Purpose"
                    name="Purpose"
                    variant="standard"
                    value={form1Data.Purpose}
                    onChange={handleForm1Change}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
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
                        <MenuItem value="Open">Open</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                    
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
                        sx={{ width: "75px" }}
                        onClick={handleOpen}
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>

                  <Dialog open={open} onClose={handleClose}   maxWidth="md">
                    <DialogTitle>Add Line Items</DialogTitle>
                    <DialogContent>
                      <Grid container spacing={3}>
                        {Object.keys(initalFormData).map((key) => {
                          const fieldStyle = { height: 40 };
                                  
                        {/* if (key === "Product") {
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
                                        id="Product"
                                        name="Product"
                                        label="Product"
                                        value={formData.Product?.value || ""}
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
                                          },
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
                          } */}

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

                          if (key === "WorkOrderId") {
                            return (
                              <Grid item xs={12} md={3} key={key}>
                                <TextField
                                  select
                                  name={key}
                                  label="WorkOrder Id"
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
                        <StyledTableCell>Action</StyledTableCell>
                          {Object.keys(initalFormData).map((key) => (
                            <StyledTableCell key={key}>
                              {key === "Completion"
                                ? "Completion(%)"
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
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    id="TermsAndConditions"
                    name="TermsAndConditions"
                    value={form1Data.TermsAndConditions}
                    onChange={handleForm1Change}
                    variant="outlined"
                  />
                </Grid>


              </Grid>
            </form>

            {/* Table and Form 2 */}
            
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