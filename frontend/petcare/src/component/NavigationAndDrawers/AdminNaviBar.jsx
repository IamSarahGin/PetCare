import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Tabs, Tab, Typography, Button, IconButton, useTheme, useMediaQuery, Menu, MenuItem } from '@mui/material';
import AdminNaviDrawer from './AdminNaviDrawer';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import MenuIcon from '@mui/icons-material/Menu';

const AdminNaviBar = ({ isAdmin }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [adminNavData, setAdminNavData] = useState({
        menu_item_1: '',
        menu_item_2: '',
        menu_item_3: '',
        menu_item_4: '',
        menu_item_5: '',
        menu_item_6: '',
        menu_item_7: '',
        logo_image: ''
    });
    const theme = useTheme();
    const isMatch = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminNavData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/admin_navigation');
                setAdminNavData(response.data[0]);
            } catch (error) {
                console.error('Error fetching navigation data:', error);
            }
        };

        fetchAdminNavData();
    }, []);

    useEffect(() => {
        fetchAuthStatus();
    }, []);

    const fetchAuthStatus = async () => {
        try {
            const response = await axios.get('http://localhost:3001/auth/status', { withCredentials: true });
            setLoggedIn(true);
        } catch (error) {
            console.error('Error fetching authentication status:', error);
            setLoggedIn(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:3001/logout', { withCredentials: true });
            setLoggedIn(false);
            // Redirect to the home page after logout
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="admin-navbar-container" >
            <AppBar position="static" sx={{ background: "#8a1a00", height: '50px' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {adminNavData.menu_item_1}
                    </Typography>
                    
                        {!isMatch && (
                            <Button onClick={handleLogout} color="inherit">{adminNavData.menu_item_2}</Button>
                       
                    )}
                </Toolbar>
            </AppBar>
            <AppBar sx={{ background: "#ededed", position: 'static', top: '50px', width: '100%' }}>
                <Toolbar>
                    <img src={adminNavData.logo_image} className='logo' alt="Logo" style={{ width: '60px', height: '60px' }} />
                    {isMatch ? (
                        <>
                            <AdminNaviDrawer adminNavData={adminNavData} />
                        </>
                    ) : (
                        <Tabs
                            sx={{ marginLeft: 'auto' }}
                            textColor="secondary"
                            value={false}
                            TabIndicatorProps={{
                                sx: {
                                    backgroundColor: theme.palette.secondary.light,
                                    height: '3px',
                                }
                            }}
                        >
                            <Tab
                                label={adminNavData.menu_item_3}
                                component={Link}
                                to="/admin/dashboard"
                                sx={{
                                    '&.Mui-selected': {
                                        color: theme.palette.secondary.main,
                                    }, '&:hover': {
                                        color: theme.palette.secondary.light,
                                        transition: 'color 0.3s ease-in-out',
                                    },
                                }}
                            />
                            <Tab
                                label={adminNavData.menu_item_4}
                                component={Link}
                                to="/approved/list"
                                sx={{
                                    '&.Mui-selected': {
                                        color: theme.palette.secondary.main,
                                    }, '&:hover': {
                                        color: theme.palette.secondary.light,
                                        transition: 'color 0.3s ease-in-out',
                                    },
                                }}
                            />
                            <Tab
                                label={adminNavData.menu_item_5}
                                component={Link}
                                to="/rejected/list"
                                sx={{
                                    '&.Mui-selected': {
                                        color: theme.palette.secondary.main,
                                    }, '&:hover': {
                                        color: theme.palette.secondary.light,
                                        transition: 'color 0.3s ease-in-out',
                                    },
                                }}
                            />
                        </Tabs>
                    )}
                    {!isMatch && ( // Render the logout button only when not in responsive mode
                    <>
                    <Dropdown>
                        <Dropdown.Toggle variant="plain" id="dropdown-basic">
                            MAINTENANCE ACTIONS
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="/addPet">{adminNavData.menu_item_6}</Dropdown.Item>
                            <Dropdown.Item href="/addService">{adminNavData.menu_item_7}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </>
                   
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default AdminNaviBar;
