import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser'

const salt = 10;
const app = express();
app.use(cookieParser());
app.use(express.json());
const allowedOrigins = [
  'http://localhost:3000',
  'https://65fbd9b8f0a2cf85b70571aa--super-starlight-7d5ece.netlify.app',
  'https://pet-care-83o8yn5y1-iamsarahgins-projects.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["POST", "GET"],
  credentials: true
};

app.use(cors(corsOptions));



app.options('*', cors());

const db = mysql.createConnection({
  host: "bpqdps7jseiq3tz9uhbn-mysql.services.clever-cloud.com",
  user: "u82plvrejz57d3ny",
  password: "6I916ct2X2nGs5orWRXq",
  database: "bpqdps7jseiq3tz9uhbn"
});


// Middleware to verify user authentication
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token is not valid" });
      } else {
        req.userId = decoded.userId;
        req.email = decoded.email;
        req.role = decoded.role; 
        req.firstName=decoded.firstName;
        next();
      }
    });
  }
};

app.get('/', verifyUser, (req, res) => {
  return res.json({
    Status: "Success",
    firstName: req.firstName,
    email: req.email,
    userId: req.userId
  });
});

app.get('/auth/status', verifyUser, (req, res) => {
  return res.json({
      status: "Success",
      loggedIn: true,
      firstName: req.firstName,
      email: req.email,
      userId: req.userId,
      role:req.role
  });
});
// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  const userRole = req.role;
  if (userRole === 'admin') {
    return next(); // User is authorized, proceed to the next middleware
  } else {
    return res.status(403).json({ error: 'Unauthorized' }); // User is not authorized
  }
};
// Endpoint to get rejected list (only accessible by admin)
app.get('/rejected/list', verifyUser, verifyAdmin, (req, res) => {
  // Check if the user is an admin
  if (req.role === 'admin') {
    // User is admin, allow access
    res.send('Welcome to rejected list (Admin)');
  } else {
    // User is not admin, deny access
    res.status(403).send('Access Forbidden: You are not an admin.');
  }
});
 // API endpoint to fetch user profile data
app.get('/api/user/profile', verifyUser, (req, res) => {
  const userId = req.userId;
  const getUserQuery = 'SELECT userId, firstName, lastName, email, role FROM users WHERE userId = ?';
  db.query(getUserQuery, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching user profile:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
      }
      const user = results[0];
      res.json(user);
  });
});


 
app.use('/rejected/list', verifyAdmin);




  //API endpoint to create register
app.post('/register', (req, res) => {
    const { firstName, lastName, email, contactNumber, password, confirmPassword } = req.body;
    // Check if the password and confirm password match
    if (password !== confirmPassword) {
        return res.json({ Error: 'Passwords do not match' });
    }
    // Check if the email already exists in the database
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, data) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ error: 'Error checking email' });
        }
        // If email exists, prompt the user to login
        if (data.length > 0) {
            return res.json({ Error: 'Email already exists. Please login.' });
        }
        // If email doesn't exist and passwords match, proceed with registration
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) return res.status(500).json({ Error: 'Error hashing password' });
            const insertUserQuery = 'INSERT INTO users (firstName, lastName, email, contactNumber, password) VALUES (?, ?, ?, ?, ?)';
            db.query(insertUserQuery, [firstName, lastName, email,contactNumber, hash], (err, result) => {
                if (err) {
                    console.error('Error inserting user data:', err);
                    return res.status(500).json({ Error: 'Error inserting user data' });
                }
                return res.json({ Status: 'Success', Message: 'User registered successfully' });
            });
        });
    });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email=?';
  db.query(sql, [email], (err, data) => {
      if (err) return res.json({ Error: "Login error in server" });
      if (data.length > 0) {
          bcrypt.compare(password.toString(), data[0].password, (err, response) => {
              if (err) return res.json({ Error: "Password compare error" });
              if (response) {
                  const userId = data[0].userId;
                  const firstName = data[0].firstName;
                  const email = data[0].email;
                  const role = data[0].role; // Include user role
                  // Generate token
                  // After successful login and generating token
                  const token = jwt.sign({ userId, firstName, email, role }, "jwt-secret-key", { expiresIn: '1d' });
                  // Set token in cookie
                  res.cookie("token", token, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 }); // 1 day expiry
                  return res.json({ Status: "Success", role: role }); 
              } else {
                  return res.json({ Error: "Password not matched" });
              }
          });
      } else {
          return res.json({ Error: "No email existed" });
      }
  });
});



app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});

app.get('/api/currentUserLoginId', verifyUser, (req, res) => {
    return res.json({ userId: req.userId });
});

app.get('/api/currentUserEmail', verifyUser, (req, res) => {
    return res.json({ email: req.email });
});


// API endpoint to create a booking
app.post('/bookings', verifyUser, (req, res) => {
  const { petName, petId, breed, age, color, serviceId, date, time, symptoms } = req.body;
  const userId = req.userId; 
  const email = req.email; 
  const insertBookingQuery = 'INSERT INTO booking (petName, petId, breed, age, color, serviceId, date, time, symptoms, userId, userEmail, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const status = 'pending'; 
  db.query(insertBookingQuery, [petName, petId, breed, age, color, serviceId, date, time, symptoms, userId, email, status], (err, result) => {
    if (err) {
      console.error('Error creating booking:', err);
      return res.status(500).json({ error: 'Error creating booking' });
    }
    return res.json({ status: 'Success', bookingId: result.insertId });
  });
});




// API endpoint to get bookings
app.get('/bookings', verifyUser, (req, res) => {
  const userId = req.userId; 
  const getBookingsQuery = `
  SELECT booking.*, users.email AS userEmail
  FROM booking 
  INNER JOIN users ON booking.userId = users.userId 
  WHERE booking.userId = ?`;
  db.query(getBookingsQuery, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching bookings:', err);
          return res.status(500).json({ error: 'Error fetching bookings' });
      }
      return res.json(results);
  });
});


// API endpoint to check if the user has existing bookings for the selected date
app.get('/existingBookings', verifyUser, (req, res) => {
  const { userId, date } = req.query; // Assuming userId and date are passed as query parameters

  // Query to check if there are existing bookings for the user and date
  const checkExistingBookingsQuery = `
    SELECT * FROM booking
    WHERE userId = ? AND date = ?`;

  db.query(checkExistingBookingsQuery, [userId, date], (err, results) => {
    if (err) {
      console.error('Error checking existing bookings:', err);
      return res.status(500).json({ error: 'Error checking existing bookings' });
    }

    // If there are no bookings for the user and date, return false, otherwise return true
    const hasExistingBookings = results.length > 0;
    return res.json({ hasExistingBookings });
  });
});

  
  // API endpoint to get pet types
  app.get('/petTypes', (req, res) => {
    const getPetTypesQuery = 'SELECT * FROM pet';
    db.query(getPetTypesQuery, (err, results) => {
      if (err) {
        console.error('Error fetching pet types:', err);
        return res.status(500).json({ error: 'Error fetching pet types' });
      }
      return res.json(results);
    });
  });
  
  
 //INQUIRE PAGE 
// API endpoint to create inquires
  app.post('/inquiries', (req, res) => {
    const { inquire, description, message, userId, userEmail } = req.body;
    const insertInquiryQuery = 'INSERT INTO inquiries (inquire, description, message, userId, userEmail) VALUES (?, ?, ?, ?, ?)';
    db.query(insertInquiryQuery, [inquire, description, message, userId, userEmail], (err, result) => {
      if (err) {
        console.error('Error inserting inquiry data:', err);
        return res.status(500).json({ error: 'Error inserting inquiry data' });
      }
  
      return res.json({ status: 'Success', message: 'Inquiry submitted successfully' });
    });
  });
  


// API Endpoint to fetch all pending bookings with user details
app.get('/api/bookings/pending', verifyUser, verifyAdmin, (req, res) => {
  const query = `
    SELECT b.*, u.firstName, u.lastName, u.email 
    FROM booking b
    JOIN users u ON b.userId = u.userId
    WHERE b.status = ?`;
  db.query(query, ['pending'], (err, results) => {
      if (err) {
          console.error('Error fetching pending bookings:', err);
          return res.status(500).json({ error: 'Error fetching pending bookings' });
      }
      res.json(results);
  });
});



// API Endpoint to approve a booking
app.post('/api/bookings/approve', verifyUser, verifyAdmin, (req, res) => {
  const { bookingId } = req.body;
  const query = 'UPDATE booking SET status = ? WHERE bookingId = ?';
  db.query(query, ['approved', bookingId], (err, result) => {
      if (err) {
          console.error('Error updating booking status:', err);
          return res.status(500).json({ error: 'Error updating booking status' });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Booking not found' });
      }
      res.json({ message: 'Booking status updated to approved' });
  });
});

// API Endpoint to reject a booking
app.post('/api/bookings/reject', verifyUser, verifyAdmin, (req, res) => {
  const { bookingId } = req.body;
  const query = 'UPDATE booking SET status = ? WHERE bookingId = ?';
  db.query(query, ['rejected', bookingId], (err, result) => {
      if (err) {
          console.error('Error updating booking status:', err);
          return res.status(500).json({ error: 'Error updating booking status' });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Booking not found' });
      }
      res.json({ message: 'Booking status updated to rejected' });
  });
});


// API endpoint to fetch approved bookings
app.get('/api/bookings/approved', verifyUser, verifyAdmin, (req, res) => {
  const query = 'SELECT Booking.*, users.firstName, users.lastName, users.email FROM booking INNER JOIN users ON Booking.userId = users.userId WHERE Booking.status = ?';
  db.query(query, ['approved'], (err, results) => {
      if (err) {
          console.error('Error fetching approved bookings:', err);
          return res.status(500).json({ error: 'Error fetching approved bookings' });
      }
      res.json(results);
  });
});

// API endpoint to fetch rejected bookings
app.get('/api/bookings/rejected', verifyUser, verifyAdmin, (req, res) => {
  const query = 'SELECT Booking.*, users.firstName, users.lastName, users.email FROM booking INNER JOIN users ON Booking.userId = users.userId WHERE Booking.status = ?';
  db.query(query, ['rejected'], (err, results) => {
      if (err) {
          console.error('Error fetching rejected bookings:', err);
          return res.status(500).json({ error: 'Error fetching rejected bookings' });
      }
      res.json(results);
  });
});


// API Endpoint to update the status of a booking
app.post('/api/bookings/update-status/:bookingId/:newStatus', verifyUser, verifyAdmin, (req, res) => {
  const { bookingId, newStatus } = req.params;
  const validStatuses = ['pending', 'approved', 'rejected'];

  // Validate newStatus
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  // Update the status in the database
  const query = 'UPDATE booking SET status = ? WHERE bookingId = ?';
  db.query(query, [newStatus, bookingId], (err, result) => {
    if (err) {
      console.error('Error updating booking status:', err);
      return res.status(500).json({ error: 'Error updating booking status' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: `Booking status updated to ${newStatus}` });
  });
});

//HOMEPAGE
app.get('/homepage', (req, res) => {
  const query = "SELECT * FROM homepage";
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//ABOUT PAGE
app.get('/aboutpage', (req, res) => {
  const query = "SELECT * FROM aboutpage";
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//SERVICE PAGE
app.get('/servicepage', (req, res) => {
  const query = "SELECT * FROM servicespage";
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//HAPPYFURPARENTS PAGE
app.get('/api/happyFurparentsPage', (req, res) => {
  const sql = `SELECT * FROM happyfurparentspage`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

//CONTACT US PAGE
// POST endpoint to add a new contact
app.post('/contacts', (req, res) => {
  const { firstName, lastName, emailAddress, mobileNumber, inquireAbout, moreDetails } = req.body;
  if (!firstName || !lastName || !emailAddress || !mobileNumber || !inquireAbout) {
    return res.status(400).json({ error: 'Incomplete data provided' });
  }
  const query = 'INSERT INTO contactUs (firstName, lastName, emailAddress, mobileNumber, inquireAbout, moreDetails) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [firstName, lastName, emailAddress, mobileNumber, inquireAbout, moreDetails], (err, results) => {
    if (err) {
      console.error('Error adding contact:', err);
      return res.status(500).json({ error: 'Error adding contact' });
    }
    res.status(201).json({ message: 'Contact added successfully!' });
  });
});

//LOGIN PAGE
// Create API endpoint to fetch data from loginpageandregisterpage table
app.get('/loginpageandregisterpage', (req, res) => {
  const query = 'SELECT * FROM loginpageandregisterpage';
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//NAVIGATION BAR
app.get('/navigation', (req, res) => {
  const query = "SELECT * FROM navigation_bar";
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//USER NAVIGATION BAR
app.get('/user_navigation', (req, res) => {
  const query = "SELECT * FROM user_navigation_bar";
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});


//ADMIN NAVIGATION BAR
app.get('/admin_navigation', (req, res) => {
  const query = "SELECT * FROM admin_navigation_bar";
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//FOOTER
app.get('/footer', (req, res) => {
  const query = "SELECT * FROM footer";
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});


//CALENDAR TIMESLOT FOR MAKE A BOOKING 
app.get('/timeSlots', (req, res) => {
  const { date } = req.query;
  const getSlotsQuery = 'SELECT startTime, endTime FROM time_slots WHERE date = ? AND availability = "available"';
  console.log("SQL Query:", getSlotsQuery);
  db.query(getSlotsQuery, [date], (err, results) => {
      if (err) {
          console.error('Error fetching time slots:', err);
          return res.status(500).json({ error: 'Error fetching time slots' });
      }
      console.log("Fetched time slots:", results);
      res.json(results);
  });
});


// Backend (API endpoint to book a time slot)
app.post('/bookTimeSlot', (req, res) => {
  const { date, time, userId, userEmail } = req.body;

  // Fetch booking details including userId and userEmail
  const fetchBookingQuery = 'SELECT * FROM booking WHERE date = ? AND time = ?';
  db.query(fetchBookingQuery, [date, time], (err, bookings) => {
      if (err) {
          console.error('Error fetching booking details:', err);
          return res.status(500).json({ error: 'Error fetching booking details' });
      }

      // If booking details are found
      if (bookings.length > 0) {
          const { userId, userEmail } = bookings[0];

          // Check if the time slot is available
          const checkAvailabilityQuery = 'SELECT * FROM time_slots WHERE date = ? AND startTime = ? AND availability = "available"';
          db.query(checkAvailabilityQuery, [date, time], (err, results) => {
              if (err) {
                  console.error('Error checking time slot availability:', err);
                  return res.status(500).json({ error: 'Error checking time slot availability' });
              }

              // If the time slot is available, book it
              if (results.length > 0) {
                  const slotId = results[0].slotId;
                  const updateSlotQuery = 'UPDATE time_slots SET availability = "booked", userId = ?, userEmail = ? WHERE slotId = ?';
                  db.query(updateSlotQuery, [userId, userEmail, slotId], (err, result) => {
                      if (err) {
                          console.error('Error booking time slot:', err);
                          return res.status(500).json({ error: 'Error booking time slot' });
                      }
                      return res.json({ message: 'Time slot booked successfully' });
                  });
              } else {
                  // If the time slot is not available, return an error
                  return res.status(400).json({ error: 'Time slot is not available' });
              }
          });
      } else {
          // If no booking is found for the specified date and time
          return res.status(400).json({ error: 'No booking found for the specified date and time' });
      }
  });
});


//CRUD OPEARTION FOR SERVICE TABLE 

// API endpoint to get service types
// API endpoint to create a new service
app.post('/services', (req, res) => {
  const { serviceType } = req.body; // Corrected from petType to serviceType
  const sql = `INSERT INTO services (serviceType) VALUES (?)`;
  db.query(sql, [serviceType], (err, result) => {
    if (err) {
      console.error('Error creating service:', err);
      return res.status(500).json({ error: 'Failed to create service' });
    }
    console.log('Service created:', result);
    return res.status(201).json({ message: 'Service created successfully' });
  });
});

app.get('/serviceTypes', (req, res) => {
  const getServiceTypesQuery = 'SELECT * FROM services';
  db.query(getServiceTypesQuery, (err, results) => {
    if (err) {
      console.error('Error fetching service types:', err);
      return res.status(500).json({ error: 'Error fetching service types' });
    }
    return res.json(results);
  });
});


// Update a service by serviceId
app.put('/service/:serviceId', (req, res) => {
  const { serviceId } = req.params;
  const { serviceType } = req.body;
  const sql = `UPDATE services SET serviceType = ? WHERE serviceId = ?`;
  db.query(sql, [serviceType, serviceId], (err, result) => {
    if (err) throw err;
    console.log('Service updated:', result);
    res.send('Service updated successfully');
  });
});

// Delete a service by serviceId
app.delete('/service/:serviceId', (req, res) => {
  const { serviceId } = req.params;
  const sql = `DELETE FROM services WHERE serviceId = ?`;
  db.query(sql, [serviceId], (err, result) => {
    if (err) throw err;
    console.log('Service deleted:', result);
    res.send('Service deleted successfully');
  });
});



//CRUD OPEARTION FOR PET TABLE 

// Create a new pet
app.post('/api/pet', (req, res) => {
  const { petType } = req.body;
  const sql = `INSERT INTO pet (petType) VALUES (?)`;
  db.query(sql, [petType], (err, result) => {
    if (err) throw err;
    console.log('Pet created:', result);
    res.send('Pet created successfully');
  });
});

// Read all pets
app.get('/api/pet', (req, res) => {
  const sql = `SELECT * FROM pet`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Update a pet by petId
app.put('/api/pet/:petId', (req, res) => {
  const { petId } = req.params;
  const { petType } = req.body;
  const sql = `UPDATE pet SET petType = ? WHERE petId = ?`;
  db.query(sql, [petType, petId], (err, result) => {
    if (err) throw err;
    console.log('Pet updated:', result);
    res.send('Pet updated successfully');
  });
});

// Delete a pet by petId
app.delete('/api/pet/:petId', (req, res) => {
  const { petId } = req.params;
  const sql = `DELETE FROM pet WHERE petId = ?`;
  db.query(sql, [petId], (err, result) => {
    if (err) throw err;
    console.log('Pet deleted:', result);
    res.send('Pet deleted successfully');
  });
});



app.listen(3001,()=>{
    console.log('Server is running...')
})