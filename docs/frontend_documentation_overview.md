- [Back To README](../README.md)

# Frontend Documentation

This document provides an overview of the React application's frontend, including its file structure and key components.



---

## **Directory Breakdown**

### **1. `tests/`**
Contains test files for the application.

### **2. `components/`**
Holds reusable components used across multiple pages.

- `Sidebar.js`: Main Sidebar for user navigation.

### **3. `pages/`**
Contains the main pages of the application, each representing a specific route or functionality:

- **`About.js`**: Displays information about the application.
- **`Billing.js`**: Handles billing-related features.
- **`Dashboard.js`**: The main dashboard for users.
- **`Documents.js`**: Manages document-related tasks.
- **`Login.js`**: Provides user login functionality.
- **`PersonsInstitutions.js`**: Manages records of persons and institutions.
- **`Profile.js`**: Displays and allows updates to the user profile.
- **`Reports.js`**: Generates and displays various reports.
- **`ResetPassword.js`**: Allows users to reset their password.
- **`Scheduler.js`**: Manages scheduling and calendar-related tasks.
- **`Signup.js`**: Handles new user registration.
- **`System.js`**: Configuration page for system settings.
- **`TransactionCodes.js`**: Page for managing transaction codes.

### **4. `patient/`**
Contains components and pages related to patient management:

- **`NewPatientForm.js`**: A form for adding new patients.
- **`PatientAllergiesForm.js`**: Form for managing patient allergies.
- **`PatientDashboard.js`**: Displays patient-related data in a dashboard.
- **`PatientDetails.js`**: Provides detailed patient information.
- **`PatientEmergencyContactsForm.js`**: Form for managing emergency contacts.
- **`PatientInsuranceForm.js`**: Captures patient insurance details.
- **`PatientMedicalHistoryForm.js`**: Tracks patient medical history.
- **`PatientMedicationsForm.js`**: Records patient medications.
- **`patientNotes.js`**: Stores notes related to patients.
- **`PatientPage.js`**: Main page for managing patient-related actions.
- **`PatientPrimaryCareProviderForm.js`**: Assigns a primary care provider to a patient.
- **`PatientSearch.js`**: Allows searching for patients.

### **5. `user/`**
Manages user-related components and pages:

- **`UserDetails.js`**: Displays detailed information about users.
- **`UserManagement.js`**: Provides administrative tools for managing user accounts.

---

## **Development Notes**

- **Routing**: Pages in the `pages/` directory are intended to work with React Router for navigation.
- **Reusability**: Components in `components/` should be designed for reuse across multiple pages.
- **Testing**: Add and maintain tests in the `tests/` directory to ensure application stability.

---

---

## **Development Notes**

- **Styling:** Ensure consistent styling across all components and pages. Use a global CSS or CSS-in-JS solution for scalability.
- **Routing:** Pages are intended to be used with a routing library like React Router for navigation.
- **State Management:** Use React state or a state management library (e.g., Redux, Context API) to manage shared application state.

---

## **Adding New Features**
1. Create a new component or page in the appropriate directory.
2. Follow the naming conventions for consistency.
3. Update routing to include the new page if applicable.
4. Write tests and place them in the `__tests__` directory.

---

## **Contributing**
- Follow the existing file structure.
- Document any new components or pages.
- Ensure all tests pass before submitting changes.

---
