import React,{useState} from 'react';
import { Button, Drawer, List, ListItem, ListItemText, Divider} from '@mui/material';
import { Link } from 'react-router-dom';

const SideMenu = () => {

    
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };


  return (
    <div>
      <Button onClick={handleDrawerOpen} >MENU</Button>
        <Drawer anchor="left" open={drawerOpen} 
            onClose={handleDrawerClose}
            sx={{
                '& .MuiDrawer-paper': {
                top: 'calc(64px + 48px)',
                height: 'auto'
                }
            }}
            ModalProps={{
               BackdropProps: {
                invisible: true
               },
            }}
        >
          <List>
            <ListItem button component={Link} to="/ObjectManager">
              <ListItemText primary="Object Manager" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/PickList">
              <ListItemText primary="PickList" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/vendors">
              <ListItemText primary="Roles" />
            </ListItem>
            <Divider />
          </List>
        </Drawer>
    </div>
  );
}

export default SideMenu;
