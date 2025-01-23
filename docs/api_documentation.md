# API Documentation

- [Back To README](../README.md)

This document provides details about the API endpoints available in the project, including required parameters, expected responses, and example requests.

---

## Base URL
All endpoints are prefixed by the base URL:

http://localhost:5000


---

## Authentication
Some routes are protected and require a JSON Web Token (JWT) in the `Authorization` header as follows:

Authorization: Bearer <token>


---

## Endpoints

### 1. **User Authentication and Management**

#### `POST /validate-user-login`
Authenticates a user and returns a JWT token.

- **Request Body**:
  ```json
  {
    "username": "example_user",
    "password": "example_password"
  }

    Response:

    {
      "valid": true,
      "token": "jwt_token_here"
    }

POST /logout

Logs the user out by clearing the authentication token cookie.

    Response:

    {
      "message": "Logged out successfully."
    }

POST /add-user

Registers a new user.

    Request Body:

{
"account_type": "practitioner",
"firstName": "John",
"lastName": "Doe",
"email": "john.doe@example.com",
"password": "secure_password"
}

Response:

    {
      "message": "User added successfully."
    }

2. Patient Management
   POST /add-patient

Adds a new patient to the database.

    Request Body:

{
"firstname": "Jane",
"middlename": "M",
"lastname": "Doe",
"dob": "1990-01-01",
"address": "123 Main St",
"city": "City",
"state": "State",
"zip_code": "12345",
"phone_number": "123-456-7890",
"email": "jane.doe@example.com",
"ssn": "123-45-6789"
}

Response:

    {
      "message": "Patient added successfully."
    }

POST /search-patient

Searches for a patient by date of birth and last name.

    Request Body:

{
"dob": "1990-01-01",
"lastname": "Doe"
}

Response:

    {
      "patients": [
        {
          "id": 1,
          "first_name": "Jane",
          "last_name": "Doe",
          "dob": "1990-01-01",
          "address": "123 Main St",
          "city": "City",
          "state": "State",
          "zip_code": "12345",
          "phone_number": "123-456-7890",
          "email": "jane.doe@example.com",
          "ssn": "123-45-6789"
        }
      ]
    }

3. Patient Details
   POST /patient-details

Fetches full patient details by patient ID.

    Request Body:

{
"id": 1
}

Response:

    {
      "patient": {
        "id": 1,
        "first_name": "Jane",
        "middle_name": "M",
        "last_name": "Doe",
        "date_of_birth": "1990-01-01",
        "address": "123 Main St",
        "city": "City",
        "state": "State",
        "zip_code": "12345",
        "phone_number": "123-456-7890",
        "email": "jane.doe@example.com",
        "ssn": "123-45-6789",
        "insurance_provider": "HealthCare Inc.",
        "policy_number": "ABC123",
        "group_number": "GROUP456",
        "policy_holders_name": "Jane Doe",
        "notes": "Patient has a history of hypertension.",
        "date_created": "2024-01-01T00:00:00Z",
        "last_updated_date": "2024-01-01T00:00:00Z",
        "last_updated_by": "Dr. Smith"
      }
    }

4. Patient Notes
   POST /get-patient-notes

Retrieves all notes for a specific patient.

    Request Body:

{
"patientId": 1
}

Response:

    {
      "notes": [
        {
          "note_id": 1,
          "patient_id": 1,
          "date_created": "2024-01-01T00:00:00Z",
          "practitioner_id": 123,
          "note": "Patient is in good health.",
          "last_saved_date": "2024-01-01T00:00:00Z",
          "last_saved_by": 123
        }
      ]
    }

POST /save-note

Adds a new note for a patient.

    Request Body:

{
"patientId": 1,
"note": "Patient is in good health.",
"practitionerId": 123
}

Response:

    {
      "message": "Note saved successfully!"
    }

5. Patient Medical Records
   POST /add-patient-medical-history

Adds a medical history record for a patient.

    Request Body:

{
"patient_id": 1,
"notes": "Patient has a history of hypertension.",
"last_updated_by": 123
}

Response:

    {
      "message": "Medical History added successfully."
    }

POST /get-patient-medical-history

Retrieves the medical history for a specific patient.

    Request Body:

{
"patientId": 1
}

Response:

    {
      "mh": [
        {
          "patient_med_history": 1,
          "patient_id": 1,
          "notes": "Patient has a history of hypertension.",
          "date_created": "2024-01-01T00:00:00Z",
          "last_updated_date": "2024-01-01T00:00:00Z",
          "last_updated_by": 123
        }
      ]
    }

6. Patient Allergies and Medications
   POST /add-patient-allergy

Adds an allergy record for a patient.

    Request Body:

{
"patient_id": 1,
"allergy": "Peanuts",
"last_updated_by": 123
}

Response:

    {
      "message": "Allergy added successfully."
    }

POST /get-patient-allergies

Retrieves allergies for a specific patient.

    Request Body:

{
"patientId": 1
}

Response:

    {
      "a": [
        {
          "patient_allergy_id": 1,
          "patient_id": 1,
          "allergy": "Peanuts",
          "date_created": "2024-01-01T00:00:00Z",
          "last_updated_date": "2024-01-01T00:00:00Z",
          "last_updated_by": 123
        }
      ]
    }

POST /add-patient-medications

Adds a medication record for a patient.

    Request Body:

{
"patient_id": 1,
"medication": "Ibuprofen",
"dosage": "200mg",
"frequency": 2,
"last_updated_by": 123
}

Response:

    {
      "message": "Medication added successfully."
    }

POST /get-patient-medications

Retrieves medication records for a specific patient.

    Request Body:

{
"patientId": 1
}

Response:

    {
      "m": [
        {
          "patient_meds": 1,
          "patient_id": 1,
          "medication": "Ibuprofen",
          "dosage": "200mg",
          "frequency": 2,
          "date_created": "2024-01-01T00:00:00Z",
          "last_updated_date": "2024-01-01T00:00:00Z",
          "last_updated_by": 123
        }
      ]
    }

Error Handling

All responses follow a consistent error format for failed requests:

{
"error": "Description of the error"
}

Common errors:

    404 Not Found: Resource not found.
    401 Unauthorized: Authentication required.
    400 Bad Request: Invalid or missing parameters.