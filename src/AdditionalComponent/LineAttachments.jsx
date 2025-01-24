import React, { useState } from "react";
import {
  Box,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";

const LineAttachments = ({ onFilesLineAdded, existingFilesLine = [] }) => {
  const [uploadedFolders, setUploadedFolders] = useState(existingFilesLine);
  const [filesLine, setFilesLine] = useState([]); 
  const [displayFiles, setDisplayFiles] = useState([]);


  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files); // Convert FileList to Array
    const updatedFiles = [...uploadedFolders, ...newFiles];

     // Generate display data
     const newDisplayFiles = newFiles.map((file) => ({
      fileName: file.name, // Extract file name
      url: URL.createObjectURL(file), // Temporary URL for file preview
    }));
  
    setUploadedFolders(updatedFiles); // Maintain raw File objects in state
    setDisplayFiles((prev) => [...prev, ...newDisplayFiles]); // Update display files
    onFilesLineAdded(updatedFiles); // Pass the raw File objects to the parent component
  };

  const handleRemove = (index) => {
    // Remove the selected file from both `uploadedFolders` and `displayFiles`
    const updatedFolders = uploadedFolders.filter((_, i) => i !== index);
    const updatedDisplayFiles = displayFiles.filter((_, i) => i !== index);
  
    // Update the states
    setUploadedFolders(updatedFolders);
    setDisplayFiles(updatedDisplayFiles);
  
    // Pass the updated folders to the parent component
    onFilesLineAdded(updatedFolders);
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Grid container spacing={3}>

        <Grid item xs={12}>
        <input type="file" onChange={handleFileChange} />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Folder Name</StyledTableCell>
                  <StyledTableCell>URL</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {displayFiles.map((folder, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{folder.fileName}</StyledTableCell>
                    <StyledTableCell>
                      <a
                        href={folder.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{fontSize:"15px",color:"blue"}}
                      >
                        {folder.url}
                      </a>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRemove(index)}
                        sx={{
                        height: "20px",
                        width: "53px",
                        fontSize: "0.75rem",
                      }}
                      >
                        Remove
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LineAttachments;
