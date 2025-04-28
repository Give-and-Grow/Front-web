import React, { useState } from 'react';
import SignupScreen from './SignupScreen';
import Signuporganization from './Signuporganization';
import SelectUserType from './SelectUserType';

const SignupFlow = () => {
  const [userType, setUserType] = useState(null);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  return (
    <>
      {!userType && <SelectUserType onSelect={handleUserTypeSelect} />}
      {userType === 'volunteer' && <SignupScreen role="USER" />}
      {userType === 'organization' && <Signuporganization role="organization" />}
    </>
  );
};

export default SignupFlow;
