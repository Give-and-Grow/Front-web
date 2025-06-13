import React, { useState } from 'react';
import SignupScreen from './SignupScreen';
import Signuporganization from './Signuporganization';
import SelectUserType from './SelectUserType';
import Navbar from './Navbar';
import Footer from '../components/Footer';

const SignupFlow = () => {
  const [userType, setUserType] = useState(null);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  return (
    <>
      <Navbar />

      <div style={{ minHeight: '80vh', padding: '20px' }}>
        {!userType && <SelectUserType onSelect={handleUserTypeSelect} />}
        {userType === 'volunteer' && <SignupScreen role="USER" />}
        {userType === 'organization' && <Signuporganization role="organization" />}
      </div>

      <Footer />
    </>
  );
};

export default SignupFlow;
