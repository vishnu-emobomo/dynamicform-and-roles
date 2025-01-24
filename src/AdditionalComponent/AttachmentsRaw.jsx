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
import { uploadFileToBackend } from "./UploadFileToS3";

const Attachments = ({ onAttachmentDataChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFolders, setUploadedFolders] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const fileUrl = await uploadFileToBackend(selectedFile);

      console.log(`File uploaded successfully: ${fileUrl}`);

      const updatedFolders = [
        ...uploadedFolders,
        {
          name: selectedFile.name,
          url: fileUrl,
          key: `C#1232/${selectedFile.name}`,
        },
      ];
      setUploadedFolders(updatedFolders);

      onAttachmentDataChange(updatedFolders);

      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed");
    }
  };

  const handleRemove = async (index) => {
    const fileToDelete = uploadedFolders[index];

    try {
      await deleteFileFromS3(fileToDelete.key);
      console.log(`File deleted successfully: ${fileToDelete.key}`);

      const updatedFolders = uploadedFolders.filter((_, i) => i !== index);
      setUploadedFolders(updatedFolders);

      onAttachmentDataChange(updatedFolders);
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete the file from S3");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ padding: 2, backgroundColor: "white", borderRadius: 1 }}>
            <Typography variant="h6">Upload Folders</Typography>
            <input type="file" onChange={handleFileChange} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              sx={{ marginLeft: 2 }}
            >
              Add
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Folder Name</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadedFolders.map((folder, index) => (
                  <TableRow key={index}>
                    <TableCell>{folder.name}</TableCell>
                    <TableCell>
                      <a
                        href={folder.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {folder.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRemove(index)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Attachments;
