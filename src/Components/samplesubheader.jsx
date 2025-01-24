import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MenuIcon from '@mui/icons-material/Menu';
import "../ComponentCss/SubHeader.css";
import { Link } from 'react-router-dom';

export default function SubHeader() {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleListItemClick = (item) => () => {
    setSelectedItem(item);
    setOpen(false); // Close the drawer after selection
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem disablePadding onClick={handleListItemClick('Tender Management')}>
          <ListItemButton>
            <ListItemIcon>
              <AssignmentIcon /> {/* Tender Management Icon */}
            </ListItemIcon>
            <ListItemText primary="Tender Management" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding onClick={handleListItemClick('Project Management')}>
          <ListItemButton>
            <ListItemIcon>
              <BusinessIcon /> {/* Project Management Icon */}
            </ListItemIcon>
            <ListItemText primary="Project Management" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding onClick={handleListItemClick('Inventory')}>
          <ListItemButton>
            <ListItemIcon>
              <InventoryIcon /> {/* Inventory Icon */}
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding onClick={handleListItemClick('Vendor Management')}>
          <ListItemButton>
            <ListItemIcon>
              <LocalShippingIcon /> {/* Vendor Management Icon */}
            </ListItemIcon>
            <ListItemText primary="Vendor Management" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 2, mt: 10 }}>
      <AppBar position="fixed" sx={{ top: 48, zIndex: theme => theme.zIndex.drawer + 0 }} className='custom-subHeader'>
        <Toolbar variant="dense">
          <IconButton edge="start" color="white" aria-label="menu" sx={{ mr: 2 }}>
            <div>
              <Button onClick={toggleDrawer(true)} style={{ color: "white" }}><MenuIcon /></Button>
              <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
              </Drawer>
            </div>
          </IconButton>

          {selectedItem === 'Tender Management' && (
            <Typography variant="h6" color="white" component="div" sx={{ mr: 2, fontSize: 15 }}>
              <Link className="link" to="/ManageTender">
                Tender
              </Link>
            </Typography>
          )}

          {selectedItem === 'Project Management' && (
            <Typography variant="h6" color="white" component="div" sx={{ mr: 2, fontSize: 15 }}>
              <Link className="link" to="/ManageProject">
                Project
              </Link>
            </Typography>
          )}

          {selectedItem === 'Vendor Management' && (
            <>
              <Typography variant="h6" color="white" component="div" sx={{ mr: 2, fontSize: 15 }}>
                Purchase
              </Typography>
              <Typography variant="h6" color="white" component="div" sx={{ mr: 2, fontSize: 15 }}>
                Receipts
              </Typography>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
