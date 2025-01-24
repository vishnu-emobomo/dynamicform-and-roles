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
import { Link, useNavigate, useLocation } from "react-router-dom";
import apiClient from "../utlis/apiClient";
import Pagination from "../utlis/Pagination";

const ManageMaterialWorkOrder = () => {
  const [workOrder, setWorkOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // State for paginated data
  const [paginatedData, setPaginatedData] = useState([]);

  // Filter work orders based on search query
  const filteredWorkOrder = workOrder.filter(order =>
    order.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageDataChange = (start, end) => {
    setPaginatedData(filteredWorkOrder.slice(start, end));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handlePageDataChange(0, 10); // Initialize paginated data
  }, [filteredWorkOrder]);

  const fetchData = async () => {
    setLoading(true); // Set loading to true when starting fetch
    try {
      const response = await apiClient.get(`/api/work.order/get-all-workorders`);
      console.log(response);
      if (response) {
        setWorkOrder(response.data.WorkOrder || []);
      } else {
        console.error("Failed to fetch work orders: ", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching work orders: ", error);
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
            <Grid container alignItems="center" spacing={2} justifyContent="space-between">
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  Material WorkOrder Details
                </Typography>
              </Grid>
              <Grid item>
              <Button
                  variant="contained"
                  sx={{ width: "50px" }}
                  component={Link}
                  to="/AddMatWorkOrder"
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
                    <StyledTableCell>Material Id</StyledTableCell>
                    <StyledTableCell> Material Quantity</StyledTableCell>
                    <StyledTableCell>OnHand Quantity</StyledTableCell>
                    <StyledTableCell>Creation Date</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((workOrder, index) => (
                      <StyledTableRow key={workOrder.PK}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{workOrder.Name}</StyledTableCell>
                        <StyledTableCell>{workOrder.WorkOrderQuantity}</StyledTableCell>
                        <StyledTableCell>{workOrder.OnHandQuantity}</StyledTableCell>
                        <StyledTableCell>{workOrder.creationDate}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        There Are No Work Order Records.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredWorkOrder.length > 0 && (
                <Pagination
                  totalItems={filteredWorkOrder.length}
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

export default ManageMaterialWorkOrder;
