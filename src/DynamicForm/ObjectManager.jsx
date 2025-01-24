import React, { useState } from "react";
import Header from "../Components/Header";
import SubHeader from "../Components/SubHeader";
import { Box, Button,  Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
} from "@mui/material";
import Sidebar from "./SideBar";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { Link, Outlet } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";

const ObjectManager = () => {

  const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = (open) => () => {
      setSidebarOpen(open);
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: "#325c67",
          color: theme.palette.common.white,
          padding: "10px",
          verticalAlign: "top",
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
          padding: "10px !important",
        },
      }));
    
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
          backgroundColor: "#f3f3f3",
        },
        "&:last-child td, &:last-child th": {
          border: 0,
        },
      }));

          // Sample data for table
    const tableData = [
      {  module: "Project", description: "Projects related to various construction work" },
        {  module: "Tender", description: "Tenders for bids in various industries." },
        {  module: "Vendor", description: "Vendors supplying materials and services." },
        {  module: "Customer", description: "Customer services." },
        {  module: "Tools", description: "Tool services." },
        {  module: "Material", description: "Materials add on services." },
    ];

    const handleNavigate =(module)=>{
      navigate(`/AdjustForm/${module}`)
    }




  return (
    <div>
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <SubHeader />

      {/* Flex container for the button and content */}
      <Box sx={{ display: "flex", flexGrow: 1,
       alignItems: "flex-start", 
    //    paddingLeft: sidebarOpen ? "250px" : "0" 
       }}>
       
        <Button sx={{ marginTop: "-40px" }} onClick={toggleSidebar(true)}>
          Menu
        </Button>

            <Box sx={{ 
                minHeight: "calc(100vh - 112px)",
                backgroundColor: "white",
                borderRadius: "10px",
                marginLeft: "55px",
                }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>SNO</StyledTableCell>
                        <StyledTableCell>Module</StyledTableCell>
                        <StyledTableCell>Description</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody >
                    {tableData.map((row) => (
                        <StyledTableRow key={row.sno} 
                           onClick={()=>handleNavigate(row.module)}
                       
                           style={{ cursor: "pointer" }}
                            >
                          <StyledTableCell>{row.sno}</StyledTableCell>
                            <StyledTableCell>{row.module}</StyledTableCell>
                            <StyledTableCell>{row.description}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Box>
      </Box>

      <Sidebar open={sidebarOpen} toggleDrawer={toggleSidebar} />
    </Box>
    </div>
  );
}

export default ObjectManager;
