import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp, claimUser } from '../../store/session';
import style from './auth.module.css';

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [updateUser, setUpdateUser] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(name, email, password, phone));
      if (data && data.find((errorMessage) => errorMessage.split(' ')[2] === '200')) {
        const userToClaimString = data.find((errorMessage) => errorMessage.split(' ')[2] === '200')
        const userId = userToClaimString.split(' ')[3];
        const userName = userToClaimString.split(' ')[4];
        setName(userName);
        const errorArray = userToClaimString.split(' ').slice(6)
        setErrors([errorArray.join(' ')]);
        setUpdateUser(userId);
      } else if (data) {
        setErrors(data)
      }
    }
  };

  const onClaimUser = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(claimUser(updateUser, email, password));
      if (data) {
        setErrors(data)
      }
    }
  };

  const updateName = (e) => {
    setName(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  const updatePhone = (e) => {
    setPhone(e.target.value)
  }

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <form id={style.signup_block} onSubmit={updateUser ? onClaimUser : onSignUp}>
      <div>
        {errors.map((error, ind) => (
          <div className={style.error} key={ind}>{error}</div>
        ))}
      </div>
      <div>
        <label>Name</label>
        <input
          type='text'
          name='name'
          onChange={updateName}
          value={name}
        ></input>
      </div>
      <div>
        <label>Email</label>
        <input
          type='text'
          name='email'
          onChange={updateEmail}
          value={email}
        ></input>
      </div>
      <div>
        <label>Phone Number</label>
        <input
          type='tel'
          name='phone_number'
          onChange={updatePhone}
          value={phone}
        ></input>
      </div>
      <div>
        <label>Password</label>
        <input
          type='password'
          name='password'
          onChange={updatePassword}
          value={password}
        ></input>
      </div>
      <div>
        <label>Repeat Password</label>
        <input
          type='password'
          name='repeat_password'
          onChange={updateRepeatPassword}
          value={repeatPassword}
          required={true}
        ></input>
      </div>
      {updateUser &&
      <>
        <p>Would you like to claim the account with this phone number?</p>
        <button type='submit'>Claim and Update User</button>
        <button onClick={() => {
          setPhone('');
          setUpdateUser('');
        }} type='button'>Cancel and Change Number</button>
      </>}
      {!updateUser && <button type='submit'>Sign Up</button>}
    </form>
  );
};

export default SignUpForm;
