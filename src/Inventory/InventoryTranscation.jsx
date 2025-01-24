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
  CircularProgress,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import apiClient from "../utlis/apiClient";

const InventoryTransaction = () => {
  const [inventoryTrans, setInventoryTrans] = useState([]); // To store transactions
  const [loading, setLoading] = useState(true);
  const [materialId, setMaterialId] = useState(""); // To store Material ID
  const location = useLocation();

  useEffect(() => {
    console.log("Page reload detected, resetting states...");

    // Clear the materialId and inventoryTrans states
    setMaterialId(""); 
    setInventoryTrans([]); 

    // Fetch the transactions
    fetchInventoryTransactions();

    // If materialId exists in location.state, set it
    const materialFromLocation = location.state?.materialId || "";
    setMaterialId(materialFromLocation);

  }, [location]); 

  const fetchInventoryTransactions = async () => {
    try {
      const response = await apiClient.get(`/api/inventory/get-all-transactions`);
      const Transactions = response.data.InventoryTransactions;
      setInventoryTrans(Transactions); // Set the transactions from API response
    } catch (error) {
      console.error("Error fetching inventory transactions:", error);
    } finally {
      setLoading(false); // Stop loading after fetching
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

  // Filter transactions based on materialId, if provided
  const filteredTransactions = materialId
    ? inventoryTrans.filter((trans) =>
        trans.Name.toLowerCase().includes(materialId.toLowerCase())
      )
    : inventoryTrans;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <SubHeader />

      <Grid container sx={{ flexGrow: 1, marginTop: "-82px", padding: 0 }} spacing={6}>
        <Grid item xs={12} md={11}>
          <Box sx={{ backgroundColor: "white", padding: 0, borderRadius: "10px", marginLeft: "140px" }}>
            <TableContainer component={Paper} sx={{ marginTop: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SNO</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>WorkOrderId</StyledTableCell>
                    <StyledTableCell>Material ID</StyledTableCell>
                    <StyledTableCell>Previous QTY</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Add/Remove QTY</StyledTableCell>
                    <StyledTableCell>On Hand</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transItem, index) => (
                      <StyledTableRow key={transItem.PK}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{transItem.CreationDate.split("T")[0]}</StyledTableCell>
                        <StyledTableCell>{transItem.WorkOrderId}</StyledTableCell>
                        <StyledTableCell>{transItem.Name}</StyledTableCell>
                        <StyledTableCell>{transItem.ProductQuantity}</StyledTableCell>
                        <StyledTableCell>{transItem.Type}</StyledTableCell>
                        <StyledTableCell>{transItem.ReceiptQuantity}</StyledTableCell>
                        <StyledTableCell>{transItem.OnhandQuantity}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={7} align="center">There Are No Inventory Transactions.</StyledTableCell>
                    </StyledTableRow>
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

export default InventoryTransaction;
