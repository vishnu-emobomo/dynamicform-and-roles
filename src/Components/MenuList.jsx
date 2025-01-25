import * as React from "react";
import Box from "@mui/material/Box";
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
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import { Link, useLocation } from "react-router-dom";
import { useCheckPermission } from "../Authorization/useCheckPermission";
import "../ComponentCss/SubHeader.css";
import "../assets/css/general-sans.css";

const MenuList = () => {
  const checkPermission = useCheckPermission();
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const location = useLocation();

  // Define menu items with permissions
  const menuItems = [
    {
      label: "Tender Management",
      path: "/ManageTender",
      icon: <AssignmentIcon sx={{ color: "#cc5500" }} />, 
      objectType: "Tender",
      permissions: ["CanReadCreated", "CanEditCreated", "CanEditAll", "CanReadAll", "CanCreate"],
    },
    {
      label: "Project Management",
      path: "/ManageProject",
      icon: <BusinessIcon sx={{ color: "#cc5500" }} />,
      objectType: "Project",
      permissions: ["CanReadProject", "CanEditProject", "CanCreateProject"],
    },
    {
      label: "Inventory",
      path: "/InventoryTranscation",
      icon: <InventoryIcon sx={{ color: "#cc5500" }} />,
      objectType: "Inventory",
      permissions: ["CanReadInventory", "CanEditInventory"],
    },
    {
      label: "Vendor & Customer",
      path: "/ManageVendor",
      icon: <LocalShippingIcon sx={{ color: "#cc5500" }} />,
      objectType: "Vendor",
      permissions: ["CanReadVendor", "CanEditVendor"],
    },
    {
      label: "Purchase Order",
      path: "/ManagePurchase",
      icon: <ShoppingCartIcon sx={{ color: "#cc5500" }} />,
      objectType: "Purchase",
      permissions: ["CanReadPurchase", "CanEditPurchase"],
    },
    {
      label: "Material & Tools",
      path: "/ManageMaterial",
      icon: <PrecisionManufacturingIcon sx={{ color: "#cc5500" }} />,
      objectType: "Material",
      permissions: ["CanReadMaterial", "CanEditMaterial"],
    },
    {
      label: "Work Order",
      path: "/ManageWorkOrder",
      icon: <MapsHomeWorkIcon sx={{ color: "#cc5500" }} />,
      objectType: "WorkOrder",
      permissions: ["CanReadWorkOrder", "CanEditWorkOrder"],
    },
    {
      label: "File Upload",
      path: "/FileUpload",
      icon: <PermMediaIcon sx={{ color: "#cc5500" }} />,
      objectType: "File",
      permissions: ["CanUploadFile"],
    },
    {
      label: "Admin",
      path: "/ObjectManager",
      icon: <PermMediaIcon sx={{ color: "#cc5500" }} />,
      objectType: "Admin",
      permissions: ["CanAccessAdmin"],
    },
  ];

  // Check if the user has the required permissions
  const hasPermission = (objectType, requiredPermissions) => {
    if (!requiredPermissions.length) return true;
    return requiredPermissions.every((perm) => checkPermission(objectType, perm));
  };

  // Toggle drawer open/close
  const toggleDrawer = (isOpen) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setOpen(isOpen);
  };

  // Update the selected menu item based on the current path
  React.useEffect(() => {
    const currentItem = menuItems.find((item) => location.pathname.includes(item.path));
    setSelectedItem(currentItem ? currentItem.label : null);
  }, [location.pathname]);

  // Render the drawer list dynamically
  const DrawerList = (
    <Box sx={{ width: 250, color: "#cc5500", marginTop: "50px" }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {menuItems.map(({ label, path, icon, objectType, permissions }) =>
          hasPermission(objectType, permissions) && (
            <ListItem key={label} disablePadding onClick={() => setSelectedItem(label)}>
              <Link to={path} style={{ textDecoration: "none", color: "inherit" }}>
                <ListItemButton>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              </Link>
            </ListItem>
          )
        )}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)} style={{ color: "white" }}>
        <MenuOpenIcon sx={{ fontSize: 35, color: "#CC5500" }} />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default MenuList;
