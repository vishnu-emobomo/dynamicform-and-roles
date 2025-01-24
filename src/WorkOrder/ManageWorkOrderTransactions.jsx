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
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserId } from "../utlis/tokenUtils";
import TocIcon from "@mui/icons-material/Toc";
import apiClient from "../utlis/apiClient";
import Pagination from "../utlis/Pagination";

const ManageWorkOrderTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snoNumber, setSnoNumber] = useState(0);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/api/in-out-source/get-all-workorder-transactions`
      );
      console.log(response.data);
      if (Array.isArray(response.data)) {
        setTransactions(response.data);
      } else {
        console.error("Unexpected data format:", response.data.data);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching Transactions: ", error);
      setTransactions([]);
    } finally {
      setLoading(false); // Set loading to false when fetch completes
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // State for paginated data
  const [paginatedData, setPaginatedData] = useState(
    transactions.slice(0, 10) // Initial data slice for the first page
  );

  const handlePageDataChange = (start, end) => {
    setPaginatedData(transactions.slice(start, end));
    setSnoNumber(start);
  };

  useEffect(() => {
    handlePageDataChange(0, 10); // Initialize paginated data
  }, [transactions]);

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
                  WorkOrder Transactions
                </Typography>
              </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SNO</StyledTableCell>
                    <StyledTableCell>Gate Pass</StyledTableCell>
                    <StyledTableCell>Vendor Name</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    // Show loading spinner while data is being fetched
                    <TableRow>
                      <TableCell colSpan={13} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <StyledTableRow key={transaction.PK}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {transaction.GatePass}
                        </StyledTableCell>
                        <StyledTableCell>
                          {transaction.VendorName}
                        </StyledTableCell>
                        <StyledTableCell>{transaction.Type}</StyledTableCell>
                        <StyledTableCell>{transaction.Date}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={13} align="center">
                        There Are No Transaction Data.
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
              {transactions.length > 0 && (
                <Pagination
                  totalItems={transactions.length}
                  onPageDataChange={handlePageDataChange}
                />
              )}
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageWorkOrderTransactions;
