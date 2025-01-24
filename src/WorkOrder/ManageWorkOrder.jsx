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
  CircularProgress,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../utlis/apiClient";
import Pagination from "../utlis/Pagination";
import TocIcon from "@mui/icons-material/Toc";

const ManageWorkOrder = () => {
  const [workOrder, setWorkOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snoNumber, setSnoNumber] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `/api/in-out-source/Get-All-OutSources`
        );
        console.log(response.data); // Log the response to check its structure

        if (response) {
          setWorkOrder(response.data || []);
        } else {
          console.error("Failed to fetch work orders: ", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching work orders: ", error);
      } finally {
        setLoading(false); // Set loading to false when fetch completes
      }
    };

    fetchData();
  }, []); // Adding an empty dependency array ensures this runs once after the initial render

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

  // State for paginated data
  // const [paginatedData, setPaginatedData] = useState(
  //   workOrder.slice(0, 10) // Initial data slice for the first page
  // );

  const handlePageDataChange = (start, end) => {
    // setPaginatedData(workOrder.slice(start, end));
    setSnoNumber(start);
  };

  useEffect(() => {
    handlePageDataChange(0, 10); // Initialize paginated data
  }, [workOrder]);

 const handleClick = (workOrder) => {
   console.log("Navigating to UpdateWorkOrder with PK:", workOrder.PK);
   navigate("/UpdateWorkOrder", {
     state: {
       OutSourcePK: workOrder.PK,
     },
   });
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
            <Grid
              container
              alignItems="center"
              spacing={2}
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  Work Order Details
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ width: "50px" }}
                  component={Link}
                  to="/AddWorkOrder"
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
                    <StyledTableCell>Gate Pass</StyledTableCell>
                    <StyledTableCell>Vendor Name</StyledTableCell>
                    <StyledTableCell>Issued Date</StyledTableCell>
                    <StyledTableCell>Received Date</StyledTableCell>
                    <StyledTableCell>Return Status</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={13} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : workOrder.length > 0 ? (
                    workOrder.map((workOrderItem, index) => (
                      <StyledTableRow key={workOrderItem.PK}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {workOrderItem.GatePass}
                        </StyledTableCell>
                        <StyledTableCell>
                          {workOrderItem.VendorName}
                        </StyledTableCell>
                        <StyledTableCell>{workOrderItem.Issued_Date}</StyledTableCell>
                        <StyledTableCell>{workOrderItem.Received_Date}</StyledTableCell>
                        <StyledTableCell>
                          {workOrderItem.ReturnStatus}
                        </StyledTableCell>
                        <StyledTableCell>
                          {workOrderItem.Status}
                        </StyledTableCell>
                        <StyledTableCell>
                          <TocIcon
                            sx={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent element interference
                              handleClick(workOrderItem);
                            }}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={13} align="center">
                        No work orders available.
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
              {/* {workOrder.length > 0 && (
                <Pagination
                  totalItems={workOrder.length}
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

export default ManageWorkOrder;
