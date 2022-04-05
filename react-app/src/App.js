import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProtectedEstablishmentRoute from './components/auth/ProtectedEstablishmentRoute'
import UsersList from './components/UsersList';
import User from './components/User';
import Establishment from './components/establishment';
import Landing from './components/Landing';
import EstablishmentSetup from './components/auth/EstablishmentSetup';
import { authenticate } from './store/session';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  const user = useSelector(state => state.session?.user)
  // console.log('USER', user)
  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <Switch>
        <ProtectedEstablishmentRoute path='/establishment' exact={true}>
          <Establishment/>
        </ProtectedEstablishmentRoute>
        <Route path='/login' exact={true}>
          <NavBar/>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <NavBar/>
          <SignUpForm />
        </Route>
        <ProtectedRoute path='/users' exact={true}>
          <NavBar/>
          <UsersList/>
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <NavBar/>
          <User />
        </ProtectedRoute>
        <ProtectedRoute path='/establishment-setup' exact={true}>
          <NavBar/>
          <EstablishmentSetup/>
        </ProtectedRoute>
        <Route path='/' exact={true} >
          <NavBar/>
          <Landing/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
