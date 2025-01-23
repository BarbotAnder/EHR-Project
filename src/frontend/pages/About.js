import React from 'react';
import '../../css/App.css'; // Correct path to the stylesheet
import seniorDesignLogo from '../../img/sdp-logo-3.png'; // Adjust the path if needed

const About = () => {
    return (
        <div className="container-fluid" style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            <div className="main-content" style={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
                <div id="about" style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>About the Project</h3>
                    <hr />
                    <p>
                        This Electronic Health Record (EHR) system is developed as part of Boise State University's Computer Science
                        Senior Capstone Project. It is designed to meet the unique needs of mental health professionals by providing
                        a streamlined, secure, and user-friendly platform for managing patient information, scheduling, billing, and
                        other essential healthcare functions.
                    </p>

                    <p>
                        <strong>Sponsorship:</strong> This project is proudly sponsored by Integrity Mental Health, an organization
                        dedicated to advancing mental health care through technology and innovation. Integrity Mental Health has
                        provided essential guidance and support throughout the development process to ensure that this EHR system
                        aligns with the practical requirements of mental health professionals.
                    </p>

                    <p>
                        <strong>Purpose:</strong> Our goal with this project is to create an efficient and reliable EHR system that
                        empowers healthcare providers to focus on what matters most: delivering quality patient care. This platform
                        is specifically tailored to address the challenges faced by mental health practitioners, with features
                        designed to streamline patient interactions and reduce administrative workload.
                    </p>

                    <p>
                        This EHR system represents the combined efforts of Boise State's computer science students and industry
                        partners, bringing together academic knowledge and practical experience to create a meaningful solution for
                        healthcare. We extend our gratitude to Boise State University and Integrity Mental Health for their support
                        and collaboration.
                    </p>
                </div>
            </div>

            {/* Attribution Footer */}
            <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: 'white', marginTop: 'auto' }}>
                <p>This website/app was created for a<br />
                    <strong>Boise State University Computer Science Senior Design Project</strong> by</p>
                <p><strong>Hunter Walp</strong><br />
                    <strong>Maya Murphy</strong><br />
                    <strong>Jake Lammers</strong></p>
                <p>For information about sponsoring a project, go to<br />
                    <a href="https://www.boisestate.edu/coen-cs/community/cs481-senior-design-project/" target="_blank" rel="noopener noreferrer">
                        Boise State Senior Design Project
                    </a></p>
                <img
                    src={seniorDesignLogo}
                    alt="Boise State Senior Design Logo"
                    style={{ width: '150px', marginTop: '20px' }} // Adjust size as needed
                />
            </footer>
        </div>
    );
};

export default About;
