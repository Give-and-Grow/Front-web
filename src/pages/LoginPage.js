import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoginPage.css'; // تأكد من أن ملف CSS موجود
import { useNavigate } from 'react-router-dom';
import { requestFCMToken } from '../firebase';  // استورد دالة طلب التوكين


const images = [
    require('../images/volunter1.jpg'),
    require('../images/volunter2.jpg'),
    require('../images/volunter3.webp'),
    require('../images/volunter5.webp'),
];

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [imageIndex, setImageIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setImageIndex((prev) => (prev + 1) % images.length);
                setFade(true);
            }, 500);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleLogin = async () => {
        try {
        const response = await axios.post('http://localhost:5000/auth/login', {
            username,
            password,
        });

        if (response.status === 200) {
            const { token, role } = response.data;

            localStorage.setItem('userToken', token);
            localStorage.setItem('userRole', role);

            // * اطلب توكين FCM *
            const fcmToken = await requestFCMToken();
            if (fcmToken) {
            // * ابعت التوكين للسيرفر *
            await axios.post('http://localhost:5000/user/fcm-token', {
                fcm_token: fcmToken
            }, {
                headers: {
                Authorization: Bearer ${token}
                }
            });
            }

            alert('Login successful!');

            if (role === 'ADMIN') {
            navigate('/admin-dashboard');
            } else {
            navigate('/homepage');
            }
        } else {
            alert(response.data.message || 'Invalid credentials');
        }
        } catch (error) {
        console.error('Login error:', error);
        const message = error.response?.data?.message || 'Failed to connect to the server';
        alert(message);
        }
    };


    return (
        <div className="login-container">
            <div className="image-container">
                <img
                    src={images[imageIndex]}
                    alt="Volunteer"
                    className={`login-image ${fade ? 'fade-in' : 'fade-out'}`}
                />
            </div>

            <div className="form-container">
                <h2 className="title">
                    Join Us <br /> be the change you want <br /> to see in the world
                </h2>

                <input
                    className="input"
                    type="text"
                    placeholder="Username/Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="button" onClick={handleLogin}>
                    Login
                </button>

                <div className="footer">
                    <p className="footer-link" onClick={() => navigate('/SignupFlow')}>
                        Don't have an account? Sign Up
                    </p>
                    <p className="footer-link" onClick={() => navigate('/ResetPasswordScreen')}>
                        Forget Password
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
