import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText,IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios';
const AdminNaviDrawer = ({ adminNavData }) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const PAGES=[
        { label: adminNavData.menu_item_3, link: '/admin/dashboard' },
        { label: adminNavData.menu_item_4, link: '/approved/list' },
        { label: adminNavData.menu_item_5, link: '/rejected/list' },
        { label: adminNavData.menu_item_6, link: '/addPet' },
        { label: adminNavData.menu_item_7, link: '/addService' },
    ]
    
    const handleLogoutClick = () => {
        console.log("Logging out...");
        axios.get('http://localhost:3001/logout', { withCredentials: true })
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

export default AdminNaviDrawer;
