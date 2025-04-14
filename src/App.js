import React from 'react';
import LoginPage from './pages/LoginPage';
import SignupScreen from './pages/SignupScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import ResetPasswordScreen from './pages/ResetPasswordScreen';

import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignupScreen" element={<SignupScreen />} />
        <Route path="/ResetPasswordScreen" element={<ResetPasswordScreen />} />
       
        {/* Add any additional routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
