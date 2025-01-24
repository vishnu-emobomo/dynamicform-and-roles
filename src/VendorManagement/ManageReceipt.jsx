import React, { useEffect, useState } from "react";
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
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import TocIcon from "@mui/icons-material/Toc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiClient from "../utlis/apiClient";
import Pagination from "../utlis/Pagination";

const ManageReceipt = () => {
  const [receipt, setReceipt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snoNumber, setSnoNumber] = useState(0);

  const navigate = useNavigate();

  // Fetch receipt orders  from the API
  useEffect(() => {
    const fetchReceiptOrders = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/api/receipts/get-all-receipts`);
        console.log(response.data.data);

        const receiptData = response.data.data;

        setReceipt(receiptData);
      } catch (error) {
        console.error("Error fetching receipt order:", error);
      } finally {
        setLoading(false); // Set loading to false when fetch completes
      }
    };

    fetchReceiptOrders();
  }, []);

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

  const handleClick = (receiptItem) => {
    navigate("/ROLineItem", {
      state: {
        receiptPK: receiptItem.PK,
      },
    });
  };

  // State for paginated data
  // const [paginatedData, setPaginatedData] = useState(
  //   receipt.slice(0, 10) // Initial data slice for the first page
  // );

  const handlePageDataChange = (start, end) => {
    // setPaginatedData(receipt.slice(start, end));
    setSnoNumber(start);
  };

  useEffect(() => {
    handlePageDataChange(0, 10); // Initialize paginated data
  }, [receipt]);

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
              minHeight: "calc(100vh - 112px) !important",
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
                  Receipt Details
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  // sx={{ width: "150px" }}
                  size="small"
                  component={Link}
                  to="/AddReceipt"
                >
                  Add Receipt
                </Button>
              </Grid>
            </Grid>

            {/* Show projects or a fallback message */}
            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SNO</StyledTableCell>
                    <StyledTableCell>Receipt No</StyledTableCell>
                    <StyledTableCell>Receipt Name</StyledTableCell>
                    <StyledTableCell>Receipt Type</StyledTableCell>
                    <StyledTableCell>Vendor Name</StyledTableCell>
                    {/* <StyledTableCell>Status</StyledTableCell> */}
                    <StyledTableCell>Line Items</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={13} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : receipt.length > 0 ? (
                    receipt.map((receiptItem, index) => (
                      <StyledTableRow key={receiptItem.PK}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {receiptItem.Values.ReceiptNo}
                        </StyledTableCell>
                        <StyledTableCell>
                          {receiptItem.Values.ReceiptName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {receiptItem.Values.ReceiptType}
                        </StyledTableCell>
                        <StyledTableCell>
                          {receiptItem.Values.VendorName}
                        </StyledTableCell>
                        {/* <StyledTableCell>
                          {receiptItem.Values.Status}
                        </StyledTableCell> */}
                        <StyledTableCell>
                          <TocIcon
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleClick(receiptItem)}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={12} align="center">
                        No receipt orders available.
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
              {/* {receipt.length > 0 && (
                <Pagination
                  totalItems={receipt.length}
                  onPageDataChange={handlePageDataChange}
                />
              )} */}
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageReceipt;