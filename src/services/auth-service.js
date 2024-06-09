import axios from 'axios';

const API_URL = 'https://bemyhandbackend.onrender.com/';

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + 'login', {
        email,
        password
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    try {
      localStorage.removeItem('user');
      console.log('logging out');
    } catch (e) {
      console.log('Unable to logout', e);
    }
  }

  register(username, email, password, confirmPassword) {
    return axios.post(API_URL + 'signup', {
      username,
      email,
      password,
      confirmPassword
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
