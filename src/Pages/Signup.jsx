import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import styles from './CommonStyle.module.css';

const Signup = () => {

  const history = useHistory();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const HandleChangeInput = (e) => {                // to take user input
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onHandleClick = (e) => {                     // to signup into an application
    e.preventDefault();
    if (!data.name || !data.email || !data.password) {
      alert("please fill form properly");
    }
    (async () => {
      const resp = await axios.post(
        `https://simpleshop-app.herokuapp.com/api/v1/users?user[name]=${data.name}&user[email]=${data.email}&user[password]=${data.password}`,
      );
      if (resp.data.role !== undefined) {
        setShowSuccess(true);
      }
    })();
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setShowSuccess(false);
      };

  return (
    <div className="App">
      <Snackbar open={showSuccess} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="success" onClose={handleClose}>
          Signed in successfully!
        </Alert>
      </Snackbar>
      <h1>Sign Up</h1>
      <div className="container">
        <form onSubmit={onHandleClick}>
          <div className={styles.labelStyle}>
            <label>Name</label>
            <br />
            <input
              type="text"
              className={styles.textFields}
              name="name"
              placeholder="Name"
              onChange={(e) => HandleChangeInput(e)}
            />
          </div>
          <div className={styles.labelStyle}>
            <label>Email</label>
            <br />
            <input
              type="text"
              className={styles.textFields}
              name="email"
              placeholder="Email.."
              onChange={(e) => HandleChangeInput(e)}
            />
          </div>
          <div className={styles.labelStyle}>
            <label>Password</label>
            <br />
            <input
              type="password"
              className={styles.textFields}
              name="password"
              placeholder="Password"
              onChange={(e) => HandleChangeInput(e)}
            />
          </div>
          <button type="submit" className={styles.buttonStyle}>
            Sign Up
          </button>
          <div className={styles.login} style={{ display: 'flex' }}>
            <div>Already have an account?</div>
            <a onClick={() => history.push('/login')}>Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Signup;
