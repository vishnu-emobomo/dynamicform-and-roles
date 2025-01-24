import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Link } from "react-router-dom";

const Sidebar = ({ open, toggleDrawer }) => {
  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <Link
            to="/ObjectManager"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemButton>
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Object Manager" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem disablePadding>
          <Link
            to="/PickList"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemButton>
              <ListItemText primary="PickList" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem disablePadding>
          <Link
            to="/Roles"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemButton>
              <ListItemText primary="Roles" />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
      {list()}
    </Drawer>
  );
};

export default Sidebar;
