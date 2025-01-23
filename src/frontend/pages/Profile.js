import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Paper, Typography, Box, TextField, MenuItem, Button, Tabs, Tab } from '@mui/material';
import { Person as BioIcon, AccountCircle, Security, Notifications, Settings } from '@mui/icons-material';
import '../../css/App.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch('http://localhost:5000/user-details', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const data = await response.json();
                setUser(data.user);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            fetchUserDetails();
        } else {
            setLoading(false);
        }
    }, [email]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>No user information available.</div>;
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file && user) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('profile-picture', file);
            formData.append('userId', user.id);

            try {
                const response = await fetch('http://localhost:5000/update-profile', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const updatedUserResponse = await fetch('http://localhost:5000/user-details', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                const updatedUserData = await updatedUserResponse.json();
                setUser(updatedUserData.user);
            } catch (err) {
                setError(err.message);
            }
        } else {
            setError('No file selected or user not logged in');
        }
    };

    const BioTab = () => (
        <Paper elevation={2} style={{ padding: '20px', position: 'relative' }}>
            <Box style={{ position: 'absolute', top: '10px', left: '10px' }}>
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Profile Preview"
                        onClick={() => document.getElementById('profile-image-upload').click()}
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            objectFit: 'cover',
                            border: '2px solid #3f51b5',
                        }}
                    />
                ) : (
                    <div
                        onClick={() => document.getElementById('profile-image-upload').click()}
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: '#e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '2px solid #3f51b5',
                        }}
                    >
                        <Typography variant="caption">No Image</Typography>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                />
            </Box>

            <Typography variant="h4" style={{ marginLeft: '130px' }}>Bio</Typography>
            <Typography variant="body1" style={{ marginLeft: '130px' }}>
                I am an accomplished doctor with a deep passion for medicine and an unwavering commitment to my patients. With over [X years] of experience in the field, I have honed my skills in diagnosing and treating a wide range of medical conditions. My journey in medicine began with a desire to make a meaningful impact in people's lives, and that drive continues to inspire me every day.<br /><br />

                Throughout my career, I have worked in various healthcare settings, from bustling urban hospitals to community clinics, allowing me to gain invaluable insights into the diverse needs of patients. I pride myself on being approachable and empathetic, fostering a supportive environment where my patients feel comfortable discussing their health concerns.<br /><br />

                I believe that patient care extends beyond just treating ailments; it involves understanding each individual's unique circumstances and providing personalized care tailored to their needs. This holistic approach enables me to develop comprehensive treatment plans that not only address medical issues but also promote overall wellness.<br /><br />

                In addition to my clinical work, I am passionate about educating my patients about their health. I enjoy taking the time to explain medical conditions, treatment options, and preventive measures, empowering my patients to make informed decisions about their health. My goal is to build long-lasting relationships based on trust and respect, ensuring that my patients feel heard and valued.<br /><br />

                Outside of the clinic, I am dedicated to continuous learning and professional development. I actively participate in medical conferences and workshops to stay updated on the latest advancements in healthcare. I also engage in community outreach initiatives, volunteering my time to provide medical services and education to underserved populations.<br /><br />

                When I'm not practicing medicine, I enjoy spending time with my family and exploring the great outdoors. Whether it's hiking, cycling, or simply enjoying nature, I find that these activities rejuvenate my spirit and remind me of the importance of maintaining a healthy lifestyle.<br /><br />

                Ultimately, I am passionate about making a positive difference in the lives of my patients and strive to be a source of support and healing for everyone I encounter. I look forward to continuing this journey of care and compassion in the years to come.            </Typography>
        </Paper>
    );

    const AccountSettingsTab = () => (
        <Paper elevation={2} style={{ padding: '20px' }}>
            <Typography variant="h4">Account Settings</Typography>
            <p><strong>First Name:</strong> {user?.first_name || 'N/A'}</p>
            <p><strong>Last Name:</strong> {user?.last_name || 'N/A'}</p>
            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
            <p><strong>Account Type:</strong> {user?.account_type || 'N/A'}</p>
        </Paper>
    );

    const SecuritySettingsTab = ({ userId }) => {
        const [securityQuestions] = useState([
            "What is your mother's maiden name?",
            "What was the name of your first pet?",
            "What was your first car?",
            "What was the name of your elementary school?",
            "What city were you born in?",
            "What is your favorite food?",
            "What was the name of your childhood best friend?",
            "What was your first job?",
            "What is your favorite book?",
            "What is your dream vacation destination?",
        ]);

        const [selectedQuestions, setSelectedQuestions] = useState(["", "", ""]);
        const [answers, setAnswers] = useState(["", "", ""]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        // Fetch user's current security questions on mount
        useEffect(() => {
            const fetchSecurityQuestions = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`http://localhost:5000/retrieve-security-questions/${userId}`);
                    if (!response.ok) throw new Error("Failed to fetch security questions.");

                    const data = await response.json();
                    if (data.securityQuestions) {
                        setSelectedQuestions([
                            data.securityQuestions.question_1 || "",
                            data.securityQuestions.question_2 || "",
                            data.securityQuestions.question_3 || "",
                        ]);
                        setAnswers([
                            data.securityQuestions.answer_1 || "",
                            data.securityQuestions.answer_2 || "",
                            data.securityQuestions.answer_3 || "",
                        ]);
                    }
                } catch (err) {
                    console.error("Error fetching security questions:", err);
                    setError("No existing security questions found. You can set them now.");
                } finally {
                    setLoading(false);
                }
            };

            fetchSecurityQuestions();
        }, [userId]);

        const handleQuestionChange = (index, value) => {
            const updatedQuestions = [...selectedQuestions];
            updatedQuestions[index] = value;
            setSelectedQuestions(updatedQuestions);
        };

        const handleAnswerChange = (index, value) => {
            const updatedAnswers = [...answers];
            updatedAnswers[index] = value;
            setAnswers(updatedAnswers);
        };

        const handleSubmit = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user-security-questions/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        question_1: selectedQuestions[0],
                        answer_1: answers[0],
                        question_2: selectedQuestions[1],
                        answer_2: answers[1],
                        question_3: selectedQuestions[2],
                        answer_3: answers[2],
                    }),
                });

                if (!response.ok) throw new Error("Failed to update security questions.");
                alert("Security questions updated successfully!");
            } catch (error) {
                console.error("Error updating security questions:", error);
                alert("There was an error updating your security questions.");
            }
        };

        if (loading) return <Typography>Loading...</Typography>;

        return (
            <Paper elevation={2} style={{ padding: '20px', borderRadius: '10px' }}>
            <Typography variant="h4" gutterBottom>Security Settings</Typography>
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
            {error ? error : "Select and answer three security questions for account recovery."}
            </Typography>
            {selectedQuestions.map((question, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2} gap={2}>
                <TextField
                select
                label={`Question ${index + 1}`}
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                fullWidth
                variant="outlined"
                >
                {securityQuestions.map((q, i) => (
                    <MenuItem key={i} value={q} disabled={selectedQuestions.includes(q)}>
                    {q}
                    </MenuItem>
                ))}
                </TextField>
                <TextField
                label="Answer"
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                fullWidth
                variant="outlined"
                InputProps={{
                    style: {
                        padding: '10px', // Add padding inside the input
                    },
                }}
                />
                </Box>
            ))}
            <Box mt={3} textAlign="center">
            <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={selectedQuestions.some((q) => !q) || answers.some((a) => !a)}
            style={{ padding: '10px 20px', borderRadius: '8px' }}
            >
            Save Security Questions
            </Button>
            </Box>
            </Paper>
        );
    };

    const NotificationsTab = () => (
        <Paper elevation={2} style={{ padding: '20px' }}>
            <Typography variant="h4">Notifications</Typography>
            <p><strong>Email Notifications:</strong> {user?.email_notifications ? 'Enabled' : 'Disabled'}</p>
            <p><strong>SMS Notifications:</strong> {user?.sms_notifications ? 'Enabled' : 'Disabled'}</p>
            <p><strong>Push Notifications:</strong> {user?.push_notifications ? 'Enabled' : 'Disabled'}</p>
        </Paper>
    );

    const PreferencesTab = () => (
        <Paper elevation={2} style={{ padding: '20px' }}>
            <Typography variant="h4">Preferences</Typography>
            <p><strong>Language:</strong> {user?.language || 'English'}</p>
            <p><strong>Timezone:</strong> {user?.timezone || 'UTC'}</p>
            <p><strong>Theme:</strong> {user?.theme || 'Light'}</p>
        </Paper>
    );

    const tabColors = ['#3E6E40', '#1E88E5', '#FF9800', '#F44336', '#8E24AA'];
    const selectedTabColor = '#FFB300';

    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return <BioTab />;
            case 1:
                return <AccountSettingsTab />;
            case 2:
                return <SecuritySettingsTab />;
            case 3:
                return <NotificationsTab />;
            case 4:
                return <PreferencesTab />;
            default:
                return null;
        }
    };

    return (
        <div className="container-fluid" style={{ display: 'flex', height: '100vh' }}>

            <div className="main-content" style={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
                <Box>
                    <Typography variant="h3" gutterBottom>User Profile</Typography>
                    <Tabs
                        value={activeTab}
                        onChange={(event, newValue) => setActiveTab(newValue)}
                        indicatorColor="transparent"
                        aria-label="profile tabs"
                        sx={{
                            display: 'flex',
                            gap: '10px',
                        }}
                    >
                        {['Bio', 'Account Settings', 'Security Settings', 'Notifications', 'Preferences'].map((label, index) => (
                            <Tab
                                key={index}
                                label={label}
                                icon={index === 0 ? <BioIcon /> : index === 1 ? <AccountCircle /> : index === 2 ? <Security /> : index === 3 ? <Notifications /> : <Settings />}
                                sx={{
                                    backgroundColor: activeTab === index ? selectedTabColor : tabColors[index],
                                    color: 'white',
                                    paddingTop: '15px',
                                    borderRadius: '10px',
                                    boxShadow: activeTab === index ? '0 4px 10px rgba(0, 0, 0, 0.3)' : 'none',
                                    marginRight: '10px',
                                    '&:hover': {
                                        backgroundColor: activeTab === index ? selectedTabColor : tabColors[index],
                                    },
                                }}
                            />
                        ))}
                    </Tabs>

                    <Box mt={3}>{renderTabContent()}</Box>
                </Box>
            </div>
        </div>
    );
};

export default Profile;
