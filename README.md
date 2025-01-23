# Capstone Template

[![Node.js CI](https://github.com/BarbotAnder/EHR-Project/actions/workflows/node.js.yml/badge.svg)](https://github.com/BarbotAnder/EHR-Project/actions/workflows/node.js.yml)

**Boise State University CS481 Capstone Project**

## Project Overview

### Purpose
This project serves as an Electronic Health Record (EHR) system designed to streamline patient data management for healthcare providers. The system aims to improve the organization, accessibility, and security of patient notes and other critical medical information while ensuring compliance with data security standards.

### Features
- **Patient Notes Management**: Record, update, and archive notes associated with each patient.
- **User Permissions and Roles**: Implement role-based access control to ensure secure and appropriate access to patient data.
- **Customizable UI Elements**: Includes functionality to tailor interface elements such as the sidebar for ease of navigation.
- **Senior Design Program Branding**: Incorporates the Senior Design Program (SDP) logo and branding elements within the app.
- **Persons and Institutions Directory**: A dedicated page to manage and display key individuals and institutions within the healthcare system.

### Technology Stack
- **Frontend**: React.js for building a responsive, user-friendly interface.
- **Backend**: Node.js and SQLite for database management and server-side operations.
- **CI/CD**: GitHub Actions for continuous integration and ensuring code stability.

### Project Goals
- **User-Centric Design**: Create an intuitive interface that streamlines data entry and retrieval for healthcare providers.
- **Data Security**: Implement secure authentication and authorization mechanisms to protect sensitive patient information.
- **Scalability**: Develop a flexible system that can adapt to additional features or integrations as the project evolves.
- **Team Collaboration**: Ensure ease of handover and maintainability for future development teams.

### Architecture Overview
The application follows a client-server architecture, with React on the client side and a Node.js/SQLite backend. User interactions are processed in the frontend, and the backend manages data requests, validation, and storage. Data is organized into tables such as `patient_notes` (with fields like `note_id`, `patient_id`, `date_created`, etc.), providing structured data storage and retrieval.


## Documentation

- [Setup Guide](docs/setup.md)
- [API Documentation](docs/api_documentation.md)
- [Frontend Overview](docs/frontend_documentation_overview.md)
- [Backend Overview](docs/backend_documentation_overview.md)


---
