import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  styled,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../utlis/apiClient";

const DynamicSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchKey = params.get("query");

    if (searchKey) {
      fetchSearchResults(searchKey);
    }
  }, [location]);

  const fetchSearchResults = async (searchKey) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/search?searchKey=${encodeURIComponent(searchKey)}`);
      console.log(response);
      const data = Array.isArray(response.data.results) ? response.data.results : [];
      
      // Remove duplicate rows based on EntityType and Name
      const uniqueResults = data.filter((value, index, self) => 
        index === self.findIndex((t) => (
          t.EntityType === value.EntityType && t.Name === value.Name
        ))
      );

      setSearchResults(uniqueResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (result) => {
    if (result.EntityType === "Tender") {
      navigate("/UpdateTender", { state: { tenderSK: result.SK } });
    } 
    else if (result.EntityType === "Project") {
      navigate("/LineItems", {
        state: {
          projectData: result,
          projectPK: result.PK,
          projectSK: result.SK,
        },
      });
    } 
    else if (result.EntityType === "Vendor") {
      navigate("/updatevendor", { state: { pk: result.PK } });
    } 
    else if (result.EntityType === "InventoryTransaction") {
      navigate("/InventoryTranscation", { state: { materialId: result.Name } });
    }
    else if (result.EntityType === "OnHand") {
      navigate("/InventoryOnHand", { state: { materialId: result.Name } });
    } 
    else if (result.EntityType === "Product") {
      navigate("/UpdateProduct", { state: { productPK: result.PK, productSK: result.SK } });
    } 
    else if (result.EntityType === "Work Order") {
      navigate("/ManageWorkOrder", { state: { Name: result.Name } });
    } 
    else if (result.EntityType === "OutSource") {
      navigate("/UpdateWorkOrder", { state: { OutSourcePK: result.PK } });
    }
    else if (result.EntityType === "Tools") {
      navigate("/ManageTools", { state: { ToolsName: result.Name } });
    }
    else if (result.EntityType === "ToolsInventoryTransaction") {
      navigate("/ToolsTransactions", { state: { ToolsName: result.Name } });
    }
    else if (result.EntityType === "ToolsOnHand") {
      navigate("/ToolsInventoryOnHand", { state: { ToolsName: result.Name } });
    }
    else if (result.EntityType === "ToolsWorkOrder") {
      navigate("/ToolsInventoryOnHand", { state: { ToolsName: result.Name } });
    }
    else if (result.EntityType === "Customer") {
      navigate("/updateCompany", { state: { pk: result.PK } });
    }
    else if (result.EntityType === "TenderLineItem") {
      navigate("/UpdateTender", { state: { tenderSK: result.SK } });
    }
    else if (result.EntityType === "LineItem") {
      navigate("/LineItems", { state: { projectPK: result.SK } });
    }
    else if (result.EntityType === "Material") {
      navigate("/UpdateMaterial", { state: { productPK: result.SK } });
    }
    else if (result.EntityType === "S3-Location") {
      navigate("/FileUpload", { state: { Name: result.Name } });
    }
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
    "&:last-child td, &:last-child th": {
      border: 0,
    },
    cursor: "pointer",
  }));

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <SubHeader />
      <Grid container sx={{ flexGrow: 1, marginTop: "-80px", padding: 0 }} spacing={6}>
        <Grid item xs={12} md={9}>
          <Box
            sx={{
              minHeight: "calc(100vh - 112px)",
              backgroundColor: "white",
              padding: 2,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginLeft: "140px",
              width: "1100px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Search Results
            </Typography>

            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SNO</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <StyledTableRow key={index} onClick={() => handleRowClick(result)}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{result.EntityType}</StyledTableCell>
                        <StyledTableCell>{result.Name}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DynamicSearch;
