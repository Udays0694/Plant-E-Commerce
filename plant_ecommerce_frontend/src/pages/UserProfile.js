import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';

const UserProfile = () => {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        profile_picture: ''
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('token'); // Retrieve token from local storage

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(token);
                setProfile(data);
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateUserProfile(token, profile);
            setMessage(response.message);
            setError('');
        } catch (err) {
            setError('Failed to update profile');
            setMessage('');
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    return (
        <div className="profile-container">
            <h2>User Profile</h2>

            {loading ? <p>Loading...</p> : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input type="text" name="username" value={profile.username} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={profile.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Address:</label>
                        <input type="text" name="address" value={profile.address} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Profile Picture URL:</label>
                        <input type="text" name="profile_picture" value={profile.profile_picture} onChange={handleChange} />
                    </div>

                    <button type="submit">Update Profile</button>
                </form>
            )}

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default UserProfile;
