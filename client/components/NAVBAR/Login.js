import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { loadUser } from '../../store/actionCreators/userActionCreators';

// window.GITHUB_CLIENT_ID = "<%= GITHUB_CLIENT_ID %>";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      auth: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.signIn = this.signIn.bind(this);
    this.logout = this.logout.bind(this);
    this.attemptTokenLogin = this.attemptTokenLogin.bind(this);
  }
  componentDidMount() {
    //this.attemptTokenLogin();
  }
  onChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  onSubmit(ev) {
    ev.preventDefault();
    const { email, password } = this.state;
    this.signIn({
      email,
      password,
    });
  }
  async signIn(credentials) {
    let response = await axios.post('/api/auth', credentials);
    const { token } = response.data;
    window.localStorage.setItem('token', token);
    this.attemptTokenLogin();
  }
  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.setItem('guest', 'true');
    this.setState({ auth: {} });
    this.props.authorizeUser({});
  }
  async attemptTokenLogin() {
    const token = window.localStorage.getItem('token');
    if (token) {
      const response = await axios.get('/api/auth', {
        headers: {
          authorization: token,
        },
      });
      this.setState({ auth: response.data });
      this.props.authorizeUser(this.state.auth);
      this.setState({ email: '', password: '', auth: {} });
      window.localStorage.setItem('guest', 'false');
      this.props.history.push('/');
    }
  }
  render() {
    const { onChange, onSubmit, logout } = this;
    const { email, password, auth } = this.state;
    if (!auth.id) {
      return (
        <div className="login-container">
          <form onSubmit={onSubmit} className="login-form">
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                value={email}
                onChange={onChange}
                name="email"
                placeholder="email@example.com"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={onChange}
                name="password"
                placeholder="password"
              />
            </div>
            <div className="form-group">
              <button type="submit" className="form-button">
                Sign In
              </button>
            </div>
            <a href={`/api/auth/oauth`}>Login With Github</a>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          Welcome {auth.username}
          <button onClick={logout}>Logout</button>
        </div>
      );
    }
  }
}

export default connect(
  ({ userReducer }) => {
    return { userReducer };
  },
  (dispatch) => {
    return {
      authorizeUser: (user) => dispatch(loadUser(user)),
    };
  }
)(Login);
