import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import SubHeader from "../../Components/SubHeader";
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
import apiClient from "../../utlis/apiClient";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Checkbox } from "@mui/material";

const ManageCompany = () => {
  const [customer, setCustomer] = useState([]);
  const [snoNumber, setSnoNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Calculate filtered items based on search query
  const filteredItems = customer.filter(
    (customer) =>
      customer.Name &&
      customer.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    setLoading(true); // Set loading to true when starting fetch

    try {
      const response = await apiClient.get(`/api/customer/get-all-customer`);
      console.log("API Response:", response.data);
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
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
    navigate("/updateCompany", { state: { pk } });
  };

  
  const handleDelete = async (customer) => {
    setLoading(true);
    const updateDelete = {
      tableName: "Vendor",
      pk: customer.PK,
      sk: customer.SK,
    };

    if (window.confirm(`Are you sure you want to delete this customer?`)) {
        try {
          const response = await apiClient.post("/api/remove", updateDelete); 
          console.log(response.data);
      
          // Optionally, refresh tenders after deletion
          setCustomer((prevTenders) =>
            prevTenders.filter((item) => item.PK !== customer.PK)
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

        <Grid item xs={12} md={11}>
          <Box
            sx={{
              minHeight: "calc(100vh - 112px)",
              backgroundColor: "white",
              padding: 2,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginLeft: "120px",
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
                  Customer Details
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ width: "70px" }}
                  component={Link}
                  to="/AddCompany"
                  size="small"
                >
                  Add
                </Button>
              </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SNO</StyledTableCell>
                    <StyledTableCell>Customer Name</StyledTableCell>
                    <StyledTableCell>Customer Email</StyledTableCell>
                    <StyledTableCell>GST Number</StyledTableCell>
                    <StyledTableCell>Address</StyledTableCell>
                    <StyledTableCell>Phone Number</StyledTableCell>
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
                    filteredItems.map((customer, index) => (
                      <StyledTableRow key={customer.PK}>
                        <StyledTableCell>
                          {snoNumber + index + 1}
                        </StyledTableCell>
                        <StyledTableCell>{customer.Name}</StyledTableCell>
                        <StyledTableCell>
                          {customer.Values?.CustomerEmail}
                        </StyledTableCell>
                        <StyledTableCell>
                          {customer.Values?.GSTNumber}
                        </StyledTableCell>
                        <StyledTableCell>
                          {customer.Values?.Address}
                        </StyledTableCell>
                        <StyledTableCell>
                          {customer.Values?.PhoneNumber}
                        </StyledTableCell>
                        <StyledTableCell>
                          {customer.CreationDate}
                        </StyledTableCell>
                        <StyledTableCell>
                          {customer.Values?.Comments}
                        </StyledTableCell>
                        <StyledTableCell>
                          <EditIcon
                            onClick={() => handleEditClick(customer.PK)}
                            style={{ cursor: "pointer" }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                           <DeleteSweepIcon
                            onClick={() => handleDelete(customer)}
                            style={{ cursor: "pointer" }}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        There Are No Company Records.
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

export default ManageCompany;
