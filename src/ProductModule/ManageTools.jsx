import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import {
  Box,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  CircularProgress,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../utlis/apiClient";
import Layout from "../VendorManagement/Vendor Layout/Layout";
import { StyledTableCell, StyledTableRow } from "../ComponentCss/Tabel/TabelCss";

const ManageTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const ToolsName = location.state?.ToolsName || "";

  console.log(ToolsName," the tools name");
  console.log(location.state?.ToolsName," the tools name");

  useEffect(() => {
    if (ToolsName) {
      setSearchQuery(ToolsName);
    } else {
      setSearchQuery("");
    }
    fetchToolsData();
  }, [ToolsName]);


  const fetchToolsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/api/tools/get-all-tools`);
      console.log("API Response:", response.data.data);
      setTools(response.data.data);
    } catch (error) {
      console.error("Error fetching Tools data:", error);
      setError("Failed to fetch tools data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };



  const filteredItems = tools.filter(
    (tool) =>
      tool.Name && tool.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortDataByName = (data) => {
    return data.sort((a, b) => a.Name.localeCompare(b.Name));
  };

  const sortedFilteredItems = sortDataByName(filteredItems);

  const handleEditClick = (pk) => {
    navigate("/UpdateTools", { state: { pk } });
  };

  return (
      <Layout>

            <Grid
              container
              alignItems="center"
              spacing={2}
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="h6" gutterBottom >
                  Tools Details
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  size="small"
                  component={Link}
                  to="/AddTools"
                >
                  Add Tools
                </Button>
              </Grid>
            </Grid>

            {error && (
              <Typography color="error" variant="body2" gutterBottom>
                {error}
              </Typography>
            )}

            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SNO</StyledTableCell>
                    <StyledTableCell>Description</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                  
                    {/* <StyledTableCell>Size</StyledTableCell> */}
               
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Composition</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : sortedFilteredItems.length > 0 ? (
                    sortedFilteredItems.map((tool, index) => (
                      <StyledTableRow key={tool.PK}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{tool.Name}</StyledTableCell>
                        <StyledTableCell>{tool.Values?.Tools}</StyledTableCell>
                 
                        {/* <StyledTableCell>{tool.Values?.Size}</StyledTableCell> */}
                    
                        <StyledTableCell>{tool.Quantity}</StyledTableCell>
                        <StyledTableCell>{tool.Values?.Composition}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        There Are No Tools Records.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
        </Layout>
  );
};

export default ManageTools;
