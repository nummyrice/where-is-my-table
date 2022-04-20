import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
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
import SettingsNav from './components/establishment/Settings/SettingsNav';
import Settings from './components/establishment/Settings';
import { getEstablishment } from './store/establishment';
import GuestResAccess from './components/establishment/GuestResAccess';
import GuestWaitlist from './components/establishment/GuestWaitlist'
import GuestDashboardAccess from './components/GuestDashboardAccess';
import { TransitionGroup, CSSTransition } from "react-transition-group"
import "./App.css"

function App() {
  const location = useLocation()
  const [loaded, setLoaded] = useState(false);
  const [prevDepth, setPathDepth] = useState(getPathDepth(location))
  const dispatch = useDispatch();
  const [settingTab, setSettingTab] = useState("sections")
  const currentKey = location.pathname.split("/")[1] || "/";
  const timeout = { enter: 800, exit: 400 };
  function getPathDepth(location) {
    let pathArr = location.pathname.split("/");
    pathArr = pathArr.filter(n => n !== "");
    return pathArr.length;
  }
  useEffect(() => {
    (async() => {
      const data = await dispatch(authenticate());
      if (data.establishment_id) {
        console.log('getting establishment details: ', data)
        await dispatch(getEstablishment(data.establishment_id))
      }
      setLoaded(true);
    })();
  }, [dispatch]);

  // if (data.establishment_id) getEstablishment(data.establishment_id)
  // const user = useSelector(state => state.session?.user)
  // console.log('USER', user)
  if (!loaded) {
    return null;
  }
  // establishment
    // establishment
    // settings
  // main
    // navbar
    //  landing
    // demo_dashboard access
    // demo reservation access
    // demo waitlist access
  // guestAccess
    //guestaccessWaitlist
    //guestAccessReservtation
  return (
    <TransitionGroup component="div" className="App">
      <NavBar/>
      <CSSTransition  key={currentKey}
          timeout={timeout}
          classNames="pageSlider"
          mountOnEnter={false}
          unmountOnExit={true}>
            <div
              className={
                getPathDepth(location) - prevDepth >= 0
                  ? "left"
                  : "right"
              }
            >
        <Switch location={location}>
          <ProtectedEstablishmentRoute path='/establishment' exact={true}>
            <Establishment/>
          </ProtectedEstablishmentRoute>
          <ProtectedEstablishmentRoute path='/establishment/settings' exact={true}>
            <SettingsNav settingTab={settingTab} setSettingTab={setSettingTab}/>
            <Settings settingTab={settingTab}/>
          </ProtectedEstablishmentRoute>
          <Route path={'/reserve-a-table/:establishmentName/:id'}>
            {/* <NavBar/> */}
            <GuestResAccess/>
          </Route>
          <Route path="/join-waitlist/:establishmentName/:id" exact={true}>
            {/* <NavBar/> */}
            <GuestWaitlist/>
          </Route>
          <Route path='/login' exact={true}>
            {/* <NavBar/> */}
            <LoginForm />
          </Route>
          <Route path="/demo-dashboard-access" exact={true}>
            {/* <NavBar/> */}
            <GuestDashboardAccess/>
          </Route>
          <Route path='/sign-up' exact={true}>
            {/* <NavBar/> */}
            <SignUpForm />
          </Route>
          <ProtectedRoute path='/users' exact={true}>
            {/* <NavBar/> */}
            <UsersList/>
          </ProtectedRoute>
          <ProtectedRoute path='/users/:userId' exact={true} >
            {/* <NavBar/> */}
            <User />
          </ProtectedRoute>
          <ProtectedRoute path='/establishment-setup' exact={true}>
            {/* <NavBar/> */}
            <EstablishmentSetup/>
          </ProtectedRoute>
          <Route path='/' exact={true}>
            {/* <NavBar/> */}
            <Landing/>
          </Route>
        </Switch>
      </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default App;
