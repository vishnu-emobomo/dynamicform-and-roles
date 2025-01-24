import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Backdrop, CircularProgress } from "@mui/material";

const FormField = ({ field, value, handleChange }) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      label: field.label,
      value: value || "",
      onChange: handleChange,
      fullWidth: true,
      InputLabelProps: { shrink: true },
    };
  
    switch (field.type) {
      case "select":
        return (
          <FormControl variant="standard" fullWidth>
            <InputLabel id={`${field.id}-label`} shrink>
              {field.label}
            </InputLabel>
            <Select 
                id={field.id} 
                labelId={`${field.id}-label`} 
                value={value || ""}
                onChange= {handleChange}
                {...commonProps}
            >
              {Array.isArray(field.options) &&
                field.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        );
      case "text":
      case "email":
      case "number":
        return <TextField variant="standard" {...commonProps} />;
      default:
        return (
          <TextField
            variant="outlined"
            multiline
            rows={field.rows || 3}
            {...commonProps}
          />
        );
    }
  };


  export default FormField;