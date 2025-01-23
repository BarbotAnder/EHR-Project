import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import PatientDetails from './PatientDetails';
import PatientNotes from './patientNotes';
import PatientEmergencyContacts from './PatientEmergencyContactsForm';
import PatientInsurance from'./PatientInsuranceForm';
import PatientMedications from './PatientMedicationsForm';
import PatientAllergiesForm from './PatientAllergiesForm';
import PatientMedicalHistory from './PatientMedicalHistoryForm';
import PatientPrimaryCareProviders from './PatientPrimaryCareProviderForm';
import '../../css/App.css';
import '../../css/PatientDetail.css';

const cookies = new Cookies();
const PatientPage = () => {
    const account_type = cookies.get('account_type');
    const { id } = useParams();
    const [view, setView] = useState('details');

    return (account_type === "admin" || account_type === "practitioner" || account_type === "office") ? (
        <div className="container-fluid">
            <div className="main-content">
                <TransitionGroup>
                    <CSSTransition key="patient-detail" timeout={300} classNames="fade">
                        <div id="patient-detail">
                            {/* Tabs for different views */}
                            <div className="tabs">
                                <button
                                    className={`tab ${view === 'details' ? 'active' : ''}`}
                                    onClick={() => setView('details')}
                                >
                                    Details
                                </button>
                                {(account_type === 'admin' || account_type === 'practitioner') ? (
                                    <button
                                        className={`tab ${view === 'notes' ? 'active' : ''}`}
                                        onClick={() => setView('notes')}
                                    >
                                        Notes
                                    </button>
                                ) : null}
                                <button
                                    className={`tab ${view === 'allergies' ? 'active' : ''}`}
                                    onClick={() => setView('allergies')}
                                >
                                    Allergies
                                </button>
                                <button
                                    className={`tab ${view === 'emergency' ? 'active' : ''}`}
                                    onClick={() => setView('emergency')}
                                >
                                    Emergency Contacts
                                </button>
                                <button
                                    className={`tab ${view === 'insurance' ? 'active' : ''}`}
                                    onClick={() => setView('insurance')}
                                >
                                    Insurance
                                </button>
                                <button
                                    className={`tab ${view === 'history' ? 'active' : ''}`}
                                    onClick={() => setView('history')}
                                >
                                    Medical History
                                </button>
                                <button
                                    className={`tab ${view === 'medications' ? 'active' : ''}`}
                                    onClick={() => setView('medications')}
                                >
                                    Medications
                                </button>
                                <button
                                    className={`tab ${view === 'primarycare' ? 'active' : ''}`}
                                    onClick={() => setView('primarycare')}
                                >
                                    Primary Care Provider(s)
                                </button>
                            </div>

                            {view === 'details' ? (
                                <div>
                                    <PatientDetails patientId={id} />
                                </div>
                            ) : view === 'notes' ? (
                                <div>
                                    <PatientNotes patientId={id} />
                                </div>
                            ) : view === 'allergies' ? (
                                <div>
                                    <PatientAllergiesForm patientId={id} />
                                </div>
                            ) : view === 'emergency' ? (
                                <div>
                                    <PatientEmergencyContacts patientId={id} />
                                </div>
                            ) : view === 'insurance' ? (
                                <div>
                                    <PatientInsurance patientId={id} />
                                </div>
                            ) : view === 'history' ? (
                                <div>
                                    <PatientMedicalHistory patientId={id} />
                                </div>
                            ) : view === 'medications' ? (
                                <div>
                                    <PatientMedications patientId={id} />
                                </div>
                            ) : view === 'primarycare' ? (
                                <div>
                                    <PatientPrimaryCareProviders patientId={id} />
                                </div>
                            ) : null}
                        </div>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    ) : (
        <div className='access-denied'><h2>ACCESS DENIED</h2></div>
    );
};

export default PatientPage;
