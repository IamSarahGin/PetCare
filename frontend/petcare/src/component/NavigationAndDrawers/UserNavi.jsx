import { useState, useEffect } from "react";
import { AppBar, Toolbar, Tabs, Tab, Typography, Box, Button, CircularProgress, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import UserNaviDrawer from './UserNaviDrawer';

const UserNavi = () => {
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();
    const [userNavData, setUserNavData] = useState({
        menu_item_1: '',
        menu_item_2: '',
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
        const fetchUserNavData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/user_navigation');
                setUserNavData(response.data[0]);
            } catch (error) {
                console.error('Error fetching navigation data:', error);
            }
        };

        fetchUserNavData();
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/api/currentUserEmail', { withCredentials: true })
            .then(response => {
                setUserEmail(response.data.email);
            })
            .catch(error => {
                console.error('Error fetching user email: ', error);
            });
    }, []);

    const handleLogout = () => {
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
        <>
            <AppBar position="static" sx={{ background: "#8a1a00" ,height:'50px'}}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <IconButton sx={{ color: 'white', fontSize: '1.5rem' }}>
                            <FontAwesomeIcon icon={faEnvelope} />
                        </IconButton>
                        <span style={{ fontSize: '1rem', marginRight: '0.5rem', display: { xs: 'none', sm: 'block' } }}>{userNavData.menu_item_1}</span>
                        <IconButton sx={{ color: 'white', fontSize: '1.5rem' }}>
                            <FontAwesomeIcon icon={faPhone} />
                        </IconButton>
                        <span style={{ fontSize: '1rem', display: { xs: 'none', sm: 'block' } }}>{userNavData.menu_item_2}</span>         
                    </Typography>
                    {!isMatch && ( // Render the logout button only when not in responsive mode
                    <>
                     <span style={{ fontSize: '1rem', marginRight: '2rem', display: { xs: 'none', sm: 'block' } }}>{userNavData.menu_item_3} {userEmail}  </span>
                        <Button color="inherit" onClick={handleLogout}>
                            {userNavData.menu_item_4}
                        </Button></>
                   
                    )}
                </Toolbar>
            </AppBar>
            <AppBar sx={{ background: "#ededed",  position: 'static', top: '50px', width: '100%' }}>
                <Toolbar>
                    <img src={userNavData.logo_image} className='logo' alt="Logo" style={{ width: '60px', height: '60px', }} />
                    {isMatch ? (
                        <>
                            <UserNaviDrawer userNavData={userNavData} />
                        </>
                    ) : (
                        <>
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
                                    label={userNavData.menu_item_5}
                                    component={Link}
                                    to="/welcome"
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
                                    label={userNavData.menu_item_6}
                                    component={Link}
                                    to="/booking"
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
                                    label={userNavData.menu_item_7}
                                    component={Link}
                                    to="/inquire"
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
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </>
    )
}

export default UserNavi;
