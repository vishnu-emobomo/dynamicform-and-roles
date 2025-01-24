import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Backdrop, CircularProgress } from "@mui/material";
import Header from "../../Components/Header"
import SubHeader from "../../Components/SubHeader"

const Layout = ({ children }) => (
  <Box sx={{ display: "flex",
        flexDirection: "column",
        marginTop: 5,
      }}>
      <Header />
   
      <Grid  container
        sx={{
          flexGrow: 1,
          padding: 0,
          minHeight: "100vh",
          justifyContent: "center", 
          alignItems: "center",
        }} >
        <Grid item xs={12} md={11}>
          <Box 
            sx={{
              minHeight: "calc(100vh - 112px)",
              backgroundColor: "white",
               padding: 2,
              justifyContent:"center"
            }}>
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  export default Layout;