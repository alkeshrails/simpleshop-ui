import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import styles from './CommonStyle.module.css';

const Signup = () => {
  const history = useHistory();

  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token !== undefined) history.push('/home');
  });

  const HandleChangeInput = (e) => {               // to take user input
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const onHandleClick = (e) => {                    // to login into an application
    e.preventDefault();
    (async () => {
      const resp = await axios.post(
        `https://simpleshop-app.herokuapp.com/api/v1/auth/login?email=${data.email}&password=${data.password}`,
      ).catch(err => setError(true));
      if (resp && resp.data.token !== undefined) {
        Cookies.set('token', resp.data.token, {
            expires: 15,
        });
        if (resp.data.role === 'customers') {
          history.push('/home');
        } else {
            history.push('/admin-page');
        }
      }
    })();
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(false);
  };

  return (
    <div className="App">
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error" onClose={handleClose}>
          Oops!...Something went wrong
        </Alert>
      </Snackbar>
      <h2>Login</h2>
      <div className="container">
        <form onSubmit={onHandleClick}>
          <div className={styles.labelStyle}>
            <label>Email</label>
            <br />
            <input
              type="email"
              className={styles.textFields}
              id="exampleInputEmail1"
              name="email"
              placeholder="Enter name.."
              onChange={(e) => HandleChangeInput(e)}
            />
          </div>
          <div className={styles.labelStyle}>
            <label>Password</label>
            <br />
            <input
              type="password"
              className={styles.textFields}
              id="exampleInputEmail1"
              name="password"
              placeholder="Enter name.."
              onChange={(e) => HandleChangeInput(e)}
            />
          </div>
          <br />
          <button type="submit" className={styles.buttonStyle}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
export default Signup;
