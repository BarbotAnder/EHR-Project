# Project Setup Guide

- [Back To README](../README.md)

This document provides a step-by-step guide to setting up the project, including initializing the database, starting the backend, and running the frontend.

---

## Prerequisites
Ensure the following software is installed on your machine:
- **Node.js** (v14 or later)
- **npm** (usually included with Node.js installation)
- **SQLite** (optional, if you want to inspect the database locally)

---

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone [REPOSITORY_URL]
   cd [REPOSITORY_DIRECTORY]
   
2. **Run the Build Script**
    ```bash
   ./build.sh

   build script documentation:
- [Build Script Documentation](build_documentation.md)



The backend will start in the background, and the frontend will start in the foreground (typically on http://localhost:3000).

If there is no database initialized locally, the build script will create one. It will also initialize all of the necessary tables, which are defined in 'src/backend/db.js'

- [Clean Script Documentation](clean_documentation.md)
    
