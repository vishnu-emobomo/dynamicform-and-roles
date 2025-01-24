import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import SubHeader from '../Components/SubHeader';
import { 
  Box,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Button,
  Stack,
 } from '@mui/material';
 import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { Link } from 'react-router-dom';
import apiClient from '../utlis/apiClient';
import useFetchPickList from './CustomHooks/useFetchPickList';

const PickList = () => {

  const {data, loading, error } = useFetchPickList();



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



  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <SubHeader />
      <Grid item xs={12} sm={3}>
          <Box
            sx={{
              minHeight: "calc(100vh - 112px)",
              backgroundColor: "white",
              padding: 2,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginLeft: "150px",
              marginRight: "50px",
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
                      Pick List
                    </Typography>
                  </Grid>

                    <Grid item >
                      <Stack direction="column" spacing={1}>
                        <Button
                          variant="contained"
                          component={Link}
                          to={`/AddPickList`}
                          size="small"
                        >
                          Add Field
                        </Button>
                      
                        <Button
                          variant="contained"
                          component={Link}
                          to={`/AddLinkField`}
                          size="small"
                        >
                          Add Link Field
                        </Button>
                      </Stack>
                    </Grid>
            </Grid>

            <TableContainer component={Paper} >
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>PickList Name</StyledTableCell>
                    <StyledTableCell>Options</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {loading ? (
                  <TableRow>
                    <StyledTableCell colSpan={3} align="center">
                      Loading...
                    </StyledTableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <StyledTableCell colSpan={3} align="center">
                      Error loading data
                    </StyledTableCell>
                  </TableRow>
                ) : data.length > 0 ? (
                  data.map((field, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{field.Name}</StyledTableCell>
                      <StyledTableCell>{field.Options.join(", ")}</StyledTableCell>
                      <StyledTableCell>{field.Status}</StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <StyledTableCell colSpan={3} align="center">
                      No data available
                    </StyledTableCell>
                  </TableRow>
                )}
              </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
       
    </Box>
  );
}

export default PickList;
