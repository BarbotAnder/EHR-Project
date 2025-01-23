const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    addNewPatient: (patientData) => ipcRenderer.send('addNewPatient', patientData),
    addUser: (userData) => ipcRenderer.send('addUser', userData)
});
