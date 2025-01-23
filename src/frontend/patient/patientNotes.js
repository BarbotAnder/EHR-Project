import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const EditableNote = ({ note, onSave, onCancel, isEditing }) => {
    const [editedNote, setEditedNote] = useState(note.note);

    const handleChange = (e) => {
        setEditedNote(e.target.value);
    };

    const handleSave = async () => {
        try {
            const practitionerId = cookies.get('user_id');
            const response = await axios.put('http://localhost:5000/update-note', {
                noteId: note.note_id,
                patientId: note.patient_id,
                note: editedNote,
                practitionerId,
            });
            if (response.data.updatedNote) {
                onSave(response.data.updatedNote);
            }
        } catch (error) {
            alert('Error saving edited note: ' + error.message);
        }
    };

    return (
        <div className="card note-card">
            <div className="card-content">
                <textarea
                    value={editedNote}
                    onChange={handleChange}
                    className="materialize-textarea"
                    required
                />
                {isEditing && (
                    <div className="row">
                        <div className="col s12 center-align">
                            <button onClick={handleSave} className="btn waves-effect waves-light">
                                Save Edit
                                <i className="material-icons right">save</i>
                            </button>
                            <button
                                onClick={onCancel}
                                className="btn waves-effect waves-light grey"
                            >
                                Cancel
                                <i className="material-icons right">close</i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const PatientNotes = ({ patientId, onNoteAdded }) => {
    const [note, setNote] = useState(''); // For new note
    const [notes, setNotes] = useState([]); // To hold the existing notes
    const [editingNoteId, setEditingNoteId] = useState(null); // Track which note is being edited
    const [errorMessage, setErrorMessage] = useState('');

    // Function to fetch notes
    const fetchNotes = async () => {
        try {
            const response = await axios.post('http://localhost:5000/get-patient-notes', { patientId });
            if (response.data.notes) {
                const activeNotes = response.data.notes.filter(note => !note.is_archived);
                setNotes(activeNotes);
            } else {
                setNotes([]);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            alert('Error fetching notes: ' + error.message);
            setNotes([]);
        }
    };

    useEffect(() => {
        if (patientId) {
            fetchNotes(); // Fetch notes when the component mounts or patientId changes
        }
    }, [patientId]);

    const handleChange = (e) => {
        setNote(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!note) {
            setErrorMessage('Please enter a note.');
            return;
        }

        try {
            const practitionerId = cookies.get('user_id');
            const response = await axios.post('http://localhost:5000/save-note', {
                patientId,
                note,
                practitionerId,
            });

            setNote(''); // Clear the input field
            fetchNotes();
        } catch (error) {
            alert('Error saving note: ' + error.message);
        }
    };

    const handleEdit = (noteId) => {
        setEditingNoteId(noteId); // Set the note ID to edit
    };

    const handleArchive = async (noteId) => {
        try {
            const response = await axios.put('http://localhost:5000/toggle-archive', {
                noteId, // Send the noteId to the backend for archiving
            });
            console.log(response);
            if (response.data.message === 'Note archived status updated successfully') {
                fetchNotes(); // Fetch notes again to refresh the list
            } else {
                alert('Error archiving note');
            }
        } catch (error) {
            alert('Error archiving note: ' + error.message);
        }
    };

    const handleSaveEdit = (updatedNote) => {
        setNotes ((prevNotes) =>
            prevNotes.map((note) => (note.note_id === updatedNote.note_id ? updatedNote : note))
        );
        setEditingNoteId(null); // Reset editing state
    };

    const handleCancelEdit = () => {
        setEditingNoteId(null); // Reset editing state
    };

    return (
        <div>
            <h2>Patient Notes</h2>
            {errorMessage && <p id='errMessage'>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <textarea
                    data-testid="patient-note"
                    value={note}
                    onChange={handleChange}
                    className="materialize-textarea"
                    placeholder="Add a new note"
                    required
                />
                <button type="submit" className="btn waves-effect waves-light">
                    Add Note
                    <i className="material-icons right">add</i>
                </button>
            </form>
            
            <h4>Existing Notes</h4>
            {notes.length > 0 ? (
                notes.map((existingNote) => (
                    <div key={existingNote.note_id}>
                        {editingNoteId === existingNote.note_id ? (
                            <EditableNote
                                note={existingNote}
                                onSave={handleSaveEdit}
                                onCancel={handleCancelEdit}
                                isEditing={editingNoteId === existingNote.note_id} // Pass the editing state
                            />
                        ) : (
                            <div className="card note-card">
                                <div className="card-content">
                                    <p>{existingNote.note}</p>
                                    <small>
                                        Created by: Practitioner {existingNote.practitioner_id} <br />
                                        Created on: {new Date(existingNote.date_created).toLocaleDateString()} <br />
                                        Last updated: {new Date(existingNote.last_saved_date).toLocaleDateString()} by {existingNote.last_saved_by}
                                    </small>
                                    <div>
                                        <button
                                            className="btn waves-effect waves-light"
                                            onClick={() => handleEdit(existingNote.note_id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn waves-effect waves-light"
                                            onClick={() => handleArchive(existingNote.note_id)}
                                        >
                                            Archive
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No notes available for this patient.</p>
            )}
        </div>
    );
};

export default PatientNotes;