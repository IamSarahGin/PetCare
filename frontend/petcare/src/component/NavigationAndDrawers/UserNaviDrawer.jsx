import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios';

const DrawerComponent = ({ userNavData, handleLogout }) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate(); // Use the useNavigate hook here
    const [userEmail, setUserEmail] = useState('');
    const PAGES = [
        { label: userNavData.menu_item_5, link: '/welcome' },
        { label: userNavData.menu_item_6, link: '/booking' },
        { label: userNavData.menu_item_7, link: '/inquire' },
    ];

    const handleLogoutClick = () => {
        console.log("Logging out...");
        axios.get('http://localhost:3000/logout', { withCredentials: true })
            .then(res => {
                console.log("Logout response:", res);
                if (res.status === 200) {
                    console.log("Logout successful");
                    setUserEmail('');
                    navigate('/');
                }
            })
            .catch(err => console.error('Error logging out:', err));
    };

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
                    <ListItemButton onClick={handleLogoutClick}> {/* Logout button */}
                        <ListItemIcon>
                            <ExitToAppIcon /> {/* Logout icon */}
                        </ListItemIcon>
                        <ListItemText primary="Logout" /> {/* Logout label */}
                    </ListItemButton>
                </List>
            </Drawer>
            <IconButton sx={{ color: 'gray', marginLeft: 'auto' }} onClick={() => setOpenDrawer(!openDrawer)}>
                <MenuIcon />
            </IconButton>
        </React.Fragment>
    );
};

export default DrawerComponent;

