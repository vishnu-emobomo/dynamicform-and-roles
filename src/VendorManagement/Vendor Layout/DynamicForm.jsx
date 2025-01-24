import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Backdrop, CircularProgress } from "@mui/material";
import FormField from "./FieldComponent";


const DynamicForm = ({ formStructure, formData, handleChange, handleSubmit, name }) => (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        {name}
      </Typography>
      <Grid container spacing={3}>
        {formStructure.map((field) => (
          <Grid
            item
            xs={12}
            md={field.type === "text" || field.type === "number" || field.type === "select" || field.type === "email" ? 2 : 12}
            key={field.id}
          >
            <FormField field={field} value={formData[field.id]} handleChange={handleChange} />
          </Grid>
        ))}
  
        {/* Comments Field */}
        <Grid item xs={12}>
          <TextField
            id="comments"
            name="comments"
            label="Comments"
            variant="outlined"
            value={formData.comments || ""}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
  
        <Grid item xs={12}>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );


  export default DynamicForm;