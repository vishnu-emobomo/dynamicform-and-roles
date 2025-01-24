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
import { Checkbox } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import apiClient from "../utlis/apiClient";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ListItemText from '@mui/material/ListItemText';
import Attachments from "../AdditionalComponent/Attachments";


const initalFormData = {
  SNO: { value: "", type: "text" },
  Description: { value: "", type: "text" },
  ItemCode: { values: "", type: "text" },
  QTYSETS: { value: "", type: "text" },
  WorkOrderId: { values: "", type: "text" },
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
  VendorName: { value: [], type: "text" },
  LineStatus: { value: "", type: "text" },
  files: { value: [], type: "file" },
};

const LineItems = () => {
  const location = useLocation();
  const { projectPK, projectSK, projectData } = location.state || {};
  const [lineItemPK, setLineItemPK] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formDataLine, setFormDataLine] = useState(initalFormData);
  const [open, setOpen] = useState(false);
  const [productsName, setProductsName] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorPrefix, setVendorPrefix] = useState();
  const [fileList, setFileList] = useState([]);
  const [lineFiles, setLineFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lineItemsPK, setLineItemsPK] = useState([]);
  const [workOrderId, setWorkOrderId] = useState();
  const [files, setFiles] = useState([]); // State for storing files

  const [fileData, setFileData] = useState({
    files: [], 
  })

  const onFilesAdded = (newFiles) => {
    setFileData((prevFileData) => ({
      ...prevFileData,
      files: newFiles, // Directly store raw File objects
    }));
  
    // console.log(newFiles, ": raw files passed to fileData");
  };

  const [formData, setFormData] = useState({
    PONumber: "",
    ProjectDeliverydate: "",
    TenderCodenumber: "",
    WorkOrderId: "",
    Name: "",
    CustomerName: "",
    CreationDate: "",
    StartDate: "",
    EndDate: "",
    DeliverDate: "",
    ProjectStatus: "",
  });

  const projectId = encodeURIComponent(projectPK); // Adjust this line

  // Fetch LineItems from API and display in table and also the line items files
  useEffect(() => {
    // console.log("Project ID:", projectId);

    const fetchLineItemsAndFiles = async () => {
      try {
        // Fetch line items
        const response = await apiClient.get(
          `/api/line-item/get-lineitems-by-project`,
          {
            params: { projectId: projectPK },
          }
        );

        // console.log("Response from API:", response.data);

        if (response.data.success) {
          const lineItems = response.data.LineItems;
          setLineItems(lineItems);
          // console.log("Fetched line items:", lineItems);

          // Extract PK values
          const pkArray = lineItems.map((item) => item.PK);
          setLineItemsPK(pkArray);
          // console.log("Extracted PKs:", pkArray);

          // Fetch files for each PK
          const filesData = await Promise.all(
            pkArray.map(async (pk) => {
              try {
                const fileResponse = await apiClient.get(
                  `/api/s3-file/get-s3Attachments-By-Id/${encodeURIComponent(pk)}`
                );
                 console.log(`Files for PK (${pk}):`, fileResponse.data);

                return {
                  PK: pk,
                  files: fileResponse.data?.data || [], 
                };
              } catch (fileError) {
                console.error(`Error fetching files for PK (${pk}):`, fileError);
                return { PK: pk, files: [] }; // Return empty files in case of error
              }
            })
          );

          // Merge files data into lineItems
          const updatedLineItems = lineItems.map((item) => {
            const fileData = filesData.find((file) => file.PK === item.PK);
            return { ...item, files: fileData ? fileData.files : [] };
          });

          setLineItems(updatedLineItems); 
           console.log("Updated line items with files:", updatedLineItems);
        } else {
          console.error("Failed to fetch line items:", response.data.message);
        }
      } catch (error) {
        console.error("There was an error fetching the line items!", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
      }
    };

    if (projectId) fetchLineItemsAndFiles();
  }, [projectId]);



  // Handle row click to open dialog and set selected item
  const handleRowClick = (item, index) => {
    setSelectedItem(item);
    setLineItemPK(item.PK);
  
    const updatedFormDataLine = {};
  
    // Iterate over each key in initialFormData and populate updatedFormDataLine
    Object.keys(initalFormData).forEach((key) => {
      updatedFormDataLine[key] = {
        value: item.Values[key] || "", // Set to an empty string if undefined
        type: initalFormData[key].type,
      };
  
      // Handle special case for "files"
      if (key === "files") {
        updatedFormDataLine[key].value = item.files || []; // Set files array if present
      } else if (item.Values[key] !== undefined) {
        updatedFormDataLine[key].value = item.Values[key]; // Set value from item.Values
      } else {
        updatedFormDataLine[key].value = item[key] || ""; // Default to empty string if not found
      }
    });
  
    // Explicitly set the values for "Name" and "Desc" if they exist in the item
    updatedFormDataLine["Name"] = {
      value: item.Name || "",
      type: "text",
    };
  
    setFormDataLine(updatedFormDataLine); // Set the form data for the dialog
    setOpenDialog(true);
  };
  
  

  const handleAddRow = async () => {
    const updatedLineItem = {
       SNO: formDataLine["SNO"]?.value || "",
      Name: formDataLine["Name"]?.value || "",
      Description: formDataLine["Description"]?.value || "",
      ItemCode: formDataLine["ItemCode"]?.value || "",
      QTYSETS: formDataLine["QTYSETS"]?.value || "",
      WorkOrderId: formDataLine["WorkOrderId"]?.value || "",
      LineStatus: formDataLine["LineStatus"]?.value || "",
      CompletedQuantity: formDataLine["CompletedQuantity"]?.value || "",
      PendingQuantity: formDataLine["PendingQuantity"]?.value || "",
      QCCleared: formDataLine["QCCleared"]?.value || "",
      PaymentReceived: formDataLine["PaymentReceived"]?.value || "",
      DeliverDate: formDataLine["DeliverDate"]?.value || "",
      StartDate: formDataLine["StartDate"]?.value || "",
      ActualStartDate: formDataLine["ActualStartDate"]?.value || "",
      EndDate: formDataLine["EndDate"]?.value || "",
      ActualEndDate: formDataLine["ActualEndDate"]?.value || "",
      TeamMember: formDataLine["TeamMember"]?.value || "",
      VendorName: formDataLine["VendorName"]?.value || "",
      VendorPrefix: vendorPrefix,
      MakeBuy: formDataLine["MakeBuy"]?.value || "",
      projectPK: projectPK,
      lineItemId: lineItemPK,
    };

    console.log(updatedLineItem,"for form line item");

      const updatedLineItemFiles = {
        files: formDataLine["files"]?.value || "",
      }

      const fileData = formDataLine.files?.value || [];

      console.log(fileData,": data from the form")

    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.put(
        `https://z0qexibhsk.execute-api.ap-south-1.amazonaws.com/api/line-item/update-lineitem`,
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

        console.log(response.data," after succesfull submittion of line item");

        if (fileData.length > 0) {
          try {
            const PK = fileData[0]?.PK || "defaultPrimaryKey"; 
            const sortKey = fileData[0]?.SK || "defaultSortKey"; 
            console.log(fileData, ": the data from fileData");
        
            const payload = {
              files: fileData.map(file => {
                console.log("Processing file:", file); 
                return {
                  fileName: file.Name?.[0]?.fileName || "defaultFileName", 
                };
              }),
              PK,
              sortKey,
            };
        
            // Log the payload to verify the format
            console.log(payload, "Payload to send");
        
            // Step 1: Send the payload to the API to get signed URLs
            const response = await apiClient.post("/api/s3-file/s3-lineitems-upload", payload);
        
            const { files: signedUrls } = response.data;
        
            for (const file of fileData) {
              // Check if file.file exists before trying to upload
              if (!file.file) {
                throw new Error(`File object not found for ${file.Name?.[0]?.fileName}`);
              }
              const fileName = file.Name?.[0]?.fileName || "defaultFileName";
        
             
              // Find the corresponding signed URL for the current file
              const signedUrlObj = signedUrls.find(item => item.fileName === fileName);
        
              if (!signedUrlObj) {
                throw new Error(`No signed URL found for file: ${fileName}`);
              }
        
              const { signedUrl } = signedUrlObj;
        
              // Step 3: Upload the file to S3 using the signed URL
              await axios.put(signedUrl, file.file, {
                headers: {
                  "Content-Type": file.file.type, // Ensure correct content type
                },
              });
        
              console.log(`File ${fileName} uploaded successfully.`);
            }
          } catch (error) {
            console.error("Error during file upload:", error);
          }
        } else {
          console.log("No files to upload.");
        }
        
        
        


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
                    ...updatedData.Values,
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
          value: lineItems.length + 1,
          type: "number",
        };

        setFormDataLine(updatedFormDataLine);
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
          const projectData = response.data.data[0];
          // console.log("Project Details Response:", projectData.Values);

          setFormData({
            PONumber: projectData.Values.PONumber || "",
            TenderCodenumber: projectData.Values.TenderCodenumber || "",
            CustomerName: projectData.Values.CustomerName || "",
            ProjectDeliverydate: projectData.Values.ProjectDeliverydate || "",
            WorkOrderId: projectData.Values.WorkOrderId || "",
            CreationDate: formatDate(projectData.CreationDate) || "",
            StartDate: projectData.Values.StartDate || "",
            EndDate: projectData.Values.EndDate || "",
            DeliverDate: projectData.Values.DeliverDate || "",
            ProjectStatus: projectData.Values.ProjectStatus || "",
          });

          const lastFourDigitsOfPo = projectData.Values.PONumber .slice(-4);

          setWorkOrderId(lastFourDigitsOfPo);
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

  // Update the project data
  const handleSaveClick = () => {
    const requestBody = {
      tenderId: projectData.SK,
      Name: formData.Name,
      Values: {
        PONumber: formData.PONumber,
        CustomerName: formData.CustomerName,
        ProjectDeliverydate: formData.ProjectDeliverydate,
        TenderCodenumber: formData.TenderCodenumber,
        StartDate: formData.StartDate,
        EndDate: formData.EndDate,
        DeliverDate: formData.DeliverDate,
        ProjectStatus: formData.ProjectStatus,
      },
    };

    // console.log("Project ID:", projectId);
    // console.log(
    //   "Sending request with body:",
    //   JSON.stringify(requestBody, null, 2)
    // );

    const token = sessionStorage.getItem("authToken");

    axios.put(
        `https://z0qexibhsk.execute-api.ap-south-1.amazonaws.com/api/project/update-project/${projectId}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add authorization if needed
          },
        }
      )
      .then((response) => {
        // console.log("Full Response:", response);



        if (response.data && response.data.message) {
          // console.log("Project updated successfully");
          alert("Project updated successfully");

          // console.log(response.data.updatedData.tenderId);
          const tenderPK = response.data.updatedData.tenderId ;

          if (fileData.files && fileData.files.length > 0) {
            try {
              const response =  apiClient.post("/api/s3-file/uploadfile", {
                files: fileData.files.map((file) => ({ fileName: file.name })),
                sortKey: tenderPK,
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
          
                 axios.put(signedUrl, file, {
                  headers: {
                    "Content-Type": file.type,
                  },
                });
          
                // console.log(`File ${file.name} uploaded successfully.`);
              }
            } catch (error) {
              console.error("Error during file upload:", error);
            }
          } else {
            console.log("No files to upload.");
          }


          setIsEditing(false);
        } else {
          console.error(
            "Update failed:",
            response.data.message || "Unknown error"
          );
        }
      })



      .catch((error) => {
        console.error("There was an error updating the project!", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
        } else {
          console.error("Error message:", error.message); // This may help understand network issues
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
  const handleTableChange = (event) => {
    const { name, value } = event.target;
  
    // Update the form data for Make/Buy selection
    setFormDataLine((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: value,
      },
    }));
  
    // Clear VendorName if "Make" is selected
    if (name === "MakeBuy" && value === "Make") {
      setFormDataLine((prevState) => ({
        ...prevState,
        VendorName: {
          ...prevState.VendorName,
          value: "", // Clear the VendorName value
        },
      }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract only the values from formDataLine
    const newLineItem = {
      ...Object.fromEntries(
        Object.entries(formDataLine).map(([key, obj]) => [key, obj.value])
      ),
      projectPK: projectPK, // Add projectPK
      VendorPrefix: vendorPrefix,
    };

    // Log the data in JSON format
    // console.log(
    //   JSON.stringify(newLineItem),
    //   ": JSON formatted data for single entry"
    // );

    try {
      // Make the POST request to create the line item
      const response = await apiClient.post(
        "/api/line-item/create-line-item",
        newLineItem,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Successfully inserted data
      // console.log("Line item created successfully:", response.data);

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

  // Open dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setFormDataLine(initalFormData); // Reset form data when closing
  };

  // get all products and vendor from the api
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
      const vendorResponse = await apiClient.get(`/api/vendor/getallvendors`);

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
      // console.error("Error fetching Products or Vendors: ", error);
      setProductsName([]); // Reset products on error
      setVendors([]); // Reset vendors on error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleVendorChange = (event, newValue) => {
    // Find the selected vendor based on the name
    const selectedVendor = vendors.find((vendor) => vendor.Name === newValue);

    // Get the vendor prefix from the selected vendor
    const vendorPrefix = selectedVendor
      ? selectedVendor.Values.VendorPrefix
      : null;

    setVendorPrefix(vendorPrefix);

    // console.log(vendorPrefix, " the prefix");

    // Update form data with the selected vendor name
    setFormDataLine((prevState) => ({
      ...prevState,
      VendorName: {
        ...prevState.VendorName,
        value: newValue,
      },
    }));
  };


// get the tender and project files
  useEffect(() => {
    const fetchDrawingById = async () => {
      // console.log(projectSK, ": SK from project");
      const SK = encodeURIComponent(projectSK);

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

    if (projectSK) fetchDrawingById();
  }, [projectSK]);


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


  const handleFileChange = (event) => {
    const files = event.target.files;
  
    if (files && files.length > 0) {
      const existingFiles = formDataLine.files?.value || [];
      const PK = existingFiles.length > 0 ? existingFiles[0].PK : formDataLine.PK;
      const SK = existingFiles.length > 0 ? existingFiles[0].SK : formDataLine.SK;
  
      const newFilesArray = Array.from(files).map((newFile) => ({
        Name: [{ fileName: newFile.name }],
        Location: { 1: URL.createObjectURL(newFile) },
        file: newFile,
        PK: PK, // Use existing PK
        SK: SK, // Use existing SK
      }));
  
      const updatedFiles = [
        ...existingFiles,
        ...newFilesArray,
      ];
  
      setFormDataLine((prevFormData) => ({
        ...prevFormData,
        files: {
          ...prevFormData.files,
          value: updatedFiles,
        },
      }));
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
                        PO Number:
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
                        Customer Name:
                      </Typography>
                      <TextField
                        id="CustomerName"
                        name="CustomerName"
                        type="text"
                        variant="standard"
                        value={formData.CustomerName}
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
                        WorkOrder Id:
                      </Typography>
                      <TextField
                        id="WorkOrderId"
                        name="WorkOrderId"
                        type="text"
                        variant="standard"
                        value={formData.WorkOrderId}
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
                        Project Status :
                      </Typography>
                      <TextField
                        id="ProjectStatus"
                        name="ProjectStatus"
                        type="text"
                        variant="standard"
                        value={formData.ProjectStatus || " "}
                        onChange={handleChange}
                        InputProps={{
                          style: {
                            height: "auto",
                            width: 150,
                            padding: "0px 0px",
                            fontSize: "14px",
                          },
                          sx: {
                            minHeight: "unset",
                            "& .MuiInputBase-input": {
                              padding: "0px 0px",
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

            <br />

            <div>

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




              <Button
                variant="contained"
                color="primary"

                sx={{ width: "50px", height: "30px", marginTop: "20px" }}
                onClick={handleClickOpen}
              >
                Add
              </Button>
              <Dialog open={open} onClose={handleClose} maxWidth="md">
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
                            <FormControl
                              variant="standard"
                              fullWidth
                              sx={{ mb: 1 }}
                            >
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
                                <MenuItem value="Open" sx={{ height: 28 }}>
                                  Open
                                </MenuItem>
                                <MenuItem value="Closed" sx={{ height: 28 }}>
                                  Closed
                                </MenuItem>
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
                            <FormControl
                              variant="standard"
                              fullWidth
                              sx={{ mb: 1 }}
                            >
                              <InputLabel shrink>Payment Received</InputLabel>
                              <Select
                                name="PaymentReceived"
                                value={
                                  formDataLine.PaymentReceived?.value || ""
                                }
                                onChange={handleTableChange}
                                label="Payment Received"
                                sx={{ ...fieldStyle, height: 32 }}
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
                                value={formDataLine.QCCleared?.value || ""}
                                onChange={handleTableChange}
                                label="QC Cleared"
                                sx={{ ...fieldStyle, height: 32 }}
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
                                options={productsName.map(
                                  (option) => option.Name
                                )}
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
                              <FormControl variant="standard" fullWidth>
                                <InputLabel shrink>Vendor Name</InputLabel>
                                <Select
                                  name="VendorName"
                                  multiple // Enable multiple selections
                                  value={formDataLine.VendorName?.value || []}  
                                  onChange={(e) => {
                                    handleVendorChange(e);
                                    handleTableChange(e);
                                  }}
                                  label="Vendor Name"
                                  renderValue={(selected) => selected.join(", ")} // Display selected values as a comma-separated string
                                >
                                  {vendors && vendors.length > 0 ? (
                                    vendors.map((vendor) => (
                                      <MenuItem
                                        key={vendor.id || vendor.Name}
                                        value={vendor.Name}
                                      >
                                        <Checkbox
                                          checked={
                                            formDataLine.VendorName?.value?.includes(vendor.Name) || false
                                          }
                                        />
                                        <ListItemText primary={vendor.Name} />
                                      </MenuItem>
                                    ))
                                  ) : (
                                    <MenuItem disabled>No vendors available</MenuItem>
                                  )}
                                </Select>
                              </FormControl>
                            </Grid>
                          );
                        }

                     if (key === "WorkOrderId") {
                        return (
                          <Grid item xs={12} md={3} key="WorkOrderId">
                            <TextField
                              name="WorkOrderId"
                              label="Work Order ID"
                              type="text"
                              variant="standard"
                              value={formDataLine.WorkOrderId?.value || ""}
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

            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Action</StyledTableCell>
                    <StyledTableCell>SNo</StyledTableCell>
                    <StyledTableCell> Description</StyledTableCell>
                    <StyledTableCell> WorkOrderId</StyledTableCell>
                    <StyledTableCell> Item Code</StyledTableCell>
                    <StyledTableCell>Qty/Sets</StyledTableCell>

                    <StyledTableCell>Files</StyledTableCell>
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
                    <StyledTableCell>Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lineItems
                    .sort((a, b) => (a.Values.SNO || 0) - (b.Values.SNO || 0))
                  .map((item, index) => (
                    <TableRow key={item.PK}>
                      <StyledTableCell>
                        <Checkbox
                          onClick={(event) => {
                            event.stopPropagation();
                            // console.log("Row clicked:", { item, index });
                            handleRowClick(item, index);
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </StyledTableCell>
                      
                      <StyledTableCell>
                          {item.Values.SNO}
                      </StyledTableCell>
                      <StyledTableCell>{item.Name}</StyledTableCell>
                      <StyledTableCell>
                        {item.Values.WorkOrderId}
                      </StyledTableCell>
                      <StyledTableCell>{item.Values.ItemCode}</StyledTableCell>
                      <StyledTableCell>{item.Values.QTYSETS}</StyledTableCell>
                      <StyledTableCell>
                        {item.files?.map((file, fileIndex) => (
                          <div key={fileIndex}>
{file.Location &&
  Object.values(file.Location).map((url, urlIndex) => {

    const fullFileName = url.split("/").pop();
    const decodedFileName = decodeURIComponent(fullFileName);
    const cleanFileName = decodedFileName.replace(/^C#1232\/Project_LineItems\//, "");

    return (
      <div key={urlIndex}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "blue",
            fontSize: "15px",
            textDecoration: "underline",
          }}
        >
          {cleanFileName}
        </a>
      </div>
    );
  })}

                          </div>
                        ))}
                      </StyledTableCell>
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
                      <StyledTableCell>
                        {item.Values.LineStatus}
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
                                value={formDataLine.MakeBuy?.value || ""}
                                onChange={handleTableChange} // Use the updated handleTableChange
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

                      if (key === "LineStatus") {
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
                                <MenuItem value="Open">Open</MenuItem>
                                <MenuItem value="Closed">Closed</MenuItem>
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

                      if (key === "QCCleared") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <FormControl variant="standard" fullWidth>
                              <InputLabel shrink>QC Cleared</InputLabel>
                              <Select
                                name="QCCleared"
                                value={formDataLine.QCCleared?.value || ""}
                                onChange={handleTableChange}
                                label="QC Cleared"
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        );
                      }

                      if (key === "Product") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <FormControl variant="standard" fullWidth>
                              <InputLabel shrink>Product</InputLabel>
                              <Select
                                name="Product"
                                value={formDataLine.Product?.value || ""}
                                onChange={handleTableChange}
                                label="Product"
                              >
                                {productsName && productsName.length > 0 ? (
                                  productsName.map((product) => (
                                    <MenuItem
                                      key={product.id}
                                      value={product.Name}
                                    >
                                      {product.Name}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem disabled>
                                    No products available
                                  </MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </Grid>
                        );
                      }

                      if (key === "VendorName") {
                        return (
                          <Grid item xs={12} md={3} key={key}>
                            <FormControl variant="standard" fullWidth>
                              <InputLabel shrink>Vendor Name</InputLabel>
                              <Select
                                name="VendorName"
                                multiple // Enable multiple selections
                                value={formDataLine.VendorName?.value || []} // Use an array as the value
                                onChange={(e) => {
                                  handleVendorChange(e);
                                  handleTableChange(e);
                                }}
                                label="Vendor Name"
                                renderValue={(selected) => selected.join(", ")}
                              >
                                {vendors && vendors.length > 0 ? (
                                  vendors.map((vendor) => (
                                    <MenuItem
                                      key={vendor.id || vendor.Name}
                                      value={vendor.Name}
                                    >
                                      <Checkbox
                                        checked={
                                          formDataLine.VendorName?.value?.includes(vendor.Name) || false
                                        }
                                      />
                                      <ListItemText primary={vendor.Name} />
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem disabled>No vendors available</MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </Grid>
                        );
                      }


                      if (key === "files") {
  return (
    <Grid item xs={12} md={12} key="files">
      <div>
        <strong>Uploaded Files:</strong>
        {formDataLine.files?.value && formDataLine.files.value.length > 0 ? (
          formDataLine.files.value.map((file, index) => (
            <div key={index}>
              <a
                href={file.Location[1]}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "blue",
                  fontSize: "15px",
                  textDecoration: "underline",
                }}
              >
                {file.Name[0]?.fileName || "Unknown File Name"}
              </a>
            </div>
          ))
        ) : (
          <p>No files uploaded.</p>
        )}
      </div>
      <Button
        variant="contained"
        component="span"
        onClick={() => document.getElementById("upload-files").click()}
        sx={{ mt: 1, fontSize: "10px", height: "20px" }}
      >
        Upload
      </Button>
      <input
        id="upload-files"
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange} // Attach file change handler here
      />
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