#!/bin/bash

# Ensure the script stops if any command fails
set -e

# Initialize SQLite database (if db.js handles this, no explicit action is needed)
echo "Initializing the SQLite database..."
# Assuming your db.js creates tables if they don't exist, nothing specific to start for SQLite

# Start the Node.js backend
echo "Starting the backend..."
cd src/backend   # Navigate to the backend folder where your Express app (app.js) is located
npm install  # Install backend dependencies if needed
nohup node app.js > ../../backend.log 2>&1 &  # Start backend in the background and log output to backend.log in root
BACKEND_PID=$!  # Store the backend process ID to kill it later if needed
echo "Backend is running with PID: $BACKEND_PID"

# Start the React frontend
echo "Starting the React frontend..."
cd ../frontend   # Navigate to the frontend folder (relative to src/)
npm install      # Install frontend dependencies if needed
npm start        # Start the React app (this will block the script and keep it running)

# When you want to stop the backend, you can press Ctrl+C to stop the frontend
# and kill the backend process manually using its PID, or automate it using this:
# kill $BACKEND_PID
