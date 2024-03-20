
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Tabs, Tab, Typography,Box, Button, CircularProgress, useMediaQuery, useTheme,IconButton } from '@mui/material';
import DrawerComponent from './DrawerComponent';
import { Link, useLocation  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
const Navibar = () => {
    const location = useLocation(); 
    const theme = useTheme();
    const isMatch = useMediaQuery(theme.breakpoints.down('md'));
    const [navData, setNavData] = useState({
        menu_item_1: '',
        menu_item_2: '',
        menu_item_3: '',
        menu_item_4: '',
        menu_item_5: '',
        menu_item_6: '',
        menu_item_7: '',
        menu_item_8: '',
        logo_image: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNavData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/navigation');
                setNavData(response.data[0]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching navigation data:', error);
            }
        };

        fetchNavData();
    }, []);
        
    const visibleRoutes = ['/', '/about', '/contact', '/login', '/register', '/bookingVisitor'];

   
    const isVisible = visibleRoutes.includes(location.pathname);

    if (!isVisible) {
        return null; 
    }
    return (
        <div style={{ margin: '0', padding: '0' }}> 
  <AppBar sx={{ background: "#8a1a00", height: '50px', marginBottom: '0' }}> 
    <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ color: 'white', fontSize: '1.5rem' }}> 
                <FontAwesomeIcon icon={faEnvelope} />
            </IconButton>
            <span style={{ fontSize: '1rem', marginRight: '0.5rem', display: { xs: 'none', sm: 'block' } }}>{navData.menu_item_1}</span> {/* Adjust the font size of the text */}
            <IconButton sx={{ color: 'white', fontSize: '1.5rem' }}> 
                <FontAwesomeIcon icon={faPhone} />
            </IconButton>
            <span style={{ fontSize: '1rem', display: { xs: 'none', sm: 'block' } }}>{navData.menu_item_2}</span> {/* Adjust the font size of the text */}
        </Typography>
        
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}> 
            {loading ? (
                <CircularProgress color="secondary" />
            ) : (
                <>
                    <Button component={Link} to="/login" sx={{ color: 'white', backgroundColor: '#8a1a00', marginLeft: '10px' }} color="secondary">{navData.menu_item_3}</Button>
                    <Button component={Link} to="/register" sx={{ color: 'white', backgroundColor: '#8a1a00', marginLeft: '10px' }} color="secondary">{navData.menu_item_4}</Button>
                </>
            )}
        </Box>
    </Toolbar>
</AppBar>


    <AppBar sx={{ background: "#ededed", marginTop: '0', marginBottom: '0', position: 'fixed', top: '50px', width: '100%' }}> {/* Adjusted top to 50px */}
        <Toolbar>
            <img src={navData.logo_image} className='logo' alt="Logo" style={{ width: '60px', height: '60px',}} />
            {isMatch ? (
                <>
                    <DrawerComponent navData={navData} />
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
                            label={navData.menu_item_5}
                            component={Link}
                            to="/"
                            sx={{
                                '&.Mui-selected': {
                                    color: theme.palette.secondary.main, 
                                },'&:hover': {
                                    color: theme.palette.secondary.light,
                                    transition: 'color 0.3s ease-in-out', 
                                },
                            }}
                        />
                        <Tab
                            label={navData.menu_item_6}
                            component={Link}
                            to="/about"
                            sx={{
                                '&.Mui-selected': {
                                    color: theme.palette.secondary.main,
                                },'&:hover': {
                                    color: theme.palette.secondary.light,
                                    transition: 'color 0.3s ease-in-out', 
                                },
                            }}
                        />
                        <Tab
                            label={navData.menu_item_7}
                            component={Link}
                            to="/bookingVisitor"
                            sx={{
                                '&.Mui-selected': {
                                    color: theme.palette.secondary.main, 
                                },'&:hover': {
                                    color: theme.palette.secondary.light,
                                    transition: 'color 0.3s ease-in-out', 
                                },
                            }}
                        />
                        <Tab
                            label={navData.menu_item_8}
                            component={Link}
                            to="/contact"
                            sx={{
                                '&.Mui-selected': {
                                    color: theme.palette.secondary.main, 
                                },'&:hover': {
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
</div>
    );
};

export default Navibar;
























// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { AppBar, Toolbar, Tabs, Tab, Typography, Button, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
// import DrawerComponent from './DrawerComponent';
// import { Link,useLocation  } from 'react-router-dom';

// const Navibar = () => {
//     const location = useLocation(); 
//     const theme = useTheme();
//     const isMatch = useMediaQuery(theme.breakpoints.down('md'));
//     const [navData, setNavData] = useState({
//         menu_item_1: '',
//         menu_item_2: '',
//         menu_item_3: '',
//         menu_item_4: '',
//         menu_item_5: '',
//         menu_item_6: '',
//         menu_item_7: '',
//         menu_item_8: '',
//         logo_image: ''
//     });
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchNavData = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3001/navigation');
//                 setNavData(response.data[0]);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching navigation data:', error);
//             }
//         };

//         fetchNavData();
//     }, []);
//         // Array of visible routes
//     const visibleRoutes = ['/', '/about', '/contact', '/login', '/register', '/bookingVisitor'];

//     // Check if current location matches any visible route
//     const isVisible = visibleRoutes.includes(location.pathname);

//     if (!isVisible) {
//         return null; // Don't render the Navibar if current location is not in visibleRoutes
//     }
//     return (
//         <div>
//             <AppBar sx={{ background: "#ededed" }}>
//                 <Toolbar>
//                 <img src={navData.logo_image} className='logo' alt="Logo" style={{ width: '60px', height: '60px',}} />
//                     {isMatch ? (
//                         <>
//                             <DrawerComponent navData={navData} />
//                         </>
//                     ) : (
//                         <>
//                             <Tabs
//     sx={{ marginLeft: 'auto' }}
//     textColor="secondary"
//     value={false}
//     TabIndicatorProps={{
//         sx: {
//             backgroundColor: theme.palette.secondary.light, // Change to the color you prefer
//             height: '3px', // Adjust the height of the indicator
//         }
//     }}
// >
//     <Tab
//         label={navData.menu_item_5}
//         component={Link}
//         to="/"
//         sx={{
//             '&.Mui-selected': {
//                 color: theme.palette.secondary.main, // Change to the color you prefer
//             },'&:hover': {
//                 color: theme.palette.secondary.light,
//                 transition: 'color 0.3s ease-in-out', // Transition effect
//             },
//         }}
//     />
//     <Tab
//         label={navData.menu_item_6}
//         component={Link}
//         to="/about"
//         sx={{
//             '&.Mui-selected': {
//                 color: theme.palette.secondary.main, // Change to the color you prefer
//             },'&:hover': {
//                 color: theme.palette.secondary.light,
//                 transition: 'color 0.3s ease-in-out', // Transition effect
//             },
//         }}
//     />
//     <Tab
//         label={navData.menu_item_7}
//         component={Link}
//         to="/bookingVisitor"
//         sx={{
//             '&.Mui-selected': {
//                 color: theme.palette.secondary.main, // Change to the color you prefer
//             },'&:hover': {
//                 color: theme.palette.secondary.light,
//                 transition: 'color 0.3s ease-in-out', // Transition effect
//             },
//         }}
//     />
//     <Tab
//         label={navData.menu_item_8}
//         component={Link}
//         to="/contact"
//         sx={{
//             '&.Mui-selected': {
//                 color: theme.palette.secondary.main, // Change to the color you prefer
//             },'&:hover': {
//                 color: theme.palette.secondary.light,
//                 transition: 'color 0.3s ease-in-out', // Transition effect
//             },
//         }}
//     />
// </Tabs>


//                             {loading ? (
//                                 <CircularProgress color="secondary" />
//                             ) : (
//                                 <>
//                                     <Button component={Link} to="/login" sx={{ marginLeft: "auto" }} color="secondary">{navData.menu_item_3}</Button>
//                                     <Button component={Link} to="/register" sx={{ marginLeft: "10px" }} color="secondary">{navData.menu_item_4}</Button>
//                                 </>
//                             )}
//                         </>
//                     )}
//                 </Toolbar>
//             </AppBar>
//         </div>
//     );
// };

// export default Navibar;
