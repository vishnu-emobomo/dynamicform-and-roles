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
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import apiClient from "../utlis/apiClient";

const ToolsTransactions = () => {
  const [inventoryTrans, setInventoryTrans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toolsName, setToolsName] = useState(""); // To store Material ID

  const location = useLocation();

  useEffect(() => {
    console.log("Page reload detected, resetting states...");

    // Clear the materialId and inventoryTrans states
    setToolsName("");
    setInventoryTrans([]);

    // Fetch the transactions
    fetchInventoryTransactions();

    // If materialId exists in location.state, set it
    const materialFromLocation = location.state?.ToolsName || "";

    console.log(materialFromLocation,"the data from the dynamic search")
    setToolsName(materialFromLocation);
  }, [location]);

  const fetchInventoryTransactions = async () => {
    setLoading(true); // Set loading to true when starting fetch
    try {
      const response = await apiClient.get(`/api/tools/get-all-transactions`);
      console.log(response.data);

      const Transactions = response.data.data;

      setInventoryTrans(Transactions);
    } catch (error) {
      console.error("Error fetching purchase order:", error);
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
      letterSpacing: 0, // Set letter spacing to zero for header cells
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
  const filteredTransactions = toolsName
    ? inventoryTrans.filter((trans) =>
        trans.Name.toLowerCase().includes(toolsName.toLowerCase())
      )
    : inventoryTrans;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <SubHeader />

      <Grid
        container
        sx={{ flexGrow: 1, marginTop: "-82px", padding: 0 }}
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

        <Grid item xs={12} md={8}>
          <Box
            sx={{
              backgroundColor: "white",
              padding: 0,
              borderRadius: "10px",
              marginLeft: "-50px",
            }}
          >
            <TableContainer component={Paper} sx={{ marginTop: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SNO</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell> Name</StyledTableCell>
                    <StyledTableCell>Tools Quantity</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
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
                        <StyledTableCell>
                          {transItem.CreationDate.split("T")[0]}
                        </StyledTableCell>
                        <StyledTableCell>{transItem.Name}</StyledTableCell>
                        <StyledTableCell>
                          {transItem.ToolsQuantity}
                        </StyledTableCell>
                        <StyledTableCell>{transItem.Type}</StyledTableCell>
                        <StyledTableCell>
                          {transItem.ReceiptQuantity}
                        </StyledTableCell>
                        <StyledTableCell>
                          {transItem.OnhandQuantity}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={7} align="center">
                        There Are No Inventory Transactions.
                      </StyledTableCell>
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

export default ToolsTransactions;
