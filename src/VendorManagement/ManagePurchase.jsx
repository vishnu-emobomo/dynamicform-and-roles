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
  CircularProgress,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import TocIcon from "@mui/icons-material/Toc";
import { useNavigate } from "react-router-dom";
import apiClient from "../utlis/apiClient";
import Pagination from "../utlis/Pagination";

const ManagePurchase = () => {
  const [purchase, setPurchase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snoNumber, setSnoNumber] = useState(0);

  const navigate = useNavigate();

  // Fetch purchase orders from the API

    const fetchPurchaseOrders = async () => {
     setLoading(true);
      try {
        const response = await apiClient.get(
          `/api/vendor/get-all-purchase-orders`
        );
        console.log(response.data.data);

        const purchaseData = response.data.data || [];

        setPurchase(purchaseData);
      } catch (error) {
        console.error("Error fetching purchase order:", error);
        setPurchase([]); // Ensure purchase is at least an empty array
      } finally {
        setLoading(false); // Set loading to false when fetch completes
      }
    };

    useEffect(() => {
      fetchPurchaseOrders();
    },[]);

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

  // Define the handleClickPurchase function outside of useEffect
  const handleClickPurchase = (purchaseItem,e) => {
    e.preventDefault();
    navigate("/POLineItem", {
      state: {
        purchasePK: purchaseItem.PK,
        projectPK: purchaseItem.SK,
      },
    });

  
  };
  
  
  

  // State for paginated data
  // const [paginatedData, setPaginatedData] = useState(
  //   purchase.slice(0, 10) // Initial data slice for the first page
  // );

  const handlePageDataChange = (start, end) => {
   // setPaginatedData(purchase.slice(start, end));
    setSnoNumber(start);
  };

  // useEffect(() => {
  //   handlePageDataChange(0, 10); // Initialize paginated data
  // }, [purchase]);

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
              height: "calc(100vh - 112px)",
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
                  PurchaseOrder Details
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  // sx={{ width: "150px" }}
                  component={Link}
                  to="/AddPurchase"
                  size="small"
                >
                  Add Purchase
                </Button>
              </Grid>
            </Grid>

            {/* Show projects or a fallback message */}
            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SNO</StyledTableCell>
                    <StyledTableCell>PO Number</StyledTableCell>
                    <StyledTableCell>PO Type</StyledTableCell>
                    <StyledTableCell>PO Date</StyledTableCell>
                    <StyledTableCell>PO UpdatedDate</StyledTableCell>
                    <StyledTableCell>PO Type</StyledTableCell>
                    <StyledTableCell>Created By</StyledTableCell>
                    <StyledTableCell>Project Number</StyledTableCell>
                    {/* <StyledTableCell>Tender Number</StyledTableCell> */}
                    <StyledTableCell>Vendor Name</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Receipt</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={13} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) :
                  
                  purchase && purchase.length > 0 ? (
                    purchase.map((purchaseItem, index) => (
                      <StyledTableRow key={purchaseItem.PK}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {purchaseItem.PurchaseOrderNumber}
                        </StyledTableCell>
                        <StyledTableCell>
                          {purchaseItem.Values.POType}
                        </StyledTableCell>
                        <StyledTableCell>
                          {purchaseItem.Values.PODate}
                        </StyledTableCell>
                        <StyledTableCell>
                          {purchaseItem.Values.POUpdatedData}
                        </StyledTableCell>
                        <StyledTableCell>
                          {purchaseItem.Values.POType}
                        </StyledTableCell>
                        <StyledTableCell>
                          {purchaseItem.Values.CreatedBy}
                        </StyledTableCell>
                        <StyledTableCell>
                          {purchaseItem.Values.PONumber}
                        </StyledTableCell>
                        {/* <StyledTableCell>
                          {purchaseItem.Values.tenderCodeNumber}
                        </StyledTableCell> */}
                        <StyledTableCell>
                          {purchaseItem.VendorName}
                        </StyledTableCell>
                        <StyledTableCell>
                          {purchaseItem.Values.Status}
                        </StyledTableCell>
                        <StyledTableCell 
                           onClick={(e) => {
                                    console.log("click event")
                                    handleClickPurchase(purchaseItem,e);
                                  }}    
                        >
                        <TocIcon
                            sx={{ cursor: "pointer" }}
                           
                            />
                        </StyledTableCell>

                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={12} align="center">
                        No purchase orders available.
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
              {/* Pagination component outside of TableBody */}
              {/* { purchase && purchase.length > 0 && (
                <Pagination
                  totalItems={purchase.length}
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

export default ManagePurchase;