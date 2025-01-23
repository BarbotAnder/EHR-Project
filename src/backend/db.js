const sqlite3 = require("sqlite3").verbose();
const fs = require('fs'); // Import fs for logging

const db = new sqlite3.Database("./mydb.db", (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Connected to Database!");
});

// Create tables if they don't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    account_type VARCHAR(64) NOT NULL,
    first_name VARCHAR(256) NOT NULL,
    last_name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    profile_picture VARCHAR(256) -- New column for storing the image path
)`);

db.run(`CREATE TABLE IF NOT EXISTS user_security_questions (
    user_id INTEGER NOT NULL PRIMARY KEY,
    question_1 TEXT NOT NULL,
    answer_1 TEXT NOT NULL,
    question_2 TEXT NOT NULL,
    answer_2 TEXT NOT NULL,
    question_3 TEXT NOT NULL,
    answer_3 TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
)`);


db.run(`CREATE TABLE IF NOT EXISTS patient_info (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(256) NOT NULL,
    middle_name VARCHAR(256),
    last_name VARCHAR(256) NOT NULL,
    date_of_birth DATE NOT NULL,
    address VARCHAR(256) NOT NULL,
    city VARCHAR(256) NOT NULL,
    state VARCHAR(256) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(256) NOT NULL,
    ssn VARCHAR(11) NOT NULL UNIQUE
)`);

db.run(`CREATE TABLE IF NOT EXISTS pending_patient_info (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    first_name VARCHAR(256) NOT NULL,
    middle_name VARCHAR(256),
    last_name VARCHAR(256) NOT NULL,
    date_of_birth DATE NOT NULL,
    address VARCHAR(256) NOT NULL,
    city VARCHAR(256) NOT NULL,
    state VARCHAR(256) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(256) NOT NULL,
    ssn VARCHAR(11) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient_info (id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS patient_emergency_contacts (
    patient_ec_id INTEGER NOT NULL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    contact_relationship VARCHAR(256) NOT NULL,
    contact_name VARCHAR(256) NOT NULL,
    contact_phone VARCHAR(15) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient_info (id)    
)`);

db.run(`CREATE TABLE IF NOT EXISTS patient_primary_care_providers (
    patient_pcp_id INTEGER NOT NULL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    physician_name VARCHAR(256) NOT NULL,
    physician_phone VARCHAR(15) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient_info (id)        
)`);

db.run(`CREATE TABLE IF NOT EXISTS patient_insurance (
    patient_insurance_id INTEGER NOT NULL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    insurance_provider VARCHAR(256) NOT NULL,
    policy_number VARCHAR(256) NOT NULL,
    group_number VARCHAR(256) NOT NULL,
    policy_holders_name VARCHAR(256) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient_info (id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS patient_medical_history (
    patient_med_history INTEGER NOT NULL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    notes VARCHAR(256) NOT NULL,
    date_created DATETIME NOT NULL,
    last_updated_date DATETIME NOT NULL,
    last_updated_by INTEGER,
    FOREIGN KEY (patient_id) REFERENCES patient_info (id),
    FOREIGN KEY (last_updated_by) REFERENCES users (id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS patient_medications (
    patient_meds INTEGER NOT NULL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    medication VARCHAR(256) NOT NULL,
    dosage VARCHAR(64) NOT NULL,
    frequency INTEGER NOT NULL,
    date_created DATETIME NOT NULL,
    last_updated_date DATETIME NOT NULL,
    last_updated_by INTEGER,
    FOREIGN KEY (patient_id) REFERENCES patient_info (id),
    FOREIGN KEY (last_updated_by) REFERENCES users (id)  
)`);

db.run(`CREATE TABLE IF NOT EXISTS patient_allergies (
    patient_allergy_id INTEGER NOT NULL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    allergy VARCHAR(256) NOT NULL,
    date_created DATETIME NOT NULL,
    last_updated_date DATETIME NOT NULL,
    last_updated_by INTEGER,
    FOREIGN KEY (patient_id) REFERENCES patient_info (id)    
)`);

db.run(`CREATE TABLE IF NOT EXISTS patient_notes (
    note_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    date_created DATETIME NOT NULL,
    practitioner_id INTEGER,
    note TEXT NOT NULL,
    last_saved_date DATETIME NOT NULL,
    last_saved_by INTEGER,
    is_archived INTEGER DEFAULT 0,
    FOREIGN KEY (patient_id) REFERENCES patient_info (id),
    FOREIGN KEY (last_saved_by) REFERENCES users (id)
)`);


// Function to retrieve security questions and answers for a user
const getUserSecurityQuestions = (userId, callback) => {
    const query = `
    SELECT question_1, answer_1, question_2, answer_2, question_3, answer_3
    FROM user_security_questions
    WHERE user_id = ?
    `;
    db.get(query, [userId], callback);
};


// Function to update security questions and answers for a user
const updateUserSecurityQuestions = (userId, securityQuestionsAndAnswers, callback) => {
    if (!userId) {
        console.error('userId is undefined!');
        return callback(new Error('userId is undefined!'));
    }

    const query = `
    UPDATE user_security_questions
    SET
    question_1 = ?, answer_1 = ?,
    question_2 = ?, answer_2 = ?,
    question_3 = ?, answer_3 = ?
    WHERE user_id = ?
    `;
    db.run(
        query,
        [
            securityQuestionsAndAnswers.question_1,
           securityQuestionsAndAnswers.answer_1,
           securityQuestionsAndAnswers.question_2,
           securityQuestionsAndAnswers.answer_2,
           securityQuestionsAndAnswers.question_3,
           securityQuestionsAndAnswers.answer_3,
           userId, // This must match the user's ID
        ],
        callback
    );
};

// creates test users upon build
db.get('SELECT email FROM users WHERE email = "admin@test.com"', (err) => {
    if (err) {
        db.run(`INSERT INTO users (account_type, first_name, last_name, email, password)
            VALUES('admin', 'admin', 'test', 'admin@test.com', 'test')`);
    }
});
db.get('SELECT email FROM users WHERE email = "office@test.com"', (err) => {
    if (err) {
        db.run(`INSERT INTO users (account_type, first_name, last_name, email, password)
            VALUES('office', 'office', 'test', 'office@test.com', 'test')`);
    }
});
db.get('SELECT email FROM users WHERE email = "patient@test.com"', (err) => {
    if (err) {
    db.run(`INSERT INTO users (account_type, first_name, last_name, email, password)
        VALUES('patient', 'patient', 'test', 'patient@test.com', 'test')`);
    }
});

// Function to add user with optional profile picture
const addUser = (at, fn, ln, em, ps, profilePicturePath = null) => {
    const query = `INSERT INTO users (account_type, first_name, last_name, email, password, profile_picture)
                   VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(query, [at, fn, ln, em, ps, profilePicturePath], (err) => {
        if (err) {
            console.log("Error inserting user:", err.message);
        } else {
            console.log("User added successfully");

            // Log the user information to a log file
            const logMessage = `User Added: 
                Account Type: ${at},
                First Name: ${fn}, 
                Last Name: ${ln}, 
                Email: ${em}, 
                Password: ${ps}, 
                Profile Picture: ${profilePicturePath || 'None'}\n`;

            fs.appendFile('users_log.txt', logMessage, (err) => {
                if (err) {
                    console.error('Error writing to log file:', err);
                } else {
                    console.log('User info logged successfully.');
                }
            });
        }
    });
};

// Function to check if user email exists
const isExistingEmail = (email, callback) => {
    const query = `SELECT email FROM users WHERE email = ?`;
    
    db.get(query, [email], (err,row) => {
        if (err) {
            return callback(err, null);
        }
        else if (row) {
            return callback(null, true);
        }
        return callback(null, null);
    });
};

// Function to add a new patient
const addNewPatient = (fn, mn, ln, dob, addr, ct, st, zc, pn, em, ssn) => {
    const query = `INSERT INTO patient_info (first_name, middle_name, last_name, date_of_birth, address, city, state, zip_code, phone_number, email, ssn)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [fn, mn, ln, dob, addr, ct, st, zc, pn, em, ssn], (err) => {
        if (err) {
            console.log("Error inserting new patient:", err.message);
        } else {
            console.log("New patient added successfully");

            // Log the patient information to a log file
            const logMessage = `New Patient Added: 
                First Name: ${fn}, 
                Middle Name: ${mn || 'N/A'}, 
                Last Name: ${ln}, 
                DOB: ${dob}, 
                Address: ${addr}, 
                City: ${ct},
                State: ${st},
                Zip Code: ${zc},
                Phone: ${pn},
                Email: ${em},
                SSN: XXX-XX-${ssn.slice(-4)}\n`;

            fs.appendFile('patient_log.txt', logMessage, (err) => {
                if (err) {
                    console.error('Error writing to log file:', err);
                } else {
                    console.log('Patient info logged successfully.');
                }
            });
        }
    });
};

// Function to check if patient ssn exists
const isExistingSSN = (ssn, callback) => {
    const query = `SELECT ssn FROM patient_info WHERE ssn = ?`;
    
    db.get(query, [ssn], (err,row) => {
        if (err) {
            return callback(err, null);
        }
        else if (row) {
            return callback(null, true);
        }
        return callback(null, null);
    });
};

// Function to add patient emergency contacts 
const addPatientEmergencyContacts = (id, rel, name, phone) => {
    const query = `INSERT INTO patient_emergency_contacts (patient_id, contact_relationship, contact_name, contact_phone)
                   VALUES (?, ?, ?, ?)`;

    db.run(query, [id, rel, name, phone], (err) => {
        if (err) {
            console.log("Error inserting patient emergency contact:", err.message);
        } else {
            console.log("Patient Emergency Contact added successfully");
        }
    });
};

// Function to add patient primary care providers
const addPatientPrimaryCareProviders = (id, name, phone) => {
    const query = `INSERT INTO patient_primary_care_providers (patient_id, physician_name, physician_phone)
                   VALUES (?, ?, ?)`;

    db.run(query, [id, name, phone], (err) => {
        if (err) {
            console.log("Error inserting patient primary care provider for patient "+id+":", err.message);
        } else {
            console.log("Patient Primary Care Provider added successfully");
        }
    });
};

// Function to add patient insurance info
const addPatientInsurance = (id, ip, pn, gn, phn) => {
    const query = `INSERT INTO patient_insurance (patient_id, insurance_provider, policy_number, group_number, policy_holders_name)
                   VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [id, ip, pn, gn, phn], (err) => {
        if (err) {
            console.log("Error inserting patient insurance:", err.message);
        } else {
            console.log("Patient Insurance added successfully");
        }
    });
};

// Function to add patient medical history
const addPatientMedicalHistory = (patient_id, notes, date_created, last_updated_date, last_updated_by) => {
    const query = `INSERT INTO patient_medical_history (patient_id, notes, date_created, last_updated_date, last_updated_by)
                    VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [patient_id, notes, date_created, last_updated_date, last_updated_by], (err) => {
        if (err) {
            console.log("Error inserting patient medical history:", err.message);
        } else {
            console.log("Patient medical history added successfully");
        }
    });
};

// Function to add patient medications
const addPatientMedications = (patient_id, medication, dosage, frequency, date_created, last_updated_date, last_updated_by) => {
    const query = `INSERT INTO patient_medications (patient_id, medication, dosage, frequency, date_created, last_updated_date, last_updated_by)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [patient_id, medication, dosage, frequency, date_created, last_updated_date, last_updated_by], (err) => {
        if (err) {
            console.log("Error inserting patient medication:", err.message);
        } else {
            console.log("Patient medication added successfully");
        }
    });
};

// Function to add patient allergies
const addPatientAllergies = (patient_id, allergy, date_created, last_updated_date, last_updated_by) => {
    const query = `INSERT INTO patient_allergies (patient_id, allergy, date_created, last_updated_date, last_updated_by)
                   VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [patient_id, allergy, date_created, last_updated_date, last_updated_by], (err) => {
        if (err) {
            console.log("Error inserting patient allergy:", err.message);
        } else {
            console.log("Patient allergy added successfully");
        }
    });
};

// Function to add patient notes
const addPatientNote = (patient_id, date_created, practitioner_id, note, last_saved_date, last_saved_by) => {
    const query = `INSERT INTO patient_notes (patient_id, date_created, practitioner_id, note, last_saved_date, last_saved_by)
                   VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [patient_id, date_created, practitioner_id, note, last_saved_date, last_saved_by], (err) => {
        if (err) {
            console.log("Error inserting patient note:", err.message);
        } else {
            console.log("Patient note added successfully");
        }
    });
};

const toggleArchive = (noteId) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE patient_notes SET is_archived = NOT is_archived WHERE note_id = ?`;
        db.run(query, [noteId], function(err) {
            if (err) {
                console.log("Error updating archive status for note:", err.message);
                return reject(err); // Reject the promise on error
            } else {
                console.log(`Note with ID ${noteId} archive status toggled successfully`);
                resolve({ affectedRows: this.changes }); // Resolve with the number of affected rows
            }
        });
    });
};

// Function to validate user
const validateUser = (un, pw, callback) => {
    const query = `SELECT * FROM users WHERE email = ?`;         // uses email as username -- can implement username later

    db.get(query, [un], (err, row) => {
        if (!row || pw !== row.password) {
            return callback("Invalid username and/or password", null);
        }
        if (err) {
            return callback(err, null);
        }
        return callback(null, row);
    });
};

// Function to search for a patient by date of birth and last name
const searchPatient = (dob, lastname, callback) => {
    const query = `SELECT * FROM patient_info WHERE date_of_birth = ? AND last_name = ?`;

    db.all(query, [dob, lastname], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        return callback(null, rows);
    });
};

// Function to fetch full patient details by ID
const getPatientById = (id, callback) => {
    const query = `
        SELECT
            p.id,
            p.first_name,
            p.middle_name,
            p.last_name,
            p.date_of_birth,
            p.address,
            p.city,
            p.state,  -- Added the state field here
            p.zip_code,
            p.phone_number,
            p.email,
            p.ssn,
            i.insurance_provider,
            i.policy_number,
            i.group_number,
            i.policy_holders_name,
            m.notes,
            m.date_created,
            m.last_updated_date,
            u.first_name AS last_updated_by
        FROM
            patient_info p
                LEFT JOIN
            patient_insurance i ON p.id = i.patient_id
                LEFT JOIN
            patient_medical_history m ON p.id = m.patient_id
                LEFT JOIN
            users u ON m.last_updated_by = u.id
        WHERE
            p.id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            return callback(err, null); // Pass the error to the callback
        }
        return callback(null, row); // Pass the patient details to the callback
    });
};

// Function to get user information based on the username (email)
const getUserInfo = (email, callback) => {
    const query = `SELECT account_type, first_name, last_name, email FROM users WHERE email = ?`;

    db.get(query, [email], (err, row) => {
        if (err) {
            console.error("Error fetching user:", err.message);
            callback(err, null);  // Return error to the callback
        } else if (row) {
            console.log("User found:", row);
            callback(null, row);  // Return user data to the callback
        } else {
            console.log("No user found with the provided email.");
            callback(null, null);  // Return null if no user is found
        }
    });
};

const getUserById = (id, callback) => {
    const query = `SELECT * FROM users where id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            console.error("Error fetching user:", err.message);
            callback(err, null);  // Return error to the callback
        } else if (row) {
            console.log("User found by id:", row);
            callback(null, row);  // Return user data to the callback
        } else {
            console.log("No user found with the provided id.");
            callback(null, null);  // Return null if no user is found
        }
    });
}

const findPatientIdByEmail = (email, callback) => {
    const query = `SELECT id FROM patient_info WHERE email = ?`;

    db.get(query, [email], (err, patient_id) => {
        if (err) {
            callback(err, null);
        } else if (patient_id) {
            callback(null, patient_id.id);
        }
    });
};

const updateUser = (id, at, fn, ln, em) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE users
                       SET account_type = ?, first_name = ?, last_name = ?, email = ?
                       WHERE id = ?`;
        db.run(query, [at, fn, ln, em, id], function(err) {
            if (err) {
                console.log("Error updating user:", err.message);
                return reject(err); // Reject promise on error
            } else {
                console.log(`User with ID ${id} updated successfully.`);
                return resolve(); // Resolve promise on success
            }
        });
    });
};

// Function to add patient-entered updated patient details to pending_patient_info
const pendingUpdatePatient = (id, fn, mn, ln, dob, addr, ct, st, zc, pn, em, ssn) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO pending_patient_info (patient_id, first_name, middle_name, last_name, date_of_birth, address, city, state, zip_code, phone_number, email, ssn)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.run(query, [id, fn, mn, ln, dob, addr, ct, st, zc, pn, em, ssn], function(err) {
            if (err) {
                console.log("Error updating patient:", err.message);
                return reject(err); // Reject promise on error
            } else {
                console.log(`Patient with ID ${id} added pending updates successfully.`);
                return resolve(); // Resolve promise on success
            }
        });
    });
};

// Function to update patient details
const updatePatient = (id, fn, mn, ln, dob, addr, ct, st, zc, pn, em, ssn) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE patient_info
                       SET first_name = ?, middle_name = ?, last_name = ?,
                           date_of_birth = ?, address = ?, city = ?,
                           state = ?, zip_code = ?, phone_number = ?,
                           email = ?, ssn = ?
                       WHERE id = ?`;

        db.run(query, [fn, mn, ln, dob, addr, ct, st, zc, pn, em, ssn, id], function(err) {
            if (err) {
                console.log("Error updating patient:", err.message);
                return reject(err); // Reject promise on error
            } else {
                console.log(`Patient with ID ${id} updated successfully.`);
                return resolve(); // Resolve promise on success
            }
        });
    });
};

const getAllUsers = (callback) => {
    const query = `SELECT * FROM users`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            if (typeof callback === 'function') {
                callback(err, null);  // Return error to the callback
            }
            return; // Prevent further execution
        }

        if (rows.length > 0) {
            // console.log('Users found:', rows);
            if (typeof callback === 'function') {
                callback(null, rows);
            }
        } else {
            console.log('No users found.');
            if (typeof callback === 'function') {
                callback(null, []); 
            }
        }
    });
};

const getPatientNotes = (patientId, callback) => {
    const query = `
        SELECT note_id, patient_id, date_created, practitioner_id, note, last_saved_date, last_saved_by, is_archived
        FROM patient_notes
        WHERE patient_id = ?
    `;

    db.all(query, [patientId], (err, rows) => {
        if (err) {
            console.error('Error fetching notes:', err.message);
            if (typeof callback === 'function') {
                callback(err, null);  // Return error to the callback
            }
            return; // Prevent further execution
        }

        if (rows.length > 0) {
            console.log('Notes found:', rows);
            if (typeof callback === 'function') {
                callback(null, rows);  // Return full notes array (with all fields) to the callback
            }
        } else {
            console.log('No notes found for the provided patientId.');
            if (typeof callback === 'function') {
                callback(null, []);  // Return an empty array if no notes are found
            }
        }
    });
};

const getPatientEmergencyContacts = (patient_id, callback) => {
    const query = `SELECT * FROM patient_emergency_contacts WHERE patient_id = ?`;

    db.all(query, [patient_id], (err, rows) => {
        if (err) {
            console.error('Error fetching emergency contacts:', err.message);
            if (typeof callback === 'function') {
                callback(err, null);  // Return error to the callback
            }
            return; // Prevent further execution
        }

        if (rows.length > 0) {
            console.log('Emergency Contacts found:', rows);
            if (typeof callback === 'function') {
                callback(null, rows);  
            }
        } else {
            console.log('No emergency contacts found for the provided patient_id: '+patient_id+'.');
            if (typeof callback === 'function') {
                callback(null, []);  
            }
        }
    });
};

const getPatientPrimaryCareProviders = (patient_id, callback) => {
    const query = `SELECT * FROM patient_primary_care_providers WHERE patient_id = ?`;

    db.all(query, [patient_id], (err, rows) => {
        if (err) {
            console.error('Error fetching primary care providers:', err.message);
            if (typeof callback === 'function') {
                callback(err, null);  // Return error to the callback
            }
            return; // Prevent further execution
        }

        if (rows.length > 0) {
            console.log('primary care providers found:', rows);
            if (typeof callback === 'function') {
                callback(null, rows);  
            }
        } else {
            console.log('No primary care providers found for the provided patient_id: '+patient_id+'.');
            if (typeof callback === 'function') {
                callback(null, []);  
            }
        }
    });
};

const getPatientInsurance = (patient_id, callback) => {
    const query = `SELECT * FROM patient_insurance WHERE patient_id = ?`;

    db.all(query, [patient_id], (err, rows) => {
        if (err) {
            console.error('Error fetching insurance:', err.message);
            if (typeof callback === 'function') {
                callback(err, null);  // Return error to the callback
            }
            return; // Prevent further execution
        }

        if (rows.length > 0) {
            console.log('Insurance found:', rows);
            if (typeof callback === 'function') {
                callback(null, rows);  
            }
        } else {
            console.log('No insurance found for the provided patient_id: '+patient_id+'.');
            if (typeof callback === 'function') {
                callback(null, []);  
            }
        }
    });
};

const getPatientMedicalHistory = (patient_id, callback) => {
    const query = `SELECT * FROM patient_medical_history WHERE patient_id = ?`;

    db.all(query, [patient_id], (err, rows) => {
        if (err) {
            console.error('Error fetching medical history:', err.message);
            if (typeof callback === 'function') {
                callback(err, null);  // Return error to the callback
            }
            return; // Prevent further execution
        }

        if (rows.length > 0) {
            console.log('Medical History found:', rows);
            if (typeof callback === 'function') {
                callback(null, rows);  
            }
        } else {
            console.log('No medical history found for the provided patient_id: '+patient_id+'.');
            if (typeof callback === 'function') {
                callback(null, []);  
            }
        }
    });
};

const getPatientMedications = (patient_id, callback) => {
    const query = `SELECT * FROM patient_medications WHERE patient_id = ?`;

    db.all(query, [patient_id], (err, rows) => {
        if (err) {
            console.error('Error fetching medications:', err.message);
            if (typeof callback === 'function') {
                callback(err, null);  // Return error to the callback
            }
            return; // Prevent further execution
        }

        if (rows.length > 0) {
            console.log('Medications found:', rows);
            if (typeof callback === 'function') {
                callback(null, rows);
            }
        } else {
            console.log('No medications found for the provided patient_id: '+patient_id+'.');
            if (typeof callback === 'function') {
                callback(null, []);
            }
        }
    });
};

const getPatientAllergies = (patient_id, callback) => {
    const query = `SELECT * FROM patient_allergies WHERE patient_id = ?`;

    db.all(query, [patient_id], (err, rows) => {
        if (err) {
            console.error('Error fetching allergies:', err.message);
            if (typeof callback === 'function') {
                callback(err, null);  // Return error to the callback
            }
            return; // Prevent further execution
        }

        if (rows.length > 0) {
            console.log('Allergies found:', rows);
            if (typeof callback === 'function') {
                callback(null, rows);  
            }
        } else {
            console.log('No allergies found for the provided patient_id: '+patient_id+'.');
            if (typeof callback === 'function') {
                callback(null, []);
            }
        }
    });
};

// Function to update user profile, including the profile picture path
const updateUserProfile = (email, at, fn, ln, ps, profilePicturePath) => {
    const query = `UPDATE users
                   SET account_type = ?, first_name = ?, last_name = ?, password = ?, profile_picture = ?
                   WHERE email = ?`;

    db.run(query, [at, fn, ln, ps, profilePicturePath, email], function(err) {
        if (err) {
            console.log("Error updating user profile:", err.message);
        } else {
            console.log(`User with email ${email} updated successfully.`);
        }
    });
};

const updateNote = (noteId, note, lastSavedBy, callback) => {
    const sql = `
        UPDATE patient_notes 
        SET note = ?, 
            last_saved_date = CURRENT_TIMESTAMP, 
            last_saved_by = ? 
        WHERE note_id = ?
    `;
    
    db.run(sql, [note, lastSavedBy, noteId], function(err) {
        if (err) {
            console.error('Error updating note:', err);
            console.log("db broken");
            return callback(err, null);
        }
        
        // Fetch the updated note to return
        const selectSql = `
            SELECT * FROM patient_notes 
            WHERE note_id = ?
        `;
        db.get(selectSql, [noteId], (selectErr, updatedNote) => {
            if (selectErr) {
                console.error('Error fetching updated note:', selectErr);
                return callback(selectErr, null);
            }
            
            callback(null, updatedNote);
        });
    });
};

// Exporting the functions
module.exports = {
    addUser,
    isExistingEmail,
    addNewPatient,
    isExistingSSN,
    addPatientEmergencyContacts,
    addPatientPrimaryCareProviders,
    addPatientInsurance,
    addPatientMedications,
    addPatientAllergies,
    addPatientMedicalHistory,
    addPatientNote,
    validateUser,
    searchPatient,
    getPatientById,
    findPatientIdByEmail,
    updateUser,
    pendingUpdatePatient,
    updatePatient,
    updateNote,
    getUserInfo,
    getUserById,
    updateUserProfile,
    getAllUsers,
    getPatientNotes,
    toggleArchive,
    getPatientEmergencyContacts,
    getPatientPrimaryCareProviders,
    getPatientInsurance,
    getPatientMedicalHistory,
    getPatientMedications,
    getPatientAllergies,
    getUserSecurityQuestions,
    updateUserSecurityQuestions
};
