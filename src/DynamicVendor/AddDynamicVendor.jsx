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

import { Backdrop, CircularProgress } from "@mui/material";
import formStructure from "./VendorFormStructure";

const AddDynamicVendor = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize form data with empty values from the imported form structure
    const initialData = formStructure.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {});
    setFormData(initialData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Submitting form data:", formData);
      // Add your submit logic here
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <SubHeader />

      <Grid container sx={{ flexGrow: 1, marginTop: "-80px", padding: 0 }} spacing={6}>
        <Grid item xs={12} md={2}></Grid>
        <Grid item xs={12} md={9}>
          <Box
            sx={{
              backgroundColor: "white",
              padding: 2,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginLeft: "-60px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Vendor
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {formStructure.map((field) => (
                  <Grid item xs={12} md={field.type === "textarea" ? 12 : 2} key={field.id}>
                    {field.type === "select" ? (
                      <FormControl variant="standard" fullWidth>
                        <InputLabel id={`${field.id}-label`} shrink>
                          {field.label}
                        </InputLabel>
                        <Select
                          id={field.id}
                          name={field.id}
                          value={formData[field.id]}
                          onChange={handleChange}
                          labelId={`${field.id}-label`}
                        >
                          {field.options.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : field.type === "textarea" ? (
                      <TextField
                        id={field.id}
                        name={field.id}
                        label={field.label}
                        variant="standard"
                        value={formData[field.id]}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        // multiline
                        // rows={field.rows || 3}
                        fullWidth
                      />
                    ) : (
                      <TextField
                        id={field.id}
                        name={field.id}
                        label={field.label}
                        type={field.type}
                        variant="standard"
                        value={formData[field.id]}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        required={field.required}
                      />
                    )}
                  </Grid>
                ))}
                <Grid item xs={12} sm={3}>
                  <Button variant="contained" color="primary" type="submit" fullWidth>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>
      <Backdrop
        open={loading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default AddDynamicVendor;
