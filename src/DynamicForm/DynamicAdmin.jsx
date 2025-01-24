import React, { useState } from "react";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import { Box, Button } from "@mui/material";
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom"; 

const DynamicAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (open) => () => {
    setSidebarOpen(open);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <SubHeader />

      <div>
        <Button sx={{ marginTop: "-50px" }} onClick={toggleSidebar(true)}>
          Menu
        </Button>
        <Sidebar open={sidebarOpen} toggleDrawer={toggleSidebar} />
      </div>

      <Box sx={{ marginLeft: 3, marginTop: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DynamicAdmin;
