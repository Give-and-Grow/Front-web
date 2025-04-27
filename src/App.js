import React from 'react';
import LoginPage from './pages/LoginPage';
import SignupScreen from './pages/SignupScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import ResetPasswordScreen from './pages/ResetPasswordScreen';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import Signuporganization from './pages/Signuporganization';
import SelectUserType from './pages/SelectUserType';
import SignupFlow from './pages/SignupFlow';
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
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Signuporganization" element={<Signuporganization />} />
        <Route path="/SelectUserType" element={<SelectUserType />} />
        <Route path="/SignupFlow" element={<SignupFlow />} />
        {/* Add any additional routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
