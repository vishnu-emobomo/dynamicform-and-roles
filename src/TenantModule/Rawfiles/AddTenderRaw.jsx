import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import apiClient from "../../utlis/apiClient";
import EditIcon from "@mui/icons-material/Edit";
import TenderPDF from "../../PDFComponent/TenderPDF";
import MailOutlined from "@mui/icons-material/MailOutlined";
import "../ComponentCss/AddTender.css";
import { uploadFileToS3 } from "../../AdditionalComponent/UploadFileToS3";
import Attachments from "../../AdditionalComponent/Attachments";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "10px", // Adjust this to change only the placeholder size
  },
});

const defaultTermsAndConditions = `1. PAYMENT TERMS
2. TAXES EXTRA GST 18% Applicable.
3. FREIGHT
4. VALIDITY OF QUOTATION
5. DELIVERY
6. Raw material
7. Testing Charges: Raw material testing charges extra at actual like Chemical, mechanical, ultrasonic, DP
`;

const AddTender = ({initialFormData, onFormDataChange, attachmentData, clearAttachments}) => {
  const currentDate = new Date().toLocaleDateString("en-GB");

  useEffect(() => {
    console.log("Current attachment data:", attachmentData);
  }, [attachmentData]);
  
    // State to store attachment data as an array
    const [attachmentsArray, setAttachmentsArray] = useState([]);

    useEffect(() => {
      // Convert attachmentData to a user-friendly array format
      const convertedAttachments = Array.isArray(attachmentData)
        ? attachmentData.map(file => ({
            name: file.name,
            size: (file.size / 1024).toFixed(2), // Convert size to KB
            type: file.type,
            data: file.data,
          }))
        : [];
  
      setAttachmentsArray(convertedAttachments);
  
      console.log("Current attachment data:", convertedAttachments);
    }, [attachmentData]);


  const [formData, setFormData] = useState(initialFormData  || {
    EntityType: "Tender",
    Name: "TenderName",
    CreationDate: currentDate,
    Values: {
      Name: "",
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
      Comments: "",
      TermsAndConditions: defaultTermsAndConditions,
    },
  });

  
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [partitionKey, setPartitionKey] = useState("");


    useEffect(() => {
      onFormDataChange(formData); // Ensure the parent component receives updated formData
    }, [formData, onFormDataChange]);



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
      };
    });
  };



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting data:", formData);

      // Make the API request
      const response = await apiClient.post(
        `/api/tender/create-tender`,
        formData
      );

      // Log the response
      console.log("Submitted form data:", response.data);

      // Check the response status
      if (response.status === 200) {
        const generatedPartitionKey = response.data.PK;
        setPartitionKey(generatedPartitionKey);

        console.log(generatedPartitionKey, ": this id the partitionkey");

        await handleUpload(generatedPartitionKey);

        clearAttachments();


        // Reset form fields after successful submission
        setFormData({
          EntityType: "Tender",
          Name: "TenderName",
          CreationDate: currentDate,
          Values: {
            Name: "",
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
            Comments: "",
          },
        });

        // Optionally reload the page
        // window.location.reload();
      } else {
        alert(`Error: ${response.data.message || "Failed to submit tender"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error in submitting form");
    }
  };

  const handleUpload = async (generatedPartitionKey) => {
    try {
      // Check if attachmentData is available
      if (!attachmentData || attachmentData.length === 0) {
        alert("No files to upload");
        return;
      }

      // Extract URLs from attachmentData
      const urls = attachmentData.map((attachment) => attachment.url);
      console.log(urls, ": extracted URLs inside handle upload");
      console.log(generatedPartitionKey, ": inside handle upload");

      // Store the array of URLs in the Location attribute as JSON
      const response = await apiClient.post("/api/s3-file/uploadfile", {
        fileName: urls.join(", "), // Optionally handle fileName differently
        Name: formData.Name,
        SortKey: generatedPartitionKey,
        Location: JSON.stringify(urls), // Store URLs as JSON
      });

      console.log(response, "for the dynamo s3");

      if (response.status === 200) {
        alert("File URLs stored successfully");
        setUploadedUrls(urls); // Update state with the uploaded URLs
      } else {
        alert("Failed to store file paths");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Grid container sx={{ flexGrow: 1, padding: 0 }} spacing={6}>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              minHeight: "calc(100vh - 112px) ",
              backgroundColor: "white",
              padding: 2, // Adding padding for the form
              borderRadius: "10px", // Adds border radius
              // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adds shadow
              marginLeft: "-20px",
            }}
          >
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>

              <Grid
                  container
                  spacing={3}
                  justifyContent="space-between"
                >
                  <Grid item xs={12} sm={5} style={{ marginLeft: "20px" }}>
                    <Typography variant="h6" component="div" fontWeight="bold">
                     
                    </Typography>
                  </Grid>

                  
                  <Grid item xs={12} sm={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{
                        height: "20px",
                        width: "53px",
                        fontSize: "0.75rem"
                      }}
                      fullWidth
                    >
                      <h5>submit</h5>
                    </Button>
                  </Grid>
                </Grid>




                <Grid item xs={12} md={2}>
                  <TextField
                    id="Name"
                    name="Name"
                    label="Tender Name"
                    variant="standard"
                    type="text"
                    value={formData.Values.Name}
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
                    value={formData.Values.TenderCodenumber}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="Quantity"
                    name="Quantity"
                    label="Quantity"
                    variant="standard"
                    type="number"
                    value={formData.Values.Quantity}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="UnitPrice"
                    name="UnitPrice"
                    label="Unit Price"
                    type="number"
                    variant="standard"
                    value={formData.Values.UnitPrice}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="TotalPrice"
                    name="TotalPrice"
                    label="Total Price"
                    type="number"
                    value={formData.Values.TotalPrice}
                    onChange={handleChange}
                    variant="standard"
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
                    id="CustomerName"
                    name="CustomerName"
                    label="Customer Name"
                    type="text"
                    value={formData.Values.CustomerName}
                    onChange={handleChange}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
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
                    // InputProps={{
                    //   readOnly: !isEditing, // Set readonly when not editing
                    // }}
                  />
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddTender;