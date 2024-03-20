import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText,IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const DrawerComponent = ({ navData }) => {
    const [openDrawer, setOpenDrawer] = useState(false);

    const PAGES = [
      
        { label: navData.menu_item_5, link: '/' },
        { label: navData.menu_item_6, link: '/about' },
        { label: navData.menu_item_7, link: '/bookingVisitor' },
        { label: navData.menu_item_8, link: '/contact' },
        { label: navData.menu_item_3, link: '/login' },
        { label: navData.menu_item_4, link: '/register' },
       
    ];

    return (
        <React.Fragment>
            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
                <List>
                    {PAGES.map((page, index) => (
                        <ListItemButton key={index} component={Link} to={page.link}>
                            <ListItemIcon>
                                {/* Optionally, you can add icons here */}
                            </ListItemIcon>
                            <ListItemText primary={page.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
            <IconButton sx={{ color: 'gray', marginLeft: 'auto' }} onClick={() => setOpenDrawer(!openDrawer)}>
                <MenuIcon />
            </IconButton>
        </React.Fragment>
    );
};

export default DrawerComponent;


