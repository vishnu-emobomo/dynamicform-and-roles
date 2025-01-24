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
import { getUserId } from "../utlis/tokenUtils";
import apiClient from "../utlis/apiClient";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Checkbox } from "@mui/material";


const ManageProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tenderId, setTenderId] = useState(null);

  const navigate = useNavigate();

  const handleTenderClick = (pk) => {
    setTenderId(pk); // Store the PK in state
    setProjects([]); // Clear previous projects
  };

  

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        let response;

        if (tenderId) {
          // Fetch projects by tenderId if it's available
          response = await apiClient.get(
            `/api/project/get-projects-by-tender`,
            {
              params: {
                tenderId,
              },
            }
          );
          console.log("Response for get-projects-by-tender:", response);

          if (response.data.success) {
            // Handle response for fetching projects by tender
            setProjects(response.data.projects || []); // Ensure `data` is an array
          } else {
            console.error(
              "Failed to fetch projects by tender:",
              response.data.message
            );
          }
        } else {
          // Fetch all projects if no tenderId is selected
          response = await apiClient.get(`/api/project/get-all-projects`);
          console.log("Response for get-all-projects:", response);

          if (response.data.success) {
            // Handle response for fetching all projects
            setProjects(response.data.data || []); // Ensure `data` is an array
          } else {
            console.error(
              "Failed to fetch all projects:",
              response.data.message
            );
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false); // Set loading to false when fetch completes
      }
    };

    fetchProjects();
  }, [tenderId]); // Re-run this effect whenever userPK or tenderId changes

  const StyledTextField = styled(TextField)({
    "& .MuiInputBase-input::placeholder": {
      fontSize: "10px", // Adjust this to change only the placeholder size
    },
  });

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

  const handleClick = (project) => {
    // Assuming project has a pk field
    navigate("/LineItems", {
      state: {
        projectData: project,
        projectPK: project.PK,
        projectSK: project.SK,
      },
    });
  };

  const handleDelete = async (project) => {
    setLoading(true);
    const updateDelete = {
      tableName: "Tender",
      pk:  project.PK,
      sk:  project.SK,
    };

    if (window.confirm(`Are you sure you want to delete this project?`)) {
        try {
          const response = await apiClient.post("/api/remove", updateDelete); 
          console.log(response.data);
      
          // Optionally, refresh tenders after deletion
          setProjects((prevTenders) =>
            prevTenders.filter((item) => item.PK !== project.PK)
          );
        } catch (error) {
          console.error("Error deleting tender:", error);
        }finally {
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
          >
            <h3 style={{ fontFamily: "Roboto, Helvetica, Arial, sans-serif" }}>
              Project List
            </h3>

            <List sx={{ width: "100%", overflow: "auto" }}>
              {projects.map((project, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => handleClick(project)}
                >
                  <ListItemText
                    primary={project.Name}
                    primaryTypographyProps={{ fontSize: "13px" }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
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
                  {tenderId
                    ? "Project Details for Selected Tender"
                    : "Project Details"}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  // sx={{ width: "150px" }}
                  component={Link}
                  to="/AddProject"
                  size="small"
                >
                  Add Project
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
                   
                    <StyledTableCell>Tender Number</StyledTableCell>
                    <StyledTableCell>Customer Name</StyledTableCell>
                    <StyledTableCell>Project Delivery Date</StyledTableCell>
                    <StyledTableCell>Start Date</StyledTableCell>
                    <StyledTableCell>End Date</StyledTableCell>
                    <StyledTableCell>Line Items</StyledTableCell>
                    <StyledTableCell>Delete</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    // Show loading spinner while data is being fetched
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : projects.length > 0 ? (
                    projects.map((project, index) => (
                      <StyledTableRow key={project.SK}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {project.Values.PONumber}
                        </StyledTableCell>
                   
                        <StyledTableCell>
                          {project.Values.TenderCodenumber}
                        </StyledTableCell>
                        <StyledTableCell>{project.Values.CustomerName}</StyledTableCell>
                        <StyledTableCell>
                          {project.Values.ProjectDeliverydate}
                        </StyledTableCell>
                        <StyledTableCell>
                          {project.Values.StartDate}
                        </StyledTableCell>
                        <StyledTableCell>
                          {project.Values.EndDate}
                        </StyledTableCell>
                        <TableCell>
                          <Checkbox
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleClick(project)}
                          />
                        </TableCell>
                        <StyledTableCell>
                           <DeleteSweepIcon
                            onClick={() => handleDelete(project)}
                            style={{ cursor: "pointer" }}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={7} align="center">
                        {tenderId
                          ? "No projects available for the selected tender."
                          : "No projects available."}
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

export default ManageProject;
