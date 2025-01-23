const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Include Nodemailer for sending emails
const db = require('./db'); // Import the db.js file
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000; // You can change this if you like

const corsOptions = {
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 204 // For older browsers
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const JWT_SECRET = 'EHRIdaho2024!';
const JWT_EXPIRATION = '1h'; // Token expiration

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;  // Attach decoded user data to the request object
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'img/'); // Store in the img directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid name collisions
    }
});

const upload = multer({ storage: storage });

// Test route
app.get('/', (req, res) => {
    res.send('API is working!');
});

// Validate User Login (POST)
app.post('/validate-user-login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    db.validateUser(username, password, (err, valid) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while logging in.' });
        }

        if (!valid) {
            return res.status(404).json({ message: 'Invalid username and/or password.' });
        }

        // if account_type is patient, append patient_id to valid
        if (valid.account_type === 'patient') {
            db.findPatientIdByEmail(valid.email, (err, patient_id) => {
                if (err) {
                    return res.status(405).json({ error: 'Email is not attached to a patient.' });
                }

                valid.patient_id = patient_id;      // append to valid

                // user is valid
                const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

                res.cookie('token', token, {
                    httpOnly: true,  // Can't be accessed by JavaScript
                    secure: process.env.NODE_ENV === 'production', // Only set over HTTPS in production
                    sameSite: 'Strict',  // Prevent CSRF attacks
                    maxAge: 1000 * 60 * 60 // 1 hour expiration
                });
                
                res.json({ valid });
            });
        }
        else {
            // user is valid
            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

            res.cookie('token', token, {
                httpOnly: true,  // Can't be accessed by JavaScript
                secure: process.env.NODE_ENV === 'production', // Only set over HTTPS in production
                sameSite: 'Strict',  // Prevent CSRF attacks
                maxAge: 1000 * 60 * 60 // 1 hour expiration
            });

            res.json({ valid });
        }
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.send('Logged out successfully.');
});

// Add new patient route (POST)
app.post('/add-patient', authenticateJWT, (req, res) => {
    const { firstname, middlename, lastname, dob, address, city, state, zip_code, phone_number, email, ssn } = req.body;

    if (!firstname || !lastname || !dob || !address || !city || !state || !zip_code || !phone_number || !email || !ssn) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    db.isExistingEmail(email, (err) => {
        if (err) {
            return res.status(304).json({ error: 'Email is already associated with a patient.' });
        }

        db.isExistingSSN(ssn, (err) => {
            if (err) {
                return res.status(305).json({ error: 'SSN is already associated with a patient.' });
            }
    
            db.addNewPatient(firstname, middlename, lastname, dob, address, city, state, zip_code, phone_number, email, ssn, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'There was an error adding the patient.' });
                }
            });
            res.json({ message: 'Patient added successfully' });
        });
    });
});

app.post('/add-user', (req, res) => {
    const { account_type, firstName, lastName, email, password } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    db.isExistingEmail(email, (err) => {
        if (err) {
            return res.status(305).json({ error: 'Email is already associated with an account.' });
        }

        db.addUser(account_type, firstName, lastName, email, password, (err) => {
            if (err) {
                return res.status(500).json({ error: 'There was an error adding the user.' });
            }
        });
        res.json({ message: 'User added successfully' });
    });
});

app.post('/add-patient-emergency-contacts', (req, res) => {
    const { patient_id, rel, name, phone } = req.body;

    if (!patient_id || !rel || !name || !phone) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    db.addPatientEmergencyContacts(patient_id, rel, name, phone);
    res.json({ message: 'Patient Emergency Contacts added successfully' });
});

app.post('/add-patient-primary-care-providers', (req, res) => {
    const { patient_id, name, phone } = req.body;

    if (!patient_id || !name || !phone) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    db.addPatientPrimaryCareProviders(patient_id, name, phone);
    res.json({ message: 'Patient Primary Care Providers added successfully' });
});

// Add patient insurance route (POST)
app.post('/add-patient-insurance', (req, res) => {
    const { patient_id, insurance_provider, policy_number, group_number, policy_holders_name } = req.body;

    if (!patient_id || !insurance_provider || !policy_number || !group_number || !policy_holders_name) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    db.addPatientInsurance(patient_id, insurance_provider, policy_number, group_number, policy_holders_name);
    res.json({ message: 'Insurance added successfully' });
});

// Add patient medical history route (POST)
app.post('/add-patient-medical-history', (req, res) => {
    const { patient_id, notes, last_updated_by } = req.body;
   
    const date_created = new Date().toISOString();
    const last_updated_date = new Date().toISOString();
  
    if (!patient_id || !notes) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    db.addPatientMedicalHistory(patient_id, notes, date_created, last_updated_date, last_updated_by);
    res.json({ message: 'Medical History added successfully' });
});

app.post('/add-patient-medications', (req, res) => {
    const { patient_id, medication, dosage, frequency, last_updated_by } = req.body;
    
    const date_created = new Date().toISOString();
    const last_updated_date = new Date().toISOString();

    if (!patient_id || !medication || !dosage || !frequency) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    db.addPatientMedications(patient_id, medication, dosage, frequency, date_created, last_updated_date, last_updated_by);
    res.json({ message: 'Medication added successfully' });
});

app.post('/add-patient-allergy', (req, res) => {
    const { patient_id, allergy, last_updated_by } = req.body;
    
    const date_created = new Date().toISOString();
    const last_updated_date = new Date().toISOString();

    if (!patient_id || !allergy) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }
    db.addPatientAllergies(patient_id, allergy, date_created, last_updated_date, last_updated_by);
    res.json({ message: 'Allergy added successfully' });
});

app.post('/save-note', async (req, res) => {
    const { patientId, note, practitionerId } = req.body;

    // Create timestamps for the note
    const dateCreated = new Date().toISOString();
    const lastUpdatedDate = new Date().toISOString();

    try {
        // Call the function to add the note
        await db.addPatientNote(patientId, dateCreated, practitionerId, note, lastUpdatedDate, practitionerId);
        res.status(200).json({ message: 'Note saved successfully!' });
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.post('/get-all-users', (req, res) => {
    db.getAllUsers((err, users) => {
        if (err) {
            console.error('Error retrieving notes:', err);
            return res.status(500).json({ error: 'Failed to retrieve notes' });
        }

        res.json({ users });
    });
});

app.post('/get-patient-notes', (req, res) => {
    const { patientId } = req.body;

    db.getPatientNotes(patientId, (err, notes) => {
        if (err) {
            console.error('Error retrieving notes:', err);
            return res.status(500).json({ error: 'Failed to retrieve notes' });
        }

        // Log notes to verify the full data being sent
        //console.log('Notes to send:', notes);

        // Respond with full note data (not just the note text)
        res.json({ notes });
    });
});

app.post('/get-patient-emergency-contacts', (req, res) => {
    const { patientId } = req.body;

    db.getPatientEmergencyContacts(patientId, (err, ec) => {
        if (err) {
            console.error('Error retrieving emergency contacts:', err);
            return res.status(500).json({ error: 'Failed to retrieve emergency contacts' });
        }

        // Log emergency contacts to verify the full data being sent
        console.log('Emergency Contacts to send:', ec);
        
        res.json({ ec });   // respond with all data
    });
});

app.post('/get-patient-primary-care-providers', (req, res) => {
    const { patientId } = req.body;

    db.getPatientPrimaryCareProviders(patientId, (err, pcp) => {
        if (err) {
            console.error('Error retrieving primary care providers:', err);
            return res.status(500).json({ error: 'Failed to retrieve primary care providers' });
        }

        // Log primary care providers to verify the full data being sent
        console.log('Primary Care Providers to send:', pcp);
        
        res.json({ pcp });   // respond with all data
    });
});

app.post('/get-patient-insurance', (req, res) => {
    const { patientId } = req.body;

    db.getPatientInsurance(patientId, (err, insurance) => {
        if (err) {
            console.error('Error retrieving insurance:', err);
            return res.status(500).json({ error: 'Failed to retrieve insurance' });
        }

        // Log insurance to verify the full data being sent
        console.log('Insurance to send:', insurance);
        
        res.json({ insurance });   // respond with all data
    });
});

app.post('/get-patient-medical-history', (req, res) => {
    const { patientId } = req.body;

    db.getPatientMedicalHistory(patientId, (err, mh) => {
        if (err) {
            console.error('Error retrieving medical history:', err);
            return res.status(500).json({ error: 'Failed to retrieve medical history' });
        }

        // Log medical history to verify the full data being sent
        console.log('Medical History to send:', mh);
        
        res.json({ mh });   // respond with all data
    });
});

app.post('/get-patient-medications', (req, res) => {
    const { patientId } = req.body;

    db.getPatientMedications(patientId, (err, m) => {
        if (err) {
            console.error('Error retrieving medications:', err);
            return res.status(500).json({ error: 'Failed to retrieve medications' });
        }

        // Log medications to verify the full data being sent
        console.log('Medications to send:', m);
        
        res.json({ m });   // respond with all data
    });
});

app.post('/get-patient-allergies', (req, res) => {
    const { patientId } = req.body;
    
    db.getPatientAllergies(patientId, (err, a) => {
        if (err) {
            console.error('Error retrieving allergies:', err);
            return res.status(500).json({ error: 'Failed to retrieve allergies' });
        }

        // Log allergies to verify the full data being sent
        console.log('Allergies to send:', a);
        
        res.json({ a });   // respond with all data
    });
});

// Search patient route (POST)
app.post('/search-patient', authenticateJWT, (req, res) => {
    const { dob, lastname } = req.body;

    db.searchPatient(dob, lastname, (err, patients) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (patients.length === 0) {
            return res.status(404).json({ message: 'No patients found' });
        }
        res.json({ patients });
    });
});

app.post('/user-details-by-id', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID must be provided' });
    }

    db.getUserById(id, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while fetching user details.' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    });
});

// Fetch patient details by ID route (POST)
app.post('/patient-details', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Patient ID must be provided' });
    }

    db.getPatientById(id, (err, patient) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while fetching patient details.' });
        }

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json({ patient });
    });
});

app.put('/update-user/:id', async (req, res) => {
    const { id } = req.params;
    const { account_type, first_name, last_name, email } = req.body;

    try {
        await db.updateUser(id, account_type, first_name, last_name, email);
        res.json({ message: 'User details updated successfully.' });
    } catch (error) {
        console.error('Failed to update user details:', error);
        res.status(500).json({ error: 'Failed to update user details.' });
    }
});

app.put('/pending-update-patient/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, middle_name, last_name, date_of_birth, address, city, state, zip_code, phone_number, email, ssn } = req.body;

    try {
        await db.pendingUpdatePatient(id, first_name, middle_name, last_name, date_of_birth, address, city, state, zip_code, phone_number, email, ssn);
        res.json({ message: 'Patient details added to pending list successfully.' });
    } catch (error) {
        console.error('Failed to add pending updated patient details:', error);
        res.status(500).json({ error: 'Failed to add pending updated patient details.' });
    }
});

app.put('/update-patient/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, middle_name, last_name, date_of_birth, address, city, state, zip_code, phone_number, email, ssn } = req.body;

    try {
        await db.updatePatient(id, first_name, middle_name, last_name, date_of_birth, address, city, state, zip_code, phone_number, email, ssn);
        res.json({ message: 'Patient details updated successfully.' });
    } catch (error) {
        console.error('Failed to update patient details:', error);
        res.status(500).json({ error: 'Failed to update patient details.' });
    }
});


app.post('/user-details', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    db.getUserInfo(email, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while fetching user details.' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    });
});

// Reset password route (POST)
app.post('/reset-password', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    // Setup the Nodemailer transporter for Zimbra
    const transporter = nodemailer.createTransport({
        host: 'mail.sbwalp.com',
        port: 587,
        secure: false,
        auth: {
            user: 'hunterw@sbwalp.com',
            pass: 'Broncos24',
        },
        tls: {
            rejectUnauthorized: false, // Bypass SSL certificate validation for development
        },
    });

    const mailOptions = {
        from: 'hunterw@sbwalp.com',
        to: email,
        subject: 'Password Reset Request',
        text: 'Here is a link to reset your password:\n\n[reset link goes here]',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error); // Log the full error
            return res.status(500).json({ message: 'Error sending email', error: error.toString() });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    });
});

// Express route for updating user profile
// Express route for updating user profile
app.post('/update-profile', upload.single('profile-picture'), async (req, res) => {
    const { account_type, first_name, last_name, email, password } = req.body; // Extract required fields
    const profilePicturePath = req.file ? `/img/${req.file.filename}` : null; // Save the path

    // Log the incoming request for debugging
    console.log('Received update request:', { email, file: req.file });

    if (!email) {
        return res.status(400).send("Email is required"); // Validate email
    }

    try {
        // Call the updateUserProfile function using email
        await db.updateUserProfile(email, account_type, first_name, last_name, email, password, profilePicturePath);
        res.send("Profile updated successfully");
    } catch (error) {
        console.error('Failed to update user profile:', error);
        res.status(500).send("Error updating profile");
    }
});

app.put('/update-note', (req, res) => {
    const { noteId, patientId, note, practitionerId } = req.body;
    
    // Use the imported db module's updateNote function
    db.updateNote(noteId, note, practitionerId, (err, updatedNote) => {
        if (err) {
            console.log("Server broken");
            return res.status(500).json({ error: 'Error updating note' });
        }
        
        res.json({
            message: 'Note updated successfully',
            updatedNote 
        });
    });
});

app.put('/toggle-archive', async (req, res) => {
    const { noteId } = req.body;

    if (!noteId) {
        return res.status(400).json({ message: 'Note ID is required' });
    }

    try {
        await db.toggleArchive(noteId); // Assuming this function handles the update
        return res.status(200).json({ message: 'Note archived status updated successfully' });
    } catch (error) {
        console.error('Error archiving note:', error);
        return res.status(500).json({ message: 'Error archiving note' });
    }
});

app.get('/retrieve-security-questions/:id', (req, res) => {
    const { id } = req.params;

    db.getUserSecurityQuestions(id, (err, data) => {
        if (err) {
            console.error('Error retrieving security questions:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve security questions.' });
        }
        if (!data) {
            return res.status(404).json({ message: 'Security questions not found for this user.' });
        }
        res.json({ securityQuestions: data });
    });
});


app.put('/user-security-questions/:id', (req, res) => {
    const { id } = req.params; // Extract userId from the route
    const { question_1, answer_1, question_2, answer_2, question_3, answer_3 } = req.body;

    // Validate input
    if (!question_1 || !answer_1 || !question_2 || !answer_2 || !question_3 || !answer_3) {
        return res.status(400).json({ message: 'All questions and answers are required.' });
    }

    const securityQuestionsAndAnswers = { question_1, answer_1, question_2, answer_2, question_3, answer_3 };

    db.updateUserSecurityQuestions(id, securityQuestionsAndAnswers, (err) => {
        if (err) {
            console.error("Error updating security questions:", err.message);
            return res.status(500).json({ error: 'Failed to update security questions.' });
        }
        res.json({ message: `Security questions updated successfully for user: ${id}` });
    });
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
