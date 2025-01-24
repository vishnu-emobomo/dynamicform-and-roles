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
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import apiClient from "../utlis/apiClient";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Checkbox } from "@mui/material";

const ManageVendor = () => {
  const [vendor, setVendor] = useState([]);
  const [userPK, setUserPK] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Calculate filtered items based on search query
  const filteredItems = vendor.filter(
    (vendor) =>
      vendor.Name &&
      vendor.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    setLoading(true); // Set loading to true when starting fetch

    try {
      const response = await apiClient.get(`/api/vendor/getallvendors`);
      console.log("API Response:", response.data);
      setVendor(response.data);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    } finally {
      setLoading(false); // Set loading to false when fetch completes
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
  }));

  const handleEditClick = (pk) => {
    navigate("/updatevendor", { state: { pk } });
  };

  const handleDelete = async (vendor) => {
    setLoading(true);
    const updateDelete = {
      tableName: "Vendor",
      pk: vendor.PK,
      sk: vendor.SK,
    };

    if (window.confirm(`Are you sure you want to delete this vendor?`)) {
        try {
          const response = await apiClient.post("/api/remove", updateDelete); 
          console.log(response.data);
      
          // Optionally, refresh tenders after deletion
          setVendor((prevTenders) =>
            prevTenders.filter((item) => item.PK !== vendor.PK)
          );
        } catch (error) {
          console.error("Error deleting tender:", error);
        } finally {
          setLoading(false); // Set loading to false when fetch completes
        }
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
              minHeight: "calc(100vh - 112px)",
              backgroundColor: "white",
              borderRadius: "10px",
              marginLeft: "15px",
              marginRight: "25px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          ></Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box
            sx={{
              minHeight: "calc(100vh - 112px)",
              backgroundColor: "white",
              padding: 2,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginLeft: "-50px",
            }}
          >
            <Grid
              container
              alignItems="center"
              spacing={2}
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  Vendor Details
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  // sx={{ width: "150px" }}
                  size="small"
                  component={Link}
                  to="/AddVendor"
                >
                  Add Vendor
                </Button>
              </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SNO</StyledTableCell>
                    <StyledTableCell>Company Name</StyledTableCell>
                    <StyledTableCell>Company Email</StyledTableCell>
                    <StyledTableCell>Address</StyledTableCell>
                    <StyledTableCell>Phone Number</StyledTableCell>
                    <StyledTableCell>Vendor Name</StyledTableCell>
                    {/* <StyledTableCell>Vendor Prefix</StyledTableCell> */}
                    <StyledTableCell>Creation Date</StyledTableCell>
                    <StyledTableCell>Comments</StyledTableCell>
                    <StyledTableCell>Edit</StyledTableCell>
                    <StyledTableCell>Delete</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.length > 0 ? (
                    filteredItems.map((vendor, index) => (
                      <StyledTableRow key={vendor.PK}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {vendor.Name}
                        </StyledTableCell>
                        <StyledTableCell>
                          {vendor.Values?.CompanyEmail}
                        </StyledTableCell>
                        <StyledTableCell>
                          {vendor.Values?.Address}
                        </StyledTableCell>
                        <StyledTableCell>
                          {vendor.Values?.PhoneNumber}
                        </StyledTableCell>
                        <StyledTableCell>{vendor.Values?.VendorName}</StyledTableCell>
                        {/* <StyledTableCell>
                          {vendor.Values?.VendorPrefix}
                        </StyledTableCell> */}
                        <StyledTableCell>{vendor.CreationDate}</StyledTableCell>
                        <StyledTableCell>
                          {vendor.Values?.Comments}
                        </StyledTableCell>
                        <StyledTableCell>
                          <EditIcon
                            onClick={(e) => handleEditClick(vendor.PK)}
                            style={{ cursor: "pointer" }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                           <DeleteSweepIcon
                            onClick={() => handleDelete(vendor)}
                            style={{ cursor: "pointer" }}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        There Are No Vendor Records.
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

export default ManageVendor;
