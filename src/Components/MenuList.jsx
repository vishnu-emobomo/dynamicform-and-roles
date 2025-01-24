import * as React from "react";
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Link, useLocation } from "react-router-dom";
import "../ComponentCss/SubHeader.css";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import "../assets/css/general-sans.css";


const MenuList = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const location = useLocation();
   const toggleDrawer = (open) => (event) => {
    
     if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
       return;
     }
     setOpen(prev=>!prev);
   };

   React.useEffect(() => {
    const path = location.pathname;
    // console.log(path);
    if (path.includes("/ManageTender")) {
      setSelectedItem("Tender Management");
    } 
    else if (path.includes("/AddTender")) {
      setSelectedItem("Tender Management");
    }
    else if (path.includes("/UpdateTender")) {
      setSelectedItem("Tender Management");
    }
     else if (path.includes("/ManageProject")) {
      setSelectedItem("Project Management");
    } 
    else if (path.includes("/AddProject")) {
      setSelectedItem("Project Management");
    } 
    else if (path.includes("/LineItems")) {
      setSelectedItem("Project Management");
    } 
    else if (path.includes("/AddPurchase")) {
      setSelectedItem("Purchase Order");
    } 
    else if (path.includes("/ManagePurchase")) {
      setSelectedItem("Purchase Order");
    } 
    else if (path.includes("/POLineItem")) {
      setSelectedItem("Purchase Order");
    } 
    else if (path.includes("/AddVendor")) {
      setSelectedItem("Vendor Management");
    } 
    else if (path.includes("/ManageVendor")) {
      setSelectedItem("Vendor Management");
    }
    else if (path.includes("/updatevendor")) {
      setSelectedItem("Vendor Management");
    } 
    else if (path.includes("/AddCompany")) {
      setSelectedItem("Vendor Management");
    } 
    else if (path.includes("/ManageCompany")) {
      setSelectedItem("Vendor Management");
    }
    else if (path.includes("/updateCompany")) {
      setSelectedItem("Vendor Management");
    }
    else if (path.includes("/AddReceipt")) {
      setSelectedItem("Purchase Order");
    }
    else if (path.includes("/ManageReceipt")) {
      setSelectedItem("Purchase Order");
    }
    else if (path.includes("/ROLineItem")) {
      setSelectedItem("Purchase Order");
    } 
    else if (path.includes("/AddMaterial")) {
      setSelectedItem("Product");
    } 
    else if (path.includes("/ManageMaterial")) {
      setSelectedItem("Product");
    } 
    else if (path.includes("/UpdateMaterial")) {
      setSelectedItem("Product");
    } 
    else if (path.includes("/AddTools")) {
      setSelectedItem("Product");
    } 
    else if (path.includes("/ManageTools")) {
      setSelectedItem("Product");
    } 
    else if (path.includes("/UpdateTools")) {
      setSelectedItem("Product");
    } 
    else if (path.includes("/InventoryTranscation")) {
      setSelectedItem("Inventory");
    } 
    else if (path.includes("/InventoryOnHand")) {
      setSelectedItem("Inventory");
    }
    else if (path.includes("/ToolsTransactions")) {
      setSelectedItem("Inventory");
    } 
    else if (path.includes("/ToolsInventoryOnHand")) {
      setSelectedItem("Inventory");
    } 
    else if (path.includes("/ManageWorkOrder")) {
      setSelectedItem("Work Order");
    }
    else if (path.includes("/AddWorkOrder")) {
      setSelectedItem("Work Order");
    }
    else if (path.includes("/ManageMatWorkOrder")) {
      setSelectedItem("Work Order");
    }
    else if (path.includes("/AddMatWorkOrder")) {
      setSelectedItem("Work Order");
    }
    else if (path.includes("/UpdateWorkOrder")) {
      setSelectedItem("Work Order");
    }
    else if (path.includes("/FileUpload")) {
      setSelectedItem("File Upload");
    }
    else if (path.includes("/ObjectManager")) {
      setSelectedItem("Admin");
    }
    else {
      setSelectedItem(null);
    }
  }, [location]);

     const handleListItemClick = (item) => () => {
      setSelectedItem(item);
      setOpen(false); // Close the drawer after selection
    };
  
   
    const DrawerList = (
        <Box sx={{ width: 250, color:"#cc5500" ,marginTop:"50px"  }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            <ListItem
              disablePadding
              onClick={handleListItemClick("Tender Management")}
            >
              <Link
                to="/ManageTender"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <AssignmentIcon  sx={{ color: "#cc5500" }}/> {/* Tender Management Icon */}
                  </ListItemIcon>
                  <ListItemText primary="Tender Management" />
                </ListItemButton>
              </Link>
            </ListItem>
    
            <ListItem
              disablePadding
              onClick={handleListItemClick("Project Management")}
            >
              <Link
                to="/ManageProject"
                style={{ textDecoration: "none", color: "inherit" ,fontFamily:"GeneralSans-Regular" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <BusinessIcon sx={{ color: "#cc5500" }} /> {/* Project Management Icon */}
                  </ListItemIcon>
                  <ListItemText primary="Project Management" />
                </ListItemButton>
              </Link>
            </ListItem>
    
            <ListItem disablePadding onClick={handleListItemClick("Inventory")}>
            <Link
                to="/InventoryTranscation"
                style={{ textDecoration: "none", color: "inherit" }}
              >
              <ListItemButton>
                <ListItemIcon>
                  <InventoryIcon  sx={{ color: "#cc5500" }}/>
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItemButton>
            </Link>
            </ListItem>
    
            <ListItem
              disablePadding
              onClick={handleListItemClick("Vendor Management")}
            >
              <Link
                to="/ManageVendor"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <LocalShippingIcon sx={{ color: "#cc5500" }} /> {/* Vendor Management Icon */}
                  </ListItemIcon>
                  <ListItemText primary="Vendor & Customer" />
                </ListItemButton>
              </Link>
            </ListItem>
    
            <ListItem disablePadding onClick={handleListItemClick("Purchase Order")}>
              <Link
                to="/ManagePurchase"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <ShoppingCartIcon sx={{ color: "#cc5500" }} /> {/* Purchase Order Icon */}
                  </ListItemIcon>
                  <ListItemText primary="Purchase Order" />
                </ListItemButton>
              </Link>
            </ListItem>
    
            <ListItem disablePadding onClick={handleListItemClick("Product")}>
              <Link
                to="/ManageMaterial"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <PrecisionManufacturingIcon  sx={{ color: "#cc5500" }}/> {/* Product Icon */}
                  </ListItemIcon>
                  <ListItemText primary="Material & Tools" />
                </ListItemButton>
              </Link>
            </ListItem>
    
    
    
            <ListItem disablePadding onClick={handleListItemClick("Work Order")}>
              <Link
                to="/ManageWorkOrder"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <MapsHomeWorkIcon  sx={{ color: "#cc5500" }}/> {/*  Work Order Icon */}
                  </ListItemIcon>
                  <ListItemText primary="Work Order" />
                </ListItemButton>
              </Link>
            </ListItem>
    
            <ListItem disablePadding onClick={handleListItemClick("File Storage")}>
              <Link
                to="/FileUpload"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <PermMediaIcon sx={{ color: "#cc5500" }}/> 
                  </ListItemIcon>
                  <ListItemText primary="File Upload" />
                </ListItemButton>
              </Link>
            </ListItem>

          <ListItem disablePadding onClick={handleListItemClick("Admin")}>
              <Link
                to="/ObjectManager"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <PermMediaIcon /> 
                  </ListItemIcon>
                  <ListItemText primary="Admin" />
                </ListItemButton>
              </Link>
            </ListItem>
    
    
          </List>
          <Divider />
        </Box>
      );



      return (
        <div>
        <Button onClick={toggleDrawer(true)} style={{ color: "white" }}>
        <MenuOpenIcon sx={{ fontSize: 35, color: "#CC5500" , }} />
        </Button>
        <Drawer open={open} onClose={toggleDrawer(false)}  >
          {DrawerList}
        </Drawer>
      </div>

      );
}

export default MenuList