import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const ProtectedEstablishmentRoute = props => {
  const user = useSelector(state => state.session.user)
  const establishment = useSelector(state => state.establishment)
  if (!user) return(<Route {...props}><Redirect to='/login' /></Route>)
  if (!establishment) return(<Route {...props}><Redirect to='/establishment-setup' /></Route>)
  return (
    <Route {...props}>
     {props.children}
    </Route>
  )
};

export default ProtectedEstablishmentRoute;
