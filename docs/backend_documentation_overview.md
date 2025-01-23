- [Back To README](../README.md)

# Backend Documentation

This document provides an overview of the backend application, detailing its functionality, routes, and key components.

---

## **Overview**

The backend is a Node.js application built using Express. It serves as the API layer for managing user data, patient records, authentication, and other services required by the frontend.

- **Server Port**: `5000` (default)
- **Authentication**: JWT-based token authentication with cookie storage.

---

## **Dependencies**

The backend uses the following key dependencies:
- **Express**: For handling HTTP requests and responses.
- **body-parser**: For parsing incoming JSON and URL-encoded data.
- **cookie-parser**: For managing cookies in authentication.
- **jsonwebtoken**: For creating and verifying JWT tokens.
- **multer**: For handling file uploads (e.g., profile pictures).
- **nodemailer**: For sending emails (e.g., password reset).
- **cors**: For enabling Cross-Origin Resource Sharing between the frontend and backend.

---

## **File Breakdown**

### **1. `app.js`**
The main entry point for the backend server. It initializes the Express application, sets up middleware, and defines API routes.

### **2. `db.js`**
Handles database operations and queries. Functions in `db.js` are called within the API routes to interact with the SQLite database.

---

## **API Endpoints**

### **Authentication**
- `POST /validate-user-login`  
  Validates user credentials and generates a JWT token.

- `POST /logout`  
  Clears the authentication cookie to log out the user.

---

### **User Management**
- `POST /add-user`  
  Adds a new user to the database.

- `PUT /update-user/:id`  
  Updates user details based on their ID.

- `POST /user-details`  
  Fetches details of a user by their email.

- `POST /user-details-by-id`  
  Fetches user details by their ID.

- `PUT /user-security-questions/:id`  
  Updates user security questions and answers.

- `GET /retrieve-security-questions/:id`  
  Retrieves security questions for a user by their ID.

---

### **Patient Management**
- `POST /add-patient`  
  Adds a new patient to the database.

- `POST /search-patient`  
  Searches for patients by last name and date of birth.

- `POST /patient-details`  
  Fetches detailed patient information by ID.

- `PUT /update-patient/:id`  
  Updates a patient's details.

- `POST /add-patient-emergency-contacts`  
  Adds emergency contact information for a patient.

- `POST /add-patient-primary-care-providers`  
  Adds primary care provider information for a patient.

- `POST /add-patient-insurance`  
  Adds insurance details for a patient.

- `POST /add-patient-medical-history`  
  Adds medical history for a patient.

- `POST /add-patient-medications`  
  Adds medication details for a patient.

- `POST /add-patient-allergy`  
  Adds an allergy record for a patient.

---

### **Notes Management**
- `POST /save-note`  
  Saves a new patient note.

- `PUT /update-note`  
  Updates an existing patient note.

- `POST /get-patient-notes`  
  Retrieves notes for a specific patient.

- `PUT /toggle-archive`  
  Toggles the archive status of a note.

---

### **Profile Management**
- `POST /update-profile`  
  Updates the user profile, including optional file uploads.

---

### **Utility Routes**
- `GET /`  
  Test route to confirm the API is operational.

---

## **Security**
- **Authentication**: Uses JWT tokens stored in HTTP-only cookies for secure sessions.
- **CORS Configuration**: Allows requests only from `http://localhost:3000`.
- **Password Reset**: Sends reset emails using `nodemailer`.

---

## **Development Notes**
1. **Running the Server**:
   ```bash
   node app.js
