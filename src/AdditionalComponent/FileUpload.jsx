import React, { useState, useEffect  } from "react";
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
} from "@mui/material";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import axios from "axios";
import { Backdrop, CircularProgress } from "@mui/material";
import apiClient from "../utlis/apiClient";
import Attachments from "../AdditionalComponent/Attachments";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { styled } from "@mui/system";
import { tableCellClasses } from "@mui/material/TableCell";
import { useLocation } from "react-router-dom";



const FileUpload = () => {
    const [fileData, setFileData] = useState([])
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [files, setFiles] = useState([]); 
    const [filteredFileList, setFilteredFileList] = useState([]);
    const [fileName, setFileName] = useState(""); // To store Material ID
    const location = useLocation();
  
    useEffect(() => {
      console.log("Page reload detected, resetting states...");
  
      // Clear the fileName and fileList states
      setFileName(""); 
      setFileList([]); 
  
      // Fetch the transactions
      fetchDrawingById();
  
      // If materialId exists in location.state, set it
      const fileNameFromLocation = location.state?.Name || "";
      setFileName(fileNameFromLocation);
  
    }, [location]); 


      const fetchDrawingById = async () => {
      
        const SK = "FLE";
    
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
          setFileList(filesWithKeys); 
        } catch (error) {
          console.error("Error fetching S3 attachments:", error);
        }
      };
    
// Filter transactions based on materialId, if provided
    const filteredTransactions = fileName
    ? fileList.filter((file) => {
        const fullFileName = file.url.substring(file.url.lastIndexOf("/") + 1);
        const decodedFileName = decodeURIComponent(fullFileName);
        const cleanFileName = decodedFileName.replace(/^C#1232\/Attachments\//, '');
        return cleanFileName.toLowerCase().includes(fileName.toLowerCase());
      })
    : fileList;

    useEffect(() => {
    setFilteredFileList(filteredTransactions);
    }, [fileList, fileName]);


    const generateUniqueSortKey = () => {
        const prefix = "FLE#";
        const timestamp = Date.now(); // Current timestamp in milliseconds
        return `${prefix}${timestamp}`;
      };
      
      // Usage
      const sortkey = generateUniqueSortKey();  
      


    const onFilesAdded = (newFiles) => {
        setFileData((prevFileData) => ({
          ...prevFileData,
          files: newFiles, // Directly store raw File objects
        }));
      
        // console.log(newFiles, ": raw files passed to fileData");
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
          console.log(fileData, "before");
      
          // Check if there are files to upload
          if (fileData.files && fileData.files.length > 0) {
            try {
              // Upload each file one by one
              for (const file of fileData.files) {
                const response = await apiClient.post("/api/s3-file/uploadfile", {
                  files: [{ fileName: file.name }],  // Send file one by one
                  sortKey: sortkey,
                  Name: file.name, 
                  Type: "Attachments",
                });
      
                console.log(`File ${file.name} uploaded successfully:`, response.data);
      
                const { files: signedUrls } = response.data;
      
                // Upload the file to its signed URL
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
      
          alert("Submitted the files successfully");
        } catch (error) {
          console.error("Error submitting form:", error);
          alert("Error in submitting form");
        } finally {
          setLoading(false);
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

        console.log(updateDelete);
    
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
    
                <form
                  noValidate
                  autoComplete="off"
              
                  onSubmit={handleSubmit}
                >

                 <Grid container spacing={3} alignItems="center">
                        <Grid item xs={6}>
                        <Typography variant="h6" component="div" fontWeight="bold">
                        Attachments
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
                
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={9}>
                      <Attachments
                        onFilesAdded={onFilesAdded}
                        existingFiles={files}
                      />
                    </Grid>

                    <Grid item xs={12} md={9}>
  <Typography variant="h6" gutterBottom>
    File List
  </Typography>
  {filteredFileList.length > 0 ? (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>File Name</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {filteredFileList.map((file, index) => {
            const fullFileName = file.url.substring(file.url.lastIndexOf("/") + 1);
            const decodedFileName = decodeURIComponent(fullFileName);
            const cleanFileName = decodedFileName.replace(/^C#1232\/Attachments\//, '');

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

export default FileUpload;
