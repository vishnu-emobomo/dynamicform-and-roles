// import React, { useState } from "react";

// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import {
//   TextField,
//   Button,
//   Grid,
//   Box,
//   Typography,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// import axios from "axios";


// const Register = () => {
//   const [formValues, setFormValues] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     address: "",
//     organization: "",
//     phoneNumber: "",
//     companyName: "",
//     companyEmail: "",
//     role: "",
//     permissions: [
//       {
//         ID: 1,
//         objectType: "Tender",
//         canCreate: false,
//         canEditCreated: false,
//         canReadCreated: false,
//         canDeleteCreated: false,
//       },
//       {
//         ID: 2,
//         objectType: "WorkOrder",
//         canCreate: false,
//         canEditCreated: false,
//         canReadCreated: false,
//         canDeleteCreated: false,
//       },
//       {
//         ID: 3,
//         objectType: "Project",
//         canCreate: false,
//         canEditCreated: false,
//         canReadCreated: false,
//         canDeleteCreated: false,
//       },
//     ],
//   });

//   const [openDialog, setOpenDialog] = useState(false);

//   const handlePermissionChange = (event, permissionID, actionType) => {
//     const { checked } = event.target;
//     setFormValues((prevValues) => {
//       const updatedPermissions = prevValues.permissions.map((permission) =>
//         permission.ID === permissionID
//           ? { ...permission, [actionType]: checked }
//           : permission
//       );
//       return { ...prevValues, permissions: updatedPermissions };
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const requiredFields = [
//       "firstName",
//       "lastName",
//       "email",
//       "address",
//       "companyName",
//       "companyEmail",
//       "role",
//     ];

//     const missingFields = requiredFields.filter((field) => !formValues[field]);
//     if (missingFields.length > 0) {
//       alert(`Please fill out the required fields: ${missingFields.join(", ")}`);
//       return;
//     }

//     const payload = { ...formValues };
//     console.log(payload);

//     try {
//       const response = await axios.post(
//         "https://example.com/api/register",
//         payload
//       );

//       if (response.status === 200) {
//         alert("Registered successfully!");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert("Registration failed");
//     }
//   };

//   const handleOpenDialog = () => setOpenDialog(true);
//   const handleCloseDialog = () => setOpenDialog(false);

//   const handleSavePermissions = () => {
//     setOpenDialog(false);
//   };

//   const renderSelectedPermissions = () => {
//     const selectedPermissions = [];
//     formValues.permissions.forEach((permission) => {
//       if (
//         permission.canCreate ||
//         permission.canEditCreated ||
//         permission.canReadCreated ||
//         permission.canDeleteCreated
//       ) {
//         selectedPermissions.push(
//           `${permission.objectType}: ${[
//             permission.canCreate && "CanCreate",
//             permission.canEditCreated && "CanEditCreated",
//             permission.canReadCreated && "CanReadCreated",
//             permission.canDeleteCreated && "CanDeleteCreated",
//           ]
//             .filter(Boolean)
//             .join(", ")}`
//         );
//       }
//     });

//     return selectedPermissions.length
//       ? selectedPermissions.join(", ")
//       : "No permissions selected";
//   };

//   return (
//    <div style={{
//     backgroundImage:
//       "url('https://img.freepik.com/free-vector/realistic-podium-background_52683-75942.jpg?t=st=1735841986~exp=1735845586~hmac=b23bead0e5b76bafdc830f50bc6eb51cd62abd4b20134c02275986c92f61c142&w=1060')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     height: "100vh",
//     display: "flex", // Enables flexbox for centering
//     alignItems: "flex-start", // Align items at the top
//     justifyContent: "center", // Center horizontally
//     paddingTop: "50px",
//    }}>
    
//     <div className="register"
//       component="form"
//       onSubmit={handleSubmit}
//       style={{ 
//         padding: "60px",
//         borderRadius: "10px",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//         width: "60%",
//         margin: "50px auto 0", // Adds 50px margin from the top
//         backdropFilter: "blur(20px) saturate(200%)",
//         WebkitBackdropFilter: "blur(20px) saturate(200%)",
//         backgroundColor: "rgba(255, 255, 255, 0.6)",
//        }}
//     >
//      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//   <Typography
//     variant="h4"
//     align="start"
//     gutterBottom
//     sx={{ mb: 3, color: "cornflowerblue" }}
//     style={{ flex: 1 }}
//   >
//     User Onboarding Form
//   </Typography>
//   <div style={{ height: "100px", width: "100px", marginLeft: "20px" }}>
//     <DotLottieReact
//       src="https://lottie.host/da207ccd-192b-4e12-adab-9fef10886a89/oPZao60QcI.lottie"
//       loop
//       autoplay
//       style={{ height: "100%", width: "100%" }}
//     />
//   </div>
// </div>

//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             variant="standard"
//             label="First Name"
//             name="firstName"
//             value={formValues.firstName}
//             onChange={handleChange}
//             sx={{
//               height: "40px",
//               "& .MuiInputBase-root": { height: "40px", padding: "0 10px" },
//               "& .MuiFormLabel-root": { fontSize: "14px" },
//             }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <TextField
//             variant="standard"
//             label="Last Name"
//             name="lastName"
//             value={formValues.lastName}
//             onChange={handleChange}
//             sx={{
//               height: "40px",
//               "& .MuiInputBase-root": { height: "40px", padding: "0 10px" },
//               "& .MuiFormLabel-root": { fontSize: "14px" },
//             }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <TextField
//             variant="standard"
//             label="Email"
//             name="email"
//             value={formValues.email}
//             onChange={handleChange}
//             sx={{
//               height: "40px",
//               "& .MuiInputBase-root": { height: "40px", padding: "0 10px" },
//               "& .MuiFormLabel-root": { fontSize: "14px" },
//             }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <TextField
//             variant="standard"
//             label="Address"
//             name="address"
//             value={formValues.address}
//             onChange={handleChange}
//             sx={{
//               height: "40px",
//               "& .MuiInputBase-root": { height: "40px", padding: "0 10px" },
//               "& .MuiFormLabel-root": { fontSize: "14px" },
//             }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <TextField
//             variant="standard"
//             label="Organization"
//             name="organization"
//             value={formValues.organization}
//             onChange={handleChange}
//             sx={{
//               height: "40px",
//               "& .MuiInputBase-root": { height: "40px", padding: "0 10px" },
//               "& .MuiFormLabel-root": { fontSize: "14px" },
//             }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <TextField
//             variant="standard"
//             label="Phone Number"
//             name="phoneNumber"
//             value={formValues.phoneNumber}
//             onChange={handleChange}
//             sx={{
//               height: "40px",
//               "& .MuiInputBase-root": { height: "40px", padding: "0 10px" },
//               "& .MuiFormLabel-root": { fontSize: "14px" },
//             }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <TextField
//             variant="standard"
//             label="Company Name"
//             name="companyName"
//             value={formValues.companyName}
//             onChange={handleChange}
//             sx={{
//               height: "40px",
//               "& .MuiInputBase-root": { height: "40px", padding: "0 10px" },
//               "& .MuiFormLabel-root": { fontSize: "14px" },
//             }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <TextField
//             variant="standard"
//             label="Company Email"
//             name="companyEmail"
//             value={formValues.companyEmail}
//             onChange={handleChange}
//             sx={{
//               height: "40px",
//               "& .MuiInputBase-root": { height: "40px", padding: "0 10px" },
//               "& .MuiFormLabel-root": { fontSize: "14px" },
//             }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <TextField
//             variant="standard"
//             label="Role"
//             name="role"
//             value={formValues.role}
//             onChange={handleChange}
//             sx={{
//               height: "40px",
//               "& .MuiInputBase-root": { height: "40px", padding: "0 10px" },
//               "& .MuiFormLabel-root": { fontSize: "14px" },
//             }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth variant="standard" sx={{ height: "40px" }}>
//             <InputLabel>Permissions</InputLabel>
//             <Select
//               value={renderSelectedPermissions()}
//               onClick={handleOpenDialog}
//               label="Permissions"
//               readOnly
//               sx={{
//                 "& .MuiInputBase-root": { height: "40px", padding: "0 10px" },
//               }}
//             >
//               <MenuItem value={renderSelectedPermissions()}>
//                 {renderSelectedPermissions()}
//               </MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>

//       <Button
//         type="submit"
//         variant="contained"
//         fullWidth
//         sx={{ mt: 3, width: "20%", fontSize: "16px" }}
//       >
//         Register
//       </Button>

//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         fullWidth
//         maxWidth="sm"
//         sx={{
//           "& .MuiDialog-paper": { borderRadius: "8px" },
//           overflowY: "hidden",
//           height: "500px",
          
//         }}
//       >
//         <DialogTitle>Manage Permissions</DialogTitle>
//         <DialogContent sx={{
//           backgroundImage:"url('https://img.freepik.com/free-photo/blurred-abstract-background_58702-1514.jpg?t=st=1735843592~exp=1735847192~hmac=811d2aabf7b7af7576ad4603fd4c0259cbae5b6e941b20ae1d6c045586a27edc&w=1060')",
//         }} >
          
//           {formValues.permissions.map((permission) => (
//             <Box
//               key={permission.ID}
//               sx={{
//                 mb: 2,
//                 p: 2,
//                 border: "1px solid #ddd",
//                 borderRadius: "8px",
//                 boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//                 overflowY: "hidden",
//                 backgroundImage:"url('https://img.freepik.com/free-photo/white-background-with-cracked-glass-texture_53876-128488.jpg?t=st=1735842974~exp=1735846574~hmac=0421d494594b745dba4aacabdbcafcea47af3f942903802a65d9065a4b1a6e2a&w=1060')",
                 
//               }}
//             >
//               <Typography variant="subtitle1">{permission.objectType}</Typography>
//               <FormGroup>
//                 {[
//                   "canCreate",
//                   "canEditCreated",
//                   "canReadCreated",
//                   "canDeleteCreated",
//                 ].map((action) => (
//                   <FormControlLabel
//                     key={action}
//                     control={
//                       <Checkbox
//                         checked={permission[action]}
//                         onChange={(e) =>
//                           handlePermissionChange(e, permission.ID, action)
//                         }
//                       />
//                     }
//                     label={action.replace(/([A-Z])/g, " $1").trim()}
//                   />
//                 ))}
//               </FormGroup>
//             </Box>
//           ))}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button onClick={handleSavePermissions} variant="contained">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//    </div>
//   );
// };

// export default Register;


import { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControl,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Grid,
  Box,
} from '@mui/material';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    managementOptions: [],
  });

  const managementOptions = [
    'Tender Management',
    'Project Management',
    'Vendor & Customer Management',
    'Inventory Management',
    'Purchase Order Management',
    'Material & Tools Management',
    'Work Order Management',
    'File Upload',
  ];

  const handleCheckboxChange = (option) => {
    setFormData((prev) => {
      const newOptions = prev.managementOptions.includes(option)
        ? prev.managementOptions.filter((item) => item !== option)
        : [...prev.managementOptions, option];
      return { ...prev, managementOptions: newOptions };
    });
  };

  const textFieldStyles = {
    '& .MuiInputBase-root': { color: '#cc5500' },
    '& .MuiInput-underline:before': { borderBottomColor: '#cc5500' },
    '& .MuiInput-underline:hover:before': { borderBottomColor: '#cc5500' },
    '& .MuiInput-underline:after': { borderBottomColor: '#cc5500' },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
        bgcolor: 'white',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 960,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Grid container spacing={6}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Full Name"
              fullWidth
              variant="standard"
              sx={{ ...textFieldStyles, mt: 2 }}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <TextField
              label="Email Address"
              fullWidth
              variant="standard"
              sx={{ ...textFieldStyles, mt: 2 }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Phone Number"
              fullWidth
              variant="standard"
              sx={{ ...textFieldStyles, mt: 2 }}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              label="Username"
              fullWidth
              variant="standard"
              sx={{ ...textFieldStyles, mt: 2 }}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              sx={{ ...textFieldStyles, mt: 2 }}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              variant="standard"
              sx={{ ...textFieldStyles, mt: 2 }}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="standard" sx={{ ...textFieldStyles, mt: 2 }}>
              <InputLabel >Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                
              >
                <MenuItem value="read">Read</MenuItem>
                <MenuItem value="write">Write</MenuItem>
                <MenuItem value="read-write">Read & Write</MenuItem>
              </Select>
            </FormControl>

            <FormGroup sx={{ mt: 4 }}>
              {managementOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={formData.managementOptions.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      sx={{
                        color: '#cc5500',
                        '&.Mui-checked': {
                          color: '#cc5500',
                        },
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="contained"
            sx={{ mr: 2, backgroundColor: '#cc5500', '&:hover': { backgroundColor: '#b24400' }, width:"auto" }}
            onClick={() => console.log('Register User', formData)}
          >
            Register user
          </Button>
          <Button
            variant="outlined"
            sx={{ color: '#cc5500', borderColor: '#cc5500', '&:hover': { backgroundColor: '#cc5500', color: 'white' } }}
            onClick={() => setFormData({
              fullName: '',
              email: '',
              phone: '',
              username: '',
              password: '',
              confirmPassword: '',
              role: '',
              managementOptions: [],
            })}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}