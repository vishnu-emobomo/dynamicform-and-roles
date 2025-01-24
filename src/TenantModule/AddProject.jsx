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
} from "@mui/material";
import { Checkbox } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { getUserId } from "../utlis/tokenUtils";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import apiClient from "../utlis/apiClient";
import { Backdrop, CircularProgress } from "@mui/material";
import Attachments from "../AdditionalComponent/Attachments";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

const initalFormData = {
  SNO: { value: "", type: "text" },
  Description: { value: "", type: "text" },
  ItemCode: { values: "", type: "text" },
  QTYSETS: { value: "", type: "number" },
  WorkOrderId: { values: "", type: "text" },
  CompletedQuantity: { value: "", type: "text" },
  PendingQuantity: { value: "", type: "text" },
  QCCleared: { value: "", type: "text" },
  PaymentReceived: { value: "", type: "text" },
  files: { value: [], type: "file" },
  DeliverDate: { value: "", type: "date" },
  StartDate: { value: "", type: "date" },
  ActualStartDate: { value: "", type: "date" },
  EndDate: { value: "", type: "date" },
  ActualEndDate: { value: "", type: "date" },
  TeamMember: { value: "", type: "text" },
  MakeBuy: { value: "", type: "text" },
  VendorName: { value: [], type: "text" },
  LineStatus: {
    value: "",
    type: "select",
    options: ["Open", "Closed", "Active", "InActive"],
  },
};

const AddProject = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initalFormData);
  const [tableData, setTableData] = useState([]);
  const [userPK, setUserPK] = useState(null);
  const [snoCounter, setSnoCounter] = useState(1); // State for SNO counter
  const [PONumbers, setPONumbers] = useState([]);
  const [productsName, setProductsName] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [workOrderId, setWorkOrderId] = useState();
  const [selectedProductPK, setSelectedProductPK] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [tenderMap, setTenderMap] = useState({});
  const [poToTenderPKMap, setPoToTenderPKMap] = useState({});
  // const [vendorPrefix, setVendorPrefix] = useState();
  const [loading, setLoading] = useState(false);
  const [tender, setTender] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [files, setFiles] = useState([]); // State for storing files

  // Fetch userPK on mount
  useEffect(() => {
    const id = getUserId();
    console.log("Id - ", id);
    if (id) {
      setUserPK(id);
      // Update the form state with the fetched userPK
      setForm1Data((prevForm1Data) => ({
        ...prevForm1Data,
        userPK: id,
      }));
    }
  }, []);

  const [form1Data, setForm1Data] = useState({
    CustomerName: "",
    CreationDate: "",
    PONumber: "",
    TenderCodenumber: "",
    WorkOrderId: "",
    StartDate: "",
    EndDate: "",
    ProjectDeliverydate: "",
    Comments: "",
    ProjectStatus: "",
    tenderId: tender
  });

  const [fileData, setFileData] = useState({
    SortKey: "",
    Name: "ProjectFile",
    Type: "Project",
    files: [],
  });

  const handleForm1Change = async (e) => {
    const { name, value } = e.target;
    console.log({ name, value });

    // Update the form1Data for the field directly
    setForm1Data((prevForm1Data) => ({
      ...prevForm1Data,
      [name]: value,
    }));

    if (name === "PONumber") {
      console.log("PONumbers:", PONumbers);
      console.log("Selected PONumber value:", value);
      console.log("poData:", PONumbers);

      // Use poToTenderPKMap to get the selected PK directly
      const selectedPK = poToTenderPKMap[value];

      if (selectedPK) {
        console.log("Selected PK:", selectedPK);

        // Update form1Data with the selected PK
        setForm1Data((prevForm1Data) => ({
          ...prevForm1Data,
          selectedPK: selectedPK, // Set the PK in form1Data
        }));

        try {
          // Make the API call with the selected PK
          const response = await axios.get(
            `/api/tender/get-tender-by-project`,
            {
              params: {
                projectPK: selectedPK, // Send PK as query parameter
              },
            }
          );

          console.log(
            response.data,
            ": data we get from the tender from po number"
          );

          // Update form1Data with TenderCodenumber from the API response
          setForm1Data((prevForm1Data) => ({
            ...prevForm1Data,
            TenderCodenumber: response.data.tenderCodeNumber,
            // CustomerName: response.data.customerName,
          }));

          console.log(
            "The selected customer name :",
            response.data.customerName
          );

          console.log("Tender API Response:", response.data);
        } catch (error) {
          console.error("Error fetching tender by project:", error);
        }
      } else {
        console.log("No matching PK found for the selected PONumber.");
      }
    }
  };

  // getting the po number to get the drop down and later send to tendercodenumber
  useEffect(() => {
    const fetchTenderAndPONumbers = async () => {
      try {
        const response = await apiClient.get(`/api/tender/Get-all-tenders`);

        // console.log(response.data, ": get all tenders");

        if (response.data && Array.isArray(response.data.data)) {
          const tenderData = response.data.data;

          // Store the mapping of PONumber to TenderCodenumber
          const tenderMap = {};
          const poToTenderPKMap = {};
          tenderData.forEach((tender) => {
            tenderMap[tender.Values.PONumber] = tender.Values.TenderCodenumber;
            poToTenderPKMap[tender.Values.PONumber] = tender.PK;
          });

          // Store the PONumbers to display in the dropdown
          const poNumbers = Object.keys(tenderMap);
          setPONumbers(poNumbers);
          setTenderMap(tenderMap); // Store the map in state
          setPoToTenderPKMap(poToTenderPKMap); // Store the PO to tenderPK map
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch tender data:", error);
      }
    };

    if (form1Data.userPK) {
      fetchTenderAndPONumbers();
    }
  }, [form1Data]);

  const handlePONumberChange = (event) => {
    const selectedPONumber = event.target.value;
    const lastFourDigitsOfPo = selectedPONumber.slice(-4);

    setWorkOrderId(lastFourDigitsOfPo);

    // Update form1Data with selected PONumber
    setForm1Data((prevData) => ({
      ...prevData,
      PONumber: selectedPONumber,
      TenderCodenumber: tenderMap[selectedPONumber] || "",
      WorkOrderId: `${lastFourDigitsOfPo}`, // Default to `1` on initial selection
    }));

    console.log(`WorkOrderId: ${formData.WorkOrderId}`);

    // Log the related TenderCodenumber
    if (tenderMap[selectedPONumber]) {
      console.log(
        `TenderCodenumber for PONumber ${selectedPONumber}: ${tenderMap[selectedPONumber]}`
      );
    }

    if (poToTenderPKMap[selectedPONumber]) {
      setTender(poToTenderPKMap[selectedPONumber]);
    }
  };

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
      // Fetch vendors
      const vendorResponse = await apiClient.get(`/api/vendor/getallvendors`);

      // console.log(vendorResponse.data,"list of  vendors");

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
  }, []);

  // Effect to trigger the API call when both Product PK and Quantity are available
  useEffect(() => {
    if (selectedProductPK && selectedQuantity) {
      triggerApiForProduct(selectedProductPK, selectedQuantity);
    }
  }, [selectedProductPK, selectedQuantity]);

  // Function to trigger the API call
  const triggerApiForProduct = async (productPK, quantity) => {
    try {
      // Encode the productPK to make it safe for URL parameters
      const encodedProductPK = encodeURIComponent(productPK);

      const response = await fetch(
        `https://lmz2xjnhoc.execute-api.ap-south-1.amazonaws.com/api/inventory/check-inventory?productPK=${encodedProductPK}&requestedQuantity=${quantity}`,
        {
          method: "GET", // Or POST, depending on your API
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to send product data: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Product data submitted successfully:", result);
    } catch (error) {
      console.error("Error submitting product data:", error);
    }
  };

  const handleVendorChange = (event, newValue) => {
    // Find the selected vendor based on the name
    const selectedVendor = vendors.find((vendor) => vendor.Name === newValue);

    // Update form data with the selected vendor name
    setFormData((prevState) => ({
      ...prevState,
      VendorName: {
        ...prevState.VendorName,
        value: newValue,
      },
    }));
  };

  // Handle opening/closing modal for table form
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!tender) {
      console.error("Tender ID is not defined");
      return;
    }

    const fetchData = async () => {
      try {
        const encodedTender = encodeURIComponent(tender);

        // Fetch line items related to the tender
        const lineItemsResponse = await apiClient.get(
          `/api/lineitem/get-lineitem-by-tender?tenderId=${encodedTender}`
        );

        if (lineItemsResponse.data.success) {
          // Process the fetched line items
          const fetchedItems = lineItemsResponse.data.LineItems.map((item) => {
            const SNO = item.Values.SNO || "";
            return {
              SNO,
              Description: item.Name || "",
              QTYSETS: item.Values.QTYSETS || "",
              ItemCode: item.Values.ItemCode || "",
              WorkOrderId: `${workOrderId}/${SNO}`,
            };
          });

          // Set initial autofill data for the table
          setTableData(fetchedItems);
        } else {
          console.error(
            "Failed to fetch line items:",
            lineItemsResponse.data.message
          );
        }

        console.log(encodedTender, ": the tender value");

        // Fetch customer data related to the tender
        const customerResponse = await apiClient.get(
          `/api/tender/get-tender-by-project?projectPK=${encodedTender}`
        );

        console.log(customerResponse.data, ": the data form the customer name");

        if (customerResponse.data) {
          // Update form data with customer details
          setForm1Data((prevForm1Data) => ({
            ...prevForm1Data,
            CustomerName: customerResponse.data.customerName,
            tenderId: customerResponse.data.TenderPK,
          }));
        } else {
          console.error("Failed to fetch customer data.");
        }

        // form the S3 to the getting files

        const SK = encodeURIComponent(tender);

        // console.log(sk);
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
        setFileList(filesWithKeys);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [tender]);

  const onFilesAdded = (newFiles) => {
    setFileData((prevFileData) => ({
      ...prevFileData,
      files: newFiles, // Directly store raw File objects
    }));
  
    console.log(newFiles, ": raw files passed to fileData");
  };

  // Modify handleRowClick to set the editing index and open the dialog
  const handleRowClick = (row, index) => {
    const updatedFormData = {};

    // Map row data to formData format
    Object.keys(row).forEach((key) => {
      updatedFormData[key] = { value: row[key] || "" };
    });

    console.log("Populating formData for editing:", updatedFormData);

    // Update state with row data
    setFormData(updatedFormData);
    setEditingRowIndex(index);

    // Open dialog
    handleOpen();
  };

  const handleTableChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => {
      // Prepare new state
      const newState = {
        ...prevState,
        [name]: {
          ...prevState[name],
          value: value,
        },
      };

      // Handle WorkOrderId field update based on SNO and WorkOrderId in form1Data
      if (name === "SNO" || name === "WorkOrderId") {
        const updatedWorkOrderId = `${form1Data.WorkOrderId || ""}/${
          newState.SNO.value || ""
        }`;
        newState.WorkOrderId = {
          ...prevState.WorkOrderId,
          value: updatedWorkOrderId,
        };
      }

      return newState;
    });

    // If Product field is changed, get the PK of the selected product
    if (name === "Product") {
      const selectedProduct = productsName.find(
        (product) => product.Name === value
      );
      if (selectedProduct) {
        setSelectedProductPK(selectedProduct.PK); // Assume PK exists in productsName
      } else {
        setSelectedProductPK(null); // Reset if no match
      }
    }

    // Track quantity
    if (name === "Quantity") {
      setSelectedQuantity(value);
    }
  };


  const handleAddRow = () => {
    const newRow = Object.keys(formData).reduce((acc, key) => {
      acc[key] = key === "files" ? formData[key]?.value || [] : formData[key]?.value || "";
      return acc;
    }, {});
  

    setTableData((prevData) =>
      editingRowIndex !== null
        ? prevData.map((row, index) =>
            index === editingRowIndex ? { ...row, ...newRow } : row
          )
        : [...prevData, newRow]
    );

    handleClose();
    setEditingRowIndex(null);
    setFormData(initalFormData); // Reset form
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
  
    setFormData((prevState) => ({
      ...prevState,
      files: {
        value: [...(prevState.files?.value || []), ...newFiles],
      },
    }));
  
    setFiles((prevFiles) => [...prevFiles, ...newFiles]); // Update local state
  };
 
 

  const handleSubmitAll = async () => {
    console.log("Submitting form data:", form1Data);
    setLoading(true); // Start loading
  
    // Log initial table data
    console.log("Initial tableData:", JSON.stringify(tableData, null, 2));
  
    // Check each row for missing files
    tableData.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
      if (!row.files) {
        console.warn(`Warning: files is undefined for row ${index + 1}`);
      }
    });
  
    const retry = async (fn, retries = 3, delay = 1000) => {
      try {
        return await fn();
      } catch (error) {
        if (retries > 0) {
          console.warn(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return retry(fn, retries - 1, delay);
        } else {
          throw error;
        }
      }
    };
  
    try {
      // Submit form1Data to create a project
      const projectResponse = await apiClient.post("/api/project/create-project", form1Data);
      const projectResult = projectResponse;
      console.log("Project created successfully:", projectResult);
  
      // Retrieve the project primary key
      const project_PK = projectResult.data.ProjectId;
      console.log("Project PK:", project_PK);
  
      if (fileData.files && fileData.files.length > 0) {
        try {
          const response = await apiClient.post("/api/s3-file/uploadfile", {
            files: fileData.files.map((file) => ({ fileName: file.name })),
            sortKey: tender,
            Name: fileData.files.map((file) => ({ fileName: file.name })),
            Type: "Project",
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
  
      // Prepare updated line items
      const updatedLineItems = tableData.map((row, index) => {
        console.log(`Processing row ${index + 1}:`, row);
  
        // Omit the files property from the row for line item submission
        const { files, ...lineItemWithoutFiles } = row;
  
        return {
          ...lineItemWithoutFiles,
          projectPK: project_PK, // Add project primary key
          files, // Keep the original files for uploading to S3 later
        };
      });
  
      console.log("Updated line items:", JSON.stringify(updatedLineItems, null, 2));
  
      // Submit each line item to the API and upload files to S3
      const lineItemPromises = updatedLineItems.map(async (row, index) => {
        try {
          // Submit the line item without the files property
          const { files, ...lineItemData } = row;
          console.log(lineItemData);
  
          const lineItemResponse = await retry(
            () => apiClient.post("/api/line-item/create-line-item", lineItemData),
            3,
            1000
          );
          console.log(`Line item ${index + 1} submitted successfully:`, lineItemResponse.data);
  
          const lineItem_PK = lineItemResponse.data.lineItemId;
  
          if (files && files.length > 0) {
            console.log(files, " the data from line item ");
  
            try {
              const response = await apiClient.post("/api/s3-file/uploadfile", {
                files: files.map((file) => ({ fileName: file.name })),
                sortKey: lineItem_PK,
                Name: files.map((file) => ({ fileName: file.name })),
                Type: "Project_LineItems",
              });
  
              const { files: signedUrls } = response.data;
  
              for (const file of files) {
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
        } catch (error) {
          console.error(`Error submitting line item ${index + 1}:`, error);
          throw new Error(`Line item ${index + 1} submission failed.`);
        }
      });
  
      // Wait for all line item submissions to complete
      const lineItemResponses = await Promise.allSettled(lineItemPromises);
  
      // Check for rejected submissions
      const rejectedItems = lineItemResponses.filter((item) => item.status === "rejected");
      if (rejectedItems.length > 0) {
        console.error("Some line items failed to submit:", rejectedItems);
        throw new Error("One or more line items failed to submit. Check logs for details.");
      }
  
      // Reset the forms
      setForm1Data({
        EntityType: "Project",
        CustomerName: "",
        CreationDate: "",
        PONumber: "",
        ProjectDeliverydate: "",
        TenderCodenumber: "",
        StartDate: "",
        EndDate: "",
        Comments: "",
        tenderId: "",
      });
  
      alert(" Project Submitted successfully");
      setTableData([]); // Clear the table data
      setSnoCounter(1); // Reset SNO counter
  
      window.location.reload();
    } catch (error) {
      console.error("Error during submission:", error);
      alert(`Failed to create project and/or line items: ${error.message}`);
    } finally {
      setLoading(false); // End loading
    }
  };
  
  

  const handleDelete = async (pk, sk, url) => {
    setLoading(true);
    const updateDelete = {
      url: url,
      pk: pk,
      sk: sk,
      tableName: "S3DyamobdFile",
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

  const handleClickOpen = () => {
    setOpen(true);
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
        <Grid item xs={12} md={2}></Grid>

        <Grid item xs={12} md={9}>
          <Box
            sx={{
              minHeight: "calc(100vh - 112px) ",
              backgroundColor: "white",
              padding: 2,
              borderRadius: "10px",
              // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginLeft: "-60px",
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
                  Add Project
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmitAll}
                  sx={{ width: "75px" }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>

            <br />

            <form noValidate autoComplete="off">
              <Grid container spacing={3}>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="PONumber">PO Number</InputLabel>
                    <Select
                      id="PONumber"
                      name="PONumber"
                      value={form1Data.PONumber} // Value is bound to form1Data
                      onChange={handlePONumberChange}
                      variant="standard"
                      displayEmpty
                    >
                      {PONumbers.map((code) => (
                        <MenuItem key={code} value={code}>
                          {code}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="tender-code-number"
                    name="TenderCodenumber"
                    label="Tender Number"
                    value={form1Data.TenderCodenumber}
                    onChange={(e) =>
                      setForm1Data({
                        ...form1Data,
                        TenderCodenumber: e.target.value,
                      })
                    }
                    variant="standard"
                    InputProps={{
                      readOnly: true, // Makes the field read-only
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="CustomerName"
                    name="CustomerName"
                    label="Customer Name"
                    variant="standard"
                    value={form1Data.CustomerName || ""} // Ensure to provide a default value
                    onChange={handleForm1Change}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="WorkOrderId"
                    name="WorkOrderId"
                    label="Work Order Id"
                    variant="standard"
                    value={form1Data.WorkOrderId || ""}
                    onChange={handleForm1Change}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    name="StartDate"
                    label="Start Date"
                    variant="standard"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={form1Data.StartDate}
                    onChange={handleForm1Change}
                    fullWidth
                    // Set height for the TextField component
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    name="EndDate"
                    label="End Date"
                    type="date"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={form1Data.EndDate}
                    onChange={handleForm1Change}
                    fullWidth
                    // Set height for the TextField component
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    name="ProjectDeliverydate"
                    label="Project Delivery Date"
                    variant="standard"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={form1Data.ProjectDeliverydate}
                    onChange={handleForm1Change}
                    fullWidth
                    sx={{ height: 48 }} // Set height for the TextField component
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="ProjectStatus"
                    name="ProjectStatus"
                    label="Project Status"
                    variant="standard"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={form1Data.ProjectStatus}
                    onChange={handleForm1Change}
                    fullWidth
                    sx={{ height: 48 }} // Set height for the TextField component
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
                                    style={{ color: "blue", fontSize: "15px" }}
                                  >
                                    {cleanFileName}
                                  </a>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <DeleteSweepIcon
                                    onClick={() =>
                                      handleDelete(file.PK, file.SK, file.url)
                                    }
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

                        <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                        size="small"
                        >
                        Add
                      </Button>
                    </Grid>

                    

                    <Dialog open={open} onClose={handleClose} maxWidth="md">
                      <DialogTitle>Project Line Items</DialogTitle>
                      <br />
                      <DialogContent>
                        <Grid container spacing={3}>
                          {Object.keys(initalFormData).map((key) => {
                            const fieldStyle = { height: 40 };

                            if (key === "MakeBuy") {
                              return (
                                <Grid item xs={12} md={3} key={key}>
                                  <FormControl
                                    variant="standard"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                  >
                                    <InputLabel shrink>Make/Buy</InputLabel>
                                    <Select
                                      name="MakeBuy"
                                      value={formData.MakeBuy?.value || ""}
                                      onChange={handleTableChange}
                                      label="Make/Buy"
                                      sx={{
                                        ...fieldStyle,
                                        height: 32,
                                        lineHeight: "1.5em",
                                      }}
                                    >
                                      <MenuItem
                                        value="Make"
                                        sx={{ height: 28 }}
                                      >
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
                                  <FormControl
                                    variant="standard"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                  >
                                    <InputLabel shrink>Line Status</InputLabel>
                                    <Select
                                      name="LineStatus"
                                      value={formData.LineStatus?.value || ""}
                                      onChange={handleTableChange}
                                      label="Line Status"
                                      sx={{
                                        ...fieldStyle,
                                        height: 32,
                                        lineHeight: "1.5em",
                                      }}
                                    >
                                      <MenuItem
                                        value="Open"
                                        sx={{ height: 28 }}
                                      >
                                        Open
                                      </MenuItem>
                                      <MenuItem
                                        value="Closed"
                                        sx={{ height: 28 }}
                                      >
                                        Closed
                                      </MenuItem>
                                      <MenuItem
                                        value="Active"
                                        sx={{ height: 28 }}
                                      >
                                        Active
                                      </MenuItem>
                                      <MenuItem
                                        value="In Active"
                                        sx={{ height: 28 }}
                                      >
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
                                  <FormControl
                                    variant="standard"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                  >
                                    <InputLabel shrink>
                                      Payment Received
                                    </InputLabel>
                                    <Select
                                      name="PaymentReceived"
                                      value={
                                        formData.PaymentReceived?.value || ""
                                      }
                                      onChange={handleTableChange}
                                      label="Payment Received"
                                      sx={{
                                        ...fieldStyle,
                                        height: 32,
                                        lineHeight: "1.5em",
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
                                  <FormControl
                                    variant="standard"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                  >
                                    <InputLabel shrink>QC Cleared</InputLabel>
                                    <Select
                                      name="QCCleared"
                                      value={formData.QCCleared?.value || ""}
                                      onChange={handleTableChange}
                                      label="QC Cleared"
                                      sx={{
                                        ...fieldStyle,
                                        height: 32,
                                        lineHeight: "1.5em",
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
                                          label="Product"
                                          value={formData.Product?.value || ""}
                                          onChange={handleTableChange}
                                          variant="standard"
                                          fullWidth
                                          InputLabelProps={{ shrink: true }}
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
                                      sx={{
                                        "& .MuiAutocomplete-input": {
                                          fontSize: "0.875rem",
                                          height: 40,
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

                            {/* if (key === "VendorName") {
                              return (
                                <Grid item xs={12} md={3} key={key}>
                                  <Stack spacing={4}>
                                    <Autocomplete
                                      id="vendor-autocomplete"
                                      freeSolo
                                      options={vendors.map(
                                        (vendor) => vendor.Name
                                      )}
                                      disableClearable
                                      value={formData?.VendorName?.value || ""} // Ensure value is taken from formData
                                      onInputChange={(event, newValue) => {
                                        handleVendorChange(event, newValue); // Update formData
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="Vendor Name"
                                          name="VendorName"
                                          variant="standard"
                                          fullWidth
                                          InputLabelProps={{ shrink: true }}
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
                                    />
                                  </Stack>
                                </Grid>
                              );
                            } */}

                            if (key === "VendorName") {
                              return (
                                <Grid item xs={12} md={3} key={key}>
                                  <Stack spacing={4}>
                                    <Autocomplete
                                      id="vendor-autocomplete"
                                      multiple // Enable multiple selection
                                      options={vendors.map((vendor) => vendor.Name)}
                                      disableClearable
                                      value={formData?.VendorName?.value || []}
                                      onChange={(event, newValue) => {
                                        handleVendorChange(event, newValue); 
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="Vendor Name"
                                          name="VendorName"
                                          variant="standard"
                                          fullWidth
                                          InputLabelProps={{ shrink: true }}
                                          InputProps={{
                                            ...params.InputProps,
                                            // Remove the dropdown button
                                            endAdornment: null, 
                                            style: {
                                              fontSize: "0.875rem",
                                              height: 32,
                                            },
                                          }}
                                          sx={{ mb: 1 }}
                                        />
                                      )}
                                    />
                                  </Stack>
                                </Grid>
                              );
                            }

                            if (key === "WorkOrderId") {
                              return (
                                <Grid item xs={12} md={3} key={key}>
                                  <TextField
                                    name="WorkOrderId"
                                    label="Work Order ID"
                                    type="text"
                                    variant="standard"
                                    value={formData.WorkOrderId.value || ""}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ readOnly: true }}
                                    sx={{
                                      mb: 1,
                                      "& .MuiOutlinedInput-root": {
                                        height: 40,
                                      },
                                    }}
                                  />
                                </Grid>
                              );
                            }

                            if (key === "files") {
                              return (
                                <Grid item xs={12} md={3} key="files">
                                  <TextField
                                    name="files"
                                    label="files"
                                    type="text"
                                    variant="standard"
                                    value={
    Array.isArray(formData.files?.value) && formData.files?.value.length > 0
      ? formData.files.value.map((file) => file.name).join(", ")
      : "No files selected"
  }
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ readOnly: true }}
                                    sx={{
                                      mb: 1,
                                      "& .MuiOutlinedInput-root": {
                                        height: 40,
                                      },
                                    }}
                                  />

                                  <Button
                                    variant="contained"
                                    component="span"
                                    onClick={() =>
                                      document
                                        .getElementById("upload-files")
                                        .click()
                                    }
                                    sx={{
                                      mt: 1,
                                      fontSize: "10px",
                                      height: "20px",
                                    }}
                                  >
                                    Upload
                                  </Button>
                                  <input
                                    id="upload-files"
                                    type="file"
                                    multiple
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                  />
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
                                      : key === "QTYSETS"
                                      ? "QTY/SETS"
                                      : key === "Completion"
                                      ? "Completion(%)"
                                      : key.replace(/([A-Z])/g, " $1").trim()
                                  }
                                  type={initalFormData[key].type}
                                  variant="standard"
                                  value={formData[key]?.value || ""}
                                  onChange={handleTableChange}
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  sx={{
                                    mb: 1,
                                    "& .MuiOutlinedInput-root": { height: 40 },
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
                                {key === "Completion"
                                  ? "Completion"
                                  : key === "SNO"
                                  ? "SNO"
                                  : key === "QTYSETS"
                                  ? "QTY/SETS"
                                  : key === "WorkOrderId"
                                  ? "Work Order Id"
                                  : key === "MakeBuy"
                                  ? "Make/Buy" // Customize label for MakeBuy
                                  : key.replace(/([A-Z])/g, " $1").trim()}
                              </StyledTableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {tableData
                            .sort((a, b) => (a.SNO || 0) - (b.SNO || 0))
                            .map((row, index) => (
                              <StyledTableRow key={row.SNO}>
                                <StyledTableCell>
                                  <Checkbox
                                    onClick={(event) => {
                                      event.stopPropagation();

                                      handleRowClick(row, index);
                                    }}
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    color="primary"
                                  />
                                </StyledTableCell>

                                {Object.keys(initalFormData).map((key) => (
                                  <StyledTableCell key={key}>
  {key === "files"
    ? (row.files || []).map((file) => file.name).join(", ") || "No files"
    : row[key] || ""}
</StyledTableCell>

                                ))}
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
                    value={form1Data.Comments}
                    onChange={handleForm1Change}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>

      <Backdrop
        open={loading}
        // sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default AddProject;