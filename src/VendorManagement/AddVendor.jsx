import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Backdrop, CircularProgress } from "@mui/material";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import useFormStructure from "../DynamicVendor/useFormStructure"; // Dynamic form structure hook
import apiClient from "../utlis/apiClient";

// const AddVendor = () => {
//   const formStructure = useFormStructure("Vendor");
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (formStructure.length > 0) {
//       const initialData = formStructure.reduce((acc, field) => {
//         acc[field.id] = field.type === "select" ? field.options[0] || "" : "";
//         return acc;
//       }, {});
//       setFormData(initialData);
//     }
//   }, [formStructure]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await apiClient.post("/api/vendor/create-vendor", formData);
//       console.log("Form submitted successfully:", response.data);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // if (!formStructure || formStructure.length === 0) {
//   //   return <Typography>Loading form...</Typography>;
//   // }

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column" }}>
//       <Header />
//       <SubHeader />
//       <Grid container sx={{ flexGrow: 1, marginTop: "-80px", padding: 0 }} spacing={6}>
//         <Grid item xs={12} md={2}></Grid>
//         <Grid item xs={12} md={9}>
//           <Box 
//           sx={{ backgroundColor: "white", 
//           padding: 2, 
//           borderRadius: "10px", 
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
//           marginLeft: "-60px" }}>
//             <Typography variant="h6" gutterBottom>Vendor</Typography>
//             <form noValidate autoComplete="off" onSubmit={handleSubmit}>
//               <Grid container spacing={3}>
//                 {formStructure.map((field) => (
//                   <Grid item xs={12} 
//                   md={field.type === "text" 
//                       || field.type === "number" 
//                       || field.type ==="select"
//                       || field.type ==="email" ? 2 : 12}
//                   key={field.id}>
//                     {field.type === "select" ? (
//                       <FormControl   variant="standard"  fullWidth>
//                         <InputLabel id={`${field.id}-label`} shrink>
//                           {field.label} 
//                         </InputLabel>
//                         <Select 
//                           id={field.id} 
//                           name={field.id} 
//                           value={formData[field.id]} 
//                           onChange={handleChange} 
//                           labelId={`${field.id}-label`}>
//                           {Array.isArray(field.options)
//                             ? field.options.map((option) => (
//                                 <MenuItem key={option} value={option}>
//                                   {option}
//                                 </MenuItem>
//                               ))
//                             : null}
//                         </Select>
//                       </FormControl>
//                     ) : field.type === "text" ? (
//                       <TextField 
//                         id={field.id} 
//                         name={field.id} 
//                         label={field.label} 
//                         variant="standard" 
//                         value={formData[field.id]} 
//                         onChange={handleChange} 
//                         InputLabelProps={{
//                           shrink: true,
//                         }}
//                         fullWidth />
//                     ) : field.type === "email" ? (
//                     <TextField 
//                       id={field.id} 
//                       name={field.id} 
//                       label={field.label} 
//                       variant="standard" 
//                       value={formData[field.id]} 
//                       onChange={handleChange} 
//                       InputLabelProps={{
//                         shrink: true,
//                       }}
//                       fullWidth />
//                   ): field.type === "number" ? (
//                       <TextField 
//                         id={field.id} 
//                         name={field.id} 
//                         label={field.label} 
//                         variant="standard" 
//                         value={formData[field.id]} 
//                         onChange={handleChange} 
//                         InputLabelProps={{
//                           shrink: true,
//                         }}
//                         fullWidth />
//                     ): (
//                       <TextField 
//                         id={field.id} 
//                         name={field.id} 
//                         label={field.label} 
//                         type={field.type} 
//                         variant="outlined" 
//                         value={formData[field.id]} 
//                         onChange={handleChange} 
//                         fullWidth 

//                         multiline rows={field.rows || 3}  />
//                     )}
//                   </Grid>
//                 ))}

//                  {/* Comments Field */}
//                 <Grid item xs={12}>
//                   <TextField
//                     id="comments"
//                     name="comments"
//                     label="Comments"
//                     variant="outlined"
//                     value={formData.comments || ""}
//                     onChange={handleChange}
//                     fullWidth
//                     multiline
//                     rows={2} // Adjust rows as needed
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12} >
//                   <Grid item xs={12} sm={3}>
//                     <Button variant="contained" color="primary" type="submit" fullWidth>
//                       Submit
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </form>
//           </Box>
//         </Grid>
//       </Grid>
//       <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}>
//         <CircularProgress color="inherit" />
//       </Backdrop>
//     </Box>
//   );
// };


import Layout from "./Vendor Layout/Layout";
import VendorForm from "./Vendor Layout/DynamicForm";

const AddVendor = () => {
  const formStructure = useFormStructure("Vendor");
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
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post("/api/vendor/create-vendor", formData);
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <VendorForm
        formStructure={formStructure}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        name={"Vendor"}
      />
      <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Layout>
  );
};

export default AddVendor;
