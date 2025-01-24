

import React, { useState } from 'react';
import { Box, Button, Drawer, List, ListItem, ListItemText, Divider, Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Backdrop, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import SubHeader from '../Components/SubHeader';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utlis/apiClient';
import SideMenu from '../DynamicForm/CustomHooks/SideMenu';


const AddPickList = () => {

  const navigate = useNavigate();


  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    PicklistName: "",
    Options: [],
    Status:""
  });
  const [loading, setLoading] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "Options"
        ? value.split(",").map((item) => item.trim()) // Transform options input to array
        : value,
    }));
  };

  const handleSubmit = async(e)=>{   
    e.preventDefault();  
    setLoading(true);
    console.log(formData)
    try{
      const response = await apiClient.post("/api/Dynamic/PickList", formData);
      console.log(response.data);
    } catch(error){
      console.log("error in submitting form",error);
    } finally {
      setLoading(false); // Make sure to stop loading regardless of success or failure
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <SubHeader />

      <div>
      <SideMenu/>

        <Grid
          container
          sx={{ flexGrow: 1, marginTop: "-80px", padding: 0 }}
          spacing={6}
        >
          <Grid item xs={12} md={10}>
            <Box
              sx={{
                minHeight: "calc(50vh - 50px)",
                backgroundColor: "white",
                padding: 2,
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                marginLeft: "160px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                PickList 
              </Typography>
              <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      id="PicklistName"
                      name="PicklistName"
                      label="PickList Name"
                      variant="standard"
                      type="text"
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      id="Options"
                      name="Options"
                      label="Options"
                      type="text"
                      onChange={handleChange}
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="Status" shrink>
                         Status
                      </InputLabel>
                      <Select
                        id="Status"
                        name="Status"
                        label="Status"
                        onChange={handleChange}
                        labelId="Status"
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="In Active">In Active</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>


                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          size="small"
                        >
                          Submit
                        </Button>
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={()=> navigate(`/PickList`)}
                        >
                          Back
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>
        </Grid>
      </div>

      <Backdrop
        open={loading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default AddPickList;

