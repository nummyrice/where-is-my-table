import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp, claimUser } from '../../store/session';
import { getEstablishment } from '../../store/establishment';
import { login } from '../../store/session';
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
    } else setErrors(['passwords do not match'])
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

  const demoLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login("establishment_demo@aa.io", 'password1'));
    if (data.errors) {
      return setErrors(data);
    }
    if (data.establishment_id) await dispatch(getEstablishment(data.establishment_id))
    return
  }

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
    <div id={style.signup_background}>
      <h2 id={style.est_form_title}>{"Sign-up"}</h2>
      <form id={style.signup_block} className={style.gradient_border} onSubmit={updateUser ? onClaimUser : onSignUp}>
          {errors.map((error, ind) => (
            <div className={style.error} key={ind}>{error}</div>
          ))}
          <label>Name</label>
          <input
            type='text'
            name='name'
            onChange={updateName}
            value={name}
          ></input>
          <label>Email</label>
          <input
            type='text'
            name='email'
            onChange={updateEmail}
            value={email}
          ></input>
          <label>Phone Number</label>
          <input
            type='tel'
            name='phone_number'
            onChange={updatePhone}
            value={phone}
          ></input>
          <label>Password</label>
          <input
            type='password'
            name='password'
            onChange={updatePassword}
            value={password}
          ></input>
          <label>Repeat Password</label>
          <input
            type='password'
            name='repeat_password'
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}
          ></input>
        {updateUser &&
        <>
          <p>Would you like to claim the account with this phone number?</p>
          <button type='submit'>Claim and Update User</button>
          <button onClick={() => {
            setPhone('');
            setUpdateUser('');
          }} type='button'>Cancel and Change Number</button>
        </>}
        {!updateUser &&
         <div id={style.btn_section}>
            <button className={`${style.custom_btn} ${style.btn_9}`} type='submit'>Sign Up</button>
            <button onClick={event => demoLogin(event)} className={`${style.custom_btn} ${style.btn_9}`}>Demo Login</button>
          </div>
          }

      </form>
    </div>
  );
};

export default SignUpForm;
