- [Back To README](../README.md)

# Script Steps

## 1. Initialize SQLite Database
The script assumes that your `db.js` handles table creation if they don't already exist.  
No explicit action is needed for SQLite initialization within the script.

---

## 2. Start the Node.js Backend
The backend server is located in the `src/backend` directory.  
The script:
- Installs necessary dependencies using `npm install`.
- Starts the backend in the background using `nohup` and redirects logs to `backend.log` in the project root directory.
- Stores the backend's process ID (PID) to allow for manual or automated termination later.

**Logs:**  
The backend logs can be found in `backend.log`.

---

## 3. Start the React Frontend
The frontend is located in the `src/frontend` directory.  
The script:
- Installs necessary dependencies using `npm install`.
- Starts the React development server using `npm start`, which blocks further script execution.

---

# Stopping the Servers

### Frontend
Stop the React frontend by pressing `Ctrl+C`.

### Backend
If you wish to stop the backend, you can terminate it manually using its PID:
```bash
kill <backend_pid>
