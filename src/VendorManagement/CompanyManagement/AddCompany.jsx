
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Backdrop, CircularProgress } from "@mui/material";
import Header from "../../Components/Header";
import SubHeader from "../../Components/SubHeader";
import useFormStructure from "../../DynamicVendor/useFormStructure"; 
import apiClient from "../../utlis/apiClient";
import Layout from "../Vendor Layout/Layout";
import DynamicForm from "../Vendor Layout/DynamicForm";

// Rest of your component code


const AddCompany = () => {
  const formStructure = useFormStructure("Customer");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formStructure.length > 0) {
      const initialData = formStructure.reduce((acc, field) => {
        acc[field.id] = field.type === "select" ? field.options[0] || "" : "";
        return acc;
      }, {});
      setFormData(initialData);
    }
  }, [formStructure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Start loading
    try {
      const response = await apiClient.post(
        `/api/customer/create-customer`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data, ": the customer insert");

      // Check for a successful response
      if (response.data.result && response.data.result.success) {
        console.log(
          "Customer created successfully:",
          response.data.result.message
        );
        alert("Customer inserted successfully");

        // Reset the form to its initial state
        setFormData({
            Name: "",
            CustomerEmail: "",
            GSTNumber: "",
            Address: "",
            PhoneNumber: "",
            Comments: "", 
        });

        window.location.reload();
        
      } else {
        console.error(
          "Error creating Customer:",
          response.data.result.message || "Unknown error"
        );
        alert("Unable to insert the Customer");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("There was a network error, please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  // if (!formStructure || formStructure.length === 0) {
  //   return <Typography>Loading form...</Typography>;
  // }

  return (
    // <Box sx={{ display: "flex", flexDirection: "column" }}>
    //   <Header />
    //   <SubHeader />
    //   <Grid container sx={{ flexGrow: 1, marginTop: "-80px", padding: 0 }} spacing={6}>
    //     <Grid item xs={12} md={12}>
    //       <Box 
    //       sx={{ backgroundColor: "white", 
    //       padding: 2, 
    //       borderRadius: "10px", 
    //       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
    //       marginLeft: "150px",
    //       marginRight: "30px",
    //        }}>
    //         <Typography variant="h6" gutterBottom>
    //            Customer
    //         </Typography>
    //         <form noValidate autoComplete="off" onSubmit={handleSubmit}>
    //           <Grid container spacing={3}>
    //             {formStructure.map((field) => (
    //               <Grid item xs={12} 
    //               md={field.type === "text" 
    //                   || field.type === "number" 
    //                   || field.type ==="select"
    //                   || field.type ==="email" ? 2 : 12}
    //               key={field.id}>
    //                 {field.type === "select" ? (
    //                   <FormControl   variant="standard"  fullWidth>
    //                     <InputLabel id={`${field.id}-label`} shrink>
    //                       {field.label} 
    //                     </InputLabel>
    //                     <Select 
    //                       id={field.id} 
    //                       name={field.id} 
    //                       value={formData[field.id]} 
    //                       onChange={handleChange} 
    //                       labelId={`${field.id}-label`}>
    //                       {Array.isArray(field.options)
    //                         ? field.options.map((option) => (
    //                             <MenuItem key={option} value={option}>
    //                               {option}
    //                             </MenuItem>
    //                           ))
    //                         : null}
    //                     </Select>
    //                   </FormControl>
    //                 ) : field.type === "text" ? (
    //                   <TextField 
    //                     id={field.id} 
    //                     name={field.id} 
    //                     label={field.label} 
    //                     variant="standard" 
    //                     value={formData[field.id]} 
    //                     onChange={handleChange} 
    //                     InputLabelProps={{
    //                       shrink: true,
    //                     }}
    //                     fullWidth />
    //                 ) : field.type === "email" ? (
    //                   <TextField 
    //                     id={field.id} 
    //                     name={field.id} 
    //                     label={field.label} 
    //                     variant="standard" 
    //                     value={formData[field.id]} 
    //                     onChange={handleChange} 
    //                     InputLabelProps={{
    //                       shrink: true,
    //                     }}
    //                     fullWidth />
    //                 ): field.type === "number" ? (
    //                   <TextField 
    //                     id={field.id} 
    //                     name={field.id} 
    //                     label={field.label} 
    //                     variant="standard" 
    //                     value={formData[field.id]} 
    //                     onChange={handleChange} 
    //                     InputLabelProps={{
    //                       shrink: true,
    //                     }}
    //                     fullWidth />
    //                 ): (
    //                   <TextField 
    //                     id={field.id} 
    //                     name={field.id} 
    //                     label={field.label} 
    //                     type={field.type} 
    //                     variant="outlined" 
    //                     value={formData[field.id]} 
    //                     onChange={handleChange} 
    //                     fullWidth 

    //                     multiline rows={field.rows || 3}  />
    //                 )}
    //               </Grid>
    //             ))}

    //              {/* Comments Field */}
    //             <Grid item xs={12}>
    //               <TextField
    //                 id="comments"
    //                 name="comments"
    //                 label="Comments"
    //                 variant="outlined"
    //                 value={formData.comments || ""}
    //                 onChange={handleChange}
    //                 fullWidth
    //                 multiline
    //                 rows={2} // Adjust rows as needed
    //                 InputLabelProps={{
    //                   shrink: true,
    //                 }}
    //               />
    //             </Grid>
                
    //             <Grid item xs={12} >
    //               <Grid item xs={12} sm={3}>
    //                 <Button variant="contained" color="primary" type="submit" fullWidth>
    //                   Submit
    //                 </Button>
    //               </Grid>
    //             </Grid>
    //           </Grid>
    //         </form>
    //       </Box>
    //     </Grid>
    //   </Grid>
    //   <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}>
    //     <CircularProgress color="inherit" />
    //   </Backdrop>
    // </Box>

    <Layout>
      <DynamicForm
        formStructure={formStructure}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        name={"Company"}
      />
      <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Layout>
  );
};

export default AddCompany;



