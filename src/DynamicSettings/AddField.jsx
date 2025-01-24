import React, { useState } from 'react';
import { Box, Button, Drawer, List, ListItem, ListItemText, Divider, Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Backdrop, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import SubHeader from '../Components/SubHeader';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utlis/apiClient';
import SideMenu from '../DynamicForm/CustomHooks/SideMenu';
import useFetchPickList from '../DynamicForm/CustomHooks/useFetchPickList';

const AddField = () => {
  const { moduleName } =  useParams();
  console.log(moduleName);

  const { data: pickListData} = useFetchPickList();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ModuleName: moduleName,
    Values:{
      id: '',
      label: '',
      type: '',
      options: '',
      DefaultValue: '',
      Status: ''
    }
  });
  const [loading, setLoading] = useState(false);



  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name in formData.Values) {
      setFormData((prevState) => ({
        ...prevState,
        Values: {
          ...prevState.Values,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      const response = await apiClient.post("/api/Dynamic/Create-Field", formData);
      console.log(response.data); 

      alert("field added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form data:", error); // Handle errors
    } finally {
      setLoading(false); // Make sure to stop loading regardless of success or failure
    }
  
    console.log(formData, "the submitted form data");
  };
  

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
                marginLeft: "150px",
                marginRight: "30px",
              }}
            >
              <Typography variant="h6" gutterBottom>
              {moduleName}
              </Typography>
              <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      id="id"
                      name="id"
                      label="Attribute Name"
                      variant="standard"
                      type="text"
                      value={formData.Values.id}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      id="label"
                      name="label"
                      label="Label Name"
                      type="text"
                      value={formData.Values.label}
                      onChange={handleChange}
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel id="Type" shrink>
                        Type
                      </InputLabel>
                      <Select
                        id="type"
                        name="type"
                        label="Type"
                        value={formData.Values.type}
                        onChange={handleChange}
                        labelId="Type"
                      >
                        <MenuItem value="text">text</MenuItem>
                        <MenuItem value="number">number</MenuItem>
                        <MenuItem value="email">email</MenuItem>
                        <MenuItem value="select">select</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                   {formData.Values.type === "select" ? (
                    <FormControl variant='standard' fullWidth>
                      <InputLabel id="PickListName" shrink>
                        PickList Name 
                      </InputLabel>
                        <Select
                            id="options"
                            name="options"
                            label="PickList Name"
                            value={formData.Values.options}
                            onChange={handleChange}
                            labelId="PickListName"
                        >
                          {
                            pickListData.map((item, index)=>(
                              <MenuItem key={index} value={item.Options}>
                                {item.Name}
                              </MenuItem>
                            ))
                          }
                        </Select>
                    </FormControl>
                    ) : (
                      <TextField
                        id="options"
                        name="options"
                        label="PickList Name"
                        variant="standard"
                        value={formData.Values.options}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      id="DefaultValue"
                      name="DefaultValue"
                      label="Default Value"
                      type="text"
                      variant="standard"
                      value={formData.DefaultValue}
                      onChange={handleChange}
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
                        type='text'
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
                        onClick={()=> navigate(`/AdjustForm/${moduleName}`)}
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

export default AddField;
