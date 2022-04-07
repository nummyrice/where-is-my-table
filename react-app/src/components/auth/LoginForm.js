import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getEstablishment } from '../../store/establishment';
import { login } from '../../store/session';
import style from './auth.module.css';

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const establishment = useSelector(state => state.establishment)
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data.errors) {
      return setErrors(data);
    }
    if (data.establishment_id) await dispatch(getEstablishment(data.establishment_id))
    return
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div id={style.login_background}>
      <h2 id={style.est_form_title}>{"Login"}</h2>
      <form id={style.login_block} onSubmit={onLogin}>
        <div className={style.error}>
          {errors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div>
          <label htmlFor='email'>Email</label>
          <input
            name='email'
            type='text'
            placeholder='Email'
            value={email}
            onChange={updateEmail}
          />
          <label htmlFor='password'>Password</label>
          <input
            name='password'
            type='password'
            placeholder='Password'
            value={password}
            onChange={updatePassword}
          />
          <button type='submit'>Login</button>
      </form>
      </div>
  );
};

export default LoginForm;
