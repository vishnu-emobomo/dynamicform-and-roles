import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, List, ListItem, ListItemText, Divider, Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Backdrop, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import SubHeader from '../Components/SubHeader';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utlis/apiClient';
import SideMenu from '../DynamicForm/CustomHooks/SideMenu';
import useFetchPickList from '../DynamicForm/CustomHooks/useFetchPickList';



const AddLinkedPicklist = () => {

  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    Name:"",
    PicklistName: "",
    Module: "",
    Attribute: "",
    Status: "",
    userPK: "USER#1733378542838",
  });
  const [loading, setLoading] = useState(false);



  
  const { attribute }  = useFetchPickList(formData.Module);

  

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  console.log(attribute.attributes, "Fetched attributes for the selected module");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name] : value,
      ...(name === "PicklistName" && { Name: value}),
    }));
  };

  const handleSubmit = async(e)=>{   
    e.preventDefault();  
    setLoading(true);

    const updateFormData ={
      ...formData,
      Name: formData.PicklistName,
    }

    console.log(updateFormData)
    try{
      const response = await apiClient.post("/api/Dynamic/create-link-picklist", updateFormData);
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
                      value={formData.PicklistName}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="Module" shrink>
                         Module
                      </InputLabel>
                      <Select
                        id="Module"
                        name="Module"
                        label="Module"
                        onChange={handleChange}
                        labelId="Module"
                      >
                        <MenuItem value="Tender">Tender</MenuItem>
                        <MenuItem value="Project">Project</MenuItem>
                        <MenuItem value="Customer">Customer</MenuItem>
                        <MenuItem value="Vendor">Vendor</MenuItem>
                        <MenuItem value="Material">Material</MenuItem>
                        <MenuItem value="Tools">Tools</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <FormControl variant='standard' fullWidth>
                      <InputLabel id="Attribute"  shrink>
                        Attribute
                      </InputLabel>
                      <Select
                          id="Attribute" 
                          name="Attribute"
                          label="Attribute"
                          value={formData.Attribute}
                          onChange={handleChange}
                          labelId='Attribute'
                      >{
                        Array.isArray(attribute.attributes) &&
                        attribute.attributes
                        .filter(item => item != "Values" && item != "userPK")
                        .map(
                          (item,index)=>(
                            <MenuItem key={index}
                                value={item}>
                                  {item}
                                </MenuItem>
                          ))
                      }

                      </Select>
                    </FormControl>
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

export default AddLinkedPicklist;