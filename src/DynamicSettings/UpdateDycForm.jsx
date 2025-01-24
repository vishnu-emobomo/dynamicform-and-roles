import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import axios from "axios";
import apiClient from "../utlis/apiClient";
import { Backdrop, CircularProgress } from "@mui/material";
import useFetchPickList from '../DynamicForm/CustomHooks/useFetchPickList';

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "10px", // Adjust this to change only the placeholder size
  },
});

const UpdateDycForm = () => {
  const location = useLocation();
  const [phoneError, setPhoneError] = useState("");
  const { formId, valueId, moduleName } = location.state;
  const [loading, setLoading] = useState(false);
  const { data: pickListData} = useFetchPickList();

  // Updated formData structure
  const [formData, setFormData] = useState({
    PK: formId,
    SK: formId,
    Field:  {
        id: "",
        label: "",
        type: "",
        options: "",
        DefaultValue: "",
        Status: "",
    } 
   
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
     Field :{
        ...prevData.Field,
        [name]: value,
     },
    }));

    if (name === "PhoneNumber") {
      if (value.length !== 10) {
        setPhoneError("Phone number must be exactly 10 digits");
      } else {
        setPhoneError(""); 
      }
    }
  };

  useEffect(() => {
    // Fetch vendor data by pk
    const fetchVendorData = async () => {
      try {
        const response = await apiClient(
          "/api/Dynamic/Get-DynamicForm-By-Id",{
            params:{
                formId: formId,
                valueId: valueId
            }
          }
        );

        // Log the full response to check its structure
        console.log("API Response:", response.data);

        // Check if the response structure matches what you expect
        if (response.data && response.data.data) {
          const values = response.data.data.data;
          console.log(values.type)

          setFormData((prevData) => ({
            ...prevData,
            Field: {
              id: values.id || '',
              label: values.label || '',
              type: values.type || '',
              options: values.options || '',
              DefaultValue: values.DefaultValue || '',
              Status: values.Status || '',
            },
          }));
        } else {
          console.log(
            "Values section not found in the response. Structure: ",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchVendorData();
  }, [formId,valueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    console.log(formData);
    try {
      const response = await apiClient.post(
        "/api/Dynamic/Update-Form-Field",
        {
          ...formData,
        },
      );

      alert("updated successfully");
      console.log("Fields updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating vendor:", error);
    }  finally {
      setLoading(false);
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
        <Grid item xs={12} md={11}>
          <Box
            sx={{
              height: "calc(100vh - 112px)",
              backgroundColor: "white",
              padding: 2,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginLeft: "160px",
          
            }}
          >
            <Typography variant="h6" gutterBottom>
              {moduleName}
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={2}>
                  <TextField
                    id="id"
                    name="id"
                    label="Attribute Name"
                    variant="standard"
                    type="text"
                    value={formData.Field.id}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="label"
                    name="label"
                    label="field Name"
                    variant="standard"
                    type="text"
                    value={formData.Field.label}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="Field-Type" shrink>
                      Type
                    </InputLabel>
                    <Select
                      id="type"
                      labelId="Field-Type" 
                      name="type"
                      value={formData.Field.type}
                      onChange={handleChange} 
                    >
                      <MenuItem value="text">text</MenuItem>
                      <MenuItem value="number">number</MenuItem>
                      <MenuItem value="email">email</MenuItem>
                      <MenuItem value="select">select</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>


                <Grid item xs={12} md={3}>
                   {formData.Field.type === "select" ? (
                    <FormControl variant='standard' fullWidth>
                      <InputLabel id="PickListName" shrink>
                        PickList Name 
                      </InputLabel>
                        <Select
                            id="options"
                            name="options"
                            label="PickList Name"
                            value={formData.options}
                            onChange={handleChange}
                            labelId="PickListName"
                        >
                          {
                            pickListData.map((item, index)=>(
                              <MenuItem key={index} value={item.Options}>
                                {item.Options}
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
                        value={formData.options}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    id="DefaultValue"
                    name="DefaultValue"
                    label="Default Value"
                    variant="standard"
                    type="text"
                    value={formData.Field.DefaultValue}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="Status-Field" shrink>
                      Status
                    </InputLabel>
                    <Select
                      id="Status"
                      labelId="Status-Field" 
                      name="Status"
                      value={formData.Field.Status}
                      onChange={handleChange} 
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="In Active">In Active</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>


              </Grid>
              <br></br>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Backdrop
              open={loading}
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateDycForm;