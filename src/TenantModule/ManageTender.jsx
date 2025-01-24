import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
  TablePagination,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import TenderChip from "../SmallComponents/TenderChip";
import apiClient from "../utlis/apiClient";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { StyledTableCell, StyledTableRow } from "../ComponentCss/Tabel/TabelCss";
import { useCheckPermission } from "../Authorization/useCheckPermission";

const ManageTender = () => {

  const checkPermission = useCheckPermission();


  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleTenders, setVisibleTenders] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  
  

  const handleTenderClick = (tender) => {
    navigate("/UpdateTender", { state: { tenderSK: tender.SK } });
  };

  const handleDelete = async (tender) => {
    setLoading(true);
    const updateDelete = {
      tableName: "Tender",
      pk: tender.PK,
      sk: tender.SK,
    };

    if (window.confirm(`Are you sure you want to delete this tender?`)) {
      try {
        const response = await apiClient.post("/api/remove", updateDelete);
        console.log(response.data);

        setTenders((prevTenders) =>
          prevTenders.filter((item) => item.PK !== tender.PK)
        );
      } catch (error) {
        console.error("Error deleting tender:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/api/tender/Get-all-tenders`);
        console.log(response.data);
        if (response.data.success) {
          const fetchedTenders = response.data.data || [];
          setTenders(fetchedTenders);
          setVisibleTenders(Math.min(10, fetchedTenders.length));
          setHasMore(fetchedTenders.length > 10);
        } else {
          console.error("Failed to fetch tenders:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching tenders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  const loadMoreTenders = () => {
    const newVisible = visibleTenders + 5;
    setVisibleTenders(newVisible);
    setHasMore(newVisible < tenders.length);
  };

  const toggleCollapse = () => {
    setOpen(!open);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const canReadProject = checkPermission("Project", "CanReadCreated");
  const canReadTender = checkPermission("Tender", "CanReadCreated");
  const canCreateTender = checkPermission("Tender", "CanCreate");
  const canCreateProject = checkPermission("Project", "CanCreate");

  return (
    <Box sx={{ display: "flex",
     flexDirection: "column",
     marginTop: 5,
    }}>
      <Header />
      <Grid
        container
        sx={{
          flexGrow: 1,
          padding: 0,
          minHeight: "100vh",
          justifyContent: "center", 
          alignItems: "center",
        }}
       >

        <Grid item xs={12} md={11}>
          <Box
            sx={{
              minHeight: "calc(100vh - 112px)",
              backgroundColor: "white",
               padding: 2,
              // borderRadius: "10px",
              // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              justifyContent:"center"
            }}
          >
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  Tender Details
                </Typography>
              </Grid>
              <Grid item>
                {canCreateTender && (
                    <Button
                    variant="contained"
                    component={Link}
                    to="/AddTender"
                    size="small"
                  >
                    Add Tender
                  </Button>
                )}
              </Grid>

              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>SNO</StyledTableCell>
                          <StyledTableCell>Customer Name</StyledTableCell>
                          <StyledTableCell>Tender Code Number</StyledTableCell>
                          <StyledTableCell>Drawings</StyledTableCell>
                          <StyledTableCell>PO Number</StyledTableCell>
                          <StyledTableCell>PO Received Date</StyledTableCell>
                          <StyledTableCell>Tender Due Date</StyledTableCell>
                          <StyledTableCell>Status</StyledTableCell>
                          <StyledTableCell>Update</StyledTableCell>
                          <StyledTableCell>Delete</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={8} align="center">
                              <CircularProgress />
                            </TableCell>
                          </TableRow>
                        ) : tenders.length > 0 ? (
                          tenders
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((tender, index) => (
                              <StyledTableRow key={tender.PK}>
                                <StyledTableCell>{
                                  page * rowsPerPage + index + 1
                                }</StyledTableCell>
                                <StyledTableCell>
                                  {tender.Values.CustomerName}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {tender.Values.TenderCodenumber}
                                </StyledTableCell>
                                <StyledTableCell>{tender.countFiles} Files</StyledTableCell>
                                <StyledTableCell>
                                  {tender.Values.PONumber}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {tender.Values.PORecivedDate}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {tender.Values.TenderDuedate}
                                </StyledTableCell>
                                <StyledTableCell>
                                  <TenderChip tender={tender} />
                                </StyledTableCell>
                                <StyledTableCell>
                                  <Button
                                    onClick={() => handleTenderClick(tender)}
                                    size="small"
                                    variant="standard"
                                  >
                                    Update
                                  </Button>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <DeleteSweepIcon
                                    onClick={() => handleDelete(tender)}
                                    style={{ cursor: "pointer" }}
                                  />
                                </StyledTableCell>
                              </StyledTableRow>
                            ))
                        ) : (
                          <StyledTableRow>
                            <StyledTableCell colSpan={8} align="center">
                              There Are No Tender Data.
                            </StyledTableCell>
                          </StyledTableRow>
                        )}
                      </TableBody>
                    </Table>
                  <TablePagination
                          rowsPerPageOptions={[10]}
                          component="div"
                          count={tenders.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={({ count, page, rowsPerPage, onPageChange }) => (
                      <Box
                          sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          overflow: 'hidden', // Prevent scrolling
                          height: 'auto', // Ensure the height does not cause overflow
                          }}
                          >
                      {/* Previous Button with Reverse Animation */}
                      <Button
                          onClick={(event) => onPageChange(event, page - 1)}
                          disabled={page === 0}
                          sx={{
                          padding: 0, // Remove padding to avoid constraints
                          backgroundColor: 'transparent', // No background color
                          '&:hover': { backgroundColor: 'transparent' },
                          display: 'flex', // Make button flexible
                          justifyContent: 'center', // Center content
                          alignItems: 'center', // Center content vertically
                          }}
                          >
                        <DotLottieReact
                        src="https://lottie.host/7c2197e8-15fa-4874-b39c-b9fe33b7dd6b/HQAylzP3m1.lottie"
                        loop
                        autoplay
                        style={{
                        width: 600, // Adjust size to prevent overflow
                        height: 600, // Adjust size to prevent overflow
                        transform: 'scaleX(-1)', // Reverse the animation
                        }}
                        />
                      </Button>

                      {/* Next Button with Forward Animation */}
                      <Button
                          onClick={(event) => onPageChange(event, page + 1)}
                          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                          sx={{
                          padding: 0, // Remove padding to avoid constraints
                          backgroundColor: 'transparent', // No background color
                          '&:hover': { backgroundColor: 'transparent' },
                          display: 'flex', // Make button flexible
                          justifyContent: 'center', // Center content
                          alignItems: 'center', // Center content vertically
                          }}
                          >
                          <DotLottieReact
                              src="https://lottie.host/7c2197e8-15fa-4874-b39c-b9fe33b7dd6b/HQAylzP3m1.lottie"
                              loop
                              autoplay
                              style={{
                              width: 600, // Adjust size to prevent overflow
                              height: 600, // Adjust size to prevent overflow
                              }}
                              />
                        </Button>
                        </Box>
                      )}
                  />

              </TableContainer>
            </Grid>

        
          </Box>
        </Grid>

        


      </Grid>
    </Box>
  );
};

export default ManageTender;