import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const ProtectedEstablishmentRoute = props => {
  const user = useSelector(state => state.session.user)
  return (
    <Route {...props}>
      {(user?.id === 1)? props.children  : <Redirect to='/login' />}
    </Route>
  )
};


export default ProtectedEstablishmentRoute;
