import React from 'react';
import SignupForm from './SignupForm/SignupForm';

const SignupPage = (props) => {
  return (
    <React.Fragment>
      <SignupForm {...props} />
    </React.Fragment>
  );
};

export default SignupPage;
