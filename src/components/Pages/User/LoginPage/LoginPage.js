import React, { useEffect, useState } from 'react';
import SigninForm from './SigninForm/SigninForm';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useSpeechRecognition } from 'react-speech-recognition';
import AuthService from '../../../../services/auth-service';
let modalStyle = {
  position: 'relative'
};

let modalBodyStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#FFFFFF',
  padding: '1rem 5rem 3rem 5rem'
};

const LoginPage = (props) => {
  const [loading, setLoading] = useState(false);

  const commands = [];

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    console.log('user:', user);
    if (user) {
      const userId = user.userId;
      props.history.push(`/articles-directory/user-articles/${userId}`);
    }
  }, []);

  return (
    <React.Fragment>
      {loading ? <LinearProgress /> : ''}
      <SigninForm {...props} />
    </React.Fragment>
  );
};

export default LoginPage;
