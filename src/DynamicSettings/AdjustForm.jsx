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
 } from '@mui/material';
 import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import apiClient from '../utlis/apiClient';
import { Checkbox } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const AdjustForm = () => {

  const { moduleName } =  useParams();
  const [data, setData] = useState([]);
  const navigate = useNavigate();



  console.log(moduleName)

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const response = await apiClient.post(`/api/Dynamic/Get-Form-Fields-For-Table`, {
       ModuleName: moduleName , 
        });
        console.log(response.data);
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [moduleName]);

  const handleUpdateDetails=(PK, id, moduleName)=>{

    navigate("/UpdateDycForm", {state : {formId: PK, valueId: id, moduleName }});
  }



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
                      {moduleName}
                    </Typography>
                  </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        component={Link}
                        to={`/AddField/${moduleName}`}
                        size="small"
                      >
                        Add Field
                      </Button>
                    </Grid>
            </Grid>

            <TableContainer component={Paper} >
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Attribute Name</StyledTableCell>
                    <StyledTableCell>Label Name</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Picked List Name</StyledTableCell>
                    <StyledTableCell>Defualt Value</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length > 0 && Array.isArray(data[0]?.Values) ? (
                    data[0].Values.map((field, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{field.id || "-"}</StyledTableCell>
                        <StyledTableCell>{field.label || "-"}</StyledTableCell>
                        <StyledTableCell>{field.type || "-"}</StyledTableCell>
                        <StyledTableCell>{field.PickedList || "-"}</StyledTableCell>
                        <StyledTableCell>{field.DefaultValue || "-"}</StyledTableCell>
                        <StyledTableCell>{field.Status || "-"}</StyledTableCell>
                        <StyledTableCell>
                          <Checkbox
                            onClick={()=> 
                            handleUpdateDetails(data[0].PK, field.id, moduleName )}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <StyledTableCell colSpan={6} align="center">
                        No data available.
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

export default AdjustForm;
